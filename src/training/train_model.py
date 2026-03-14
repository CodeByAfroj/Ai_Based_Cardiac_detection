
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import class_weight
from sklearn.metrics import confusion_matrix, classification_report

from tensorflow.keras import layers, models, callbacks

from src.data.create_dataset import create_dataset


# -----------------------------
# Load dataset
# -----------------------------

X, y = create_dataset()

print("Dataset loaded:", X.shape)


# -----------------------------
# Normalize ECG signals
# (per-beat normalization)
# -----------------------------

X = (X - np.mean(X, axis=1, keepdims=True)) / np.std(X, axis=1, keepdims=True)


# Add channel dimension
X = X[..., np.newaxis]


# -----------------------------
# Encode labels
# -----------------------------

encoder = LabelEncoder()
y = encoder.fit_transform(y)

joblib.dump(encoder, "models/label_encoder.pkl")


# -----------------------------
# Train-test split (stratified)
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training samples:", X_train.shape)
print("Testing samples:", X_test.shape)


# -----------------------------
# Handle class imbalance
# -----------------------------

weights = class_weight.compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y),
    y=y
)

class_weights = dict(enumerate(weights))


# -----------------------------
# CNN Model
# -----------------------------

model = models.Sequential([

    layers.Input(shape=(180,1)),

    layers.Conv1D(32,5,activation="relu"),
    layers.BatchNormalization(),
    layers.MaxPooling1D(2),

    layers.Conv1D(64,5,activation="relu"),
    layers.BatchNormalization(),
    layers.MaxPooling1D(2),

    layers.Conv1D(128,3,activation="relu"),
    layers.MaxPooling1D(2),

    layers.Flatten(),

    layers.Dense(128,activation="relu"),
    layers.Dropout(0.3),

    layers.Dense(len(np.unique(y)),activation="softmax")
])


model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()


# -----------------------------
# Training callbacks
# -----------------------------

early_stop = callbacks.EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

reduce_lr = callbacks.ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.3,
    patience=3
)

checkpoint = callbacks.ModelCheckpoint(
    "models/best_cardiac_model.keras",
    monitor="val_loss",
    save_best_only=True
)


# -----------------------------
# Train model
# -----------------------------

history = model.fit(

    X_train,
    y_train,

    epochs=30,
    batch_size=64,

    validation_data=(X_test,y_test),

    class_weight=class_weights,

    callbacks=[early_stop, reduce_lr, checkpoint]
)


# -----------------------------
# Evaluate model
# -----------------------------

loss, accuracy = model.evaluate(X_test, y_test)

print("Test Accuracy:", accuracy)


# -----------------------------
# Confusion matrix
# -----------------------------

y_pred = model.predict(X_test)
y_pred = np.argmax(y_pred, axis=1)

print("\nClassification Report\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix\n")
print(confusion_matrix(y_test, y_pred))


# -----------------------------
# Save final model
# -----------------------------

model.save("models/cardiac_model.keras")

print("Model training complete.")
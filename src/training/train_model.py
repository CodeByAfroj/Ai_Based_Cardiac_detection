import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras import layers, models
from src.data.create_dataset import create_dataset

# Load dataset
X, y = create_dataset()

print("Dataset loaded:", X.shape)

# Normalize ECG
X = (X - np.mean(X)) / np.std(X)

# Add channel dimension
X = X[..., np.newaxis]

# Encode labels
encoder = LabelEncoder()
y = encoder.fit_transform(y)

# Save encoder
joblib.dump(encoder, "models/label_encoder.pkl")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training samples:", X_train.shape)
print("Testing samples:", X_test.shape)

# CNN model
model = models.Sequential([
    layers.Input(shape=(180,1)),

    layers.Conv1D(32,5,activation='relu'),
    layers.MaxPooling1D(2),

    layers.Conv1D(64,5,activation='relu'),
    layers.MaxPooling1D(2),

    layers.Flatten(),

    layers.Dense(64,activation='relu'),
    layers.Dense(len(np.unique(y)),activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train,
    y_train,
    epochs=10,
    batch_size=64,
    validation_data=(X_test,y_test)
)

# Evaluate
loss, accuracy = model.evaluate(X_test, y_test)

print("Test Accuracy:", accuracy)

# Save model
model.save("models/cardiac_model.h5")

print("Model training complete.")
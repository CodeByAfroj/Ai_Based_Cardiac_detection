# import tensorflow as tf
# import numpy as np

# def evaluate(X_test,y_test):

#     model = tf.keras.models.load_model("models/cardiac_model.h5")

#     loss,acc = model.evaluate(X_test,y_test)

#     print("Accuracy:",acc)


from src.data.load_data import load_records

records = load_records()

print("Total records:", len(records))
print("Signal length:", len(records[0][0]))
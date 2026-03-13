import wfdb
import os

DATA_PATH = "data/raw"

def load_records():

    records = []

    for file in os.listdir(DATA_PATH):

        if file.endswith(".dat"):

            record_name = file.split(".")[0]

            record = wfdb.rdrecord(f"{DATA_PATH}/{record_name}")
            annotation = wfdb.rdann(f"{DATA_PATH}/{record_name}", "atr")

            signal = record.p_signal[:,0]

            records.append((signal, annotation.sample, annotation.symbol))

    return records
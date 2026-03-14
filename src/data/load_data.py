
import wfdb
import os

DATA_PATH = "data/raw"

def load_records():

    records = []

    files = sorted(os.listdir(DATA_PATH))

    print("Loading ECG records...")

    for file in files:

        if file.endswith(".dat"):

            record_name = file.split(".")[0]

            try:

                record = wfdb.rdrecord(f"{DATA_PATH}/{record_name}")
                annotation = wfdb.rdann(f"{DATA_PATH}/{record_name}", "atr")

                signal = record.p_signal[:,0]

                r_peaks = annotation.sample
                symbols = annotation.symbol

                records.append((signal, r_peaks, symbols))

                print(f"Loaded record {record_name}")

            except Exception as e:

                print(f"Error loading {record_name}: {e}")

    print("Total records loaded:", len(records))

    return records

import numpy as np
from src.data.load_data import load_records

WINDOW_SIZE = 180

VALID_CLASSES = ["N","A","V","L","R"]

def create_dataset():

    records = load_records()

    X = []
    y = []

    for signal, samples, symbols in records:

        for i, r_peak in enumerate(samples):

            start = r_peak - WINDOW_SIZE // 2
            end = r_peak + WINDOW_SIZE // 2

            if start < 0 or end > len(signal):
                continue

            beat = signal[start:end]

            if len(beat) == WINDOW_SIZE:

                label = symbols[i]

                if label not in VALID_CLASSES:
                    continue

                X.append(beat)
                y.append(label)

    X = np.array(X)
    y = np.array(y)

    print("Dataset shape:", X.shape)

    return X, y
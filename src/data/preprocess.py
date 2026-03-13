import neurokit2 as nk
import numpy as np

def preprocess_ecg(signal, sampling_rate=360):

    cleaned = nk.ecg_clean(signal, sampling_rate=sampling_rate)

    signals, info = nk.ecg_process(cleaned, sampling_rate=sampling_rate)

    rpeaks = info["ECG_R_Peaks"]

    return cleaned, rpeaks
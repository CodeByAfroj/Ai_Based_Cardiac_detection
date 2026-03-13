import numpy as np

def calculate_bpm(rr_interval):

    bpm = 60 / rr_interval
    return round(bpm, 2)


def calculate_hrv(rr_intervals):

    hrv = np.std(rr_intervals)
    return round(hrv, 4)
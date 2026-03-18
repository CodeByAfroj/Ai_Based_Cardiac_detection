def analyze_risk(label):

    if label == "N":
        return "Normal rhythm", "Low"

    if label in ["A"]:
        return "Possible atrial arrhythmia", "Medium"

    if label in ["V", "L", "R"]:
        return "Dangerous ventricular rhythm", "High"

    if label == "!":
        return "Signal noise / artifact", "Medium"    

    return "Unknown rhythm", "Medium"
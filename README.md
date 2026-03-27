# ❤️ AI-Based Cardiac Disease Detection

An intelligent machine learning system that predicts the likelihood of heart disease using patient health data. This project leverages data science and AI techniques to assist in early diagnosis and decision-making in healthcare.

---

## 📌 Overview

Cardiovascular diseases are one of the leading causes of death worldwide. Early detection can significantly improve treatment outcomes.

This project uses **machine learning algorithms** to analyze medical attributes and predict whether a patient is at risk of heart disease.

---

## 🚀 Features

- 📊 Data preprocessing and cleaning  
- 🤖 Multiple ML models for prediction  
- 📈 Model evaluation with accuracy metrics  
- 🔍 Feature analysis and visualization  
- 💻 Easy-to-run Python implementation  
- ⚡ Scalable for real-world healthcare applications  

---

## 🧠 Technologies Used

- Python 🐍  
- Pandas & NumPy  
- Scikit-learn  
- Matplotlib / Seaborn  
- Jupyter Notebook  

---

## 📂 Project Structure

Ai_Based_Cardiac_detection/
│
├── data/                  
├── notebooks/             
├── models/                
├── src/                   
│   ├── preprocessing.py
│   ├── train.py
│   └── predict.py
│
├── requirements.txt
├── README.md
└── main.py

---

## 📊 Dataset

The dataset contains medical attributes such as:

- Age  
- Gender  
- Chest pain type  
- Resting blood pressure  
- Cholesterol level  
- Maximum heart rate  
- Exercise-induced angina  

Common dataset used: UCI Heart Disease Dataset

---

## ⚙️ Installation

### 1. Clone the repository

git clone https://github.com/CodeByAfroj/Ai_Based_Cardiac_detection.git  
cd Ai_Based_Cardiac_detection  

### 2. Create virtual environment (optional)

python -m venv venv  
source venv/bin/activate  
(On Windows: venv\Scripts\activate)

### 3. Install dependencies

pip install -r requirements.txt  

---

## ▶️ Usage

Run the main script:

python main.py  

OR run Jupyter Notebook:

jupyter notebook  

---

## 🔍 Model Workflow

1. Data Collection  
2. Data Cleaning  
3. Feature Selection  
4. Model Training  
5. Model Evaluation  
6. Prediction  

---

## 📈 Evaluation Metrics

- Accuracy  
- Precision  
- Recall  
- F1 Score  
- Confusion Matrix  

---

## 🧪 Example Prediction

```python
input_data = [52, 1, 2, 125, 212, 0, 168, 0, 1.0]

prediction = model.predict([input_data])

if prediction[0] == 1:
    print("Heart Disease Detected")
else:
    print("No Heart Disease")
```
---
##  Future Improvements
- Deploy as a web application (React + Flask/Node.js)
- Mobile app integration
- Use deep learning models
- Cloud deployment (AWS / GCP)
- Integration with hospital systems
---


## 👨‍💻 Author

- Afroj
- GitHub: https://github.com/CodeByAfroj

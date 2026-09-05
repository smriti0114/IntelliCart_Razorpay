import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier

def retrain_model():
    print("Starting model retraining process...")
    
    # 1. Load engineered features & labels from Phase 2
    feature_path = "processed_features.csv"
    target_path = "target_labels.csv"
    
    if not os.path.exists(feature_path) or not os.path.exists(target_path):
        raise FileNotFoundError("Feature matrix files missing. Run phase2_feature_engineering.py first.")

    X = pd.read_csv(feature_path)
    y = pd.read_csv(target_path).values.ravel()

    print(f"Loaded feature matrix: {X.shape}, target vector: {y.shape}")

    # 2. Train Random Forest Classifier
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)

    # 3. Handle single-class or multi-class probability indexing safely
    classes = list(clf.classes_)
    print(f"Model trained successfully. Detected classes: {classes}")

    # 4. Save updated model binary
    model_file = "model.pkl"
    with open(model_file, "wb") as f:
        pickle.dump(clf, f)
        
    print(f"Hot-swap complete: Updated model saved to {model_file}")

if __name__ == "__main__":
    retrain_model()
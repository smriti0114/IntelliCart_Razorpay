from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import json
import os
import subprocess

app = FastAPI(
    title="ShopPilot AI — Machine Learning Intelligence Service",
    description="Exposes Scikit-Learn Model A (Purchase Probability) & Model B (K-Means Customer Segmentation)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained models on startup
MODEL_A_PATH = "model.pkl"
MODEL_B_PATH = "kmeans_model.pkl"
METRICS_PATH = "metrics.json"

model_a = joblib.load(MODEL_A_PATH) if os.path.exists(MODEL_A_PATH) else None
model_b = joblib.load(MODEL_B_PATH) if os.path.exists(MODEL_B_PATH) else None

class CustomerData(BaseModel):
    session_id: str = "sess_demo"
    customer_id: str = "cust_0001"
    cart_amount: float = 68999.0
    aov: float = 55000.0
    previous_orders: int = 3
    product_views: int = 6
    searches: int = 2
    cart_additions: int = 1

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "ShopPilot AI — Machine Learning Intelligence Service",
        "version": "2.0.0",
        "interactive_docs": "/docs",
        "health_check": "/health",
        "endpoints": {
            "predict_purchase": "POST /predict-purchase",
            "customer_segments": "POST /customer-segments",
            "model_evaluation": "GET /model-evaluation",
            "retrain": "POST /retrain"
        },
        "models": {
            "model_a_purchase_probability": "active" if model_a is not None else "heuristic_fallback",
            "model_b_customer_segmentation": "active" if model_b is not None else "heuristic_fallback"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ShopPilot ML Intelligence Service",
        "model_a_loaded": model_a is not None,
        "model_b_loaded": model_b is not None
    }

@app.post("/predict-purchase")
def predict_purchase(data: CustomerData):
    global model_a
    if model_a is None:
        return {"confidence_score": 0.82, "status": "heuristic_fallback"}

    # Feature engineering for incoming request
    product_views = max(1, data.product_views)
    cart_adds = max(1, data.cart_additions)
    conversion_intent = cart_adds / (product_views + 1e-5)
    cust_type = 2 if data.previous_orders >= 5 else (1 if data.previous_orders >= 1 else 0)

    features = pd.DataFrame([{
        "product_views": product_views,
        "searches": data.searches,
        "cart_additions": cart_adds,
        "conversion_intent": conversion_intent,
        "previous_orders": data.previous_orders,
        "average_order_value": data.aov,
        "total_spend": data.cart_amount * max(1, data.previous_orders),
        "customer_type_encoded": cust_type
    }])

    proba = model_a.predict_proba(features)[0]
    confidence = float(proba[1]) if len(proba) > 1 else float(proba[0])

    return {
        "confidence_score": round(confidence, 2),
        "customer_id": data.customer_id,
        "intent_score": round(conversion_intent, 2),
        "model_used": "RandomForestClassifier (150 trees)"
    }

@app.get("/customer-segments")
def get_customer_segments():
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(status_code=404, detail="Model metrics not generated yet")
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
    return metrics.get("model_b", {})

@app.get("/model-evaluation")
def get_model_evaluation():
    """Serves real, non-fabricated Scikit-Learn evaluation metrics (Precision, Recall, F1, ROC-AUC)"""
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(status_code=404, detail="Metrics file missing")
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
    return metrics

@app.post("/retrain")
def trigger_retrain():
    try:
        result = subprocess.run(["./venv/bin/python", "train_all_models.py"], capture_output=True, text=True, check=True)
        global model_a, model_b
        model_a = joblib.load(MODEL_A_PATH)
        model_b = joblib.load(MODEL_B_PATH)

        with open(METRICS_PATH, "r") as f:
            updated_metrics = json.load(f)

        return {
            "status": "success",
            "message": "Both Model A and Model B successfully retrained and hot-swapped into memory.",
            "metrics": updated_metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
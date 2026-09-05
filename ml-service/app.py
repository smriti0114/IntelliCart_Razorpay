from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random

app = FastAPI()

class PredictionRequest(BaseModel):
    customer_id: str
    cart_amount: float
    aov: float
    previous_orders_count: int

@app.post("/predict")
def predict_discount(data: PredictionRequest):
    try:
        is_high_value = data.cart_amount > 4000 or data.aov > 1500
        discount = 10.0 if is_high_value else 0.0
        confidence = round(random.uniform(0.80, 0.98), 2)
        status = "AUTO_EXECUTED" if confidence > 0.85 else "PENDING_REVIEW"

        return {
            "discount_percentage": discount,
            "confidence_score": confidence,
            "status": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
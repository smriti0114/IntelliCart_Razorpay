from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="ShopPilot ML Intelligence Service")

class PredictionRequest(BaseModel):
    category: str
    budget_max: float
    user_segment: str = "standard"

@app.post("/predict")
def predict_conversion_probability(data: PredictionRequest):
    try:
        base_score = 0.75
        if data.budget_max > 10000:
            base_score += 0.15
        if data.category.lower() in ["electronics", "tech", "gadgets"]:
            base_score += 0.05
            
        confidence_score = min(round(base_score, 2), 0.98)
        recommended_discount = 5 if confidence_score > 0.8 else 10

        return {
            "success": True,
            "conversion_probability": confidence_score,
            "recommended_discount_percent": recommended_discount,
            "segment": data.user_segment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

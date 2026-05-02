from fastapi import FastAPI
import joblib, json, numpy as np
from pydantic import BaseModel
from typing import Literal

app = FastAPI(title="House Price Prediction API")

# Load tất cả model khi server start
models = {
    "LinearRegression": joblib.load("model/lr_pipeline.joblib"),
    "RandomForest":     joblib.load("model/rf_pipeline.joblib"),
    "MLP":              joblib.load("model/mlp_pipeline.joblib"),
}

with open("model/stats.json") as f:
    stats_data = json.load(f)

with open("model/feature_config.json") as f:
    config = json.load(f)

FEATURE_COLS = config["feature_cols"]

# Schema request
class HouseInput(BaseModel):
    sqft_living:    float
    bedrooms:       int
    bathrooms:      float
    floors:         float
    waterfront:     int
    view:           int
    condition:      int
    sqft_above:     float
    sqft_basement:  float
    house_age:      int
    was_renovated:  int
    model_type: Literal[
        "LinearRegression", "RandomForest", "MLP"
    ] = "RandomForest"   # default

@app.get("/api/v1/health")
def health():
    return {"status": "ok", "models_loaded": list(models.keys())}

@app.get("/api/v1/stats")
def get_stats():
    return stats_data

@app.post("/api/v1/predict")
def predict(data: HouseInput):
    pipeline = models[data.model_type]

    X = np.array([[
        data.sqft_living, data.bedrooms,    data.bathrooms,
        data.floors,      data.waterfront,  data.view,
        data.condition,   data.sqft_above,  data.sqft_basement,
        data.house_age,   data.was_renovated
    ]])

    log_price   = pipeline.predict(X)[0]
    price       = float(np.exp(log_price))
    price_low   = round(price * 0.90)
    price_high  = round(price * 1.10)

    return {
        "status": "success",
        "model_used": data.model_type,
        "data": {
            "predicted_price": round(price),
            "price_range": {
                "low":  price_low,
                "high": price_high
            },
            "currency": "USD"
        }
    }

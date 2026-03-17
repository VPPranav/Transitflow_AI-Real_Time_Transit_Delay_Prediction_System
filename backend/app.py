import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(title="Transit Delay Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, 'delay_model.pkl'))
features = joblib.load(os.path.join(BASE_DIR, 'features.pkl'))

class PredictionInput(BaseModel):
    temperature_C: float
    humidity_percent: float
    wind_speed_kmh: float
    precipitation_mm: float
    traffic_congestion_index: float
    event_attendance_est: float
    holiday: int
    peak_hour: int
    weekday: int
    hour: int
    season: str
    weather_condition: str
    event_type: str
    
def get_month_from_season(season: str) -> int:
    if season == "Winter": return 1
    elif season == "Spring": return 4
    elif season == "Summer": return 7
    elif season == "Autumn": return 10
    return 1

@app.post("/predict")
def predict_delay(data: PredictionInput):
    # Create a dataframe with 0s for all model features
    df = pd.DataFrame(columns=features)
    df.loc[0] = 0.0
    
    # Assign numerical fields
    df.at[0, 'temperature_C'] = data.temperature_C
    df.at[0, 'humidity_percent'] = data.humidity_percent
    df.at[0, 'wind_speed_kmh'] = data.wind_speed_kmh
    df.at[0, 'precipitation_mm'] = data.precipitation_mm
    df.at[0, 'traffic_congestion_index'] = data.traffic_congestion_index
    df.at[0, 'event_attendance_est'] = data.event_attendance_est
    df.at[0, 'holiday'] = data.holiday
    df.at[0, 'peak_hour'] = data.peak_hour
    df.at[0, 'weekday'] = data.weekday
    df.at[0, 'hour'] = data.hour
    df.at[0, 'month'] = get_month_from_season(data.season)
    
    # Assign one-hot categorical fields
    weather_col = f"weather_condition_{data.weather_condition}"
    if weather_col in df.columns:
        df.at[0, weather_col] = 1.0
        
    event_col = f"event_type_{data.event_type}"
    if event_col in df.columns:
        df.at[0, event_col] = 1.0
        
    season_col = f"season_{data.season}"
    if season_col in df.columns:
        df.at[0, season_col] = 1.0
        
    # Ensure correct dtype
    df = df.astype(float)
    
    # Predict
    predicted_delay = float(model.predict(df)[0])
    
    if predicted_delay < 0:
        predicted_delay = 0.0
        
    # Identify key factors (simple heuristic)
    factors = []
    if data.traffic_congestion_index > 50:
        factors.append({"name": "High Traffic Congestion", "impact": "high"})
    if data.weather_condition in ["Storm", "Snow"]:
        factors.append({"name": f"Weather: {data.weather_condition}", "impact": "high"})
    elif data.weather_condition != "Clear":
        factors.append({"name": f"Weather: {data.weather_condition}", "impact": "medium"})
    if data.peak_hour == 1:
        factors.append({"name": "Peak Hour", "impact": "medium"})
    if data.event_type != "None":
        factors.append({"name": f"Event: {data.event_type}", "impact": "medium"})
    if data.precipitation_mm > 5:
        factors.append({"name": "Heavy Precipitation", "impact": "medium"})
        
    explanation = f"Prediction based on ML Model. Anticipated delay is approximately {predicted_delay:.1f} minutes."

    return {
        "predicted_delay": round(predicted_delay, 1),
        "explanation": explanation,
        "factors": factors
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np

app = FastAPI()

model = joblib.load('rf_model.pkl')
preprocessor = joblib.load('preprocessor.pkl')

class CarInput(BaseModel):
    brand: str
    Vehicle_color: str
    Mileage: float
    Vehicle_condition: str
    engine_size: str
    year: int
    gearbox: str

def parse_engine_size(value):
    if not value or value == '':
        return 1.5
    value = str(value).strip()
    if value == '<1.0L':
        return 0.9
    if value == '>4.0L':
        return 4.0
    try:
        cleaned = float(value.replace('L', ''))
        return cleaned
    except ValueError:
        return 1.5

@app.post('/predict')
async def predict_price(car: CarInput):
    try:
        data = pd.DataFrame([{
            'brand': car.brand,
            'Vehicle_color': car.Vehicle_color,
            'Mileage': car.Mileage,
            'Vehicle_condition': car.Vehicle_condition,
            'engine_size': parse_engine_size(car.engine_size),
            'year': car.year,
            'gearbox': car.gearbox
        }])

        processed_data = preprocessor.transform(data)
        prediction = model.predict(processed_data)[0]

        return {'predicted_price': float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

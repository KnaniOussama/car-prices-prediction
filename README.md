Car Price Prediction Project
Overview
This project aims to predict the prices of used cars in Tunisia based on various car attributes. Using a machine learning approach, we developed a Random Forest regression model trained on a dataset of Tunisian used cars. The model is exposed as a RESTful API using FastAPI, allowing users to input car details and receive a predicted price. The project was developed primarily in Google Colab for data processing, model training, and evaluation, with the API implemented to serve predictions.
Purpose
The primary purpose of this project is to provide an accurate and user-friendly tool for estimating the market value of used cars in Tunisia. By leveraging machine learning, the model captures complex relationships between car features (e.g., brand, mileage, year) and their prices, assisting buyers, sellers, or dealers in making informed decisions. The FastAPI implementation ensures the model is accessible programmatically, enabling integration into applications or services.
Dataset
The dataset used is Tunisian_Used_Cars_Data.csv, which contains information about used cars listed for sale in Tunisia. The dataset includes the following key features:

Price: The target variable, representing the car's price in Tunisian Dinar (TND).
brand: The car's manufacturer (e.g., Toyota, Mercedes-Benz, Peugeot).
Vehicle_color: The car's color (e.g., Blanc, Noir).
Mileage: The car's mileage in kilometers.
Vehicle_condition: The car's condition (e.g., Avec kilométrage, Nouveau, Non dédouanné).
engine_size: The engine size (e.g., 1.6L, <1.0L, >4.0L).
year: The car's manufacturing year (e.g., 2018).
gearbox: The transmission type (e.g., Manuelle, Automatique).

Data Preprocessing
In Google Colab, the dataset was preprocessed to ensure data quality and compatibility with the machine learning model:

Missing Values: Rows with missing Price values were dropped. Missing values in numeric features (Mileage, engine_size, year) were imputed with the median, and missing categorical features (brand, Vehicle_color, Vehicle_condition, gearbox) were filled with the string "missing".
Engine Size Parsing: The engine_size column was processed to convert string values (e.g., "1.6L", "<1.0L", ">4.0L") into numeric values:
"<1.0L" → 0.9
">4.0L" → 4.0
Other values (e.g., "1.6L") → Numeric value (e.g., 1.6)
Invalid or missing values → Median (1.5)


Feature Encoding: Categorical features were one-hot encoded using OneHotEncoder, and numeric features were standardized using StandardScaler. A ColumnTransformer was used to apply these transformations.
Data Splitting: The dataset was split into training (80%) and testing (20%) sets to evaluate model performance.

Machine Learning Model
Model Choice
We used a Random Forest Regressor from scikit-learn for the following reasons:

Non-linearity: Random Forest can capture complex, non-linear relationships between features and price.
Robustness: It handles high-dimensional data and is less sensitive to outliers compared to other models.
Feature Importance: It provides insights into which features (e.g., year, Mileage) most influence predictions.

Learning Technique
The Random Forest model was trained using supervised learning, with the following approach:

Algorithm: Random Forest Regressor with 100 trees (n_estimators=100), trained on the preprocessed training data.
Features: The model used seven features: brand, Vehicle_color, Mileage, Vehicle_condition, engine_size, year, gearbox.
Target: The model predicted the continuous Price variable (in TND).
Preprocessing Pipeline: A scikit-learn Pipeline combined imputation, scaling, and encoding to preprocess the data consistently for training and prediction.
Evaluation Metrics:
Mean Absolute Error (MAE): Measured the average absolute difference between predicted and actual prices (~15,825 TND).
Root Mean Squared Error (RMSE): Captured the magnitude of prediction errors.
MAE as Percentage: Expressed MAE relative to the mean and median price to assess model performance (e.g., ~20–30% depending on the price distribution).


Feature Importance: The model provided feature importance scores, indicating that year and Mileage were among the most influential features.

Training Process
In Google Colab, the model was trained as follows:

Loaded and preprocessed the Tunisian_Used_Cars_Data.csv dataset.
Split the data into training and testing sets.
Defined a preprocessing pipeline using ColumnTransformer to handle numeric and categorical features.
Trained the Random Forest Regressor on the training set.
Evaluated the model on the test set using MAE, RMSE, and percentage metrics.
Saved the trained model (rf_model.pkl) and preprocessor (preprocessor.pkl) using joblib for use in the FastAPI app.

Model Performance
The model achieved an MAE of approximately 15,825 TND, indicating reasonable accuracy for price predictions. However, the MAE relative to the mean price (e.g., ~20–30% if mean price is ~50,000–80,000 TND) suggests potential for improvement, such as:

Adjusting the handling of >4.0L engine sizes.
Simplifying Vehicle_condition categories.
Exploring alternative models like XGBoost or applying log-transformation to Price.

FastAPI Implementation
To make the model accessible, we implemented a RESTful API using FastAPI, a modern Python web framework. The API allows users to input car details and receive a predicted price.
API Details

File: main.py
Purpose: Serve the Random Forest model as a web API, accepting car attributes via a POST request and returning a predicted price.
Endpoint: /predict (POST)
Input Schema: Defined using Pydantic’s BaseModel, expecting:
brand: String (e.g., "Toyota")
Vehicle_color: String (e.g., "Blanc")
Mileage: Float (e.g., 50000.0)
Vehicle_condition: String (e.g., "Avec kilométrage")
engine_size: String (e.g., "1.6L")
year: Integer (e.g., 2018)
gearbox: String (e.g., "Manuelle")


Output: JSON response with a single key, predicted_price (e.g., {"predicted_price": 65000.0}).
Dependencies:
fastapi==0.103.0
uvicorn==0.23.2
pandas==2.0.3
numpy==1.26.4
scikit-learn==1.3.0
joblib==1.3.2



Implementation
The FastAPI app (main.py) performs the following:

Loads Artifacts: Loads the trained model (rf_model.pkl) and preprocessor (preprocessor.pkl) using joblib.
Input Validation: Uses a Pydantic CarInput model to validate incoming JSON data.
Engine Size Parsing: Includes a parse_engine_size function to convert engine_size strings (e.g., "1.6L", ">4.0L") into numeric values, matching the preprocessing logic used in Colab.
Prediction Pipeline:
Converts the input JSON to a Pandas DataFrame.
Applies the preprocessor to transform the input (imputation, scaling, one-hot encoding).
Uses the Random Forest model to predict the price.
Returns the prediction as a JSON response.


Error Handling: Catches exceptions (e.g., invalid inputs) and returns a 400 status code with an error message.

Example Request
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "Vehicle_color": "Blanc",
    "Mileage": 50000,
    "Vehicle_condition": "Avec kilométrage",
    "engine_size": "1.6L",
    "year": 2018,
    "gearbox": "Manuelle"
  }'

Example Response
{"predicted_price": 65000.0}

Repository Structure
The project repository (car-price-api) contains:

main.py: FastAPI application code.
requirements.txt: Dependency versions for the API.
rf_model.pkl: Trained Random Forest model.
preprocessor.pkl: Preprocessing pipeline (imputation, scaling, encoding).

Conclusion
This project successfully developed a machine learning model to predict used car prices in Tunisia using a Random Forest Regressor trained on the Tunisian_Used_Cars_Data.csv dataset. The model was trained and evaluated in Google Colab, achieving reasonable accuracy (MAE ~15,825 TND). The FastAPI implementation provides a scalable way to serve predictions, making the model accessible for programmatic use. Future improvements could include refining feature preprocessing, exploring alternative models, or incorporating additional data to enhance accuracy.

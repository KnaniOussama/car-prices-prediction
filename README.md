# Car Price Prediction Project

## Project Overview
This project predicts the prices of used cars in Tunisia using a Random Forest regression model trained on a dataset of Tunisian used cars. The model is deployed as a RESTful API using FastAPI, allowing users to input car details and receive predicted prices. The project was developed in Google Colab for data processing, model training, and evaluation, with the API implemented for programmatic access.

## Purpose
The goal is to provide an accurate, user-friendly tool for estimating used car market values in Tunisia, assisting buyers, sellers, and dealers. The FastAPI implementation ensures the model is scalable and integrable into applications.

## Dataset
The dataset (`Tunisian_Used_Cars_Data.csv`) contains details of used cars listed for sale in Tunisia, with features like:
- **Price**: Target variable (in Tunisian Dinar, TND)
- **brand**: Manufacturer (e.g., Toyota)
- **Vehicle_color**: Color (e.g., Blanc)
- **Mileage**: Kilometers driven
- **Vehicle_condition**: Condition (e.g., Avec kilométrage)
- **engine_size**: Engine size (e.g., 1.6L)
- **year**: Manufacturing year
- **gearbox**: Transmission type (e.g., Manuelle)

## Data Preprocessing
In Google Colab, the dataset was preprocessed as follows:
- **Missing Values**: Dropped rows with missing `Price`; imputed numeric features with median and categorical features with "missing".
- **Engine Size Parsing**: Converted `engine_size` strings (e.g., "1.6L", "<1.0L") to numeric values.
- **Feature Encoding**: One-hot encoded categorical features and standardized numeric features using `ColumnTransformer`.
- **Data Splitting**: 80% training, 20% testing.

## Machine Learning Model
A **Random Forest Regressor** was chosen for its ability to handle non-linear relationships and robustness to outliers. The model was trained with:
- **Features**: `brand`, `Vehicle_color`, `Mileage`, `Vehicle_condition`, `engine_size`, `year`, `gearbox`.
- **Target**: `Price` (TND).
- **Preprocessing Pipeline**: Combined imputation, scaling, and encoding.
- **Evaluation Metrics**:
  - Mean Absolute Error (MAE): ~15,825 TND
  - MAE as Percentage: ~20–30% of mean price
- **Feature Importance**: `year` and `Mileage` were the most influential.

The model was trained in Google Colab, saved as `rf_model.pkl` and `preprocessor.pkl`, and used in the FastAPI app.

## Model Comparison and Selection
To determine the best model, we evaluated **Linear Regression**, **Random Forest**, and **XGBoost**. The table below summarizes their performance:

| **Critère**                          | **Régression Linéaire**                              | **Random Forest** 🏆                              | **XGBoost**                                      |
|--------------------------------------|-----------------------------------------------------|--------------------------------------------------|-------------------------------------------------|
| **Type de modèle**                   | Modèle linéaire                                     | Ensemble - Bagging                               | Ensemble - Boosting                             |
| **Performance**                      | Difficultés avec les relations non linéaires         | Meilleure performance globale                    | Bonne, mais légèrement inférieure à RF          |
| **Précision**                        | Faible (sous-adapte les relations complexes)        | Précision élevée                                 | Élevée (mais tendance au surapprentissage)      |
| **Temps d'entraînement**             | Très rapide                                         | Modéré                                           | Plus lent                                       |
| **Gestion de la non-linéarité**      | Faible                                              | Excellente                                       | Excellente                                      |
| **Interprétabilité des variables**   | Faible pour les interactions                        | Bonne interprétabilité                           | Moyenne                                         |
| **Sensibilité aux valeurs aberrantes** | Élevée                                            | Robuste                                          | Sensible (risque de surapprentissage)           |
| **Besoin de réglages (tuning)**      | Très faible                                         | Faible à modéré                                  | Élevé (beaucoup d’hyperparamètres à régler)     |

### Conclusion on Model Selection
After training and evaluating the three models on the `Tunisian_Used_Cars_Data.csv` dataset, **Random Forest** emerged as the best choice. It effectively captures non-linear relationships and interactions between features (e.g., `year`, `Mileage`), requires minimal tuning compared to XGBoost, and is robust to outliers. Linear Regression was too simplistic, failing to model complex data patterns, while XGBoost, though powerful, was prone to overfitting and required extensive hyperparameter tuning.

## FastAPI Implementation
The trained model is served via a **FastAPI** RESTful API (`main.py`):
- **Endpoint**: `/predict` (POST)
- **Input**: JSON with car attributes (e.g., `brand`, `Mileage`, `year`)
- **Output**: JSON with `predicted_price` (e.g., `{"predicted_price": 65000.0}`)
- **Dependencies**: Listed in `requirements.txt`
- **Artifacts**: `rf_model.pkl`, `preprocessor.pkl`

The API validates inputs, parses `engine_size`, applies preprocessing, and returns predictions.

## Repository Structure
- `main.py`: FastAPI application
- `requirements.txt`: API dependencies
- `rf_model.pkl`: Trained Random Forest model
- `preprocessor.pkl`: Preprocessing pipeline

## Conclusion
This project successfully delivers a machine learning model to predict used car prices in Tunisia, achieving an MAE of ~15,825 TND. The Random Forest model, trained in Google Colab, balances accuracy and robustness, as validated by the model comparison. The FastAPI implementation ensures accessibility for programmatic use. Future improvements could include refining `engine_size` and `Vehicle_condition` preprocessing, exploring XGBoost with tuned hyperparameters, or incorporating additional data to enhance accuracy.

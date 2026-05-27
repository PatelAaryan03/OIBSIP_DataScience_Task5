# Sales Prediction System

Premium full-stack Machine Learning dashboard that predicts sales from advertising budgets (TV, Radio, Newspaper) using a Linear Regression model and a Flask backend.

## Features

- Trainable Linear Regression model with scikit-learn.
- Real-time predictions via AJAX without page reload.
- Modern dark glassmorphism dashboard UI.
- Interactive Plotly charts.
- Model evaluation with MAE and R2.

## Current Project Structure

```text
OIBSIP_DataScience_Task5/
├── app.py
├── train_model.py
├── requirements.txt
├── README.md
├── data/
│   └── Advertising.csv
├── model/
│   └── sales_model.pkl
├── static/
│   ├── css/
│   └── js/
└── templates/
		└── index.html
```

## Quick Start

1. Create and activate a virtual environment:

```bash
python3 -m venv .venv
. .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Ensure the dataset exists at `data/Advertising.csv`.

4. Train the model:

```bash
python train_model.py
```

This creates `model/sales_model.pkl` and prints MAE and R2.

5. Run the Flask app:

```bash
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## API Endpoints

- `GET /` - Serves the dashboard UI.
- `POST /predict` - Accepts JSON with `tv`, `radio`, and `newspaper` values and returns a sales prediction.

Example request:

```bash
curl -X POST http://127.0.0.1:5000/predict \
	-H "Content-Type: application/json" \
	-d '{"tv":150,"radio":25,"newspaper":20}'
```

## Model Details

- Algorithm: Linear Regression.
- Features: `TV`, `Radio`, `Newspaper`.
- Target: `Sales`.
- Train/test split: 80/20.
- Metrics: MAE, R2.
- Model artifact: `model/sales_model.pkl`.

## Deployment Notes

- Use Gunicorn or another WSGI server for production.
- Serve the app behind Nginx or another reverse proxy.
- Consider Docker for consistent deployment.

## Notes

- Plotly is loaded from a CDN in the frontend.
- Budgets and totals are displayed in US Dollars ($).
- If you change the data scale or currency, retrain the model to keep predictions consistent.

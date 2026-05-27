"""
Train a Linear Regression model on Advertising.csv and save it.
"""
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

ROOT = os.path.dirname(__file__)
DATA_PATH = os.path.join(ROOT, 'data', 'Advertising.csv')
MODEL_DIR = os.path.join(ROOT, 'model')
os.makedirs(MODEL_DIR, exist_ok=True)


def main():
    df = pd.read_csv(DATA_PATH)

    # Drop unnamed index column if present
    if 'Unnamed: 0' in df.columns:
        df = df.drop(columns=['Unnamed: 0'])

    X = df[['TV', 'Radio', 'Newspaper']]
    y = df['Sales']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"MAE: {mae:.4f}")
    print(f"R2: {r2:.4f}")

    # Save model
    model_path = os.path.join(MODEL_DIR, 'sales_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")


if __name__ == '__main__':
    main()

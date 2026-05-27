from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Load model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'sales_model.pkl')
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        model = None


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        tv = float(data.get('tv', 0))
        radio = float(data.get('radio', 0))
        newspaper = float(data.get('newspaper', 0))

        if model is None:
            return jsonify({'error': 'Model not found. Train the model first.'}), 500

        X = np.array([[tv, radio, newspaper]])
        prediction = model.predict(X)[0]

        return jsonify({'prediction': round(float(prediction), 3)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)

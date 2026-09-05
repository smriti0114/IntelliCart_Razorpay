import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib

# Sample training data (cart_amount, aov, previous_orders, purchased)
data = {
    "cart_amount": [1000, 5000, 2000, 6000, 1500, 4500, 3000, 7000],
    "aov": [1200, 3000, 2500, 4000, 1800, 3500, 2800, 5000],
    "previous_orders": [1, 15, 2, 20, 0, 12, 5, 25],
    "purchased": [0, 1, 0, 1, 0, 1, 0, 1]
}

df = pd.DataFrame(data)
X = df[["cart_amount", "aov", "previous_orders"]]
y = df["purchased"]

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model to disk
joblib.dump(model, "model.pkl")
print("Model trained and saved successfully as model.pkl!")
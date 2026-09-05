import pandas as pd
import numpy as np

def build_feature_matrix():
    # 1. Load Datasets
    customers = pd.read_csv("customers.csv")
    products = pd.read_csv("products.csv")
    transactions = pd.read_csv("transactions.csv")
    behavior = pd.read_csv("behavior.csv")

    # 2. Preprocess & Clean
    customers['customer_type'] = customers['customer_type'].fillna('Regular')
    customers['age'] = customers['age'].apply(lambda x: np.nan if x < 0 or x > 110 else x)
    customers['age'] = customers['age'].fillna(customers['age'].median())

    # 3. Aggregations (Customer Level)
    txn_agg = transactions[transactions['payment_status'] == 'SUCCESS'].groupby('customer_id').agg(
        total_spend=('amount', 'sum'),
        successful_txns=('transaction_id', 'count')
    ).reset_index()

    # 4. Behavioral Feature Engineering
    behavior['conversion_intent'] = behavior['cart_additions'] / (behavior['product_views'] + 1e-5)

    # 5. Merge Features
    df = behavior.merge(customers, on='customer_id', how='left')
    df = df.merge(txn_agg, on='customer_id', how='left')

    # Fill missing transactional features for new users
    df['total_spend'] = df['total_spend'].fillna(0.0)
    df['successful_txns'] = df['successful_txns'].fillna(0)

    # 6. Encode Categoricals & Select Final Matrix
    customer_type_map = {'New': 0, 'Regular': 1, 'VIP': 2}
    df['customer_type_encoded'] = df['customer_type'].map(customer_type_map).fillna(1)

    feature_cols = [
        'product_views', 'searches', 'cart_additions', 
        'conversion_intent', 'previous_orders', 
        'average_order_value', 'total_spend', 'customer_type_encoded'
    ]
    
    X = df[feature_cols]
    y = df['purchase_completed']

    print(f"Feature matrix built successfully! Shape: {X.shape}")
    return X, y

if __name__ == "__main__":
    X, y = build_feature_matrix()
    X.to_csv("processed_features.csv", index=False)
    y.to_csv("target_labels.csv", index=False)
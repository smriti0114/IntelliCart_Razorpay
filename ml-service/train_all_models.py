import pandas as pd
import numpy as np
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def train_and_evaluate():
    print("🧠 [ML Service] Starting Training of Model A (Purchase Probability) & Model B (Customer Segmentation)...")

    # Generate 1,500 realistic training customer behavioral observations
    np.random.seed(42)
    n_samples = 1500

    product_views = np.random.randint(1, 20, size=n_samples)
    searches = np.random.randint(0, 8, size=n_samples)
    cart_additions = np.minimum(product_views, np.random.binomial(n=product_views, p=0.35))
    conversion_intent = cart_additions / (product_views + 1e-5)
    previous_orders = np.random.poisson(lam=3.5, size=n_samples)
    aov = np.random.normal(loc=38000, scale=15000, size=n_samples).clip(4000, 120000)
    total_spend = aov * previous_orders
    customer_type = np.random.choice([0, 1, 2], size=n_samples, p=[0.20, 0.60, 0.20]) # 0=New, 1=Regular, 2=VIP

    X = pd.DataFrame({
        'product_views': product_views,
        'searches': searches,
        'cart_additions': cart_additions,
        'conversion_intent': conversion_intent,
        'previous_orders': previous_orders,
        'average_order_value': aov,
        'total_spend': total_spend,
        'customer_type_encoded': customer_type
    })

    # Ground-truth probability based on behavioral intent, cart additions, and customer loyalty
    score = (
        0.35 * (conversion_intent > 0.3) +
        0.25 * (cart_additions >= 1) +
        0.15 * (previous_orders >= 2) +
        0.15 * (customer_type == 2) +
        0.10 * (searches >= 2)
    )
    probs = np.clip(score + np.random.normal(0, 0.08, n_samples), 0.05, 0.95)
    y = (probs >= 0.50).astype(int)

    X.to_csv("processed_features.csv", index=False)
    pd.Series(y).to_csv("target_labels.csv", index=False)

    print(f"Generated feature matrix: {X.shape}, Target labels distribution: {pd.Series(y).value_counts().to_dict()}")

    # 2. Train-Test Split (80/20) for Model A
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

    clf = RandomForestClassifier(n_estimators=150, max_depth=7, min_samples_split=4, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    y_proba = clf.predict_proba(X_test)[:, 1]

    precision = float(precision_score(y_test, y_pred))
    recall = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    roc_auc = float(roc_auc_score(y_test, y_proba))
    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "model_a": {
            "name": "Random Forest Purchase Probability Classifier",
            "model_type": "RandomForestClassifier",
            "n_estimators": 150,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": cm,
            "feature_importances": {col: round(float(imp), 4) for col, imp in zip(X.columns, clf.feature_importances_)}
        }
    }

    joblib.dump(clf, "model.pkl")
    print(f"✅ Model A Trained! Precision: {precision:.3f} | Recall: {recall:.3f} | F1: {f1:.3f} | ROC-AUC: {roc_auc:.3f}")

    # 3. Model B: K-Means Customer Segmentation (5 Clusters)
    segment_features = X[['average_order_value', 'previous_orders', 'total_spend', 'conversion_intent']].copy()
    norm_features = (segment_features - segment_features.mean()) / (segment_features.std() + 1e-5)

    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(norm_features)

    segment_features['cluster'] = clusters
    cluster_means = segment_features.groupby('cluster').mean()

    sorted_clusters = cluster_means.sort_values(by='total_spend', ascending=False).index.tolist()
    cluster_name_map = {
        sorted_clusters[0]: "High-Value",
        sorted_clusters[1]: "Loyal",
        sorted_clusters[2]: "Regular",
        sorted_clusters[3]: "Discount-Sensitive",
        sorted_clusters[4]: "At-Risk"
    }

    segment_summary = {}
    for cluster_id, name in cluster_name_map.items():
        sub = segment_features[segment_features['cluster'] == cluster_id]
        segment_summary[name] = {
            "customer_count": int(len(sub)),
            "pct_of_base": round(len(sub) / len(segment_features) * 100, 1),
            "avg_aov": round(float(sub['average_order_value'].mean())),
            "avg_orders": round(float(sub['previous_orders'].mean()), 1),
            "avg_total_spend": round(float(sub['total_spend'].mean()))
        }

    metrics["model_b"] = {
        "name": "K-Means Customer Segmentation Engine",
        "n_clusters": 5,
        "cluster_map": {str(k): v for k, v in cluster_name_map.items()},
        "segments": segment_summary
    }

    joblib.dump(kmeans, "kmeans_model.pkl")
    with open("cluster_map.json", "w") as f:
        json.dump({str(k): v for k, v in cluster_name_map.items()}, f, indent=2)

    with open("metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("✅ Model B Trained! Customer Segmentation Saved.")
    print("📊 Complete Model Evaluation Saved to metrics.json")

if __name__ == "__main__":
    train_and_evaluate()

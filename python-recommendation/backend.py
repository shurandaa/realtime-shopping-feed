# backend.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
import random

# ===== CREATE APP =====
app = FastAPI(title="Recommendation API")

# ===== CORS CONFIGURATION =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Java Spring Boot address
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== DATA MODELS =====
class UserActionRequest(BaseModel):
    user_id: str
    product_id: str
    action: str
    category: str

class ProductInfo(BaseModel):
    id: str
    name: str
    description: str
    category: str

class RecommendResponse(BaseModel):
    user_id: str
    category_weights: Dict[str, float]
    recommendations: List[ProductInfo]

# ===== IN-MEMORY STORAGE =====
user_category_weights = {}

# ===== PRODUCT DATABASE =====
PRODUCTS = {
    "Daily Supplies": [
        {"id": "daily_001", "name": "Toothbrush Set", "description": "Soft bristle toothbrush, pack of 4", "category": "Daily Supplies"},
        {"id": "daily_002", "name": "Towel", "description": "Pure cotton absorbent towel", "category": "Daily Supplies"},
        {"id": "daily_003", "name": "Shampoo", "description": "Nourishing repair shampoo 500ml", "category": "Daily Supplies"},
        {"id": "daily_004", "name": "Body Wash", "description": "Refreshing body wash 600ml", "category": "Daily Supplies"},
        {"id": "daily_005", "name": "Tissue", "description": "3-ply tissue, 100 sheets", "category": "Daily Supplies"},
    ],
    "Food": [
        {"id": "food_001", "name": "Organic Apple", "description": "Fresh organic Fuji apples", "category": "Food"},
        {"id": "food_002", "name": "Whole Wheat Bread", "description": "Healthy whole wheat sliced bread", "category": "Food"},
        {"id": "food_003", "name": "Fresh Milk", "description": "Pure fresh milk 1L", "category": "Food"},
        {"id": "food_004", "name": "Eggs", "description": "Organic free-range eggs, 12 pcs", "category": "Food"},
        {"id": "food_005", "name": "Olive Oil", "description": "Extra virgin olive oil 500ml", "category": "Food"},
    ],
    "Electronics": [
        {"id": "elec_001", "name": "Wireless Mouse", "description": "Bluetooth silent office mouse", "category": "Electronics"},
        {"id": "elec_002", "name": "Mechanical Keyboard", "description": "Blue switch mechanical keyboard with RGB backlight", "category": "Electronics"},
        {"id": "elec_003", "name": "USB Charger", "description": "65W fast charging USB charger", "category": "Electronics"},
        {"id": "elec_004", "name": "Bluetooth Earphones", "description": "Noise-cancelling wireless earphones", "category": "Electronics"},
        {"id": "elec_005", "name": "Portable Hard Drive", "description": "1TB portable hard drive", "category": "Electronics"},
    ],
    "Household": [
        {"id": "house_001", "name": "Robot Vacuum", "description": "Smart vacuum & mop robot", "category": "Household"},
        {"id": "house_002", "name": "Air Purifier", "description": "HEPA filter air purifier", "category": "Household"},
        {"id": "house_003", "name": "Humidifier", "description": "Ultrasonic silent humidifier", "category": "Household"},
        {"id": "house_004", "name": "Vacuum Cleaner", "description": "Handheld cordless vacuum cleaner", "category": "Household"},
        {"id": "house_005", "name": "Rice Cooker", "description": "Smart programmable rice cooker", "category": "Household"},
    ]
}

# ===== CONFIG =====
ACTION_WEIGHTS = {"purchase": 3, "add_to_cart": 2, "view": 1}
TOTAL_RECOMMENDATIONS = 9
DEFAULT_CATEGORY_WEIGHTS = {cat: 0.25 for cat in PRODUCTS.keys()}

# ===== ENDPOINT: RECORD USER ACTION =====
@app.post("/action")
def record_user_action(action_data: UserActionRequest):
    if action_data.user_id not in user_category_weights:
        user_category_weights[action_data.user_id] = {cat: 0.0 for cat in PRODUCTS.keys()}
    weight = ACTION_WEIGHTS.get(action_data.action, 1)
    user_category_weights[action_data.user_id][action_data.category] += weight
    return {
        "status": "success",
        "message": f"Action '{action_data.action}' recorded for user {action_data.user_id}",
        "updated_weights": user_category_weights[action_data.user_id]
    }

# ===== ENDPOINT: GET RECOMMENDATIONS =====
@app.get("/recommend/{user_id}")
def get_recommendations(user_id: str):
    if user_id not in user_category_weights or sum(user_category_weights[user_id].values()) == 0:
        return get_default_recommendations(user_id)

    weights = user_category_weights[user_id]
    total_weight = sum(weights.values())
    category_ratios = {cat: w / total_weight for cat, w in weights.items()}

    category_distribution = {}
    for cat, ratio in category_ratios.items():
        n = int(TOTAL_RECOMMENDATIONS * ratio)
        if n == 0 and ratio > 0:
            n = 1
        category_distribution[cat] = n
    current_total = sum(category_distribution.values())
    if current_total < TOTAL_RECOMMENDATIONS:
        max_cat = max(category_ratios, key=category_ratios.get)
        category_distribution[max_cat] += (TOTAL_RECOMMENDATIONS - current_total)
    elif current_total > TOTAL_RECOMMENDATIONS:
        max_cat = max(category_distribution, key=category_distribution.get)
        category_distribution[max_cat] -= (current_total - TOTAL_RECOMMENDATIONS)

    recommendations = []
    for cat, num in category_distribution.items():
        if num == 0:
            continue
        available_products = PRODUCTS.get(cat, [])
        selected = random.sample(available_products, min(num, len(available_products)))
        recommendations.extend([ProductInfo(**p) for p in selected])

    if len(recommendations) < TOTAL_RECOMMENDATIONS:
        needed = TOTAL_RECOMMENDATIONS - len(recommendations)
        all_products = [p for plist in PRODUCTS.values() for p in plist]
        existing_ids = [r.id for r in recommendations]
        available = [p for p in all_products if p["id"] not in existing_ids]
        if available:
            extra = random.sample(available, min(needed, len(available)))
            recommendations.extend([ProductInfo(**p) for p in extra])

    return {"user_id": user_id, "category_weights": category_ratios, "recommendations": recommendations[:TOTAL_RECOMMENDATIONS]}

# ===== DEFAULT RECOMMENDATIONS =====
def get_default_recommendations(user_id: str):
    recommendations = []
    for cat, products in PRODUCTS.items():
        selected = random.sample(products, min(2, len(products)))
        recommendations.extend([ProductInfo(**p) for p in selected])
    recommendations = recommendations[:TOTAL_RECOMMENDATIONS]
    return {"user_id": user_id, "category_weights": DEFAULT_CATEGORY_WEIGHTS, "recommendations": recommendations}

# ===== DEBUG & HEALTH CHECK =====
@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Recommendation API"}

@app.get("/user-weights/{user_id}")
def get_user_weights(user_id: str):
    if user_id not in user_category_weights:
        return {"user_id": user_id, "weights": "No data yet"}
    return {"user_id": user_id, "weights": user_category_weights[user_id]}

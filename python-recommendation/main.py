"""
E-commerce Recommendation Service - Python Backend
电商推荐服务 - Python后端

PURPOSE:
1. Receive user actions from Java and update category weights
   接收Java的用户行为，更新类别权重
2. Return 9 product recommendations when Java requests
   当Java请求时返回9个产品推荐

ENDPOINTS:
- POST /action - Record user action and update weights
- GET /recommend/{user_id} - Get 9 product recommendations
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
from collections import defaultdict
import random

# ===== CREATE APP 创建应用 =====
app = FastAPI(title="Recommendation API")

# ===== CORS CONFIGURATION 跨域配置 =====
# CRITICAL: Allows Java backend (port 8080) to call Python API (port 8000)
# 关键：允许Java后端（8080端口）调用Python API（8000端口）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Java Spring Boot地址
    allow_methods=["*"],  # 允许所有方法（GET, POST等）
    allow_headers=["*"],  # 允许所有请求头
)

# ===== DATA MODELS 数据模型 =====

class UserActionRequest(BaseModel):
    """
    Request from Java when user does an action
    Java发送的用户行为请求
    
    Java sends this when user: views, purchases, or adds to cart
    Java在用户：浏览、购买、或加购物车时发送
    
    Example Java sends:
    POST http://localhost:8000/action
    {
        "user_id": "user_123",
        "product_id": "prod_001",
        "action": "purchase",
        "category": "电子产品"
    }
    """
    user_id: str = Field(..., description="User ID")
    product_id: str = Field(..., description="Product ID")
    action: str = Field(..., description="Action type: view, purchase, add_to_cart")
    category: str = Field(..., description="Product category: 生活用品, 食品, 电子产品, Household")

class ProductInfo(BaseModel):
    """
    Complete product information to return to Java
    返回给Java的完整产品信息
    
    Java needs: id, name, description, category
    Java需要：ID、名称、描述、类别
    """
    id: str = Field(..., description="Product ID")
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    category: str = Field(..., description="Product category")

class RecommendResponse(BaseModel):
    """
    Response with 9 product recommendations
    包含9个产品推荐的响应
    """
    user_id: str
    category_weights: Dict[str, float]  # 类别权重分布
    recommendations: List[ProductInfo]  # 9个推荐产品

# ===== IN-MEMORY STORAGE 内存存储 =====
# Stores user category weights (in real project: use Redis or database)
# 存储用户类别权重（实际项目：用Redis或数据库）

user_category_weights = {}
# Structure: {
#   "user_123": {
#       "生活用品": 5.0,
#       "食品": 3.0,
#       "电子产品": 8.0,
#       "Household": 2.0
#   }
# }

# ===== PRODUCT DATABASE 产品数据库 =====
# Mock product database (in real project: MySQL/PostgreSQL)
# 模拟产品数据库（实际项目：MySQL/PostgreSQL）

PRODUCTS = {
    "生活用品": [
        {"id": "daily_001", "name": "牙刷套装", "description": "软毛护龈牙刷，4支装", "category": "生活用品"},
        {"id": "daily_002", "name": "毛巾", "description": "纯棉吸水毛巾", "category": "生活用品"},
        {"id": "daily_003", "name": "洗发水", "description": "滋养修复洗发水500ml", "category": "生活用品"},
        {"id": "daily_004", "name": "沐浴露", "description": "清爽沐浴露600ml", "category": "生活用品"},
        {"id": "daily_005", "name": "纸巾", "description": "抽纸3层100抽", "category": "生活用品"},
    ],
    "食品": [
        {"id": "food_001", "name": "有机苹果", "description": "新鲜有机红富士苹果", "category": "食品"},
        {"id": "food_002", "name": "全麦面包", "description": "健康全麦切片面包", "category": "食品"},
        {"id": "food_003", "name": "鲜牛奶", "description": "纯鲜牛奶1L", "category": "食品"},
        {"id": "food_004", "name": "鸡蛋", "description": "有机散养鸡蛋12个", "category": "食品"},
        {"id": "food_005", "name": "橄榄油", "description": "特级初榨橄榄油500ml", "category": "食品"},
    ],
    "电子产品": [
        {"id": "elec_001", "name": "无线鼠标", "description": "蓝牙静音办公鼠标", "category": "电子产品"},
        {"id": "elec_002", "name": "机械键盘", "description": "青轴机械键盘RGB背光", "category": "电子产品"},
        {"id": "elec_003", "name": "USB充电器", "description": "65W快充充电器", "category": "电子产品"},
        {"id": "elec_004", "name": "蓝牙耳机", "description": "降噪无线蓝牙耳机", "category": "电子产品"},
        {"id": "elec_005", "name": "移动硬盘", "description": "1TB便携移动硬盘", "category": "电子产品"},
    ],
    "Household": [
        {"id": "house_001", "name": "扫地机器人", "description": "智能扫地拖地机器人", "category": "Household"},
        {"id": "house_002", "name": "空气净化器", "description": "HEPA过滤空气净化器", "category": "Household"},
        {"id": "house_003", "name": "加湿器", "description": "超声波静音加湿器", "category": "Household"},
        {"id": "house_004", "name": "吸尘器", "description": "手持无线吸尘器", "category": "Household"},
        {"id": "house_005", "name": "电饭煲", "description": "智能预约电饭煲", "category": "Household"},
    ]
}

# ===== CONFIGURATION 配置 =====

ACTION_WEIGHTS = {
    # How much weight does each action have?
    # 每个行为的权重是多少？
    "purchase": 3,       # 购买 = 3分（最重要）
    "add_to_cart": 2,    # 加购物车 = 2分
    "view": 1            # 浏览 = 1分（最轻）
}

TOTAL_RECOMMENDATIONS = 9  # Always return exactly 9 products
                          # 总是返回恰好9个产品

# ===== API ENDPOINT 1: RECORD USER ACTION 记录用户行为 =====

@app.post("/action")
def record_user_action(action_data: UserActionRequest):
    """
    API Endpoint 1: Record user action and update category weights
    API端点1：记录用户行为并更新类别权重
    
    WHEN CALLED: Every time user views, purchases, or adds product to cart
    何时调用：每次用户浏览、购买或加购物车时
    
    JAVA SENDS (POST request):
    Java发送（POST请求）：
    POST http://localhost:8000/action
    Content-Type: application/json
    
    {
        "user_id": "user_123",
        "product_id": "prod_001",
        "action": "purchase",        // or "view" or "add_to_cart"
        "category": "电子产品"       // one of 4 categories
    }
    
    WHAT YOU DO:
    你做什么：
    1. Get user's current weights (or create new if first time)
       获取用户当前权重（如果是第一次则创建新的）
    2. Add weight to the category based on action type
       根据行为类型给类别加权重
    3. Store updated weights
       存储更新后的权重
    
    RETURN TO JAVA:
    返回给Java：
    {
        "status": "success",
        "message": "Action recorded",
        "updated_weights": {
            "生活用品": 2.0,
            "食品": 1.0,
            "电子产品": 5.0,  // Just added 3 for purchase
            "Household": 0.0
        }
    }
    """
    
    # Step 1: Get user's current category weights
    # 步骤1：获取用户当前的类别权重
    if action_data.user_id not in user_category_weights:
        # First time seeing this user - initialize all categories to 0
        # 第一次见到这个用户 - 初始化所有类别为0
        user_category_weights[action_data.user_id] = {
            "生活用品": 0.0,
            "食品": 0.0,
            "电子产品": 0.0,
            "Household": 0.0
        }
    
    # Step 2: Get weight for this action
    # 步骤2：获取这个行为的权重值
    weight = ACTION_WEIGHTS.get(action_data.action, 1)
    # If action is "purchase", weight = 3
    # If action is "add_to_cart", weight = 2
    # If action is "view", weight = 1
    # 如果是"purchase"，权重=3；"add_to_cart"=2；"view"=1
    
    # Step 3: Add weight to the category
    # 步骤3：把权重加到对应类别
    user_category_weights[action_data.user_id][action_data.category] += weight
    # Example: If user purchased 电子产品, add 3 to 电子产品 category
    # 例子：如果用户购买了电子产品，给电子产品类别加3分
    
    # Step 4: Return confirmation to Java
    # 步骤4：返回确认信息给Java
    return {
        "status": "success",
        "message": f"Action '{action_data.action}' recorded for user {action_data.user_id}",
        "updated_weights": user_category_weights[action_data.user_id]
    }
    # FastAPI automatically converts this Python dict to JSON
    # FastAPI自动把这个Python字典转成JSON


# ===== API ENDPOINT 2: GET RECOMMENDATIONS 获取推荐 =====

@app.get("/recommend/{user_id}")
def get_recommendations(user_id: str):
    """
    API Endpoint 2: Return exactly 9 product recommendations
    API端点2：返回恰好9个产品推荐
    
    WHEN CALLED: When user visits homepage or product page
    何时调用：当用户访问主页或产品页面时
    
    JAVA SENDS (GET request):
    Java发送（GET请求）：
    GET http://localhost:8000/recommend/user_123
    
    NO REQUEST BODY! Just the user_id in the URL
    没有请求体！只有URL中的user_id
    
    WHAT YOU DO:
    你做什么：
    1. Get user's category weights (from previous actions)
       获取用户的类别权重（从之前的行为）
    2. Calculate ratio for each category
       计算每个类别的比例
       Example: 生活用品:1, 食品:1, 电子产品:2, Household:0
       Total = 4, Ratios = 0.25, 0.25, 0.5, 0
    3. Distribute 9 recommendations proportionally
       按比例分配9个推荐
       Example: 生活用品:2个, 食品:2个, 电子产品:5个, Household:0个
    4. Select products from each category
       从每个类别选择产品
    5. Return complete product info (id, name, description, category)
       返回完整产品信息
    
    RETURN TO JAVA (JSON):
    返回给Java（JSON格式）：
    {
        "user_id": "user_123",
        "total_recommendations": 9,
        "category_distribution": {
            "生活用品": 2,
            "食品": 2,
            "电子产品": 5,
            "Household": 0
        },
        "recommendations": [
            {
                "id": "elec_001",
                "name": "无线鼠标",
                "description": "蓝牙静音办公鼠标",
                "category": "电子产品"
            },
            // ... 8 more products
        ]
    }
    """
    
    # ===== STEP 1: GET USER'S CATEGORY WEIGHTS 获取用户类别权重 =====
    
    if user_id not in user_category_weights:
        # New user with no history - return popular products from all categories
        # 新用户没有历史 - 返回所有类别的热门产品
        return get_default_recommendations(user_id)
    
    weights = user_category_weights[user_id]
    # Example: {"生活用品": 2.0, "食品": 1.0, "电子产品": 4.0, "Household": 1.0}
    
    # ===== STEP 2: CALCULATE TOTAL WEIGHT 计算总权重 =====
    
    total_weight = sum(weights.values())
    # Example: 2.0 + 1.0 + 4.0 + 1.0 = 8.0
    
    if total_weight == 0:
        # Edge case: All weights are 0
        # 边界情况：所有权重都是0
        return get_default_recommendations(user_id)
    
    # ===== STEP 3: CALCULATE RATIOS FOR EACH CATEGORY 计算每个类别的比例 =====
    
    category_ratios = {
        category: weight / total_weight
        for category, weight in weights.items()
    }
    # Example: {
    #   "生活用品": 2.0/8.0 = 0.25 (25%),
    #   "食品": 1.0/8.0 = 0.125 (12.5%),
    #   "电子产品": 4.0/8.0 = 0.5 (50%),
    #   "Household": 1.0/8.0 = 0.125 (12.5%)
    # }
    
    # ===== STEP 4: DISTRIBUTE 9 RECOMMENDATIONS PROPORTIONALLY =====
    # 步骤4：按比例分配9个推荐
    
    category_distribution = {}
    # How many products to recommend from each category
    # 从每个类别推荐多少个产品
    
    for category, ratio in category_ratios.items():
        num_products = int(TOTAL_RECOMMENDATIONS * ratio)
        # Example: 9 * 0.5 = 4 (round down to integer)
        # 例子：9 * 0.5 = 4（向下取整）
        
        # Ensure at least 1 if category has any weight
        # 如果类别有任何权重，确保至少1个
        if num_products == 0 and ratio > 0:
            num_products = 1
        
        category_distribution[category] = num_products
    
    # Adjust to exactly 9 (due to rounding, might not sum to 9)
    # 调整到恰好9个（由于四舍五入，可能不等于9）
    current_total = sum(category_distribution.values())
    
    if current_total < TOTAL_RECOMMENDATIONS:
        # Add remaining to category with highest ratio
        # 把剩余的加到比例最高的类别
        max_category = max(category_ratios, key=category_ratios.get)
        category_distribution[max_category] += (TOTAL_RECOMMENDATIONS - current_total)
    
    elif current_total > TOTAL_RECOMMENDATIONS:
        # Remove excess from category with most products
        # 从产品最多的类别中减去多余的
        max_category = max(category_distribution, key=category_distribution.get)
        category_distribution[max_category] -= (current_total - TOTAL_RECOMMENDATIONS)
    
    # ===== STEP 5: SELECT PRODUCTS FROM EACH CATEGORY =====
    # 步骤5：从每个类别选择产品
    
    recommendations = []
    
    for category, num_to_select in category_distribution.items():
        if num_to_select == 0:
            continue  # Skip categories with 0 allocation
                     # 跳过分配为0的类别
        
        # Get all products in this category
        # 获取该类别的所有产品
        available_products = PRODUCTS.get(category, [])
        
        if not available_products:
            continue  # Skip if category has no products
                     # 如果类别没有产品则跳过
        
        # Randomly select products (in real project: use ranking/scoring)
        # 随机选择产品（实际项目：应该用排序/评分）
        selected_count = min(num_to_select, len(available_products))
        selected = random.sample(available_products, selected_count)
        
        # Add selected products to recommendations
        # 将选中的产品添加到推荐列表
        for product in selected:
            recommendations.append(ProductInfo(**product))
            # **product unpacks the dict: id=..., name=..., description=..., category=...
            # **product解包字典：id=..., name=..., description=..., category=...
    
    # ===== STEP 6: ENSURE EXACTLY 9 RECOMMENDATIONS =====
    # 步骤6：确保恰好9个推荐
    
    if len(recommendations) < TOTAL_RECOMMENDATIONS:
        # Not enough products - add random products to fill
        # 产品不够 - 添加随机产品填充
        needed = TOTAL_RECOMMENDATIONS - len(recommendations)
        all_products = [p for cat_products in PRODUCTS.values() for p in cat_products]
        existing_ids = [r.id for r in recommendations]
        available = [p for p in all_products if p["id"] not in existing_ids]
        
        if available:
            extra = random.sample(available, min(needed, len(available)))
            recommendations.extend([ProductInfo(**p) for p in extra])
    
    # Take only first 9 if somehow we have more
    # 如果超过了只取前9个
    recommendations = recommendations[:TOTAL_RECOMMENDATIONS]
    
    # ===== STEP 7: RETURN JSON TO JAVA =====
    # 步骤7：返回JSON给Java
    
    return RecommendResponse(
        user_id=user_id,
        category_weights=category_ratios,
        recommendations=recommendations
    )
    # FastAPI automatically converts RecommendResponse to JSON
    # FastAPI自动将RecommendResponse转换为JSON

def get_default_recommendations(user_id: str):
    """
    Default recommendations for new users (no history)
    新用户的默认推荐（没有历史）
    
    Strategy: Return 2-3 products from each category
    策略：从每个类别返回2-3个产品
    """
    recommendations = []
    
    # Get 2 products from each category
    # 从每个类别获取2个产品
    for category, products in PRODUCTS.items():
        selected = random.sample(products, min(2, len(products)))
        recommendations.extend([ProductInfo(**p) for p in selected])
    
    # Take first 9
    # 取前9个
    recommendations = recommendations[:TOTAL_RECOMMENDATIONS]
    
    return RecommendResponse(
        user_id=user_id,
        category_weights={"生活用品": 0.25, "食品": 0.25, "电子产品": 0.25, "Household": 0.25},
        recommendations=recommendations
    )

# ===== ADDITIONAL UTILITY ENDPOINTS 额外工具端点 =====

@app.get("/")
def health_check():
    """
    Health check - verify service is running
    健康检查 - 验证服务是否运行
    
    Java can call: GET http://localhost:8000/
    """
    return {
        "status": "healthy",
        "service": "Recommendation API",
        "version": "1.0.0",
        "endpoints": {
            "record_action": "POST /action - Record user behavior",
            "get_recommendations": "GET /recommend/{user_id} - Get 9 recommendations"
        }
    }

@app.get("/user-weights/{user_id}")
def get_user_weights(user_id: str):
    """
    Debug endpoint: View user's current category weights
    调试端点：查看用户当前的类别权重
    
    Useful for testing: GET http://localhost:8000/user-weights/user_123
    """
    if user_id not in user_category_weights:
        return {"user_id": user_id, "weights": "No data yet"}
    
    return {
        "user_id": user_id,
        "weights": user_category_weights[user_id]
    }

# ===== SERVER STARTUP 服务器启动 =====

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print("🚀 Starting Recommendation API Server")
    print("=" * 50)
    print(f"📍 Server URL: http://localhost:8000")
    print(f"📖 API Docs: http://localhost:8000/docs")
    print(f"🔗 Java backend should call:")
    print(f"   - POST http://localhost:8000/action")
    print(f"   - GET http://localhost:8000/recommend/{{user_id}}")
    print("=" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
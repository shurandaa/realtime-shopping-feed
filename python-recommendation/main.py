# main.py
import uvicorn
from backend import app

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 Starting Recommendation API Server")
    print("=" * 50)
    print("📍 Server URL: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)

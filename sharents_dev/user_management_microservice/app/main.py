from fastapi import FastAPI
from .routes import user_routes
from .database import connect_db, close_db

app = FastAPI()

app.include_router(user_routes.router, prefix="/users", tags=["users"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
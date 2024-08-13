from fastapi import FastAPI
from .routes import children_routes
from .database import connect_db, close_db

app = FastAPI()

app.include_router(children_routes.router, prefix="/children", tags=["children"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
from fastapi import FastAPI
from .routes import event_routes

app = FastAPI()

app.include_router(event_routes.router, prefix="/events", tags=["events"])
# need some additional routes for members access --- gets

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
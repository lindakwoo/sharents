from fastapi import FastAPI
from . import routes

app = FastAPI()

app.include_router(routes.router, prefix="", tags=["users"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

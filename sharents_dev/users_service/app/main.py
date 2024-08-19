from fastapi import FastAPI
from . import routes


app = FastAPI(
    title="Users Service",
    description="API for user management",
    version="1.0.0",
    openapi_url="/auth/openapi.json",
    docs_url="/auth/docs",
)


app.include_router(routes.router, prefix="", tags=["users"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

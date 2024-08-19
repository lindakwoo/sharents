from fastapi import FastAPI
from . import routes

app = FastAPI(
    title="Milestones Media Service",
    description="API for managing milestones and media",
    version="1.0.0",
    openapi_url="/api/milestones/openapi.json",
    docs_url="/api/milestones/docs",
)


app.include_router(routes.router, prefix="/api", tags=["milestones_media"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8004)

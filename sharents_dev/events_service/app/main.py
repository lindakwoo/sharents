from fastapi import FastAPI
from . import routes

app = FastAPI(
    title="Events Service",
    description="API for managing events",
    version="1.0.0",
    openapi_url="/api/events/openapi.json",
    docs_url="/api/events/docs",
)


app.include_router(routes.router, prefix="/api", tags=["events"])
# need some additional routes for members access --- gets

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8002)

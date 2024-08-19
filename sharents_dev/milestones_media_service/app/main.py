from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import routes

app = FastAPI(
    title="Milestones Media Service",
    description="API for managing milestones and media",
    version="1.0.0",
    openapi_url="/api/milestones/openapi.json",
    docs_url="/api/milestones/docs",
)

origins = [
    "http://localhost:3000",  # For local development outside Docker
    "http://frontend_service:3000",  # For React app running inside Docker
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api", tags=["milestones_media"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8004)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import routes


app = FastAPI(
    title="Members Service",
    description="API for user management",
    version="1.0.0",
    openapi_url="/api/members/openapi.json",
    docs_url="/api/members/docs",
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


app.include_router(routes.router, prefix="/api", tags=["members"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

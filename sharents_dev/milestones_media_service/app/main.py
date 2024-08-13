from fastapi import FastAPI
from . import routes

app = FastAPI()

app.include_router(routes.router, prefix="/milestones_media", tags=["milestones_media"])
# need to implement for members access --- gets
#  posting and comenting as well

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
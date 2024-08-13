from fastapi import FastAPI
from .routes import milestones, media
from .database import connect_db, close_db

app = FastAPI()

app.include_router(milestones.router, prefix="children/{child_id}/milestones", tags=["milestones"])
app.include_router(media.router, prefix="children/{child_id}/media", tags=["media"])
# need to implement for members access --- gets
#  posting and comenting as well

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
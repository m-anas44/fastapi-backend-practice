from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sockets import sio_app
from app.core.database import init_db
from app.api.v1.routes.chat import router as chat_router
from app.api.v1.routes.random import router as random_data_router
from app.api.v1.routes.auth import router as auth_router

import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("DB connected")
    except Exception as e:
        print("Error in connecting DB!", e)

    yield

app: FastAPI = FastAPI(lifespan=lifespan)

app.mount("/socket", sio_app)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.include_router(chat_router, prefix="/api/v1")
app.include_router(random_data_router, prefix="/api/v1")
app.include_router(auth_router)

@app.get("/health")
def main():
    return {"message": "Hello FastApi", "status": 200}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)
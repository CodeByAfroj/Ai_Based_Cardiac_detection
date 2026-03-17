from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.router.predict_router import router as predict_router


app = FastAPI(title="Arrhythmia Detection API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Arrhythmia Detection API Running"}


app.include_router(predict_router)

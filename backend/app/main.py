import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.investigate import router
from app.api.report import router as report_router
from app.api.investigations import router as investigations_router
from app.api.dashboard import router as dashboard_router

from app.database.database import Base
from app.database.database import engine

import app.database.models
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI SOC Copilot",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(router)
app.include_router(report_router)
app.include_router(investigations_router)
app.include_router(dashboard_router)


@app.get("/")
def home():

    return {
        "message": "AI SOC Copilot Running"
    }
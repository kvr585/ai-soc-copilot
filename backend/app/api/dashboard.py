from fastapi import APIRouter

from app.database.database import SessionLocal
from app.services.dashboard_service import DashboardService

router = APIRouter()

dashboard_service = DashboardService()


@router.get("/dashboard")
def get_dashboard():

    db = SessionLocal()

    try:

        return dashboard_service.get_dashboard(db)

    finally:

        db.close()
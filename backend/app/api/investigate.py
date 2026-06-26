from fastapi import APIRouter

from app.schemas.alert import AlertRequest
from app.controllers.investigation_controller import InvestigationController

router = APIRouter()

controller = InvestigationController()


@router.post("/investigate")
def investigate(request: AlertRequest):
    print("Endpoint reached")

    return controller.investigate(
        request.alert,
        request.log
    )
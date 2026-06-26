from fastapi import APIRouter, HTTPException

from app.database.database import SessionLocal
from app.database.crud import InvestigationCRUD

router = APIRouter()

crud = InvestigationCRUD()


@router.get("/investigations")
def get_all_investigations():

    db = SessionLocal()

    try:

        investigations = crud.get_all(db)

        return investigations

    finally:

        db.close()


@router.get("/investigations/{investigation_id}")
def get_investigation(investigation_id: int):

    db = SessionLocal()

    try:

        investigation = crud.get_by_id(
            db,
            investigation_id,
        )

        if not investigation:
            raise HTTPException(
                status_code=404,
                detail="Investigation not found",
            )

        return investigation

    finally:

        db.close()


@router.delete("/investigations/{investigation_id}")
def delete_investigation(investigation_id: int):

    db = SessionLocal()

    try:

        investigation = crud.delete(
            db,
            investigation_id,
        )

        if not investigation:
            raise HTTPException(
                status_code=404,
                detail="Investigation not found",
            )

        return {
            "message": "Investigation deleted successfully"
        }

    finally:

        db.close()
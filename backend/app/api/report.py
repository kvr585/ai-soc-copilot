from fastapi import APIRouter
from fastapi.responses import Response

from app.schemas.report import ReportRequest
from app.services.report_generator import ReportGenerator

router = APIRouter()

report_generator = ReportGenerator()


@router.post("/generate-report")
def generate_report(request: ReportRequest):

    markdown = report_generator.generate_markdown(
        request.investigation
    )

    return Response(
        content=markdown,
        media_type="text/markdown"
    )
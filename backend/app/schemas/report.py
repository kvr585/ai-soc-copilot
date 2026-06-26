from pydantic import BaseModel


class ReportRequest(BaseModel):
    investigation: dict
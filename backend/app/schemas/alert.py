from typing import Optional

from pydantic import BaseModel


class AlertRequest(BaseModel):
    alert: str
    log: Optional[str] = None

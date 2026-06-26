from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import JSON
from sqlalchemy import String
from sqlalchemy import Text

from app.database.database import Base


class Investigation(Base):

    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(String(50), unique=True, index=True)

    alert = Column(Text)

    logs = Column(Text)

    severity = Column(String(50))

    risk_score = Column(Integer)

    risk_level = Column(String(50))

    incident_type = Column(String(100))

    summary = Column(Text)

    report = Column(Text)

    # Structured JSON analysis payloads
    alert_analysis = Column(JSON, nullable=True)

    threat_intelligence = Column(JSON, nullable=True)

    risk_analysis = Column(JSON, nullable=True)

    correlation = Column(JSON, nullable=True)

    mitre = Column(JSON, nullable=True)

    iocs = Column(JSON, nullable=True)

    response_plan = Column(JSON, nullable=True)



    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
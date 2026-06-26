from uuid import uuid4

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.models import Investigation


class InvestigationCRUD:

    def create(
        self,
        db: Session,
        alert: str,
        logs: str,
        investigation: dict,
        report: str = "",
    ):

        obj = Investigation(
            incident_id=f"INC-{uuid4().hex[:8].upper()}",
            alert=alert,
            logs=logs,
            severity=investigation["alert_analysis"]["severity"],
            risk_score=investigation["risk_analysis"]["risk_score"],
            risk_level=investigation["risk_analysis"]["risk_level"],
            incident_type=investigation["correlation"]["incident_type"],
            summary=investigation["correlation"]["summary"],
            report=report,
            alert_analysis=investigation.get("alert_analysis"),
            threat_intelligence=investigation.get("threat_intelligence"),
            risk_analysis=investigation.get("risk_analysis"),
            correlation=investigation.get("correlation"),
            mitre=investigation.get("mitre"),
            iocs=investigation.get("iocs"),
            response_plan=investigation.get("response_plan"),
        )

        db.add(obj)
        db.commit()
        db.refresh(obj)

        return obj

    def get_all(
        self,
        db: Session,
    ):

        return (
            db.query(Investigation)
            .order_by(Investigation.created_at.desc())
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        investigation_id: int,
    ):

        return (
            db.query(Investigation)
            .filter(
                Investigation.id == investigation_id
            )
            .first()
        )

    def delete(
        self,
        db: Session,
        investigation_id: int,
    ):

        investigation = self.get_by_id(
            db,
            investigation_id,
        )

        if investigation:
            db.delete(investigation)
            db.commit()

        return investigation

    # -----------------------------
    # Dashboard Analytics
    # -----------------------------

    def get_dashboard_stats(
        self,
        db: Session,
    ):

        total_incidents = db.query(Investigation).count()

        critical_incidents = (
            db.query(Investigation)
            .filter(Investigation.risk_level == "Critical")
            .count()
        )

        high_incidents = (
            db.query(Investigation)
            .filter(Investigation.severity == "High")
            .count()
        )

        medium_incidents = (
            db.query(Investigation)
            .filter(Investigation.severity == "Medium")
            .count()
        )

        low_incidents = (
            db.query(Investigation)
            .filter(Investigation.severity == "Low")
            .count()
        )

        average_risk_score = (
            db.query(func.avg(Investigation.risk_score))
            .scalar()
        )

        average_risk_score = (
            round(average_risk_score, 2)
            if average_risk_score
            else 0
        )

        most_common_incident = (
            db.query(
                Investigation.incident_type,
                func.count(Investigation.id),
            )
            .group_by(Investigation.incident_type)
            .order_by(func.count(Investigation.id).desc())
            .first()
        )

        last_investigation = (
            db.query(Investigation)
            .order_by(Investigation.created_at.desc())
            .first()
        )

        recent_incidents = (
            db.query(Investigation)
            .order_by(Investigation.created_at.desc())
            .limit(10)
            .all()
        )

        return {
            "total_incidents": total_incidents,
            "critical_incidents": critical_incidents,
            "high_incidents": high_incidents,
            "medium_incidents": medium_incidents,
            "low_incidents": low_incidents,
            "average_risk_score": average_risk_score,
            "most_common_incident": (
                most_common_incident[0]
                if most_common_incident
                else None
            ),
            "last_investigation": (
                last_investigation.created_at
                if last_investigation
                else None
            ),
            "recent_incidents": recent_incidents,
        }
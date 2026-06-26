from collections import Counter, defaultdict
from datetime import datetime

from sqlalchemy.orm import Session

from app.database.models import Investigation


class DashboardService:

    def get_dashboard(self, db: Session):

        investigations = (
            db.query(Investigation)
            .order_by(Investigation.created_at.desc())
            .all()
        )

        total_incidents = len(investigations)

        critical_incidents = sum(
            1 for i in investigations
            if i.risk_level == "Critical"
        )

        high_incidents = sum(
            1 for i in investigations
            if i.severity == "High"
        )

        medium_incidents = sum(
            1 for i in investigations
            if i.severity == "Medium"
        )

        low_incidents = sum(
            1 for i in investigations
            if i.severity == "Low"
        )

        average_risk_score = (
            sum(i.risk_score for i in investigations)
            / total_incidents
            if total_incidents
            else 0
        )

        incident_counter = Counter(
            i.incident_type
            for i in investigations
        )

        most_common_incident = (
            incident_counter.most_common(1)[0][0]
            if incident_counter
            else None
        )

        last_investigation = (
            investigations[0].created_at
            if investigations
            else None
        )

        # -----------------------------
        # Severity Distribution
        # -----------------------------

        severity_distribution = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
        }

        for investigation in investigations:

            severity = (
                investigation.severity or ""
            ).lower()

            if severity in severity_distribution:
                severity_distribution[severity] += 1

        # -----------------------------
        # Risk Score Distribution
        # -----------------------------

        risk_distribution = [
            {"bucket": "0-20", "count": 0},
            {"bucket": "21-40", "count": 0},
            {"bucket": "41-60", "count": 0},
            {"bucket": "61-80", "count": 0},
            {"bucket": "81-100", "count": 0},
        ]

        for investigation in investigations:

            score = investigation.risk_score

            if score <= 20:
                risk_distribution[0]["count"] += 1
            elif score <= 40:
                risk_distribution[1]["count"] += 1
            elif score <= 60:
                risk_distribution[2]["count"] += 1
            elif score <= 80:
                risk_distribution[3]["count"] += 1
            else:
                risk_distribution[4]["count"] += 1

        # -----------------------------
        # Incident Trend
        # -----------------------------

        trend = defaultdict(int)

        for investigation in investigations:

            day = investigation.created_at.strftime("%d %b")

            trend[day] += 1

        incident_trend = [
            {
                "date": day,
                "count": count,
            }
            for day, count in sorted(trend.items())
        ]

        # -----------------------------
        # Top Incident Types
        # -----------------------------

        top_incident_types = [
            {
                "type": incident,
                "count": count,
            }
            for incident, count in incident_counter.most_common(5)
        ]

        return {

            "total_incidents": total_incidents,

            "critical_incidents": critical_incidents,

            "high_incidents": high_incidents,

            "medium_incidents": medium_incidents,

            "low_incidents": low_incidents,

            "average_risk_score": round(
                average_risk_score,
                2,
            ),

            "most_common_incident": most_common_incident,

            "last_investigation": last_investigation,

            "severity_distribution": severity_distribution,

            "risk_distribution": risk_distribution,

            "incident_trend": incident_trend,

            "top_incident_types": top_incident_types,

            "recent_incidents": investigations[:10],
        }
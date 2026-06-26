import logging

from app.agents.alert_agent import AlertAgent
from app.agents.threat_agent import ThreatAgent
from app.agents.log_agent import LogAgent
from app.agents.correlation_agent import CorrelationAgent
from app.agents.mitre_agent import MitreAgent
from app.agents.ioc_agent import IOCAgent
from app.agents.response_agent import ResponseAgent

from app.services.detection_engine import DetectionEngine
from app.services.report_generator import ReportGenerator

from app.database.database import SessionLocal
from app.database.crud import InvestigationCRUD


logger = logging.getLogger(__name__)


class InvestigationController:

    def __init__(self):

        self.alert_agent = AlertAgent()
        self.threat_agent = ThreatAgent()
        self.log_agent = LogAgent()
        self.correlation_agent = CorrelationAgent()
        self.detection_engine = DetectionEngine()
        self.mitre_agent = MitreAgent()
        self.ioc_agent = IOCAgent()
        self.response_agent = ResponseAgent()

        self.report_generator = ReportGenerator()

        self.crud = InvestigationCRUD()

    def investigate(self, alert: str, log: str | None = None):

        print("\n========== NEW INVESTIGATION ==========\n")

        # Step 1 - Alert Analysis
        logger.info("Running Alert Agent...")
        alert_analysis = self.alert_agent.analyze(alert)

        # Step 2 - Threat Intelligence
        logger.info("Running Threat Agent...")
        threat_intelligence = self.threat_agent.analyze(alert)

        # Step 3 - Log Analysis
        log_analysis = {}

        if log:
            logger.info("Running Log Agent...")
            log_analysis = self.log_agent.analyze(log)

        # Step 4 - Risk Analysis
        logger.info("Running Detection Engine...")
        risk_analysis = self.detection_engine.calculate_risk(
            alert_analysis,
            threat_intelligence,
            log_analysis,
        )

        # Step 5 - Correlation
        logger.info("Running Correlation Agent...")
        correlation = self.correlation_agent.analyze(
            alert_analysis,
            threat_intelligence,
            log_analysis,
        )

        # Step 6 - MITRE Mapping
        logger.info("Running MITRE Agent...")
        mitre = self.mitre_agent.analyze(
            alert_analysis,
            log_analysis,
            correlation,
        )

        print("MITRE RESULT:")
        print(mitre)

        # Step 7 - IOC Extraction
        logger.info("Running IOC Agent...")
        iocs = self.ioc_agent.analyze(
            alert,
            threat_intelligence,
            correlation,
        )

        print("IOC RESULT:")
        print(iocs)

        # Step 8 - AI Response Plan
        logger.info("Running Response Agent...")
        response_plan = self.response_agent.analyze(
            alert_analysis,
            threat_intelligence,
            log_analysis,
            correlation,
            risk_analysis,      # <-- THIS WAS MISSING
            mitre,
            iocs,
        )

        print("RESPONSE PLAN:")
        print(response_plan)

        # Final Investigation Object
        investigation = {
            "alert_analysis": alert_analysis,
            "threat_intelligence": threat_intelligence,
            "log_analysis": log_analysis,
            "risk_analysis": risk_analysis,
            "correlation": correlation,
            "mitre": mitre,
            "iocs": iocs,
            "response_plan": response_plan,
        }

        # Step 9 - Generate Report
        logger.info("Generating Report...")
        markdown = self.report_generator.generate_markdown(
            investigation
        )

        # Step 10 - Save to Database
        logger.info("Saving Investigation...")

        db = SessionLocal()

        try:
            self.crud.create(
                db=db,
                alert=alert,
                logs=log or "",
                investigation=investigation,
                report=markdown,
            )

        finally:
            db.close()

        logger.info("Investigation saved successfully.")
        logger.info("========== INVESTIGATION COMPLETE ==========")

        return investigation
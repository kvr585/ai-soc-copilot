from app.core.gemini import client, MODEL


class ReportAgent:

    def analyze(self, investigation: dict) -> str:
        prompt = f"""
You are a Senior Incident Response Analyst.

Generate a professional executive incident report in Markdown for a SOC Manager or CISO.

The report must contain the following sections exactly:

# Executive Summary

# Incident Overview

# Alert Analysis

# Threat Intelligence

# Risk Assessment

# MITRE ATT&CK Mapping

# Indicators of Compromise

# Incident Timeline

# Recommended Response

# Analyst Conclusion

Use the investigation output below to create a polished report. Do not return JSON. Use inline code formatting for MITRE technique IDs.

Investigation:

Alert Analysis:
{investigation.get('alert_analysis')}

Threat Intelligence:
{investigation.get('threat_intelligence')}

Log Analysis:
{investigation.get('log_analysis')}

Risk Analysis:
{investigation.get('risk_analysis')}

Correlation:
{investigation.get('correlation')}

MITRE:
{investigation.get('mitre')}

IOCs:
{investigation.get('iocs')}

Response Plan:
{investigation.get('response_plan')}
"""

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )

        report = response.text.strip()

        if report.startswith('```'):
            report = report.replace('```markdown', '').replace('```', '').strip()

        return report

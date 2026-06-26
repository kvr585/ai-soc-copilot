import json

from app.core.gemini import client, MODEL


class CorrelationAgent:

    def analyze(
        self,
        alert_analysis: dict,
        threat_intelligence: dict,
        log_analysis: dict,
    ):

        prompt = f"""
You are an experienced Senior Security Operations Center (SOC) Analyst.

You have received the outputs from multiple specialized security analysis agents.

Your responsibility is to correlate the evidence into a single security incident assessment.

Evidence:

Alert Analysis:
{json.dumps(alert_analysis, indent=2)}

Threat Intelligence:
{json.dumps(threat_intelligence, indent=2)}

Log Analysis:
{json.dumps(log_analysis, indent=2)}

Your tasks:

1. Identify the most likely incident type.

2. Determine the overall incident severity.

3. Estimate confidence as an integer between 0 and 100.

4. Build a logical chronological attack timeline using only the available evidence.

5. Write a concise executive summary (2–4 sentences).

Rules:

- Never invent evidence.
- Base conclusions only on the supplied investigation results.
- If information is missing, clearly state that.
- Severity MUST be exactly one of:
  Critical
  High
  Medium
  Low
- Timeline should be ordered from earliest activity to latest.
- Summary should sound like a professional SOC investigation report.

Return ONLY valid JSON.

Format:

{{
    "incident_type": "",
    "severity": "",
    "confidence": 0,
    "timeline": [],
    "summary": ""
}}
"""

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        try:
            result = json.loads(text)

        except json.JSONDecodeError:

            result = {
                "incident_type": "Unknown",
                "severity": "Low",
                "confidence": 0,
                "timeline": [],
                "summary": "Unable to correlate investigation results due to an invalid AI response."
            }

        # Normalize incident type
        result["incident_type"] = (
            result.get("incident_type", "Unknown").strip()
        )

        # Normalize severity
        result["severity"] = (
            result.get("severity", "Low").title()
        )

        # Normalize confidence
        try:
            confidence = int(result.get("confidence", 0))
        except (ValueError, TypeError):
            confidence = 0

        result["confidence"] = max(0, min(100, confidence))

        # Normalize timeline
        timeline = result.get("timeline", [])

        if not isinstance(timeline, list):
            timeline = []

        result["timeline"] = timeline

        # Normalize summary
        result["summary"] = (
            result.get(
                "summary",
                "No investigation summary available."
            ).strip()
        )

        return result

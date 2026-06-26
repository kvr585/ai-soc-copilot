import json

from app.core.gemini import client, MODEL


class ResponseAgent:

    def analyze(
        self,
        alert_analysis: dict,
        threat_intelligence: dict,
        log_analysis: dict,
        correlation: dict,
        risk_analysis: dict,
        mitre: dict,
        iocs: dict,
    ):

        prompt = f"""
You are an experienced Senior Incident Response Analyst.

Your responsibility is to create a practical, professional incident response plan based ONLY on the investigation evidence.

Evidence:

Alert Analysis:
{json.dumps(alert_analysis, indent=2)}

Threat Intelligence:
{json.dumps(threat_intelligence, indent=2)}

Log Analysis:
{json.dumps(log_analysis, indent=2)}

Risk Analysis:
{json.dumps(risk_analysis, indent=2)}

Correlation Analysis:
{json.dumps(correlation, indent=2)}

MITRE ATT&CK Mapping:
{json.dumps(mitre, indent=2)}

Indicators of Compromise:
{json.dumps(iocs, indent=2)}

Rules:

1. Base every recommendation only on the supplied evidence.
2. Never invent attack details.
3. Prioritize actions according to the risk analysis.
4. Containment actions should stop the attack immediately.
5. Eradication actions should remove the threat.
6. Recovery actions should restore normal operations.
7. Recommendations should improve long-term security.
8. Return empty lists when a section has no applicable actions.

Return ONLY valid JSON.

Format:

{{
    "priority": "",
    "estimated_impact": "",
    "containment": [],
    "eradication": [],
    "recovery": [],
    "recommendations": []
}}
"""

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        try:
            result = json.loads(text)

        except json.JSONDecodeError as e:

            print("RESPONSE PLAN JSON ERROR:", e)

            result = {
                "priority": "Unknown",
                "estimated_impact": "Unknown",
                "containment": [],
                "eradication": [],
                "recovery": [],
                "recommendations": []
            }

        # Normalize priority
        result["priority"] = (
            result.get("priority", "Unknown").title()
        )

        # Normalize estimated impact
        result["estimated_impact"] = (
            result.get("estimated_impact", "Unknown").title()
        )

        # Normalize list sections
        sections = [
            "containment",
            "eradication",
            "recovery",
            "recommendations",
        ]

        for section in sections:

            items = result.get(section, [])

            if not isinstance(items, list):
                items = []

            cleaned = []

            for item in items:

                if item is None:
                    continue

                item = str(item).strip()

                if item:
                    cleaned.append(item)

            result[section] = list(dict.fromkeys(cleaned))

        return result
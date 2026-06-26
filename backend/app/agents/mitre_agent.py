import json

from app.core.gemini import client, MODEL


class MitreAgent:

    def analyze(
        self,
        alert_analysis: dict,
        log_analysis: dict,
        correlation: dict,
    ):

        prompt = f"""
You are an experienced Senior SOC Analyst specializing in the MITRE ATT&CK Framework.

Your responsibility is to map the investigated incident to the most appropriate MITRE ATT&CK tactics and techniques.

Evidence:

Alert Analysis:
{json.dumps(alert_analysis, indent=2)}

Log Analysis:
{json.dumps(log_analysis, indent=2)}

Correlation Analysis:
{json.dumps(correlation, indent=2)}

Rules:

1. Select only tactics and techniques supported by the evidence.
2. Never invent attack techniques.
3. Use official MITRE ATT&CK tactic names.
4. Use official MITRE ATT&CK technique IDs (for example T1078, T1059.001).
5. Avoid duplicate tactics or techniques.
6. If there is insufficient evidence, return empty arrays.

Return ONLY valid JSON.

Format:

{{
    "tactics": [
        "Initial Access",
        "Execution"
    ],
    "techniques": [
        {{
            "id": "T1078",
            "name": "Valid Accounts"
        }}
    ]
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

        print("\n========== MITRE RAW RESPONSE ==========")
        print(text)
        print("========================================\n")

        try:
            result = json.loads(text)

        except json.JSONDecodeError as e:

            print("MITRE JSON ERROR:", e)

            result = {
                "tactics": [],
                "techniques": []
            }

        # Normalize tactics
        tactics = result.get("tactics", [])

        if not isinstance(tactics, list):
            tactics = []

        result["tactics"] = list(dict.fromkeys(tactics))

        # Normalize techniques
        techniques = result.get("techniques", [])

        if not isinstance(techniques, list):
            techniques = []

        normalized = []

        for technique in techniques:

            if not isinstance(technique, dict):
                continue

            technique_id = technique.get("id", "").strip()

            technique_name = technique.get("name", "").strip()

            if technique_id and technique_name:
                normalized.append({
                    "id": technique_id,
                    "name": technique_name
                })

        result["techniques"] = normalized

        return result
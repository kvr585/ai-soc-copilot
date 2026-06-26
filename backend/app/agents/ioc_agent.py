import json

from app.core.gemini import client, MODEL


class IOCAgent:

    def analyze(
        self,
        alert: str,
        threat: dict,
        correlation: dict,
    ):

        prompt = f"""
You are an experienced Cyber Threat Hunter.

Your responsibility is to extract every Indicator of Compromise (IOC) from the investigation results.

Evidence:

Original Alert:
{alert}

Threat Intelligence:
{json.dumps(threat, indent=2)}

Correlation Analysis:
{json.dumps(correlation, indent=2)}

Rules:

1. Extract ONLY indicators supported by the evidence.
2. Never invent IOCs.
3. Remove duplicate values.
4. Return empty arrays when no indicators exist.
5. Preserve the original value exactly as it appears.
6. Do not classify normal words as IOCs.

Return ONLY valid JSON.

Format:

{{
    "ips": [],
    "users": [],
    "emails": [],
    "domains": [],
    "urls": [],
    "hashes": [],
    "countries": [],
    "organizations": []
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

            print("IOC JSON ERROR:", e)

            result = {
                "ips": [],
                "users": [],
                "emails": [],
                "domains": [],
                "urls": [],
                "hashes": [],
                "countries": [],
                "organizations": []
            }

        expected_keys = [
            "ips",
            "users",
            "emails",
            "domains",
            "urls",
            "hashes",
            "countries",
            "organizations",
        ]

        for key in expected_keys:

            values = result.get(key, [])

            if not isinstance(values, list):
                values = []

            cleaned = []

            for value in values:

                if value is None:
                    continue

                value = str(value).strip()

                if value:
                    cleaned.append(value)

            result[key] = list(dict.fromkeys(cleaned))

        return result
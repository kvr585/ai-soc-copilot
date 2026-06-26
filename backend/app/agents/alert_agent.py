import json


from app.core.gemini import client, MODEL


class AlertAgent:

    def analyze(self, alert: str):

        prompt = f"""
You are an experienced Tier-1 Security Operations Center (SOC) Analyst.

Your task is to analyze the following security alert and classify it according to standard cybersecurity practices.

Rules:

1. Severity MUST be exactly one of:
   - Critical
   - High
   - Medium
   - Low

2. Category should be a short security category such as:
   - Credential Access
   - Phishing
   - Malware
   - Brute Force
   - Ransomware
   - Command and Control
   - Reconnaissance
   - Privilege Escalation
   - Lateral Movement
   - Data Exfiltration
   - Denial of Service
   - Informational
   - Unknown

3. Confidence must be an integer between 0 and 100.

4. Reason must briefly explain why the alert received its severity and category.

5. Never invent information that is not present in the alert.

6. If there is insufficient information, clearly state that in the reason and use Low severity unless the alert explicitly indicates otherwise.

Return ONLY valid JSON.

Format:

{{
    "severity": "",
    "category": "",
    "confidence": 0,
    "reason": ""
}}

Alert:

{alert}
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
                "severity": "Low",
                "category": "Unknown",
                "confidence": 0,
                "reason": "Unable to parse AI response."
            }

        # Normalize severity
        result["severity"] = result.get("severity", "Low").title()

        # Normalize category
        result["category"] = result.get("category", "Unknown").strip()

        # Normalize confidence
        try:
            confidence = int(result.get("confidence", 0))
        except (ValueError, TypeError):
            confidence = 0

        result["confidence"] = max(0, min(100, confidence))

        # Normalize reason
        result["reason"] = result.get("reason", "No reason provided.").strip()

        return result

from datetime import datetime


class ReportGenerator:

    def generate_markdown(self, investigation: dict) -> str:

        alert = investigation.get("alert_analysis", {})
        threat = investigation.get("threat_intelligence", {})
        logs = investigation.get("log_analysis", {})
        risk = investigation.get("risk_analysis", {})
        correlation = investigation.get("correlation", {})
        mitre = investigation.get("mitre", {})
        iocs = investigation.get("iocs", {})
        response = investigation.get("response_plan", {})
        risk_level = risk.get("risk_level", "").lower()
        if risk_level == "critical":

            final_conclusion = """
        The investigation identified a high-confidence cyber security incident.

        Multiple indicators strongly suggest malicious activity affecting the environment.

        Immediate containment, eradication, and recovery actions should be initiated without delay to reduce organizational impact.
        """

        elif risk_level == "high":

            final_conclusion = """
        The investigation identified significant indicators of malicious activity.

        Rapid investigation and containment are recommended to prevent further compromise.

        SOC analysts should prioritize this incident for immediate review.
        """

        elif risk_level == "medium":

            final_conclusion = """
        The investigation detected suspicious activity that may represent an emerging security incident.

        Additional monitoring and analyst validation are recommended before determining the final impact.
        """

        else:

            final_conclusion = """
        No significant malicious activity was identified during this investigation.

        The available evidence suggests this alert is informational or a false positive.

        No immediate containment actions are required, although monitoring should continue.
        """

        report = f"""
        
# AI SOC Copilot

# Security Incident Investigation Report

---

**Generated:** {datetime.now().strftime("%d %B %Y %H:%M:%S")}

**Risk Score:** {risk.get("risk_score", "N/A")}

**Risk Level:** {risk.get("risk_level", "N/A")}

---

# 1. Executive Summary

{correlation.get("summary", "No summary available.")}

---

# 2. Alert Analysis

**Severity**

{alert.get("severity", "N/A")}

**Category**

{alert.get("category", "N/A")}

**Confidence**

{alert.get("confidence", "N/A")}%

**Reason**

{alert.get("reason", "N/A")}

---

# 3. Threat Intelligence

| Field | Value |
|-------|-------|
| IP | {threat.get("ip", "N/A")} |
| Country | {threat.get("country", "N/A")} |
| City | {threat.get("city", "N/A")} |
| ISP | {threat.get("isp", "N/A")} |
| Organization | {threat.get("organization", "N/A")} |
| Timezone | {threat.get("timezone", "N/A")} |

---

# 4. Log Analysis

| Indicator | Status |
|-----------|--------|
| Failed Logins | {logs.get("failed_logins", 0)} |
| PowerShell | {logs.get("powershell", False)} |
| VPN Login | {logs.get("vpn_login", False)} |
| New User | {logs.get("new_user", False)} |

---

# 5. Risk Assessment

**Risk Score**

{risk.get("risk_score", "N/A")}

**Risk Level**

{risk.get("risk_level", "N/A")}

## Reasons

"""

        for reason in risk.get("reasons", []):
            report += f"- {reason}\n"

        report += """

---

# 6. Correlation Analysis

"""

        report += f"""
**Incident Type**

{correlation.get("incident_type", "N/A")}

**Severity**

{correlation.get("severity", "N/A")}

**Confidence**

{correlation.get("confidence", "N/A")}%

## Timeline

"""

        for item in correlation.get("timeline", []):
            report += f"- {item}\n"

        report += f"""

## Summary

{correlation.get("summary", "N/A")}

---

# 7. MITRE ATT&CK Mapping

## Tactics

"""

        for tactic in mitre.get("tactics", []):
            report += f"- {tactic}\n"

        report += """

## Techniques

| Technique ID | Name |
|--------------|------|
"""

        for technique in mitre.get("techniques", []):
            report += (
                f"| {technique.get('id', '')} | "
                f"{technique.get('name', '')} |\n"
            )

        report += """

---

# 8. Indicators of Compromise (IOCs)

"""

        for key, values in iocs.items():

            report += f"## {key.upper()}\n"

            if values:

                for value in values:
                    report += f"- {value}\n"

            else:

                report += "- None Detected\n"

            report += "\n"

        report += """

---

# 9. AI Response Plan

"""

        report += f"""
## Priority

{response.get("priority", "N/A")}

## Estimated Impact

{response.get("estimated_impact", "N/A")}

## Containment

"""

        for item in response.get("containment", []):
            report += f"- {item}\n"

        report += """

## Eradication

"""

        for item in response.get("eradication", []):
            report += f"- {item}\n"

        report += """

## Recovery

"""

        for item in response.get("recovery", []):
            report += f"- {item}\n"

        report += """

## Recommendations

"""

        for item in response.get("recommendations", []):
            report += f"- {item}\n"

        report += """

---

# 10. Investigation Timeline

"""

        for index, event in enumerate(correlation.get("timeline", []), start=1):
            report += f"{index}. {event}\n"

        report += f"""

---

# 11. Final Conclusion

{final_conclusion}

---

Generated by **AI SOC Copilot**
"""

        return report
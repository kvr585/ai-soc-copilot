class DetectionEngine:

    def calculate_risk(
        self,
        alert_analysis: dict,
        threat_intelligence: dict,
        log_analysis: dict,
    ):

        score = 0
        reasons = []

        # Alert severity
        severity = alert_analysis.get("severity", "").lower()

        if severity == "critical":
            score += 40
            reasons.append("Critical alert")
        elif severity == "high":
            score += 30
            reasons.append("High severity alert")
        elif severity == "medium":
            score += 20
            reasons.append("Medium severity alert")

        # Threat Intelligence
        if threat_intelligence.get("ip_found"):
            score += 10
            reasons.append("IP detected")

        # Hosting providers are more suspicious than residential ISPs
        org = str(threat_intelligence.get("organization", "")).lower()

        suspicious_hosts = [
            "hostinger",
            "amazon",
            "digitalocean",
            "linode",
            "ovh",
            "vultr"
        ]

        if any(host in org for host in suspicious_hosts):
            score += 20
            reasons.append("Cloud/Hosting provider")

        # Failed logins
        failed = log_analysis.get("failed_logins", 0)

        if failed >= 5:
            score += 25
            reasons.append("Multiple failed logins")
        elif failed >= 2:
            score += 15
            reasons.append("Repeated failed logins")

        # Successful login after authentication attempts
        if log_analysis.get("successful_login"):
            score += 15
            reasons.append("Successful authentication detected")

        # PowerShell
        if log_analysis.get("powershell"):
            score += 30
            reasons.append("PowerShell execution")

        # VPN
        if log_analysis.get("vpn_login"):
            reasons.append("VPN activity observed")

        # New user
        if log_analysis.get("new_user"):
            score += 20
            reasons.append("New user created")

        # Correlated suspicious activity
        if (
            log_analysis.get("powershell")
            and log_analysis.get("new_user")
        ):
            score += 10
            reasons.append("PowerShell execution combined with new user creation")

        if (
            failed >= 2
            and log_analysis.get("successful_login")
        ):
            score += 10
            reasons.append("Multiple failed logins followed by successful authentication")

        score = min(score, 100)

        if score >= 80:
            level = "Critical"
        elif score >= 60:
            level = "High"
        elif score >= 40:
            level = "Medium"
        else:
            level = "Low"

        return {
            "risk_score": score,
            "risk_level": level,
            "reasons": reasons
        }

import re


class LogParser:

    def parse(self, log: str):
        if not log:
            return {
        "failed_logins": 0,
        "powershell": False,
        "vpn_login": False,
        "new_user": False,
        }

        findings = {
            "failed_logins": 0,
            "successful_login": False,
            "powershell": False,
            "vpn_login": False,
            "new_user": False
        }

        failed_login_patterns = [
            r"failed login",
            r"failed password",
            r"authentication failed",
            r"login failed",
            r"invalid user",
            r"access denied",
        ]

        findings["failed_logins"] = sum(
            len(re.findall(pattern, log, re.IGNORECASE))
            for pattern in failed_login_patterns
        )
        if re.search(
            r"accepted password|login successful|authentication successful",
            log,
            re.IGNORECASE,
        ):
            findings["successful_login"] = True

        if re.search(r"powershell", log, re.IGNORECASE):
            findings["powershell"] = True

        if re.search(r"vpn", log, re.IGNORECASE):
            findings["vpn_login"] = True

        if re.search(r"new user", log, re.IGNORECASE):
            findings["new_user"] = True

        return findings

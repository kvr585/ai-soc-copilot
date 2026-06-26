import re
import ipaddress
from unittest import result

from app.services.ip_lookup import IPLookupService


class ThreatAgent:

    def __init__(self):
        self.lookup_service = IPLookupService()

    def analyze(self, alert: str):

        result = {
            "ip_found": False
        }

        match = re.search(
            r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
            alert
        )

        if not match:
            return result

        ip = match.group()
        try:
            ipaddress.ip_address(ip)
        except ValueError:
            return result

        try:
            data = self.lookup_service.lookup(ip)

        except Exception:

            return {
                "ip_found": True,
                "ip": ip,
                "lookup_success": False,
                "country": None,
                "city": None,
                "isp": None,
                "organization": None,
                "timezone": None
            }
        result = {
            "ip_found": True,
            "lookup_success": True,
            "ip": ip,
            "country": data.get("country"),
            "city": data.get("city"),
            "isp": data.get("isp"),
            "organization": data.get("org"),
            "timezone": data.get("timezone")
        }

        return result

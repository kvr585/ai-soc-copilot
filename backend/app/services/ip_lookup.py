import requests


class IPLookupService:

    BASE_URL = "http://ip-api.com/json/"

    def lookup(self, ip: str):

        response = requests.get(
            f"{self.BASE_URL}{ip}",
            timeout=5
        )

        return response.json()

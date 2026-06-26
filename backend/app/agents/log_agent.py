from app.services.log_parser import LogParser


class LogAgent:

    def __init__(self):
        self.parser = LogParser()

    def analyze(self, log: str):

        return self.parser.parse(log)

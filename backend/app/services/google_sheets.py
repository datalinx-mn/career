import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
import json

class GoogleSheetsService:
    def __init__(self):
        self.scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        self.creds_json = os.getenv("GOOGLE_SHEETS_CREDS_JSON")
        self.spreadsheet_id = os.getenv("GOOGLE_SHEET_ID")
        self.client = None

    def _get_client(self):
        if not self.client and self.creds_json:
            creds_dict = json.loads(self.creds_json)
            creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, self.scope)
            self.client = gspread.authorize(creds)
        return self.client

    def append_submission(self, submission_id, user_name, user_email, answers):
        client = self._get_client()
        if not client or not self.spreadsheet_id:
            print("Google Sheets integration not configured")
            return
        
        try:
            sheet = client.open_by_key(self.spreadsheet_id).sheet1
            row = [submission_id, user_name, user_email, json.dumps(answers)]
            sheet.append_row(row)
        except Exception as e:
            print(f"Error appending to Google Sheets: {e}")

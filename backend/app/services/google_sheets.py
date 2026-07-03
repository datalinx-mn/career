import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
import json
import time
import csv
import urllib.request

class GoogleSheetsService:
    def __init__(self):
        self.scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        self.creds_json = os.getenv("GOOGLE_SHEETS_CREDS_JSON")
        self.spreadsheet_id = os.getenv("GOOGLE_SHEET_ID")
        self.client = None
        self._questions_cache = None
        self._cache_time = 0
        self._cache_ttl = 300 # 5 minutes

    def _get_client(self):
        if not self.client and self.creds_json:
            try:
                creds_dict = json.loads(self.creds_json)
                creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, self.scope)
                self.client = gspread.authorize(creds)
            except Exception as e:
                print(f"Error authorizing Google Sheets: {e}")
        return self.client

    def get_questions(self):
        """Fetch questions from Google Sheets - works with public sheets (no auth needed)"""
        now = time.time()
        if self._questions_cache and (now - self._cache_time < self._cache_ttl):
            return self._questions_cache

        if not self.spreadsheet_id:
            print("GOOGLE_SHEET_ID not configured")
            return []

        try:
            # Fetch CSV export from Google Sheets (works with public sheets)
            url = f"https://docs.google.com/spreadsheets/d/{self.spreadsheet_id}/export?format=csv"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as response:
                content = response.read().decode("utf-8")
            
            reader = csv.reader(content.splitlines())
            rows = list(reader)
            
            # Skip instruction rows (rows 0-1 are header-like), find actual header row
            # Row 3 (0-indexed) has: Test_Code, Question_Code, Question_Text, etc.
            # Actually let's just skip rows until we find "Test_Code"
            data_rows = []
            header_found = False
            headers = []
            for row in rows:
                if not header_found:
                    # Look for the header row
                    if len(row) > 0 and row[0].strip() == "Test_Code":
                        headers = row
                        header_found = True
                    continue
                if len(row) > 3 and row[0].strip():
                    data_rows.append(row)
            
            questions = []
            for row in data_rows:
                if len(row) < 4:
                    continue
                test_code = row[0].strip()
                question_code = row[1].strip()
                question_text_korean = row[2].strip()
                question_text_mongolian = row[3].strip() if len(row) > 3 else question_text_korean
                dimension_code = row[4].strip() if len(row) > 4 else ""
                reverse_scored = row[5].strip() if len(row) > 5 else "0"
                weight = row[6].strip() if len(row) > 6 else "1"
                
                questions.append({
                    "id": f"{test_code.lower()}_{question_code.lower()}",
                    "assessment": test_code,
                    "category": dimension_code,
                    "text": question_text_mongolian,
                    "question_text_korean": question_text_korean,
                    "question_code": question_code,
                    "dimension_code": dimension_code,
                    "reverse_scored": reverse_scored == "1",
                    "weight": float(weight) if weight else 1.0
                })
            
            self._questions_cache = questions
            self._cache_time = now
            return questions
            
        except Exception as e:
            print(f"Error fetching questions from Google Sheets: {e}")
            return self._questions_cache or []

    def append_submission(self, submission):
        client = self._get_client()
        if not client or not self.spreadsheet_id:
            print("Google Sheets integration not configured")
            return
        
        try:
            spreadsheet = client.open_by_key(self.spreadsheet_id)
            answer_sheet_names = ["Хариултууд", "Answers", "Answer", "Хариу"]
            sheet = None
            for name in answer_sheet_names:
                try:
                    sheet = spreadsheet.worksheet(name)
                    break
                except gspread.exceptions.WorksheetNotFound:
                    continue
            if not sheet:
                # Create Answers sheet if it doesn't exist
                sheet = spreadsheet.add_worksheet(title="Хариултууд", rows="1000", cols="20")
                sheet.append_row([
                    "timestamp", "phone", "last_name", "first_name", "gender", 
                    "age", "school_class", "email", "career_interest", "answers_json"
                ])
            
            row = [
                time.strftime("%Y-%m-%d %H:%M:%S"),
                submission.phone,
                submission.last_name,
                submission.first_name,
                submission.gender,
                submission.age,
                submission.school_class,
                submission.email,
                submission.career_interest,
                json.dumps(submission.answers)
            ]
            sheet.append_row(row)
        except Exception as e:
            print(f"Error appending to Google Sheets: {e}")

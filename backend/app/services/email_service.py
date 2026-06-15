import resend
import os

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
        if self.api_key:
            resend.api_key = self.api_key

    def send_report_email(self, to_email, report_url):
        if not self.api_key:
            print("Email service not configured")
            return False
        
        try:
            params = {
                "from": "CareerMind AI <onboarding@resend.dev>",
                "to": [to_email],
                "subject": "Your CareerMind AI Assessment Report",
                "html": f"<p>Hello! Your career assessment report is ready.</p><p>You can view it here: <a href='{report_url}'>{report_url}</a></p>"
            }
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.core.config import settings


async def send_contact_email(name: str, email: str, subject: str, message: str) -> None:
    if not settings.smtp_user or not settings.smtp_password:
        # Email not configured — log to console in development
        print(f"[CONTACT] From: {name} <{email}>\nSubject: {subject}\n{message}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Portfolio Contact] {subject}"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.contact_recipient
    msg["Reply-To"] = email

    html_body = f"""
    <html><body style="font-family: sans-serif; color: #333;">
      <h2 style="color: #06b6d4;">New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">{name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">{email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">{subject}</td></tr>
      </table>
      <hr style="border: 1px solid #eee; margin: 16px 0;" />
      <p style="white-space: pre-wrap;">{message}</p>
    </body></html>
    """

    msg.attach(MIMEText(html_body, "html"))

    tls_context = ssl.create_default_context()
    await aiosmtplib.send(
        msg,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_user,
        password=settings.smtp_password,
        start_tls=True,
        tls_context=tls_context,
    )

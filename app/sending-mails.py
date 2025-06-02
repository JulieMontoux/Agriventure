import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# il faut automatiser le script avec cron // et remplacer le .pdf actuel par les pdf généré automatiquement via l'api
# également remplacer par nom de domaine agriventure
# a faire après déploiement

sender = "Agriventure <hello@demomailtrap.co>"
receiver = "Compte admin <laema9@gmail.com>"

subject = "AGRIVENTURE - Rappors de vente 05/05"
body = "Votre rapport de ventes du 05/05"

message = MIMEMultipart()
message["From"] = sender
message["To"] = receiver
message["Subject"] = subject

message.attach(MIMEText(body, "plain"))

filename = "sales_rapport_exemple.pdf"  

with open(filename, "rb") as attachment:
    part = MIMEBase("application", "octet-stream")
    part.set_payload(attachment.read())

encoders.encode_base64(part)

part.add_header("Content-Disposition", f"attachment; filename= {filename}")

message.attach(part)

with smtplib.SMTP("bulk.smtp.mailtrap.io", 587) as server:
    server.starttls()
    server.login("api", "35cbe3883e572281948415f2c841d2e5")
    server.sendmail(sender, receiver, message.as_string())

print('Sent')
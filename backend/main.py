from flask import Flask
from app_def import app

app.run(host="0.0.0.0", port=80, debug=True)

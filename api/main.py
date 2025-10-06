from flask import Flask
from dotenv import load_dotenv

import os
import logging

from routes.user_route import user_bp
from routes.device_route import device_bp

# Load environment variables
load_dotenv(dotenv_path=".api_env")

# Configure logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=log_level,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)
logger.info("Starting Flask API...")
app = Flask(__name__)
app.register_blueprint(user_bp, url_prefix='/users')
app.register_blueprint(device_bp, url_prefix='/devices')

if __name__ == '__main__':
    app.run(debug=True)

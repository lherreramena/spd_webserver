from fastapi import FastAPI
from dotenv import load_dotenv

import os
import logging

from app.routes import device_route
from app.routes import user_route
from app.routes import club_route
from app.routes import court_route

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
logger.info("Starting API...")

app = FastAPI()

app.include_router(user_route.router, prefix='/users', tags=["Users"])
app.include_router(device_route.router, prefix='/devices', tags=["Users"])
app.include_router(club_route.router, prefix='/club', tags=["Users"])
app.include_router(court_route.router, prefix='/court', tags=["Users"])

if __name__ == '__main__':
    app.run(debug=True)

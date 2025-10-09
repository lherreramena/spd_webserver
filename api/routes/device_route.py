from fastapi import APIRouter, Depends, Request, HTTPException
from services.device_service import *
from schemas.device_schema import serialize_device

import logging
logger = logging.getLogger(__name__)

router = Blueprint('device_bp', __name__)

@device_bp.route('/', methods=['GET'])
def list_devices():
    return jsonify([serialize_device(d) for d in get_all_devices()])

@device_bp.route('/<device_id>', methods=['GET'])
def get_device_by_id(device_id):
    device = get_device(device_id)
    return jsonify(serialize_device(device)) if device else ('Device not found', 404)

@device_bp.route('/', methods=['POST'])
def add_device():
    device = create_device(request.json)
    return jsonify(serialize_device(device)), 201

@device_bp.route('/<device_id>', methods=['PUT'])
def modify_device(device_id):
    device = update_device(device_id, request.json)
    return jsonify(serialize_device(device)) if device else ('Device not found', 404)

@device_bp.route('/<device_id>', methods=['DELETE'])
def remove_device(device_id):
    return ('Device deleted', 204) if delete_device(device_id) else ('Device not found', 404)

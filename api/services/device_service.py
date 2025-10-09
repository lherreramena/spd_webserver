from models.device import Device

import logging
logger = logging.getLogger(__name__)

devices = {}

def create_device(data):
    device_id = str(len(devices) + 1)
    device = Device(device_id, data.type, data.location)
    devices[device_id] = device
    return device

def get_device(device_id):
    return devices.get(device_id)

def get_all_devices():
    return list(devices.values())

def update_device(device_id, data):
    if device_id in devices:
        devices[device_id].type = data.type
        devices[device_id].location = data.location
        return devices[device_id]
    return None

def delete_device(device_id):
    return devices.pop(device_id, None)

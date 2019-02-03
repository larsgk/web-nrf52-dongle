// @ts-check

class _BLEService extends EventTarget {
    constructor() {
        super();
        
        this.ble_devices = new Map();
        this.textDecoder = new TextDecoder();
        this.textEncoder = new TextEncoder();
    }
    
    initialize() {
        // TBD
    }
    
    async startHeartbeatNotifications (server) {
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        const characteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef1');
        characteristic.addEventListener('characteristicvaluechanged', (evt) => {
            const value = evt.target.value.getInt16(0, true);
            this.notify('ble-heartbeat', {device: server.device.id, value: value});
        });
        return characteristic.startNotifications();
    }
    
    async startDataNotifications (server) {
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        const characteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef2');
        characteristic.addEventListener('characteristicvaluechanged', (evt) => {
            this.notify('ble-data', {device: server.device.id, value: this.textDecoder.decode(evt.target.value)})
        });
        return characteristic.startNotifications();
    }
    
    async fetchCmdCharacteristic (server) {
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        server.device.cmdCharacteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef3');
    }
    
    writeStrToBLEDevice (device, str) {
        console.log(`TX_BLE[${device.id}]:`, str);
        const data = this.textEncoder.encode(str);
        // Consider: Check length (max 20 bytes)
        device.cmdCharacteristic.writeValue(data);
    }
    
    writeBinaryToBLEDevice (device, data) {
        console.log(`TX_BLE[${device.id}]:`, data);
        device.cmdCharacteristic.writeValue(data);
    }
    
    async openBLEDevice (device) {
        const server = await device.gatt.connect();
        
        try {
            await this.startHeartbeatNotifications(server);
            await this.startDataNotifications(server);
            await this.fetchCmdCharacteristic(server);
            
            this.ble_devices.set(`${device.id}`, device);
            
            console.log(`connected BLE[${device.id}]`);
            
            device.ongattserverdisconnected = _ => { this.ble_devices.delete(`${device.id}`)};
        } catch (err) {
            console.warn(err);
        }
    }

    async scan () {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['12345678-1234-5678-1234-56789abcdef0'] }]
        });
    
        await this.openBLEDevice(device);    
    }

    broadcast(message) {
        for(let [key, device] of this.ble_devices) {
            this.writeStrToBLEDevice(device, message);
        }
    }

    broadcastBinary(data) {
        for(let [key, device] of this.ble_devices) {
            this.writeBinaryToBLEDevice(device, data);
        }
    }

    notify(type, data) {
        this.dispatchEvent(new CustomEvent(type, {detail: data}));
    }
    
}

export const BLEService = new _BLEService();

// @ts-check

class _USBService extends EventTarget {
    constructor() {
        super();
        
        this._DongleTempUSBID = {
            VID: 0x2fe3,
            PID: 0x0100
        }

        this.usb_devices = new Map();
        this.textDecoder = new TextDecoder();
        this.textEncoder = new TextEncoder();

        this.initialize();
    }
    
    async initialize() {
        // Auto-connect to all devices previously approved ('paired')
        const availableDevices = await navigator.usb.getDevices();
        availableDevices.forEach(device => {
            if(device.vendorId === this._DongleTempUSBID.VID && device.productId === this._DongleTempUSBID.PID) {
                this.openUSBDevice(device);                
            }
        });
    
        navigator.usb.addEventListener('connect', evt => this.openUSBDevice(evt.device));
    }

    readFromDevice (device) {
        device.transferIn(3, 64).then(result => {
            const msg = this.textDecoder.decode(result.data);
            if(msg.indexOf('Count =') !== -1) {
                this.notify('usb-heartbeat', {device: device.serialNumber, value: msg});
            } else {
                this.notify('usb-data', {device: device.serialNumber, value: msg});
            }
            this.readFromDevice(device);
        }, error => {
            // disconnect USB device
            this.usb_devices.delete(device.serialNumber);
            this.notify('usb-disconnected', {device: device.serialNumber})
        });
    };

    writeStrToUSBDevice (device, str) {
        console.log(`TX_USB[${device.serialNumber}]:`, str);
        const data = this.textEncoder.encode(str);
        device.transferOut(2, data);
    };

    writeRGBToBLEDevice (device, r, g, b) {
        const data = new Uint8Array([0x01, 
            Math.floor(r)&0xff,
            Math.floor(g)&0xff,
            Math.floor(b)&0xff]);
        console.log(`TX_BLE[${device.id}]:`, data);
        device.transferOut(2, data);
    }

    async openUSBDevice (device) {
        await device.open();
        await device.selectConfiguration(1);
        await device.claimInterface(0);

        this.usb_devices.set(device.serialNumber, device);

        this.notify('usb-connected', {device: device.serialNumber})

        
        this.readFromDevice(device); 
    };

    async scan () {
        const device = await navigator.usb.requestDevice({ filters: [{vendorId: this._DongleTempUSBID.VID, productId: this._DongleTempUSBID.PID}]});
    
        await this.openUSBDevice(device);    
    }

    broadcast(message) {
        for(let [key, device] of this.usb_devices) {
            this.writeStrToUSBDevice(device, message);
        }
    }

    notify(type, data) {
        this.dispatchEvent(new CustomEvent(type, {detail: data}));
    }
    
}

export const USBService = new _USBService();

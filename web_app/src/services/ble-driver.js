// @ts-check

import { BaseControl } from "./base-control.js";
import { MIDI_MSG_TYPE } from "./defs.js";

export class Thingy52Control extends BaseControl {
  constructor() {
    super("Thingy52Control");
    window.setTimeout(() => {
      this.initialize();
    }, 0);

    this._onAccelChange = this._onAccelChange.bind(this);
    this._onButtonChange = this._onButtonChange.bind(this);

    this._devices = new Map();
  }

  initialize() {
    // todo ..
  }

  async scan() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["ef680100-9b35-4933-9b10-52ffa9740042"] }],
        optionalServices: [
          "ef680200-9b35-4933-9b10-52ffa9740042",
          "ef680300-9b35-4933-9b10-52ffa9740042",
          "ef680400-9b35-4933-9b10-52ffa9740042",
          "ef680500-9b35-4933-9b10-52ffa9740042"
        ]
      });

      this._attachDevice(device);
    } catch (err) {
      console.log(err); // No device was selected.
    }
  }

  // When the GATT server is disconnected, remove the device from the list
  _deviceDisconnected(device) {
    console.log("Disconnected", device);

    if (this._devices.has(device.id)) {
      this._devices.delete(device.id);
      this.emitDisconnected(device.id);
      this.emitMessage(device.id, "");
    }
  }

  async _attachDevice(device) {
    if (this._devices.has(device.id)) {
      console.log("Device already connected: ", device.id);
      return;
    }

    const server = await device.gatt.connect();

    await this._startAccelerometerNotifications(server);
    await this._startButtonClickNotifications(server);

    // Maybe we need some light to indicate accelerometer
    // const led = await this._getLedCharacteristic(server);

    this._devices.set(device.id, device);

    device.ongattserverdisconnected = _ => this._deviceDisconnected(device);

    this.emitConnected(device.id);
  }

  _onAccelChange(event) {
    const target = event.target;
    const deviceId = target.service.device.id;

    const accel = {
      x: +target.value.getFloat32(0, true).toPrecision(5),
      y: +target.value.getFloat32(4, true).toPrecision(5),
      z: +target.value.getFloat32(8, true).toPrecision(5)
    };

    // calc note (& velocity) value
    // quick'n'dirty test
    const note = Math.round(60 + accel.y);
    const velocity = Math.min(
      Math.max(0, Math.round(0x3f - 8 * accel.x)),
      this.MAX_VELOCITY
    );

    if (this._note != note || this._velocity != velocity) {
      this._note = note;
      this._velocity = velocity;
      this.emitMessage(deviceId, `Note #${this._note} @ vel ${this._velocity}`);
    }
  }

  _onButtonChange(event) {
    const target = event.target;
    const deviceId = target.service.device.id;

    const buttonPressed = target.value.getUint8(0) === 1;

    console.log(buttonPressed ? "NOTE_ON" : "NOTE_OFF");
    if (buttonPressed) {
      if (this._note) {
        this.emitControlEvent(deviceId, {
          type: MIDI_MSG_TYPE.NOTE_ON,
          channel: 0,
          note: this._note,
          velocity: this._velocity
        });
        this._lastNote = this._note;
      }
    } else {
      if (this._lastNote) {
        this.emitControlEvent(deviceId, {
          type: MIDI_MSG_TYPE.NOTE_OFF,
          channel: 0,
          note: this._lastNote,
          velocity: this.MAX_VELOCITY
        });
      }
    }
  }

  async _startAccelerometerNotifications(server) {
    const service = await server.getPrimaryService(
      "ef680400-9b35-4933-9b10-52ffa9740042"
    );
    const characteristic = await service.getCharacteristic(
      "ef68040a-9b35-4933-9b10-52ffa9740042"
    );
    characteristic.addEventListener(
      "characteristicvaluechanged",
      this._onAccelChange
    );
    return characteristic.startNotifications();
  }

  async _startButtonClickNotifications(server) {
    const service = await server.getPrimaryService(
      "ef680300-9b35-4933-9b10-52ffa9740042"
    );
    const characteristic = await service.getCharacteristic(
      "ef680302-9b35-4933-9b10-52ffa9740042"
    );
    characteristic.addEventListener(
      "characteristicvaluechanged",
      this._onButtonChange
    );
    return characteristic.startNotifications();
  }

  _detachDevice(device) {
    device.gatt.disconnect();
    // results in _deviceDisconnected call.
  }
}

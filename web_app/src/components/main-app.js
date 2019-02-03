import { LitElement, html, css } from "lit-element";

import { BLEService } from '../services/ble-service';
import { USBService } from '../services/usb-service';

import "./nrf52-dongle";
import "./message-list";

export class MainApp extends LitElement {
  static get styles() { 
    return [
      css`
        .flex-container {
          display: flex;
          height: 100%;
        }
        .content {
          margin: auto;
          position: relative;
          width: 95%;
          max-width: 800px;
        }
        .col {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
          flex-direction: row;
        }

        button {
          flex-grow: 1;
          font-size: 1.2rem;
          margin: 0.2em;
        }

        input {
          flex-grow: 1;
          font-size: 1.2rem;
          height: 2rem;
          margin: 0.2em;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="flex-container">
        <div class="content">
          <div class="col">
            <h1>WebUSB, WebBluetooth & Zephyr with nRF52840</h1>
            <div class="row">
              <button @click=${this.scanBLE}>SCAN (BLE)</button>
              <button @click=${this.scanUSB}>SCAN (USB)</button>
            </div>
            <div class="row">
              <input id="message">
            </div>
            <div class="row">
              <button @click=${this.sendBLE}>TEXT -> BLE</button>
              <button @click=${this.sendUSB}>TEXT -> USB</button>
            </div>
            <div class="row">
              <input id="color" type="color">
            </div>
            <div class="row">
              <button @click=${this.sendRGBBLE}>COLOR -> BLE</button>
              <button @click=${this.sendRGBUSB}>COLOR -> USB</button>
            </div>
            <nrf52-dongle></nrf52-dongle>
            <message-list></message-list>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    BLEService.addEventListener('ble-connected', evt => { console.log('connected BLE', evt) });
    BLEService.addEventListener('ble-disconnected', evt => { console.log('disconnected BLE', evt) });

    USBService.addEventListener('usb-connected', evt => { console.log('connected USB', evt) });
    USBService.addEventListener('usb-disconnected', evt => { console.log('disconnected USB', evt) });

    this.messageInput = this.shadowRoot.querySelector('#message');
    this.colorInput = this.shadowRoot.querySelector('#color');
  }

  scanBLE() {
    BLEService.scan();
  }

  scanUSB() {
    USBService.scan();
  }

  sendBLE() {
    BLEService.broadcast(this.messageInput.value);
  }

  sendUSB() {
    USBService.broadcast(this.messageInput.value);
  }

  hexToRGB(hexval) {
    return hexval.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
  }

  sendRGBBLE() {
    BLEService.broadcastBinary(new Uint8Array([1, ...this.hexToRGB(this.colorInput.value)]));
  }

  sendRGBUSB() {
    USBService.broadcastBinary(new Uint8Array([1, ...this.hexToRGB(this.colorInput.value)]));
  }
}
customElements.define("main-app", MainApp);

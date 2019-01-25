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
              <button @click=${this.sendBLE}>SEND ALL (BLE)</button>
              <button @click=${this.sendUSB}>SEND ALL (USB)</button>
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
}
customElements.define("main-app", MainApp);

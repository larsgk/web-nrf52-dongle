import { LitElement, html, css } from "lit-element";

import { BLEService } from '../services/ble-service';
import { USBService } from '../services/usb-service';

export class MessageList extends LitElement {
    static get styles() {
        return [
            css`
            .list {
                width: 100%;
                height: 50%;
                border: 1px solid black;
                overflow-y: scroll;
            }
            
            `
        ];
    }

    static get properties() {
        return { 
          messages: { type: Array }
        };
      }
    
    constructor() {
        super();

        this.messages = [];
        
        BLEService.addEventListener('ble-connected', evt => {
            evt.detail.type = 'USB';
            evt.detail.value = 'CONNECTED';
            this.messages.push(evt.detail);
            this.requestUpdate();
        });
        USBService.addEventListener('ble-disconnected', evt => {
            evt.detail.type = 'BLE';
            evt.detail.value = 'DISCONNECTED';
            this.messages.push(evt.detail);
            this.requestUpdate();
        });
        BLEService.addEventListener('ble-data', evt => {
            evt.detail.type = 'BLE';
            this.messages.push(evt.detail);
            this.requestUpdate();
        });

        USBService.addEventListener('usb-connected', evt => {
            evt.detail.type = 'USB';
            evt.detail.value = 'CONNECTED';
            this.messages.push(evt.detail);
            this.requestUpdate();
        });
        USBService.addEventListener('usb-disconnected', evt => {
            evt.detail.type = 'USB';
            evt.detail.value = 'DISCONNECTED';
            this.messages.push(evt.detail);
            this.requestUpdate();
        });
        USBService.addEventListener('usb-data', evt => {
            evt.detail.type = 'USB';
            this.messages.push(evt.detail);
            this.requestUpdate();
        });
        
    }
    
    render() {
        return html`
        <div class="list">
            ${this.messages.map((item, index) =>
        html`<span>[${item.type}/${item.device}]:${item.value}&nbsp;</span><br>`)}
        </div>
        `;
    }
}
customElements.define("message-list", MessageList);

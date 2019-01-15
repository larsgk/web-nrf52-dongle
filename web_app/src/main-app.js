import { LitElement, html } from '@polymer/lit-element'; 

import { MicrobitBoard } from './microbit-board';

export class MainApp extends LitElement {
    static get properties() {
        return { };
    }
    
    constructor() {
        super(); 
    }
    
    render() {
        return html`
        <style>
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
        </style>
        <div class="flex-container">
            <div class="content">
                <div class="col">
                    <p>WebBluetooth & Zephyr GATT Display Demo</p>
                    <microbit-board></microbit-board>
                </div>
            </div>
        </div>
        `;
    }
}
customElements.define('main-app', MainApp);
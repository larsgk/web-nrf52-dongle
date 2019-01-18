import { LitElement, html } from '@polymer/lit-element'; 

export class NRF52Dongle extends LitElement {
    static get properties() {
        return { };
    }
    
    constructor() {
        super(); 
    }
    
    render() {
        return html`
            <style>
                .dongle {
                    background-color: rgb(0,10,0);
                    color: white;
                    width: 100%;
                    padding-bottom: 66.66%;
                    border-radius: 10%/15%;
                }
            </style>
            <div class="dongle"></div>
        `;
    }
}
customElements.define('nrf52-dongle', NRF52Dongle);
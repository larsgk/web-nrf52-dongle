import { LitElement, html, css } from "lit-element";

export class nRF52Dongle extends LitElement {
  static get styles() {
    return [
      css`
        .dongle {
          background-color: rgb(0, 10, 0);
          color: white;
          width: 100%;
          padding-bottom: 66.66%;
          border-radius: 10% / 15%;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="dongle"></div>
    `;
  }
}
customElements.define("nrf52-dongle", nRF52Dongle);

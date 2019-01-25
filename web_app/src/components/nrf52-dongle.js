import { LitElement, html, css } from "lit-element";

export class nRF52Dongle extends LitElement {
  static get styles() {
    return [
      css`
        .dongle {
          width: auto;
        }

        img {
          width: 100%;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="dongle"><img src="../images/real_dongle.png"></div>
    `;
  }
}
customElements.define("nrf52-dongle", nRF52Dongle);

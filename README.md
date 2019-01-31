# Workshop on Web Bluetooth, Web USB, LitElement and Zephyr

## Making a future proof IoT project by leveraging great technologies

IoT can be really hard, there are plenty of hardware options out there, with a multitude of OSes to choose from - and that is not even thinking about how to get data to and from the device!

In this workshop, we have decided to use the Nordic Semiconductor nRF52840 Dongle (PCA10059), which supports both Bluetooth and USB. Nordic is a market leader in Bluetooth products and even have new products that work with cellular (eg. LTE) as well. The Nordic hardware is relatively cheap (different price points), super stable and has really good support. 

The nRF52840 Dongle (PCA10059) connects directly to a USB port for DFU flashing and operation. It contains the flagship nRF52 chip and allows development of fairly advanced projects.

As the OS, we will use the RTOS Zephyr, a new OS that aims at becoming the Linux for IoT. Zephyr is not the default OS on nRF52840, but it is supported and will be the OS of choice for all future Nordic products. Zephyr works across a wide range of devices from different manufacturers. 

A IoT product is unfortunately not worth much without a companion application, so we will be building one too - using modern web technology such as Web Bluetooth and we will be creating the user interface using mostly vanilla HTML, CSS, JavaScript, with a bit of help from the awesome LitElement project.


## Firmware
* Based on Zephyr
* Built for the Nordic nRF52840 Dongle (PCA10059)
* Uses BLE GATT and WebUSB for communication
* TODO: Button press sends notification, BLE CMD sets the LED
* Pass through messages between BLE/GATT and USB
* If first byte in message (either way) is a 0x01, the next 3 bytes will set RGB LED ([0x01, r, g, b]) in stead

## Web Demo
* Based on LitElement
* Uses Web Bluetooth and Web USB to communicate with an attached dongle

## Prerequisites
Note: Prebuilt firmware is available if you just want to focus on the web part.

### LitElement
https://lit-element.polymer-project.org/ (note: the 2.0.0-rc is used atm, will swap to 2.0.0 once released)

### Zephyr
https://docs.zephyrproject.org/latest/getting_started/getting_started.html

### nrfutil
Follow these instructions to install nrfutil: https://github.com/NordicSemiconductor/pc-nrfutil

## Build and Flash
Follow instructions here: https://docs.zephyrproject.org/latest/boards/arm/nrf52840_pca10059/doc/nrf52840_pca10059.html



# web_gatt_zephyr
Web Bluetooth, Web USB, LitElement and Zephyr

## Workshop
LitElement meets Zephyr!

Learn about Web Bluetooth, Web USB and how to build Zephyr firmware for devices connecting to the web!
In this workshop, we will use the Nordic Semiconductor nRF52840 Dongle (PCA10059) that connects
directly to a USB port for DFU flashing and operation. It contains the flagship nRF52 chip fron Nordic
and allows development of fairly advanced projects.  We will mainly focus on GATT, Web Bluetooth and how 
to get both working using Zephyr for the firmware and LitElement for the connecting web app - but also be
ready to assist in other exotic combinations you might come up with!


## Firmware
* Based on Zephyr
* Built for the Nordic nRF52840 Dongle (PCA10059)
* Uses BLE GATT and WebUSB for communication
* Button press sends notification, BLE CMD sets the LED
* Pass through messages between BLE/GATT and USB

## Web Demo
* Based on LitElement
* Uses Web Bluetooth and Web USB to communicate with an attached dongle

## Prerequisites
Note: Prebuilt firmware is available if you just want to focus on the web part.

### LitElement
// install tools (ref docs...)

### Zephyr
// install tools (ref docs...)

### nrfutil
Follow these instructions to install nrfutil: https://github.com/NordicSemiconductor/pc-nrfutil

## Build and Flash
Follow instructions here: https://docs.zephyrproject.org/latest/boards/arm/nrf52840_pca10059/doc/nrf52840_pca10059.html



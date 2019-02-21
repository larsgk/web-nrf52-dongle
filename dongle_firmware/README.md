# nRF52840 Dongle firmware for the workshop

Note: before building the firmware, make sure you have installed the latest Zephyr SDK and cloned the zephyr repo.

Instructions here: https://docs.zephyrproject.org/latest/getting_started/getting_started.html

Then:

Open a terminal, go to the cloned zephyr folder and run ```source zephyr-env.sh``` to setup env.

Go to the cloned ```web-nrf52-dongle/dongle_firmware``` folder.

## Make the build dir and configure
```
mkdir build
cd build
cmake -GNinja -DBOARD=nrf52840_pca10059 ..
```

## Build
```
ninja
```

## Flash
```
nrfutil pkg generate --hw-version 52 --sd-req=0x00 --application zephyr/zephyr.hex --application-version 1 pkg.zip

nrfutil dfu serial -pkg pkg.zip -p /dev/ttyACM0
```

# Unique identifiers

## BLE
The first part of the MAC address should be printed on the sticker on the dongle.

## USB
The serial number is derived from 2 internal factory set 64bit integers. Allows for multiple devices connecting at the same time.

# TODO

* unify WebUSB and GATT 'cmd protocols' (set color, send text)
* put guards/limits on length of messages
* maybe introduce multi-notify on both USB and gatt side (workqueue)
* add ability to rename BLE device name - maybe only at runtime (no persist)?
* possibly send unique USB serial, etc on e.g. READ GATT characteristic?
* More descriptors on GATT services/characteristics


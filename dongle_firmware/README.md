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
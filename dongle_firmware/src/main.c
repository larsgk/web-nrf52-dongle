#include <zephyr.h>
#include <misc/printk.h>
#include <gpio.h>
#include <device.h>
#include <stdio.h>

#include <bluetooth/bluetooth.h>
#include <bluetooth/hci.h>
#include <bluetooth/conn.h>
#include <bluetooth/uuid.h>
#include <bluetooth/gatt.h>

#include "gatt_service.h"

#include "webusb_main.h"
#include "webusb_serial.h"

#include "rgb_led.h"

// BT GATT related
static const struct bt_data ad[] = {
	BT_DATA_BYTES(BT_DATA_FLAGS, (BT_LE_AD_GENERAL | BT_LE_AD_NO_BREDR)),
	// BT_DATA_BYTES(BT_DATA_UUID16_ALL,
	// 	      0x0d, 0x18, 0x0f, 0x18, 0x05, 0x18),
	BT_DATA_BYTES(BT_DATA_UUID128_ALL,
		      0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
		      0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12),
};

static void connected(struct bt_conn *conn, u8_t err)
{
	if (err) {
		printk("Connection failed (err %u)\n", err);
		rgb_led_set(0x7f,0,0);
	} else {
		printk("Connected\n");
		rgb_led_set(0,0x7f,0);
	}
}

static void disconnected(struct bt_conn *conn, u8_t reason)
{
	printk("Disconnected (reason %u)\n", reason);
	rgb_led_set(0,0,0x7f);
}

static struct bt_conn_cb conn_callbacks = {
	.connected = connected,
	.disconnected = disconnected,
};

static void bt_ready(int err)
{
	if (err) {
		printk("Bluetooth init failed (err %d)\n", err);
		return;
	}

	printk("Bluetooth initialized\n");

	gatt_service_init();

	err = bt_le_adv_start(BT_LE_ADV_CONN_NAME, ad, ARRAY_SIZE(ad), NULL, 0);
	if (err) {
		printk("Advertising failed to start (err %d)\n", err);
		return;
	}

	printk("Advertising successfully started\n");
}

void main(void)
{
	int err;

	rgb_led_init();

	rgb_led_set(0xff,0,0); // Red to indicate 'starting up'

	if(init_webusb() < 0) {
		rgb_led_set(0xff,0xff,0);
		return;
	}

	err = bt_enable(bt_ready);
	if (err) {
		printk("Bluetooth init failed (err %d)\n", err);
		return;
	}

	bt_conn_cb_register(&conn_callbacks);

	rgb_led_set(0,0,0x7f); // Blue to indicate 'ready'

	u32_t count = 0;

	char buf[100];
	int len;

	while(1) {
		// Every second...
		k_sleep(1000);
		
		// ...send 'heartbeat' count over WebUSB
		len = sprintf(buf, "Count = %d", count);
		send_webusb_data(buf, len);

		// ...and BLE GATT
		gatt_service_heartbeat_notify(count++);
	}
}

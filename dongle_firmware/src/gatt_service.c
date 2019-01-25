#include <zephyr/types.h>
#include <stddef.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <misc/printk.h>
#include <misc/byteorder.h>
#include <zephyr.h>

#include <bluetooth/bluetooth.h>
#include <bluetooth/hci.h>
#include <bluetooth/conn.h>
#include <bluetooth/uuid.h>
#include <bluetooth/gatt.h>

#include "gatt_service.h"
#include "rgb_led.h"


static struct bt_gatt_ccc_cfg  heartbeat_ccc_cfg[BT_GATT_CCC_MAX] = {};
static u8_t notify_heartbeat;

static struct bt_gatt_ccc_cfg  data_ccc_cfg[BT_GATT_CCC_MAX] = {};
static u8_t notify_data;

// TODO: Proper GATT UUID

static struct bt_uuid_128 service_uuid = BT_UUID_INIT_128(
	0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);

static struct bt_uuid_128 heartbeat_char_uuid = BT_UUID_INIT_128(
	0xf1, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);

static struct bt_uuid_128 data_char_uuid = BT_UUID_INIT_128(
	0xf2, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);

static struct bt_uuid_128 cmd_char_uuid = BT_UUID_INIT_128(
	0xf3, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);


static void heartbeat_ccc_cfg_changed(const struct bt_gatt_attr *attr,
				 u16_t value)
{
	notify_heartbeat = (value == BT_GATT_CCC_NOTIFY) ? 1 : 0;
}

static void data_ccc_cfg_changed(const struct bt_gatt_attr *attr,
				 u16_t value)
{
	notify_data = (value == BT_GATT_CCC_NOTIFY) ? 1 : 0;
}

static ssize_t write_cmd(struct bt_conn *conn,
				const struct bt_gatt_attr *attr,
				const void *buf, u16_t len, u16_t offset,
				u8_t flags)
{
	//u8_t *value = attr->user_data;

	// if (offset + len > sizeof(ctrl_point)) {
	// 	return BT_GATT_ERR(BT_ATT_ERR_INVALID_OFFSET);
	// }

//	memcpy(value + offset, buf, len);
    
	u8_t *values = (u8_t*)buf;

	// TODO: check length
	printk("Cmd sent: 0x%02X\n", values[0]);

	if(values[0] == 0x01 && len == 4) {
		rgb_led_set(values[1], values[2], values[3]);
	} else if(values[0] == 0x02) {
		// TODO: grab text and pass on to usb?
	} else {
		// assume plain text - send to USB?
		send_webusb_data(values, len);
	}

	return len;
}

static struct bt_gatt_attr attrs[] = {
	BT_GATT_PRIMARY_SERVICE(&service_uuid),

	BT_GATT_CHARACTERISTIC(&heartbeat_char_uuid.uuid,
			       BT_GATT_CHRC_NOTIFY,
			       BT_GATT_PERM_NONE, NULL, NULL, NULL),
	BT_GATT_CCC(heartbeat_ccc_cfg, heartbeat_ccc_cfg_changed),

	BT_GATT_CHARACTERISTIC(&data_char_uuid.uuid,
			       BT_GATT_CHRC_NOTIFY,
			       BT_GATT_PERM_NONE, NULL, NULL, NULL),
	BT_GATT_CCC(data_ccc_cfg, data_ccc_cfg_changed),

	BT_GATT_CHARACTERISTIC(&cmd_char_uuid.uuid,
			       BT_GATT_CHRC_WRITE,
			       BT_GATT_PERM_WRITE, NULL, write_cmd, NULL),
};

static struct bt_gatt_service gatt_svc = BT_GATT_SERVICE(attrs);

s8_t initDone = 0;

void gatt_service_init(void)
{
	bt_gatt_service_register(&gatt_svc);

	initDone = 1;
}

void gatt_service_heartbeat_notify(u32_t count)
{
	if (!initDone)
		return;

	if (!notify_heartbeat) {
		return;
	}
	bt_gatt_notify(NULL, &attrs[1], &count, 2);
}

void gatt_service_data_notify(const void *buf, u16_t len)
{
	if (!initDone)
		return;

	if (!notify_data) {
		return;
	}
	bt_gatt_notify(NULL, &attrs[4], buf, len);
}

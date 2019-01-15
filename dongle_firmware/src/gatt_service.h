#ifdef __cplusplus
extern "C" {
#endif

void gatt_service_init(void);
void gatt_service_heartbeat_notify(u32_t count);
void gatt_service_data_notify(const void *buf, u16_t len);

#ifdef __cplusplus
}
#endif

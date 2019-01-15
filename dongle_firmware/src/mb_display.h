#ifdef __cplusplus
extern "C" {
#endif

void mb_show_smiley(bool happy);
void mb_show_msg(const char* msg);
void mb_show_bits(const u8_t* buf, u16_t len);
void mb_show_status_animation(bool connected);

#ifdef __cplusplus
}
#endif

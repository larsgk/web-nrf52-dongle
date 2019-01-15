#include <zephyr.h>
#include <misc/printk.h>
#include <gpio.h>
#include <device.h>
#include <string.h>

#include <display/mb_display.h>

static struct mb_image smiley = MB_IMAGE({ 0, 1, 0, 1, 0 },
					 { 0, 1, 0, 1, 0 },
					 { 0, 0, 0, 0, 0 },
					 { 1, 0, 0, 0, 1 },
					 { 0, 1, 1, 1, 0 });

static struct mb_image smiley2 =
            MB_IMAGE({ 0, 1, 0, 1, 0 },
					 { 0, 1, 0, 1, 0 },
					 { 0, 0, 0, 0, 0 },
					 { 0, 1, 1, 1, 0 },
					 { 1, 0, 0, 0, 1 });

static const struct mb_image animation[] = {
	MB_IMAGE({ 0, 0, 0, 0, 0 },
		 { 0, 0, 0, 0, 0 },
		 { 0, 0, 1, 0, 0 },
		 { 0, 0, 0, 0, 0 },
		 { 0, 0, 0, 0, 0 }),
	MB_IMAGE({ 0, 0, 0, 0, 0 },
		 { 0, 1, 1, 1, 0 },
		 { 0, 1, 1, 1, 0 },
		 { 0, 1, 1, 1, 0 },
		 { 0, 0, 0, 0, 0 }),
	MB_IMAGE({ 1, 1, 1, 1, 1 },
		 { 1, 1, 1, 1, 1 },
		 { 1, 1, 0, 1, 1 },
		 { 1, 1, 1, 1, 1 },
		 { 1, 1, 1, 1, 1 }),
	MB_IMAGE({ 1, 1, 1, 1, 1 },
		 { 1, 0, 0, 0, 1 },
		 { 1, 0, 0, 0, 1 },
		 { 1, 0, 0, 0, 1 },
		 { 1, 1, 1, 1, 1 }),
};

// TODO: Connect and disconnect animations
// TODO: Direct pixel manipulation from bit masks (inspiration from text display logic)

void mb_show_smiley(bool happy)
{
	struct mb_display *disp = mb_display_get();
	/* Show a smiley-face */
	mb_display_image(disp, MB_DISPLAY_MODE_SINGLE, K_SECONDS(2),
        happy ? &smiley : &smiley2, 1);
	k_sleep(K_SECONDS(2));
}


// tbd
void mb_show_msg(const char* msg)
{
	struct mb_display *disp = mb_display_get();

	mb_display_print(disp, MB_DISPLAY_MODE_DEFAULT, K_MSEC(500), "%s", msg);
	k_sleep(K_MSEC(500) * (strlen(msg)+1));
}

void mb_show_bits(const u8_t* buf, u16_t len)
{
	struct mb_display *disp = mb_display_get();

	struct mb_image pixel = {};
	for (int y = 0; y < 5 && y < len; y++) {
			pixel.row[y] = buf[y] & 0x1f; // only use first 5 bits
	}
	mb_display_image(disp, MB_DISPLAY_MODE_SINGLE, K_FOREVER, &pixel, 1);
}

void mb_show_status_animation(bool connected)
{
	struct mb_display *disp = mb_display_get();
	/* Show a sequential animation */
	mb_display_image(disp, MB_DISPLAY_MODE_DEFAULT,
			 K_MSEC(150), animation, ARRAY_SIZE(animation));
	k_sleep(K_MSEC(150) * ARRAY_SIZE(animation));
}
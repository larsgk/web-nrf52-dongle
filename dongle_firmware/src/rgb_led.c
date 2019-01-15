#include <zephyr.h>
#include <misc/printk.h>
#include <device.h>
#include <pwm.h>

#define PERIOD (USEC_PER_SEC / 100)

struct device *pwm_dev;

void rgb_led_init()
{
    pwm_dev = device_get_binding(PWM_0_LABEL);

	if (!pwm_dev) {
		printk("Cannot find PWM device!\n");
		return;
	}
}

void rgb_led_set(u32_t r, u32_t g, u32_t b)
{
    if( pwm_pin_set_usec(pwm_dev, PWM_0_CH0_PIN, PERIOD, ((255 - (r & 0xff)) * PERIOD) >> 8) != 0 ||
        pwm_pin_set_usec(pwm_dev, PWM_0_CH1_PIN, PERIOD, ((255 - (g & 0xff)) * PERIOD) >> 8) != 0 ||
        pwm_pin_set_usec(pwm_dev, PWM_0_CH2_PIN, PERIOD, ((255 - (b & 0xff)) * PERIOD) >> 8) != 0) {
        printk("PWM pin write fails!\n");
		return;
    }
}
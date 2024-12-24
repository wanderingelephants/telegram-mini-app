<!-- TelegramLogin.vue -->
<template>
  <div ref="telegramLoginBtn"></div>
</template>

<script>
export default {
  name: 'TelegramLogin',
  props: {
    botName: {
      type: String,
      required: true
    }
  },
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    console.log('TG', import.meta.env)
    console.log('data-telegram-login', this.botName)
    if (import.meta.env.MODE === 'production')
    script.setAttribute('data-telegram-login', 'DipSipBot')
    else script.setAttribute('data-telegram-login', 'Dev_DipSip_bot') 
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    this.$refs.telegramLoginBtn.appendChild(script)

    window.onTelegramAuth = (user) => {
      this.$emit('telegram-auth', user)
    }
  }
}
</script>
<template>
  <button ref="customButton" class="kite-button v-btn v-btn--elevated v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-elevated">
    <img src="@/assets/kite-logo.svg" alt="Kite Logo" class="kite-logo" />
    <span class="button-text">PLACE ON ZERODHA</span>
  </button>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'KiteConnectButton',
  props: {
    apiKey: {
      type: String,
      required: true
    },
    basket: {
      type: Array,
      required: true
    }
    /*exchange: {
      type: String,
      required: true
    },
    instrument: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }*/
  },
  setup(props) {
    const customButton = ref(null)

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    onMounted(async () => {
      try {
        // Load jQuery
        await loadScript('https://code.jquery.com/jquery-3.6.0.min.js')
        
        // Load KiteConnect
        await loadScript('/kite.publisher.js')

        KiteConnect.ready(() => {
          const kite = new KiteConnect(props.apiKey)
          console.log("KiteConnect ready")
          console.log("basket", props.basket)
          for (const b of props.basket){
            kite.add({
              exchange: b.exchange,
              tradingsymbol: b.instrument,
              quantity: b.quantity*1,
              transaction_type: "BUY",
              order_type: "LIMIT",
              price: b.price*1,
              product: "CNC"
            })
          }
          

          // Use .on('click') instead of .click()
          window.jQuery(customButton.value).on('click', function(e) {
            console.log('Click handler executed')
            e.preventDefault()
            kite.connect()
            return false
          })
        })
      } catch (error) {
        console.error('Failed to initialize:', error)
      }
    })

    return {
      customButton
    }
  }
}
</script>
<style scoped>
.kite-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.kite-button:hover {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
}

.kite-button:active {
  background-color: #e8e8e8;
}

.kite-logo {
  width: 20px;  /* Adjust size as needed */
  height: 20px; /* Adjust size as needed */
}

.button-text {
  font-size: 14px;
  font-weight: 500;
  color: #444;
}
</style>

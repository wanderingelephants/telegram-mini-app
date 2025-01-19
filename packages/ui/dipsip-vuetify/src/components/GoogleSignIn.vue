<template>
<div v-show="loggedInGoogle !== true">
  <v-btn @click="signInWithGoogle" color="primary">
    Sign in with Google
  </v-btn>
  <v-card-subtitle>Better Analytics with Sign-in</v-card-subtitle>
</div>
</template>

<script>
import { mapState } from "vuex";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeFirebase } from '@/plugins/firebase';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const isInitialized = ref(false);
    const authInstance = ref(null);

    onMounted(async () => {
      try {
        const { auth } = await initializeFirebase();
        authInstance.value = auth;
        isInitialized.value = true;
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    });

    return {
      isInitialized,
      authInstance
    };
  },
  computed: {
    ...mapState([
      "loggedInGoogle",
      "userGoogle",
    ])
  },
  methods: {
    async signInWithGoogle() {
      if (!this.isInitialized || !this.authInstance) {
        console.error('Firebase not yet initialized');
        return;
      }

      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.authInstance, provider);
        const idToken = await result.user.getIdToken();
        
        // Send token to your backend
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          localStorage.setItem("jwtGoogle", idToken);
          this.$store.commit("setloggedInGoogle", true);
          this.$store.commit("setUserGoogle", result.user);
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
      }
    }
  }
}
</script>
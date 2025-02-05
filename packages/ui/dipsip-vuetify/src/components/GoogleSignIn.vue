<template>
  <v-btn @click="signInWithGoogle" color="primary" v-if="!loggedInGoogle">
    Sign in with Google
  </v-btn>
</template>

<script>
import { mapState } from "vuex";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeFirebase } from "@/plugins/firebase";

export default {
  data() {
    return {
      isInitialized: false,
      authInstance: null,
      unsubscribeAuth: null,
      showDialog: false,
    };
  },
  created() {
    this.showDialog = !this.loggedInGoogle;
  },
  watch: {
    loggedInGoogle(newVal) {
      if (newVal) {
        this.showDialog = false;
      }
    },
  },
  computed: {
    ...mapState(["loggedInGoogle", "userGoogle"]),
  },

  async mounted() {
    try {
      const { auth } = await initializeFirebase();
      this.authInstance = auth;
      this.isInitialized = true;

      // Set up auth state listener
      this.unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          const idToken = await user.getIdToken();
          localStorage.setItem("jwtGoogle", idToken);
          this.$store.commit("setloggedInGoogle", true);
          this.$store.commit("setUserGoogle", user);
        } else {
          // User is signed out
          localStorage.removeItem("jwtGoogle");
          this.$store.commit("setloggedInGoogle", false);
          this.$store.commit("setUserGoogle", null);
        }
      });

      // Check for existing token and validate it
      const existingToken = localStorage.getItem("jwtGoogle");
      if (existingToken) {
        try {
          // Verify token with your backend
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: existingToken }),
          });
          const json = await response.json();
          if (!response.ok) {
            // Token invalid - clear storage
            localStorage.removeItem("jwtGoogle");
            this.$store.commit("setloggedInGoogle", false);
          } else {
            this.$store.commit("setloggedInGoogle", true);
            this.$store.commit("setUserGoogle", json.userGoogle);
          }
        } catch (error) {
          console.error("Token verification error:", error);
        }
      }
      if (this.authInstance?.currentUser) {
        // Refresh token every 45 minutes
        setInterval(async () => {
          const token = await this.authInstance.currentUser.getIdToken(true);
          localStorage.setItem("jwtGoogle", token);
        }, 45 * 60 * 1000);
      }
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  },

  beforeDestroy() {
    // Clean up auth listener
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false;
    },
    async signInWithGoogle() {
      if (!this.isInitialized || !this.authInstance) {
        console.error("Firebase not yet initialized");
        return;
      }

      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.authInstance, provider);
        const idToken = await result.user.getIdToken(true);

        // Send token to your backend
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          const json = await response.json();
          this.showDialog = false;
          localStorage.setItem("jwtGoogle", idToken);
          this.$store.commit("setloggedInGoogle", true);
          this.$store.commit("setUserGoogle", json.userGoogle);
        }
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    },
  },
};
</script>
<style scoped>
/* Google-style button hover effect */
.v-btn.v-btn--variant-elevated {
  transition: box-shadow 0.2s ease-in-out;
}

.v-btn.v-btn--variant-elevated:hover {
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3),
    0 4px 8px 3px rgba(60, 64, 67, 0.15);
}

/* Optional: Add Google's product sans font if available */
.v-card-title,
.v-btn {
  font-family: "Google Sans", Roboto, Arial, sans-serif;
}
</style>
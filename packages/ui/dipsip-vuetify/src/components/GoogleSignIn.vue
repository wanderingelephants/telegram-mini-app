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
  onIdTokenChanged,
  setPersistence, browserLocalPersistence, onAuthStateChanged
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
      setPersistence(auth, browserLocalPersistence); // Keeps user signed in across page reloads

      this.authInstance = auth;
      this.isInitialized = true;

      /*onAuthStateChanged(auth, async (user) => {
  if (user) {
    const idToken = await user.getIdToken(true); // Force refresh if needed
    try {
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });
          const json = await response.json();
          if (!response.ok) {
            // Token invalid - clear storage
            localStorage.removeItem("AUTH_TOKEN");
            this.$store.commit("setloggedInGoogle", false);
            localStorage.removeItem("jwtGoogle");
          } else {
            this.$store.commit("setloggedInGoogle", true);
            this.$store.commit("setUserGoogle", json.userGoogle);
            localStorage.setItem("AUTH_TOKEN", json.token)
            localStorage.setItem("jwtGoogle", idToken);
          }
        } catch (error) {
          console.error("Token verification error:", error);
        }
  } else {
    
  }
});*/
      // Set up auth state listener
      this.unsubscribeAuth = onIdTokenChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          const idToken = await user.getIdToken(true);
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
      //const existingToken = localStorage.getItem("jwtGoogle");
      //if (existingToken) {
        
      //}
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
        console.log("signInWithGoogle", response)
        if (response.ok) {
          const json = await response.json();
          console.log("SignIn", json)
          this.showDialog = false;
          localStorage.setItem("AUTH_TOKEN", json.token);
          localStorage.setItem("jwtGoogle", idToken);
          this.$store.commit("setloggedInGoogle", true);
          //this.$store.commit("setUserGoogle", json.userGoogle);
        }
        else {
          console.error("Invalid token, clearing storage");
          localStorage.removeItem("jwtGoogle");
          this.$store.commit("setloggedInGoogle", false);
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
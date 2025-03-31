<template>
  <v-btn v-if="!loggedInGoogle" @click="signInWithGoogle" color="primary">
    Sign in with Google
  </v-btn>
  <!--<v-btn v-else @click="signOut" color="red">
    Sign out
  </v-btn> -->
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

      // Set up auth state listener
      this.unsubscribeAuth = onIdTokenChanged(auth, async (user) => {
        console.log("onIdTokenChanged", user)
        if (user) {
          // User is signed in
          const idToken = await user.getIdToken(true);
          try{
            await this.sendTokenToBackend(idToken)
            this.$store.commit("setUserGoogle", user);
          }
          catch(e){
            console.error(e)
            localStorage.removeItem("jwtGoogle");
            this.$store.commit("setloggedInGoogle", false);
            this.$store.commit("setUserGoogle", null);
          }
          
        } else {
          // User is signed out
          localStorage.removeItem("jwtGoogle");
          this.$store.commit("setloggedInGoogle", false);
          this.$store.commit("setUserGoogle", null);
        }
      });
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
    async signOut() {
    if (!this.authInstance) return;

    try {
      await this.authInstance.signOut();
      localStorage.removeItem("jwtGoogle");  // Clear token
      localStorage.removeItem("AUTH_TOKEN"); // Clear backend session token
      this.$store.commit("setloggedInGoogle", false);
      this.$store.commit("setUserGoogle", null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
  async sendTokenToBackend(idToken){
    const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken, "test": "hello" }),
        });
        console.log("/api/auth/google response", response)
        if (response.ok) {
          const json = await response.json();
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
        await this.sendTokenToBackend(idToken)
        
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
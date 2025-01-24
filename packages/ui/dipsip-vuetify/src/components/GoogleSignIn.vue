<template>
  <div>
    <v-dialog v-if="!loggedInGoogle" v-model="showDialog" max-width="400">
      <v-card class="rounded-lg">
        <!-- Header with Google-style typography -->
        <v-card-title class="text-h5 pt-6 px-6 font-weight-medium">
          <v-icon color="primary" class="mr-2">mdi-google</v-icon>
          Sign in with Google
        </v-card-title>

        <!-- Subtext with Google's product sans font -->
        <v-card-text class="px-6 pt-4 pb-4 text-body-1 text-grey-darken-1">
          Sign in to access enhanced features
        </v-card-text>

        <v-divider></v-divider>

        <!-- Actions with Google-styled buttons -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            class="text-caption text-grey-darken-1 font-weight-medium mr-2"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            class="text-none px-6 rounded-lg elevation-0"
            prepend-icon="mdi-google"
            @click="signInWithGoogle"
          >
            Sign in with Google
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
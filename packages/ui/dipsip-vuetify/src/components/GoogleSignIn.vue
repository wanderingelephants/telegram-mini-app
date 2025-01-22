<template>
  <div>
    <v-dialog 
      v-if="!loggedInGoogle"
      v-model="showDialog" 
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Sign in with Google
        </v-card-title>
        
        <v-card-text>
          Sign in to access enhanced features and analytics
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
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
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { initializeFirebase } from '@/plugins/firebase';

export default {
  data() {
    return {
      isInitialized: false,
      authInstance: null,
      unsubscribeAuth: null,
      showDialog: false
    };
  },
  created() {
    this.showDialog = !this.loggedInGoogle
  },
  watch: {
    loggedInGoogle(newVal) {
      if (newVal) {
        this.showDialog = false
      }
    }
  },
  computed: {
    ...mapState([
      "loggedInGoogle",
      "userGoogle",
    ])
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
          const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: existingToken }),
          });
          const json = await response.json()
          if (!response.ok) {
            // Token invalid - clear storage
            localStorage.removeItem("jwtGoogle");
            this.$store.commit("setloggedInGoogle", false);
          }
          else {
            this.$store.commit("setloggedInGoogle", true);
            this.$store.commit("setUserGoogle", json.userGoogle);
          }
        } catch (error) {
          console.error('Token verification error:', error);
        }
      }
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
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
      this.showDialog = false
    },
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
          const json = await response.json()
          this.showDialog = false
          localStorage.setItem("jwtGoogle", idToken);
          this.$store.commit("setloggedInGoogle", true);
          this.$store.commit("setUserGoogle", json.userGoogle);
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
      }
    }
  }
}
</script>
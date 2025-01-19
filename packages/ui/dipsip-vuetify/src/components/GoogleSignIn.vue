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
import { auth } from '@/plugins/firebase';

export default {
  computed: mapState([
    "loggedInGoogle",
    "userGoogle",
  ]),
  methods: {
    async signInWithGoogle(){
      try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    
    // Send token to your backend
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    localStorage.setItem("jwtGoogle", idToken);
    if (response.ok) {
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
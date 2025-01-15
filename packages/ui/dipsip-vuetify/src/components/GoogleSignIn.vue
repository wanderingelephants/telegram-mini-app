<template>
  <v-btn @click="signInWithGoogle" color="primary">
    Sign in with Google
  </v-btn>
</template>

<script setup>
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/plugins/firebase';
import { ref } from 'vue';

const user = ref(null);

const signInWithGoogle = async () => {
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
    
    if (response.ok) {
      user.value = result.user;
      console.log('Login success', user.value)
      // Handle successful sign-in
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
  }
};
</script>
<template>
  <v-row>
    <v-col cols="3"> </v-col>
     <google-sign-in/>
  </v-row>
</template>
<script>
import GoogleSignIn from "../components/GoogleSignIn";

export default {
    components: {
        GoogleSignIn,
    },    
};
</script>

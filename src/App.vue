<script setup>
import Header from './layouts/Header/Header.vue';
import Main from './layouts/Main/Main.vue';

// Sets the user's language as HTML languages.
document.documentElement.lang = navigator.language || "en";
</script>

<template>
  <Header />
  <Main />
</template>

<style scoped></style>
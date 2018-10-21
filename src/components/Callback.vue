<template>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Callback extends Vue {
  public mounted() {
    this.$auth.handleAuthentication().then(() => {
      window.location.href = localStorage.getItem('redir') || process.env.BASE_URL;
    });
  }
}
</script>

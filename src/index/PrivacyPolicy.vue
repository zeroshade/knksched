<template>
  <v-app dark>
    <v-toolbar color='orange' app>
      <v-toolbar-side-icon><a href='/'><v-icon>home</v-icon></a></v-toolbar-side-icon>
      <v-toolbar-title>Kith &amp; Kink Schedule</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <Privacy></Privacy>
    </v-content>
  </v-app>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Privacy from './components/Privacy.vue';

@Component({
  components: {
    Privacy,
  },
})
export default class PrivacyPolicy extends Vue {}
</script>

<style scoped lang="styl">
#app
  background: #EF6100
</style>

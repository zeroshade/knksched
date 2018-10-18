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
import Privacy from '@/components/main/Privacy.vue';

@Component({
  components: {
    Privacy,
  },
})
export default class PrivacyPolicy extends Vue {}
</script>

<style scoped lang="styl">
@import '~vuetify/src/stylus/theme.styl'

$material-dark.background = #EF6100

@import '~vuetify/src/stylus/main.styl'
</style>

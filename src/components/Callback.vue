<template>
  <v-app dark>
    <div class='text-xs-center'>
      <v-dialog
        v-model='dialog'
        hide-overlay
        persistent
        width='300'
      >
        <v-card color='primary' dark>
          <v-card-text>
            Logging in...
            <v-progress-linear indeterminate color='white' class='mb-0'></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Callback extends Vue {
  public dialog = false;
  public mounted() {
    this.dialog = true;
    this.$auth.handleAuthentication().then(() => {
      window.location.hash = '';
      window.location.pathname = '/admin';
    });
  }
}
</script>

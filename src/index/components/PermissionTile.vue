<template>
  <div>
    <v-icon large style='float: left'>{{ icon }}</v-icon>
    <p class='ml-4 pl-4 pt-1 mb-2 font-weight-bold privacy-header'>
      <slot></slot>
    </p>
    <template v-for='app in dataArray'>
      <p class='ml-4 pl-4 mb-0 font-weight-bold privacy-grey'>
        {{ app.title }}
      </p>
      <p class='ml-4 pl-4 font-weight-regular privacy-grey'>
        {{ app.text }}
      </p>
    </template>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PermissionTile extends Vue {
  @Prop(Array) public dataArray!: Array<{ title: string, text: string }>;
  @Prop(String) public icon!: string;
}
</script>

<style scoped lang='styl'>
.privacy-header
  font-size: 13px

.privacy-grey
  @extend .privacy-header
  color: rgba(0, 0, 0, .54);
</style>

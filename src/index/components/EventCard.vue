<template>
  <v-card>
    <v-card-title :class='`${color} headline`' primary-title>
      <v-icon v-if='ev.icon' dark>{{ev.icon}}</v-icon> {{ ev.title }}
      <v-spacer></v-spacer>

      <v-icon v-if='$auth.isAuthenticated()' @click='toggleFav()'>
        {{ filled ? 'star' : 'star_border' }}
      </v-icon>
    </v-card-title>

    <v-card-text>
      <v-layout fluid>
        <v-flex xs6>
          <p class='font-weight-bold'>{{ ev.startTime }} - {{ ev.endTime }}</p>
        </v-flex>
        <v-flex xs6>
          <p class='font-italic text-xs-right'><strong>Duration:</strong>&nbsp;
            <span v-if='ev.duration().hours()'>{{ ev.duration().hours() }}h</span>
            <span v-if='ev.duration().minutes()'>{{ ev.duration().minutes() }}m</span>
          </p>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs6>
          <p class='font-weight-medium font-italic'><strong>Room:</strong> {{ ev.room }}</p>
        </v-flex>
        <v-flex xs6>
          <p class='font-weight-medium font-italic text-xs-right'><strong>Organizer:</strong> {{ ev.organizer }}</p>
        </v-flex>
      </v-layout>
      <p v-if='ev.desc' class='font-weight-medium'>{{ ev.desc }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import Event from '@/helpers/event';

@Component
export default class EventCard extends Vue {
  @Prop(String) public color!: string;
  @Prop(Object) public ev!: Event;

  public isfav(): boolean {
    return this.$auth.userfavs.includes(this.ev.id);
  }

  public toggleFav() {
    this.ev.favorited = this.$auth.toggleFavorite(this.ev.id);
  }

  public get filled(): boolean {
    return this.ev.favorited === null ? this.isfav() : this.ev.favorited;
  }
}
</script>

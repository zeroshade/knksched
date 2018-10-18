<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md5>
        <v-card light class='elevation-12'>
          <v-toolbar dark color='primary'>
            <v-toolbar-title class='headline'>Privacy Policy for KnK Schedule</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <span class='body-1'>This app collects some Personal Data from users</span>
            <v-divider class='mt-2 mb-1' light></v-divider>
            <p class='subheading font-weight-bold mt-2'>
              Personal Data collected for the following purposes and using the following services:
            </p>

            <v-layout>
              <v-flex xs6 v-if='thirdParty.length'>
                <PermissionTile icon='people' :dataArray='thirdParty'>
                  Access to third-party accounts
                </PermissionTile>
              </v-flex>
              <v-flex xs6 v-if='regAuth.length'>
                <PermissionTile icon='contact_mail' :dataArray='regAuth'>
                  Registration and Authentication
                </PermissionTile>
              </v-flex>
            </v-layout>

            <v-divider class='mt-2 mb-1' light></v-divider>
            <p class='subheading font-weight-bold mt-2'>
              Contact Information
            </p>

            <v-layout>
              <v-flex xs6>
                <PermissionTile icon='person' :dataArray='[{title: "Contact Email", text: "zotthewizard@gmail.com"}]'>
                  Owner and Data Controller
                </PermissionTile>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import PermissionTile from './PermissionTile.vue';

const perm = 'Permissions';
const personalData = 'Personal Data';
const asSpecified = 'various types of Data as specified in the privacy policy of the service';

@Component({
  components: {
    PermissionTile,
  },
})
export default class Privacy extends Vue {
  public thirdParty: Array<{ title: string, text: string}> = [
    {
      title: 'Facebook account access',
      text: `${perm}: email`,
    },
  ];

  public regAuth: Array<{ title: string, text: string}> = [
    {
      title: 'Google OAuth',
      text: `${personalData}: ${asSpecified}`,
    },
    {
      title: 'Facebook Authentication',
      text: `${personalData}: ${asSpecified}`,
    },
    {
      title: 'Direct Registration',
      text: `${personalData}: email address and profile picture`,
    },
    {
      title: 'Auth0',
      text: `${personalData}: Cookies, email addres, first name, last name, picture and ${asSpecified}`,
    },
  ];
}
</script>

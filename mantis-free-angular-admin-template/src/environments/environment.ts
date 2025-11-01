// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYnh5ZHN5dmprcnhzanhmcGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MjE1ODQsImV4cCI6MjA3Njk5NzU4NH0.6Q_QLfBRww1L5zs_Ivgq3cKE-EHfqvQv68Xay0IvNiY',  
  supabaseUrl: 'https://krbxydsyvjkrxsjxfpgq.supabase.co', 

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

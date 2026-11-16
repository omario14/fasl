import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.fasl.prayer',
  appName: 'Fasl',
  webDir: 'dist',
  backgroundColor: '#0E1A14',
  android: {
    backgroundColor: '#0E1A14',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_fasl',
      iconColor: '#C9A84C',
    },
  },
};

export default config;

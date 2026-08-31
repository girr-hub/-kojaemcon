import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kogemcon.app',
  appName: 'KOGEMCON',
  webDir: 'public',
  server: {
    url: 'https://kojaemcon.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;

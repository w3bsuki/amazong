import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amazong.marketplace',
  appName: 'Amazong',
  webDir: 'out',
  
  // Server configuration for development
  server: {
    // For live reload during development (optional)
    // url: 'http://localhost:3000',
    // cleartext: true,
  },
  
  // iOS-specific configuration
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'amazong',
  },
  
  // Android-specific configuration  
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set true for debugging
  },
  
  // Plugins configuration (add as needed)
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f97316', // Your orange brand color
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f97316',
    },
  },
};

export default config;

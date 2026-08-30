import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useRef } from 'react';

export default function App() {
  // Pointing to your computer's local IP address where Vite is running.
  // Make sure your phone and computer are on the same Wi-Fi network.
  const WEB_APP_URL = 'http://192.168.1.2:5173';
  const webviewRef = useRef(null);

  const onMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'REQUEST_LOCATION') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          webviewRef.current?.injectJavaScript(`
            window.dispatchEvent(new CustomEvent('nativeLocationError', { detail: 'Permission denied' }));
            true;
          `);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        webviewRef.current?.injectJavaScript(`
          window.dispatchEvent(new CustomEvent('nativeLocationSuccess', { 
            detail: { lat: ${location.coords.latitude}, lng: ${location.coords.longitude} } 
          }));
          true;
        `);
      }
    } catch (e) {
      console.log('Message error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0b0f19" />
      <WebView 
        ref={webviewRef}
        source={{ uri: WEB_APP_URL }} 
        style={styles.webview}
        bounces={false}
        showsVerticalScrollIndicator={false}
        geolocationEnabled={true}
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19', // Matches FoodDash dark theme
  },
  webview: {
    flex: 1,
    backgroundColor: '#0b0f19',
  }
});

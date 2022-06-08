import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>You are cool</Text>
      <MapView style={{height: '50%', width: '100%'}} provider={PROVIDER_GOOGLE} showsUserLocation={true} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

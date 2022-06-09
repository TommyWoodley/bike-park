import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {firebase} from "./config";
import {useEffect, useState} from "react";
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';


export default function App() {
  const [locations, setLocations] = useState([]);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [currentLat, setCurrentLat] = useState(51.4960469);
  const [currentLong, setCurrentLong] = useState(-0.1790737);
  const [destLat, setDestLat] = useState(0);
  const [destLong, setDestLong] = useState(0);
  const [desc, setDesc] = useState('');
  const fireRef = firebase.firestore().collection('locations');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCurrentLat(location.coords.latitude);
            setCurrentLong(location.coords.longitude);
        })();
    }, []);

  //fetch or read data from firestore
  useEffect(() => {
    fireRef
        .orderBy('createdAt')
        .onSnapshot(
            querySnapshot => {
              const locations = []
              querySnapshot.forEach((doc) => {
                const {latcoord, longcoord, desc} = doc.data()
                locations.push({
                  id: doc.id, latcoord, longcoord, desc,
                })
              })
              setLocations(locations);
            }
        )
  }, [])

  // add an item
  const addLoc = () => {
    //check if we have atodo
    if(lat && lat.length > 0 && long && long.length > 0) {
      //get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        desc: desc,
        latcoord: lat,
        longcoord: long,
        createdAt: timestamp
      };
      fireRef
          .add(data)
          .then(() => {
            setLat(0);
            setLong(0);
            setDesc('');
            Keyboard.dismiss();
          })
          .catch((error) => {
            alert(error);
          })
    }
  }

    return (
        <View style={{flex:1}}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Latitude'
                    onChangeText={(heading) => setLat(heading)}
                    value={lat}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Longitude'
                    onChangeText={(heading) => setLong(heading)}
                    value={long}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Description'
                    onChangeText={(heading) => setDesc(heading)}
                    value={desc}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addLoc}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
            <MapView style={{height: '50%', width: '100%'}} provider={PROVIDER_GOOGLE} showsUserLocation={true}>
                {locations[0] != null && locations.map((marker, index) => (
                    <MapView.Marker
                        key = {index}
                        coordinate = {{
                            latitude: Number(marker.latcoord),
                            longitude: Number(marker.longcoord)
                        }}
                        title = {marker.desc}
                        icon={require('./marker_icon.png')}
                        onPress = {e => {
                            setDestLat(e.nativeEvent.coordinate.latitude)
                            setDestLong(e.nativeEvent.coordinate.longitude)

                            // console.log(e.nativeEvent.coordinate)
                        }}
                    />
                ))
                }
                <MapViewDirections
                    origin={{latitude: currentLat, longitude: currentLong}}
                    destination={{latitude: destLat, longitude: destLong}}
                    apikey={'AIzaSyDx-ARe9YIdlEyEzI8-KFaS2BnSCAXIp_I'}
                    strokeWidth={7}
                    strokeColor="blue"
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#e5e5e5',
        padding:15,
        borderRadius:15,
        margin:5,
        marginHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
    },
    innerContainer:{
        alignItems:'center',
        flexDirection:'column',
        marginLeft:45,
    },
    itemHeading:{
        fontWeight:'bold',
        fontSize:18,
        marginRight:22,
    },
    formContainer:{
        flexDirection:'row',
        height:80,
        marginLeft:10,
        marginRight:10,
        marginTop:100,
    },
    input:{
        height:48,
        borderRadius:5,
        overflow:'hidden',
        backgroundColor:'white',
        paddingLeft:16,
        flex:1,
        marginRight:5,
    },
    button:{
        height:47,
        borderRadius:5,
        backgroundColor:'#788eec',
        width:80,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        color:'white',
        fontSize:20,
    },
    todoIcon: {
        marginTop:5,
        fontSize:20,
        marginLeft:14
    }
})

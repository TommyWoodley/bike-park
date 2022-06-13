import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native';
import {firebase} from "./config";
import {useEffect, useState} from "react";
import { useRef } from "react";
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';


export default function App() {
    const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [currentLat, setCurrentLat] = useState(51.498317);
  const [currentLong, setCurrentLong] = useState(-0.176923);
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
                const {coord, desc} = doc.data()
                locations.push({
                  id: doc.id, coord, desc
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
            <MapView
                style={{height: '100%', width: '100%'}}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                ref={mapRef}
                initialRegion={{
                    latitude: currentLat,
                    longitude: currentLong,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}>
                {locations[0] != null && locations.map((marker, index) => (
                    <MapView.Marker
                        key = {index}
                        coordinate = {{
                            latitude: Number(marker.coord.latitude),
                            longitude: Number(marker.coord.longitude)
                        }}
                        anchor={{x:0.5, y:0.9}}
                    >
                        <View>
                            <Image
                                source={require('./assets/parking-marker.png')}
                                style={{width: 50, height: 50}}
                                resizeMode="center"
                            />
                        </View>
                    </MapView.Marker>
                ))
                }
            </MapView>
        </View>
    )
}

function CustomMarker() {
    return (
        <View>

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
        backgroundColor:'#49ec11',
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
    },
    marker: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor:'#ffffff',
        borderColor:'#eee',
    }
})


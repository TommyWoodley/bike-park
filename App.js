import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {firebase} from "./config";
import {useEffect, useState} from "react";

export default function App() {
  const [locations, setLocations] = useState([]);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const fireRef = firebase.firestore().collection('locations');

  //fetch or read data from firestore
  useEffect(() => {
    fireRef
        .orderBy('createdAt')
        .onSnapshot(
            querySnapshot => {
              const locations = []
              querySnapshot.forEach((doc) => {
                const {lat, long} = doc.data()
                locations.push({
                  id: doc.id, lat, long,
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
        lat: lat,
        long: long,
        createdAt: timestamp
      };
      fireRef
          .add(data)
          .then(() => {
            setLat(0);
            setLong(0);
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
                <TouchableOpacity style={styles.button} onPress={addLoc}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
            <MapView style={{height: '50%', width: '100%'}} provider={PROVIDER_GOOGLE} showsUserLocation={true}>
                {locations[0] != null && locations.map((marker, index) => (
                    <MapView.Marker
                        key = {index}
                        coordinate = {{
                            latitude: marker.lat,
                            longitude: marker.long
                        }}
                        title = {marker.lat}
                    />
                ))
                }
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

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {View} from 'react-native';
import {firebase} from "../utils/config";
import {onError, onResult} from "../utils/database";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {ParkingMarker} from "../components/molecules";
import InfoPopup from "../components/organisms/infoPopup";

const fireRef = firebase.firestore().collection('locations');

export default function MainMapView() {
    const [fullScreen, setFullScreen] = useState(true);
    const [locations, setLocations] = useState([]);
    const [currentLat, setCurrentLat] = useState(51.498317);
    const [currentLong, setCurrentLong] = useState(-0.176923);

    const [selectedDesc, setSelectedDesc] = useState('');

    // Ask for location permission
    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
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
            .onSnapshot(querySnapshot => onResult(querySnapshot, setLocations), onError)
    }, [])

    return (
        <View style={{flex: 1}}>
            <InfoPopup style={{height: '30%', width: '100%'}} desc={selectedDesc}/>
            <MapView
                style={{height: fullScreen ? '100%' : '80%', width: '100%'}}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={{
                    latitude: currentLat,
                    longitude: currentLong,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}>
                {locations[0] != null && locations.map((marker, index) => (
                    <ParkingMarker
                        key={index}
                        coord={{latitude: marker.coord.latitude, longitude: marker.coord.longitude}}
                        onClick={() => {
                            setFullScreen(() => false);
                            setSelectedDesc(marker.desc);
                        }}
                    />
                ))
                }
            </MapView>
        </View>
    )
}
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {View} from 'react-native';
import {firebase} from "../utils/config";
import {onError, onResult} from "../utils/database";
import {createRef, useEffect, useState} from "react";
import * as Location from 'expo-location';
import {ParkingMarker} from "../components/molecules";
import InfoPopup from "../components/organisms/infoPopup";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import MapViewDirections from "react-native-maps-directions";

const fireRef = firebase.firestore().collection('locations');

// function animateMap(lat, lng, mapView) {
//     mapView.animateToRegion({ // Takes a region object as parameter
//         longitude: lat,
//         latitude: lng,
//         latitudeDelta: 0.4,
//         longitudeDelta: 0.4,
//     },1000);
// }

function getLink(mLat, mLong) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + mLat + '%2C' + mLong + '&travelmode=bicycling'
}

export default function MainMapView() {
    const [fullScreen, setFullScreen] = useState(true);
    const [locations, setLocations] = useState([]);
    const [currentLat, setCurrentLat] = useState(51.498936);
    const [currentLong, setCurrentLong] = useState(-0.177112);
    const [done, setDone] = useState(false);
    const [link, setLink] = useState('');

    const [geoLat, setGeoLat] = useState(51.498936);
    const [geoLong, setGeoLong] = useState(-0.177112);
    const [duration, setDuration] = useState(0);

    const [selectedDesc, setSelectedDesc] = useState('');
    const [selectedNumStars, setSelectedNumStars] = useState(0);
    const [selectedNumReviews, setSelectedNumReviews] = useState(0);
    const [selectedCapacity, setSelectedCapacity] = useState(0);

    const [image, setImage] = useState('https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif');

    let markers = locations.map((marker, index) => (
            <ParkingMarker
                key={index}
                coord={{latitude: marker.coord.latitude, longitude: marker.coord.longitude}}
                desc={marker.desc}
                isSelected={marker.desc === selectedDesc}
                onClick={async () => {
                    setLink(getLink(marker.coord.latitude, marker.coord.longitude));
                    setDone(false);
                    setImage('https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif');
                    setFullScreen(() => false);
                    setSelectedNumReviews(marker.reviews.length)
                    let totalStars = 0
                    marker.reviews.forEach((x, i) => totalStars += x.rating)
                    setSelectedNumStars(totalStars / marker.reviews.length)
                    setSelectedCapacity(marker.capacity)
                    setSelectedDesc(marker.desc);
                    setCurrentLat(marker.coord.latitude);
                    setCurrentLong(marker.coord.longitude);
                    setDuration('~');
                    const storage = getStorage()
                    const reference = ref(storage, '/' + marker.img);

                    getDownloadURL(reference)
                        .then((x) => {
                            setImage(x);
                        })
                        .catch(e => {
                            console.log(marker.desc + 'getting downloadURL of image error =>  ' + '/' + marker.img, e);
                            setImage('https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/desktopimages/rainbow-cake600x600_2.jpg?ext=.jpg');
                        })

                    let location = await Location.getCurrentPositionAsync({});
                    setGeoLat(location.coords.latitude)
                    setGeoLong(location.coords.longitude)
                    setDone(true);

                }}
            />
        ));

    const mapView = createRef();


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

    useEffect(() => {
        fireRef
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => onResult(querySnapshot, setLocations), onError)
    }, [])

    return (
        <View style={{flex: 1}}>
            <InfoPopup
                style={{height: '25%', width: '100%'}}
                desc={selectedDesc}
                image={image}
                numStars={selectedNumStars}
                capacity={selectedCapacity}
                numReviews={selectedNumReviews}
                setFullscreen={setFullScreen}
                setSelectedDesc={setSelectedDesc}
                duration={duration}
                link={link}
            />
            <MapView
                style={{height: fullScreen ? '100%' : '75%',width: '100%'}}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                ref={mapView}
                region={{
                    latitude: currentLat,
                    longitude: currentLong,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}>
                <MapViewDirections
                    origin={{ latitude: geoLat, longitude: geoLong }}
                    destination={{ latitude: currentLat, longitude: currentLong }}
                    apikey={"AIzaSyDx-ARe9YIdlEyEzI8-KFaS2BnSCAXIp_I"}
                    mode={"BICYCLING"}
                    strokeWidth={selectedDesc === '' && !done? 0 : 5}
                    strokeColor="hotpink"
                    onReady={result => {
                        setDuration(Math.round(result.duration))
                    }}
                    onError={error => {
                        console.log('why are you making me deal with this norberto')
                    }}

                />
                {markers}
            </MapView>
        </View>
    )
}

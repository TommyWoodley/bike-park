import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {View} from 'react-native';
import {firebase} from "../utils/config";
import {getFromDatabase, onError, onResult} from "../utils/database";
import {createRef, useEffect, useState} from "react";
import * as Location from 'expo-location';
import {ParkingMarker} from "../components/molecules";
import InfoPopup from "../components/organisms/infoPopup";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import MapViewDirections from "react-native-maps-directions";
import CapacityPopUp from "../components/organisms/capacityPopUp";
import {Accuracy} from "expo-location";
import {setEnabled} from "react-native/Libraries/Pressability/PressabilityDebug";
import {createdAt} from "expo-updates";
import moment from "moment";


const fireRef = firebase.firestore().collection('locations');

function getLink(mLat, mLong) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + mLat + '%2C' + mLong + '&travelmode=bicycling'
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI/180; // φ, λ in radians
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dp/2) * Math.sin(dp/2) +
        Math.cos(p1) * Math.cos(p2) *
        Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

export default function MainMapView() {
    const [fullScreen, setFullScreen] = useState('no');
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
    const [selectedLiveFree, setSelectedLiveFree] = useState(0);
    const [selectedNumReviews, setSelectedNumReviews] = useState(0);
    const [selectedCapacity, setSelectedCapacity] = useState(0);
    const [selectedShelter, setSelectedShelter] = useState(false);
    const [selectedID, setSelectedID] = useState('5');
    const [selectedCreatedAt, setSelectedCreatedAt] = useState('');
    const [capacityEnabled, setCapacityEnabled] = useState(false);

    const [closeVisible, setCloseVisible] = useState(false);

    useEffect(() => {
        firebase.firestore()
            .collection('locations')
            .doc(selectedID)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot != null && documentSnapshot.data() != null) {
                    const {liveFree, createdAt} = documentSnapshot.data();
                    setSelectedLiveFree(liveFree);
                    setSelectedCreatedAt(createdAt);
                }

            });
    }, [selectedID]);


    const [image, setImage] = useState('https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif');

    const liveUpdate = async (id) => {
        const pin = await getFromDatabase(id);
        setSelectedLiveFree(pin.liveFree);
    }

    let markers = locations.map((marker, index) => (
            <ParkingMarker
                key={index}
                coord={{latitude: marker.coord.latitude, longitude: marker.coord.longitude}}
                desc={marker.desc}
                isSelected={marker.desc === selectedDesc}
                onClick={async () => {
                    const pin = await getFromDatabase(marker.id);
                    //console.log(pin);
                    setLink(getLink(marker.coord.latitude, marker.coord.longitude));
                    setDone(false);
                    setImage('https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif');
                    setFullScreen(() => 'popup');
                    setSelectedNumReviews(pin.reviews.length);
                    setSelectedID(marker.id);
                    setSelectedShelter(pin.shelter);
                    let totalStars = 0;
                    pin.reviews.forEach((x, i) => totalStars += x.rating);
                    setSelectedNumStars(totalStars / pin.reviews.length);
                    setSelectedCapacity(pin.capacity);
                    setSelectedDesc(pin.desc);
                    setCurrentLat(marker.coord.latitude);
                    setCurrentLong(marker.coord.longitude);
                    setDuration('~');
                    const storage = getStorage();
                    const reference = ref(storage, '/' + pin.img);

                    getDownloadURL(reference)
                        .then((x) => {
                            setImage(x);
                        })
                        .catch(e => {
                            console.log(pin.desc + 'getting downloadURL of image error =>  ' + '/' + pin.img, e);
                            setImage('https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/desktopimages/rainbow-cake600x600_2.jpg?ext=.jpg');
                        });

                    let location = await Location.getCurrentPositionAsync({});
                    setGeoLat(location.coords.latitude);
                    setGeoLong(location.coords.longitude);
                    setDone(true);

                    if (getDistance(marker.coord.latitude, marker.coord.longitude, geoLat, geoLong) < 10) {
                        setEnabled(true);
                    }

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
            setGeoLat(location.coords.latitude);
            setGeoLong(location.coords.longitude);

        })();
    }, []);

    useEffect(() => {
        fireRef
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => onResult(querySnapshot, setLocations), onError)
    }, [])

    return (
        <View style={{flex: 1}}>
            <CapacityPopUp
                closeVisible={closeVisible}
                setCloseVisible={setCloseVisible}
                desc={selectedDesc}
                image={image}
                id={selectedID}
                setSelectedLiveFree={setSelectedLiveFree}
            />
            <InfoPopup
                style={{height: fullScreen === 'full' ? '40%' : '25%', width: '100%'}}
                lat={currentLat}
                long={currentLong}
                desc={selectedDesc}
                image={image}
                numStars={selectedNumStars}
                capacity={selectedCapacity}
                numReviews={selectedNumReviews}
                setFullscreen={setFullScreen}
                setSelectedDesc={setSelectedDesc}
                duration={duration}
                fullscreen={fullScreen}
                link={link}
                shelter={selectedShelter}
                setCloseVisible={setCloseVisible}
                liveFree={selectedLiveFree}
                createdAt={selectedCreatedAt}
            />
            <MapView
                style={{height: fullScreen === 'no' ? '100%' : (fullScreen === 'full' ? '60%' : '75%') ,width: '100%'}}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                ref={mapView}
                region={{
                    latitude: currentLat,
                    longitude: currentLong,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
            >
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

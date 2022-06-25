import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {View, Image, Pressable} from 'react-native';
import {firebase} from "../utils/config";
import {getFromDatabase, onError, onResult} from "../utils/database";
import {createRef, useEffect, useRef, useState} from "react";
import * as Location from 'expo-location';
import {ParkingMarker} from "../components/molecules";
import InfoPopup from "../components/organisms/infoPopup";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import MapViewDirections from "react-native-maps-directions";
import CapacityPopUp from "../components/organisms/capacityPopUp";
import RatingsPopup from "../components/organisms/ratingsPopUp";
import FilterPopUp from "../components/organisms/filterPopUp";
import LoadPopUp from "../components/organisms/loadPopUp";

const fireRef = firebase.firestore().collection('locations');

function getLink(mLat, mLong) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + mLat + '%2C' + mLong + '&travelmode=bicycling'
}


function allowed(location, filters) {
    if (location.avg !== 0 && (location.avg < filters.minimumStar || location.avg > filters.maximumStar)) {
        return false;
    } else if (location.capacity < filters.minimumCap) {
        return false;
    } else if (filters.needsShelter && !location.shelter) {
        return false;
    }

    return true;
}

export default function MainMapView() {
    const [fullScreen, setFullScreen] = useState('no');
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
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
    const [selectedReviews, setSelectedReviews] = useState([]);

    const [closeVisible, setCloseVisible] = useState(false);
    const [ratingsVisible, setRatingsVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [checked, setChecked] = useState(false);
    const [load, setLoad] = useState(true);

    const base = {
        'minimumStar': 1,
        'maximumStar': 5,
        'minimumCap': 0,
        'minimumReviews': 0,
        'needsShelter': false,
    }


    const [filters, setFilters] = useState({
        'minimumStar': 1,
        'maximumStar': 5,
        'minimumCap': 0,
        'minimumReviews': 0,
        'needsShelter': false,
    });

    const myFunction = async () => {
        let count = 0;
        const fLoc = [];

        for (const pos of locations) {
            const pin = await getFromDatabase(pos.id);
            if (allowed(pin, filters)) {
                fLoc.push(pin);
            }
            count += 1;
        }

        if (fLoc !== filteredLocations) {
            setFilteredLocations(fLoc);
            if (!fLoc.map((marker, index) => marker.desc).includes(selectedDesc)) {
                setSelectedDesc("");
                setFullScreen('no');
            }
        }
    }

    useEffect(() => {
        setLoad(true);
        myFunction().then(() => {
            setLoad(false);
        });
    }, [filters.minimumStar, filters.maximumStar, filters.minimumCap, filters.needsShelter]);

    useEffect(() => {
        myFunction().then(() => {
            setLoad(false);
        });
    }, [locations]);

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

        firebase.firestore()
            .collection('locations')
            .doc(selectedID)
            .collection('reviews')
            .onSnapshot(documentSnapshot => {
                const reviews = [];
                let totalStars = 0;

                documentSnapshot.forEach(rdoc => {
                    const {rating, username, comment, createdAt} = rdoc.data();
                    reviews.push({id: rdoc.id, rating, username, comment, createdAt });
                    totalStars += rating;
                });

                setSelectedReviews(reviews);

                setSelectedNumStars(totalStars / (reviews.length === 0 ? 1 : reviews.length));
                setSelectedNumReviews(reviews.length);
            }
            );
    }, [selectedID]);


    const [image, setImage] = useState('https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif');

    const liveUpdate = async (id) => {
        const pin = await getFromDatabase(id);
        setSelectedLiveFree(pin.liveFree);
    }

    let markers = filteredLocations.map((marker, index) => (
        <ParkingMarker
            key={index}
            coord={{latitude: marker.coord.latitude, longitude: marker.coord.longitude}}
            desc={marker.desc}
            isSelected={marker.desc === selectedDesc}
            onClick={async () => {
                const pin = await getFromDatabase(marker.id);
                setLink(getLink(marker.coord.latitude, marker.coord.longitude));
                setDone(false);
                setImage('https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif');
                setFullScreen(() => 'popup');
                setSelectedID(marker.id);
                setSelectedShelter(pin.shelter);
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

            }}
        />
    ))

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
            .orderBy('desc')
            .onSnapshot(querySnapshot => {
                onResult(querySnapshot, setLocations, locations.length);
            }
                , onError)
    }, [])

    return (
        <View style={{flex: 1}}>
            <LoadPopUp
                load={load}
            />
            <CapacityPopUp
                closeVisible={closeVisible}
                setCloseVisible={setCloseVisible}
                desc={selectedDesc}
                image={image}
                id={selectedID}
                setSelectedLiveFree={setSelectedLiveFree}
            />
            <RatingsPopup
                id={selectedID}
                image={image}
                desc={selectedDesc}
                ratingsVisible={ratingsVisible}
                setRatingsVisible={setRatingsVisible}
            />
            <FilterPopUp
                filterVisible={filterVisible}
                setFilterVisible={setFilterVisible}
                filters={filters}
                setFilter={setFilters}
                checked={checked}
                setChecked={setChecked}
            />
            <InfoPopup
                style={{height: fullScreen === 'full' ? '80%' : '25%', width: '100%'}}
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
                reviews={selectedReviews}
                id={selectedID}
                ratingVisible={ratingsVisible}
                setRatingsVisible={setRatingsVisible}
            />
            <MapView
                style={{
                    position:'absolute',
                    height: fullScreen === 'no' ? '100%' : (fullScreen === 'full' ? '20%' : '75%') ,width: '100%'}}
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
                    strokeWidth={selectedDesc === '' || !done? 0 : 5}
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
            <Pressable
                style={{
                position:'absolute',
                top:65,
                right:12,
                alignSelf: 'flex-end',
                backgroundColor:
                    (filters.minimumCap === base.minimumCap || filters.minimumCap === "0" || filters.minimumCap === 0) &&
                    filters.minimumStar === base.minimumStar &&
                    filters.maximumStar === base.maximumStar &&
                    filters.needsShelter === base.needsShelter &&
                    filters.minimumReviews === base.minimumReviews ?
                        'rgba(250,250,250,0.8)' : 'rgba(0,0,0,0.8)',
                height: 38,
                width: 38,
                borderRadius: 2,
                borderWidth:0,
                elevation:15,
                alignContent:'center',
                justifyContent:'center',
                opacity: fullScreen === 'full' ? 0 : 1,
            }}
                onPress={() => {
                    if (fullScreen !== 'full') {
                        setFilterVisible(true);
                    }
                }}
            >
                    <Image
                        source={require('../assets/images/filter-icon.png')}
                        style={{alignSelf: 'center', width: '60%', height: '60%'}}
                        tintColor={(filters.minimumCap === base.minimumCap) &&
                        filters.minimumStar === base.minimumStar &&
                        filters.maximumStar === base.maximumStar &&
                        filters.needsShelter === base.needsShelter &&
                        filters.minimumReviews === base.minimumReviews ?
                            '#666666' : '#dddddd'}
                    />
            </Pressable>
        </View>
    )
}

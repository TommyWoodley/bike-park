import {firebase} from "./config";
import {Keyboard} from "react-native";

export function onResult(querySnapshot, setLocations, currentLocations) {
    const locations = []
    querySnapshot.forEach(async (doc) => {
        const {coord, desc} = doc.data();
        locations.push({
            id: doc.id, coord, desc,
        })
    })
    if (locations !== currentLocations) {
        setLocations(locations);
    }

}

export function onError(error) {
    console.error(error);
}

//update live location

export function updateLiveLocation(id, newCap) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    firebase.firestore()
        .collection('locations')
        .doc(id)
        .update({
            'liveFree': newCap,
            'createdAt': timestamp,
        }).then(r => {
        console.log('updated');
    });
}


// get single function

export async function getFromDatabase(id) {
    const doc = await firebase.firestore().collection('locations').doc(id).get()
    const {coord, desc, img, capacity, shelter, liveFree, createdAt} = doc.data()

    let snapshot = await firebase.firestore()
        .collection('locations')
        .doc(id)
        .collection('reviews')
        .get()

    const reviews = []
    snapshot.forEach(rdoc => {
        const {rating, username} = rdoc.data()
        reviews.push({id: rdoc.id, rating, username })
    })

    return ({
        id: doc.id, coord, desc, img, reviews, capacity, shelter, liveFree, createdAt,
    });
}

// add an item
function addLocation(lat, lng, desc, db) {
    if(lat && lat.length > 0 && lng && lng.length > 0) {
        //get the timestamp
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            desc: desc,
            coord: {latitude: lat, longitude: lng},
            createdAt: timestamp
        };
        db
            .add(data)
            .then(() => {
                Keyboard.dismiss();
            })
            .catch((error) => {
                alert(error);
            })
    }
}

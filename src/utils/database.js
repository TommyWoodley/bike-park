import {firebase} from "./config";
import {Keyboard} from "react-native";

export function onResult(querySnapshot, setLocations, numLocs) {
    const locs = []
    querySnapshot.forEach(async (doc) => {
        const {coord, desc} = doc.data();
        locs.push({
            id: doc.id, coord, desc
        })
    })

    if (locs.length !== numLocs) {
        setLocations(locs);
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

export function addReview(id, username, rating, comment) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const review = {
        username: username === "" ? "Anonymous" : username,
        rating: rating,
        comment: comment,
        createdAt: timestamp,
    }

    firebase.firestore()
        .collection('locations')
        .doc(id)
        .collection('reviews')
        .add(review)
        .then(r => {
            Keyboard.dismiss();
        });

}


// get single function

export async function getFromDatabase(id) {
    const doc = await firebase.firestore().collection('locations').doc(id).get()
    const {coord, desc, img, capacity, shelter, liveFree, createdAt, avg,} = doc.data()

    let snapshot = await firebase.firestore()
        .collection('locations')
        .doc(id)
        .collection('reviews')
        .get()

    const reviews = []
    snapshot.forEach(rdoc => {
        const {rating, username, comment, createdAt, avg} = rdoc.data()
        reviews.push({id: rdoc.id, rating, username, comment, createdAt })
    })

    return ({
        id: doc.id, coord, desc, img, reviews, capacity, shelter, liveFree, createdAt, avg,
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

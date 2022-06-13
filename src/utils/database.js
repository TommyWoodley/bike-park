import {firebase} from "./config";
import {Keyboard} from "react-native";

export function onResult(querySnapshot, setLocations) {
    const locations = []
    querySnapshot.forEach((doc) => {
        const {coord, desc} = doc.data()
        locations.push({
            id: doc.id, coord, desc
        })
    })
    setLocations(locations);
}

export function onError(error) {
    console.error(error);
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
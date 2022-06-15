import {Marker} from "react-native-maps";
import {View} from "react-native";
import {MarkerImage} from "../atoms";

function ParkingMarker({coord, onClick, desc, selectedDesc}) {
    return (<Marker
        coordinate={{
            latitude: coord.latitude,
            longitude: coord.longitude
        }}
        anchor={{x: 0.5, y: 0.9}}
        onPress={() => {
            onClick();
        }}
    >
        <View>
            <MarkerImage isSelected={desc === selectedDesc}/>
        </View>
    </Marker>);
}



export default ParkingMarker;
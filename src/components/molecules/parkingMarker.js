import {Marker} from "react-native-maps";
import {View} from "react-native";
import {MarkerImage} from "../atoms";

function ParkingMarker({coord, onClick, desc, isSelected}) {
    return (<Marker
        coordinate={{
            latitude: coord.latitude,
            longitude: coord.longitude
        }}
        anchor={{x: 0.5, y: isSelected ? 1 : 0.9}}
        onPress={() => {
            onClick();
        }}
    >
        <View style={{height: 60, width:60, backgroundColor:'transparent'}}>
            <MarkerImage isSelected={isSelected}/>
        </View>
    </Marker>);
}



export default ParkingMarker;
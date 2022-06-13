import {Marker} from "react-native-maps";
import {View} from "react-native";
import {MarkerImage} from "../atoms";

const ParkingMarker = ({coord, onClick}) =>
    <Marker
        coordinate = {{
            latitude: coord.latitude,
            longitude: coord.longitude
        }}
        anchor={{x:0.5, y:0.9}}
        onPress={() => onClick()}
    >
        <View>
            <MarkerImage/>
        </View>
    </Marker>;

export default ParkingMarker;
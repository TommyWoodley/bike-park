import {Marker} from "react-native-maps";
import {View} from "react-native";
import {MarkerImage} from "../atoms";
import {Component, useState} from "react";

class ParkingMarker extends Component {

    constructor({coord, onClick, setSelected}) {
        super();
        this.state = {
            coord: coord,
            onclick: onClick,
            setSelected: setSelected,
            selected: false
        }
    }

    deselect() {
        this.state.selected = false;
        console.log('deselect me');
    }

    render() {
        return (<Marker
            coordinate={{
                latitude: this.state.coord.latitude,
                longitude: this.state.coord.longitude
            }}
            anchor={{x: 0.5, y: 0.9}}
            onPress={() => {
                this.state.onclick();
                this.state.selected = true;
                this.state.setSelected(this);
            }}
        >
            <View>
                <MarkerImage size={this.state.selected ? 100: 50}/>
            </View>
        </Marker>);
    }
}



export default ParkingMarker;
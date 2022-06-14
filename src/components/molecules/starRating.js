import {Marker} from "react-native-maps";
import {View, Text, StyleSheet} from "react-native";
import {MarkerImage} from "../atoms";
import Star from "../atoms/stars";

const StarRating = ({score, num}) =>
    <View style={{flexDirection: "row", alignItems: 'center'}}>
        <Star/>
        <Star/>
        <Star/>
        <Star/>
        <Star/>
        <Text>({num})</Text>
    </View>


export default StarRating;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF00FF',
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 25,
        height: 25
    },
    text: {
        fontSize: 20,
        marginLeft: 10,
        marginRight: 10
    }
});
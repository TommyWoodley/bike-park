import {StyleSheet, Text, View} from "react-native";

const InfoPopup = ({desc}) =>
    <View style={styles.bottomView}>
        <Text>Image</Text>
        <Text>{desc}</Text>
    </View>

export default InfoPopup;

export const styles = StyleSheet.create({
    popup: {
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomView: {
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
});
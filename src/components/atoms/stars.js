import {Image, StyleSheet, Text, View} from "react-native";

const Star = () =>
    <Image
        style={styles.image}
        source={require('../../assets/images/star-filled.png')}
    />;

export default Star;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FF00FF",
    },
    image: {
        width: 25,
        height: 25
    }
});
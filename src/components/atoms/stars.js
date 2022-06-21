import {Image, StyleSheet} from "react-native";

function Star({val}) {
    let path;
    if (val < 0.125) {
        path = require('../../assets/images/star-0.png');
    } else if (val < 0.375) {
        path = require('../../assets/images/star-25.png');
    } else if (val < 0.625) {
        path = require('../../assets/images/star-50.png');
    } else if (val < 0.875) {
        path = require('../../assets/images/star-75.png');
    } else {
        path = require('../../assets/images/star-100.png');
    }
    return (
        <Image
            style={styles.image}
            source={path}
        />
    );
}


export default Star;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FF00FF",
    },
    image: {
        width: 20,
        height: 20,
        resizeMode:'contain'
    }
});
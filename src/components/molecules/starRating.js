import {View, Text, StyleSheet} from "react-native";
import Star from "../atoms/stars";

//let stars = [];
// 		// Loop 5 times
// 		for (var i = 1; i <= 5; i++) {
// 			// Set the path to filled stars
// 			let path = require('./star-filled.png');
// 			// If ratings is lower, set the path to unfilled stars
// 			if (i > ratingObj.ratings) {
// 				path = require('./star-0.png');
// 			}
// 			// Push the Image tag in the stars array
// 			stars.push((<Image style={styles.image} source={path} />));
// 		}

function StarRating({score, num}) {
    let stars = [];

    for (let i = 0; i<5; i++) {
        stars.push(<Star val={score - i} key={i}/>)
    }

    return (<View style={{flexDirection: "row", alignItems: 'center', resizeMode:'contain'}}>
        {stars}
        <Text>({num})</Text>
    </View>);
}



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
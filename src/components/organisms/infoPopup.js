import {Image, StyleSheet, Text, View} from "react-native";
import StarRating from "../molecules/starRating";
import Lightbox from 'react-native-lightbox-v2';

function InfoPopup({desc, image, numStars, numReviews}) {

    return (
        <View style={styles.bottomView}>
            <View style={{ width:'45%', height:'80%', resizeMode:'contain', borderRadius:15}}>
                <Lightbox navigator={navigator}>
                    <Image
                        style={{ height: '100%', resizeMode:'contain'}}
                        source={{ uri: image }}
                    />
                </Lightbox>
            </View>
            <View style={{width:'4%'}}/>
            <View style={{width:'45%'}}>
                <StarRating
                    score={numStars}
                    num={numReviews}
                />
                <Text style={styles.sectionTitle}>{desc}</Text>
            </View>
        </View>);
}


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
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        flexDirection:"row",
        height: '25%',
        width: '100%',
        paddingTop:15,
        justifyContent: 'center',
        borderRadius: 15,
        position: 'absolute',
        bottom: 0,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
    },
});

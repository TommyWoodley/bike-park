import {Image, StyleSheet, Text, View} from "react-native";
import StarRating from "../molecules/starRating";
import Lightbox from 'react-native-lightbox-v2';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useState} from "react";

const InfoPopup = ({desc, image, numStars, numReviews, setFullscreen}) => {
    const [swipeDirection, setSwipeDirection] = useState('');

    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

    const figureHorizontalDirection = (delta) =>
        delta > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    const figureVerticalDirection = (delta) =>
        delta > 0 ? SWIPE_DOWN : SWIPE_UP;

    const detectSwipeDirection = ({dx, dy}) => {
        return Math.abs(dx) > Math.abs(dy)
            ? figureHorizontalDirection(dx)
            : figureVerticalDirection(dy);
    };

    const onSwipe = (directionNull, gestureState) => {
        const {dx, dy} = gestureState;
        let direction = detectSwipeDirection({dx, dy});

        switch (true) {
            case direction === SWIPE_DOWN:
                setSwipeDirection('down');
                setFullscreen(true);
                break;
            default:
                break;
        }
    };

    const config = {
        velocityThreshold: 0.5,
        directionalOffsetThreshold: 50,
    };
    return (
        <View style={styles.bottomView}>
            <GestureRecognizer
                style={styles.gridContainer}
                onSwipe={(direction, state) => onSwipe(direction, state)}
                config={config}>
                <Image source={require('../../assets/images/grey-bar.png')} style={{
                    width: 50,
                    height: 20,
                    resizeMode:'contain',
                }}/>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{ width:'45%', height:'80%'}}>
                        <Image
                            style={{ height: '100%', borderRadius:15, overflow:'hidden'}}
                            source={{ uri: image }}
                        />
                    </View>
                    <View style={{width:'4%'}}/>
                    <View style={{width:'45%'}}>
                        <StarRating
                            score={numStars}
                            num={numReviews}
                        />
                        <Text style={styles.sectionTitle}>{desc}</Text>
                    </View>
                </View>
            </GestureRecognizer>
        </View>);
}


export default InfoPopup;

export const styles = StyleSheet.create({
    bottomView: {
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        flexDirection:"column",
        height: '25%',
        width: '100%',
        paddingTop: 0,
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
    gridContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems:'center',
    },
});

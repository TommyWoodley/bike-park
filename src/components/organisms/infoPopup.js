import {Button, Image, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import StarRating from "../molecules/starRating";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useState} from "react";
import * as Linking from 'expo-linking';

const InfoPopup = ({desc, image, numStars, numReviews, setFullscreen,setSelectedDesc, duration, capacity, link}) => {

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
                if (!modalVisible) {
                    setFullscreen(true);
                    setSelectedDesc("");
                } else {
                    setModalVisible(!modalVisible)
                }
                break;
            case direction === SWIPE_UP:
                if (!modalVisible) {
                    setModalVisible(true)
                }
                break;
            default:
                break;
        }
    };

    const config = {
        velocityThreshold: 0.1,
        directionalOffsetThreshold: 30,
    };
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.bottomView}>
            <GestureRecognizer
                style={styles.gridContainer}
                onSwipe={(direction, state) => onSwipe(direction, state)}
                config={config}>
                <Image source={require('../../assets/images/grey-bar.png')} style={{
                    width: 45,
                    height: 20,
                    resizeMode:'stretch',
                }}/>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View styles={{height:'5%', width:'100%', flexDirection: 'row', alignItems: 'left'}}>
                                    <Pressable
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Image
                                            style={{ height: '30%', width: '15%', resizeMode:'contain' }}
                                            source={require('../../assets/images/white-x.png')}
                                        />
                                    </Pressable>
                                </View>
                                <Image
                                    style={{ height: '50%', width: '100%', resizeMode:'contain' }}
                                    source={{ uri: image }}
                                />

                            </View>

                        </View>

                    </Modal>
                    <View style={{ width:'45%', height:'88%'}}>
                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Image
                                style={{ height: '100%', borderRadius:15, overflow:'hidden'}}
                                source={{ uri: image }}
                            />
                        </Pressable>
                    </View>
                    <View style={{width:'4%'}}/>
                    <View style={{width:'45%', flexDirection: 'column'}}>
                        <StarRating
                            score={numStars}
                            num={numReviews}
                        />
                        <Text numberOfLines={1} ellipsizeMode='tail'
                        style={styles.sectionTitle}>{desc}</Text>
                        <View style={{flexDirection:'row', paddingTop: 5}}>
                            <Image source={require('../../assets/images/bike-icon.png')}
                                   style={styles.attributeIcon}/>
                            <Text style={styles.attributeText}>{`${duration} min`}</Text>
                        </View>
                        <View style={{flexDirection:'row', paddingTop: 5}}>
                            <Image source={require('../../assets/images/bike-park-icon.png')}
                                   style={styles.attributeIcon}/>
                            <Text style={styles.attributeText}>{`${capacity} bays`}</Text>
                        </View>
                        <Pressable style={styles.button}
                                   onPress={() => Linking.openURL(link)}
                        >
                            <Text style={styles.text}>GO</Text>
                        </Pressable>
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
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        paddingTop: 5,
    },
    sectionMain: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
    gridContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems:'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        marginTop: 100,
        height: '100%',
        width: '100%',
        backgroundColor: "black",
        borderRadius: 30,
        padding: 0,
        paddingTop: 20,
        paddingBottom: 120,
        //alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        alignItems: 'center',
        width: '50%',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
        borderRadius: 20,
        elevation: 0,
        marginTop:5,
        backgroundColor: '#426fda',
    },
    attributeIcon: {
        height:25,
        width:25,
        flex:1
    },
    attributeText: {
        fontSize: 18,
        flex:4,
        paddingHorizontal: 5
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

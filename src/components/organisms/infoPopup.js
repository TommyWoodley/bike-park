import {Button, Image, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import StarRating from "../molecules/starRating";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useState} from "react";
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking';

const InfoPopup = ({lat, long, desc, image, numStars, numReviews, fullscreen, setFullscreen,setSelectedDesc, duration, capacity, link, shelter}) => {

    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

    const [pressed, setPressed] = useState(false);

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
                setPressed(false);
                if (!modalVisible) {
                    if (fullscreen === 'full') {
                        setFullscreen('popup');
                    } else {
                        setFullscreen('no');
                        setSelectedDesc("");
                    }
                } else {
                    setModalVisible(!modalVisible)
                }
                break;
            case direction === SWIPE_UP:
                setPressed(false);
                if (!modalVisible) {
                    setFullscreen('full');
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

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(`${lat}, ${long}`);
    };

    return (
        <View style={{
            alignItems: 'flex-start',
            backgroundColor: '#ffffff',
            flexDirection:"column",
            height: fullscreen === 'full' ? '40%' : '25%',
            width: '100%',
            paddingTop: 0,
            justifyContent: 'center',
            borderRadius: 15,
            position: 'absolute',
            bottom: 0,
        }}>
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
                    flexDirection: 'row',
                    height: fullscreen === 'full'? '55%' : '88%'
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
                                    style={{ height: '40%', width: '100%', resizeMode:'contain' }}
                                    source={{ uri: image }}
                                />

                            </View>

                        </View>

                    </Modal>


                    <View style={{ width:'45%', height: '90%'}}>
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
                            <Text style={{
                                fontSize: 18,
                                flex:4,
                                paddingHorizontal: 5}}>
                                {`${capacity} bays`}
                            </Text>
                            <Pressable style={{
                                fontSize: 18,
                                flex:3,
                                paddingHorizontal: 5,
                                alignItems: 'center',
                                fontWeight: 'bold',
                                color:'white',
                                borderRadius: 20,
                                backgroundColor: '#ffffff',
                            }}>
                                <Text style={styles.text}>FULL</Text>
                            </Pressable>
                        </View>
                        <View style={{flexDirection: 'row', paddingTop: 10}}>
                            <Image source={require('../../assets/images/bike-shelter.png')}
                                   style={{width: 25, height: 25, alignContent: 'flex-start'}}/>
                            <Image source={shelter ?
                                require('../../assets/images/tick-icon.png') :
                                require('../../assets/images/cross-icon.png')}
                                   style={{width: 20, height:20, marginHorizontal: 5}}/>

                            <Pressable style={styles.button}
                                       onPress={() => Linking.openURL(link)}
                            >
                                <Text style={styles.text}>GO</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={styles.copyLocation}>
                    <Image source={require('../../assets/images/parking-marker.png')}
                           style={{width: 25, height: 25, alignContent: 'flex-start'}}/>
                    <Text style={styles.attributeText}>{lat.toFixed(6)}, {long.toFixed(6)}</Text>
                    <Pressable style={{
                        alignItems: 'center',
                        width: '27%',
                        alignContent: 'flex-start',
                        paddingVertical: 10,
                        marginLeft: 10,
                        borderRadius: 20,
                        backgroundColor: !pressed ? '#ffffff' : '#999999',
                        borderWidth: 3,
                        borderColor: !pressed ? '#000000' : '#999999',
                    }} onPress={() => {
                        setPressed(true)
                        copyToClipboard();

                    }
                    }
                    >
                        <Image source={require('../../assets/images/clipboard-icon.png')}
                               style={{width: 20, height: 20, alignContent: 'flex-start'}}/>
                    </Pressable>
                </View>
            </GestureRecognizer>
        </View>);
}


export default InfoPopup;

export const styles = StyleSheet.create({
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
        paddingBottom: 0,
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
        flex:1,
        alignItems: 'center',
        width: '50%',
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        marginLeft: 20,
        borderRadius: 20,
        backgroundColor: '#426fda',
    },
    attributeIcon: {
        height:25,
        width:25,
        flex:2
    },
    attributeText: {
        fontSize: 18,
        flex:7,
        paddingHorizontal: 5
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    copyLocation: {
        flexDirection:'row',
        width: '95%',
        paddingTop: 5,
        alignItems:'center',
        justifyContent:'center'
    }
});

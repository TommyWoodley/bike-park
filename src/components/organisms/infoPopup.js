import {FlatList, Image, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import StarRating from "../molecules/starRating";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useState} from "react";
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking';
import moment from "moment";

function getTime(createdAt) {
    const time = moment(new Date(createdAt * 1000)).subtract(1969, 'years').fromNow();
    return time.endsWith("years ago") ? "" : time;
}

const InfoPopup = ({lat, long, desc, image, numStars, numReviews, fullscreen, setFullscreen,setSelectedDesc, duration, capacity, link, shelter, setCloseVisible, liveFree, createdAt, reviews, setRatingsVisible}) => {

    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

    const renderItem = ({item}) => (
        <View
            style={{width:'100%', justifyItems:'flex-start', padding: 10}}
        >

            <View style={{flexDirection:'row', alignItems:'center', width: '100%'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.ratingsUsername}>{item.username}</Text>
                    <StarRating score={item.rating} num={-1}/>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent:'flex-end',}}>
                    <Text style={{textAlign: 'right'}}>{getTime(item.createdAt)}</Text>
                </View>
            </View>
            <Text>{item.comment}</Text>
        </View>
    );

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
            height: fullscreen === 'full' ? '80%' : '25%',
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
                    height: fullscreen === 'full'? '25%' : '88%'
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
                    <View style={{width:'45%', height: '90%', flexDirection: 'column'}}>
                        <Pressable
                        onPress={() => {
                            setFullscreen('full')
                        }}>
                            <StarRating
                                score={numStars}
                                num={numReviews}
                            />
                        </Pressable>
                        <Text numberOfLines={1} ellipsizeMode='tail'
                              style={styles.sectionTitle}>{desc}</Text>
                        <View style={{flexDirection:'row', paddingTop: 5}}>
                            <Image source={require('../../assets/images/bike-icon.png')}
                                   style={styles.attributeIcon}/>
                            <Text style={styles.attributeText}>{`${duration} min`}</Text>
                            <Text style={{
                                fontSize: 10,
                                flex:4,
                                alignSelf: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                paddingHorizontal: 0}}>
                                {getTime(createdAt)}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row', paddingTop: 5}}>
                            <Image source={require('../../assets/images/bike-park-icon.png')}
                                   style={styles.attributeIcon}/>
                            <Text style={{
                                fontSize: 18,
                                flex:4,
                                paddingHorizontal: 5}}>
                                {`${capacity}`}
                            </Text>
                            <Pressable style={{
                                fontSize: 18,
                                flex:4,
                                padding: 5,
                                alignItems: 'center',
                                fontWeight: 'bold',
                                color:'black',
                                borderRadius: 20,
                                backgroundColor: liveFree === 100 ? "#ff0000" : liveFree === 50? "#ffbf00" : '#00ff00',
                            }}>
                                <Text style={styles.text}>{liveFree === 100 ? "FULL" : liveFree === 50? "SOME" : "EMPTY"}</Text>
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
                <Pressable
                    style={styles.updateButtons} onPress={() => {
                    setCloseVisible(true);
                }}>
                    <Text>UPDATE CAPACITY</Text>
                </Pressable>

                <Pressable
                    style={styles.updateButtons} onPress={() => {
                    setRatingsVisible(true);
                }}>
                    <Text>REVIEW</Text>
                </Pressable>

                <Text style={styles.ratingsTitle}>Reviews</Text>
                <Text style={{
                    fontSize: numReviews !== 0 ? 1 : 14,

                    letterSpacing: 0.25,
                    color: numReviews !== 0 ? 'white' : 'black',
                    paddingTop: numReviews === 0 ? 0 : 20,
                }}>No reviews available yet</Text>
                <FlatList data={reviews.sort((x, y) => y.createdAt - x.createdAt)} renderItem={renderItem} keyExtractor={item => item.id} style={{width:'100%'}}/>
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
        paddingVertical: 5,
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
        flex:4,
        paddingHorizontal: 5
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    ratingsUsername: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
        paddingRight: 10,
    },
    ratingsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
        paddingTop: 20,
    },
    copyLocation: {
        flexDirection:'row',
        width: '95%',
        paddingTop: 5,
        alignItems:'center',
        justifyContent:'center'
    },
    updateButtons: {
        alignItems: 'center',
        width: '90%',
        alignContent: 'flex-start',
        paddingVertical: 10,
        marginLeft: 0,
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: '#8969ff',
    },
});

import {Image, Modal, Pressable, View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform} from "react-native";
import {useState} from "react";
import {styles} from "./infoPopup";
import {addReview} from "../../utils/database";

function RatingsPopup({id, desc, image, ratingsVisible, setRatingsVisible}) {

    const [username, onChangeUsername] = useState('');
    const [rating, setRating] = useState(1);
    const [text, onChangeText] = useState('');

    return (<Modal
        animationType="slide"
        transparent={true}
        desc={desc}
        image={image}
        visible={ratingsVisible}
        onRequestClose={() => {
            setRatingsVisible(false);
        }}
        style={{justifyContent: 'center', alignItems: 'center'}}
    >
        <View style={{backgroundColor:'rgba(0,0,0,0.7)', height:'100%', width:'100%'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                marginTop: '10%',
                marginBottom: 0,
                height: 450,
                width: '90%',
                alignSelf:'center',
                backgroundColor: "white",
                borderRadius: 30,
                borderColor: 'black',
                borderWidth: 5,
                padding: 10,
                alignItems: "center",
                elevation: 20,
            }}>
                <View style={{flexDirection: 'row', height: '30%'}}>
                    <Image source={{uri: image}}
                           style={{
                               height: '100%',
                               width:'100%',
                               flex: 3,
                               borderRadius:20,
                               overflow: 'hidden'}}/>
                    <View style={{flex: 2}}>
                        <Pressable
                            onPress={() => {
                                setRatingsVisible(false)
                            }
                            }>
                            <Image source={require('../../assets/images/cross-icon.png')}
                                   style={{
                                       height: 20,
                                       width: 20,
                                       marginTop: 5,
                                       marginRight: 5,
                                       overflow: 'hidden',
                                       alignSelf: 'flex-end',
                                   }}/>
                        </Pressable>
                        <Text style={{fontSize: 16,
                            fontWeight: '600',
                            color: '#000000',
                            paddingTop: 0,
                            padding: 10,
                        }}>How safe do you think {desc} is?</Text>
                    </View>
                </View>

                <TextInput
                    style={ratingStyles.nameInput}
                    onChangeText={onChangeUsername}
                    placeholder="Name"
                    value={username}
                />

                <View style={{flexDirection: 'row', paddingVertical: 10}}>
                    <Pressable onPress={() => {
                        setRating(1);
                    }}>
                        <Image
                            style={ratingStyles.image}
                            source={rating >= 1 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                        />
                    </Pressable>

                    <Pressable onPress={() => {
                        setRating(2);
                    }}>
                        <Image
                            style={ratingStyles.image}
                            source={rating >= 2 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                        />
                    </Pressable>

                    <Pressable onPress={() => {
                        setRating(3);
                    }}>
                        <Image
                            style={ratingStyles.image}
                            source={rating >= 3 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                        />
                    </Pressable>

                    <Pressable onPress={() => {
                        setRating(4);
                    }}>
                        <Image
                            style={ratingStyles.image}
                            source={rating >= 4 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                        />
                    </Pressable>

                    <Pressable onPress={() => {
                        setRating(5);
                    }}>
                        <Image
                            style={ratingStyles.image}
                            source={rating >= 5 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                        />
                    </Pressable>

                </View>

                <TextInput
                    style={ratingStyles.commentInput}
                    onChangeText={onChangeText}
                    placeholder="Comments"
                    value={text}
                    multiline={true}
                />

                <Pressable
                    style={styles.updateButtons} onPress={() => {
                    addReview(id, username, rating, text);
                    onChangeUsername('');
                    onChangeText('');
                    setRating(0);
                    setRatingsVisible(false);
                }}>
                    <Text>SUBMIT</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>

    </Modal>);
}



export default RatingsPopup;

export const ratingStyles = StyleSheet.create({
    container: {
        backgroundColor: "#FF00FF",
    },
    image: {
        width: 50,
        height: 50,
        resizeMode:'contain'
    },
    nameInput: {
        height: 40,
        width:'100%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius:10,
    },
    commentInput: {
        height: 80,
        width:'100%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius:10,
    },
    updateButtons: {
        alignItems: 'center',
        width: '90%',
        alignContent: 'flex-start',
        paddingTop: 10,
        marginLeft: 0,
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: '#8969ff',
    },
});
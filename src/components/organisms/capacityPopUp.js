import {Marker} from "react-native-maps";
import {Image, Modal, Pressable, View, Text, StyleSheet} from "react-native";
import {styles} from "./infoPopup";
import {updateLiveLocation} from "../../utils/database";

function CapacityPopUp({id, desc, image, closeVisible, setCloseVisible, setSelectedLiveFree}) {
    return (<Modal
        animationType="slide"
        transparent={true}
        desc={desc}
        image={image}
        visible={closeVisible}
        onRequestClose={() => {
            setCloseVisible(false);
        }}
        style={{justifyContent: 'center', alignItems: 'center'}}
    >
        <View style={{justifyContent: 'center', alignContent: 'center', backgroundColor:'rgba(0,0,0,0.7)', height:'100%'}}>
            <View style={{
                marginTop: '0%',
                height: '30%',
                width: '90%',
                alignSelf:'center',
                backgroundColor: "white",
                borderRadius: 30,
                padding: 10,
                alignItems: "center",
                elevation: 20,
                borderWidth: 5,
            }}>
                <View style={{flexDirection: 'row', height: '70%'}}>
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
                            setCloseVisible(false)
                        }
                        }>
                            <Image source={require('../../assets/images/cross-icon.png')}
                                   style={{
                                       height: 25,
                                       width: 25,
                                       margin: 5,
                                       overflow: 'hidden',
                                       alignSelf: 'flex-end',
                            }}/>
                        </Pressable>
                        <Text style={{fontSize: 18,
                            fontWeight: '600',
                            color: '#000000',
                            padding: 10,
                        }}>How full is {desc}?</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 18}}>
                    <Pressable
                        style={{
                            alignItems: 'center',
                            width: '27%',
                            alignContent: 'flex-start',
                            paddingVertical: 10,
                            marginLeft: 10,
                            borderRadius: 20,
                            backgroundColor: '#ffffff',
                            borderWidth: 5,
                            borderColor: '#00ff00',
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                            updateLiveLocation(id, 0);
                            setSelectedLiveFree(0);
                        }
                        }
                    >
                        <Text>Empty</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            alignItems: 'center',
                            width: '27%',
                            alignContent: 'flex-start',
                            paddingVertical: 10,
                            marginLeft: 10,
                            borderRadius: 20,
                            backgroundColor: '#ffffff',
                            borderWidth: 5,
                            borderColor: "#ffbf00",
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                            updateLiveLocation(id, 50);
                            setSelectedLiveFree(50);
                        }
                        }
                    >
                        <Text>Some</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            alignItems: 'center',
                            width: '27%',
                            alignContent: 'flex-start',
                            paddingVertical: 10,
                            marginLeft: 10,
                            borderRadius: 20,
                            backgroundColor: '#ffffff',
                            borderWidth: 5,
                            borderColor: "#ff0000",
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                            updateLiveLocation(id, 100);
                            setSelectedLiveFree(100);
                        }
                        }
                    >
                        <Text>Full</Text>
                    </Pressable>
                </View>
            </View>
        </View>

    </Modal>);
}



export default CapacityPopUp;

const modalStyles = StyleSheet.create({

})
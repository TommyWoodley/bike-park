import {Marker} from "react-native-maps";
import {Image, Modal, Pressable, View, Text, StyleSheet} from "react-native";
import {styles} from "./infoPopup";

function CapacityPopUp({id, desc, image, closeVisible, setCloseVisible, addPopup}) {
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
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
            <View style={{
                marginTop: '40%',
                height: '50%',
                width: '90%',
                alignSelf:'center',
                backgroundColor: "white",
                borderRadius: 30,
                padding: 10,
                alignItems: "center",
                elevation: 20
            }}>
                <View style={{flexDirection: 'row', height: '70%'}}>
                    <Image source={{uri: image}}
                           style={{
                               height: '100%',
                               width:'100%',
                               flex: 3,
                               borderRadius:20,
                               overflow: 'hidden'}}/>
                    <Text style={{fontSize: 18,
                        fontWeight: '600',
                        color: '#000000',
                        padding: 10,
                        flex: 2
                    }}>How may bays are left in {desc}?</Text>

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
                            borderWidth: 3,
                            borderColor: '#000000',
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                        }
                    }
                    >
                        <Text>All</Text>
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
                            borderWidth: 3,
                            borderColor: '#000000',
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                            addPopup(id);
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
                            borderWidth: 3,
                            borderColor: '#000000',
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                            addPopup(id);
                        }
                        }
                    >
                        <Text>None</Text>
                    </Pressable>
                </View>
            </View>
        </View>

    </Modal>);
}



export default CapacityPopUp;

const modalStyles = StyleSheet.create({

})
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
                            updateLiveLocation(id, 0);
                            setSelectedLiveFree(0);
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
                            borderWidth: 3,
                            borderColor: '#000000',
                        }}
                        onPress={() => {
                            setCloseVisible(false);
                            updateLiveLocation(id, 100);
                            setSelectedLiveFree(100);
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
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
} from "react-native";
import Checkbox from 'expo-checkbox';
import {useState} from "react";

function FilterPopUp({filterVisible, setFilterVisible, filters, setFilter}) {

    const [shelter, setShelter] = useState(filters.needsShelter);
    const [minStars, onChangeMinStars] = useState(filters.minimumStar);
    const [maxStars, onChangeMaxStars] = useState(filters.maximumStar);
    const [minCapacity, setMinCapacity] = useState(filters.minimumCap);

    function handleCapacity(text) {
        if (/^\d+$/.test(text) || text === "") {
            setMinCapacity(text);
        }
    }
    return (
        <Modal
        animationType="none"
        visible={filterVisible}
        transparent={true}
        onRequestClose={() => {
            setFilterVisible(false);
        }}
        style={{justifyContent: 'center', alignItems: 'center'}}
        >
            <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => {setFilterVisible(false)}}
            >
                <View
                style={{width: '100%', height: '100%'}}>
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                    >
                        <View style={{
                            marginTop: '10%',
                            height: 250,
                            width: 280,
                            right: 25,
                            top: 5,
                            alignSelf:'center',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(250,250,250,0.9)',
                            borderRadius: 10,
                            padding: 10,
                            alignItems: "center",
                            elevation: 2,
                            borderWidth: 5,
                            borderColor: '#dddddd'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <View style={{
                                    justifyContent: 'flex-start',
                                    left: 20,
                                    top: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                    <Text>
                                        Shelter
                                    </Text>
                                    <Checkbox
                                        style={{
                                            marginHorizontal: 8,
                                        }}
                                        value={shelter}
                                        onValueChange={setShelter}
                                        color={shelter ? '#4630EB' : undefined}
                                    />
                                </View>
                                <Pressable
                                    onPress={() => {
                                        setFilterVisible(false)
                                    }
                                    }
                                    style={{
                                        alignContent: "flex-end",
                                    }}
                                >
                                    <Image source={require('../../assets/images/cross-icon.png')}
                                           style={{
                                               height: 25,
                                               width: 25,
                                               margin: 5,
                                               overflow: 'hidden',
                                               alignSelf: 'flex-end',
                                           }}
                                    />
                                </Pressable>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                alignItems: 'center',
                                left: 20,
                                paddingTop: 15,
                            }}>
                                <Text>
                                    Minimum Capacity
                                </Text>
                                <TextInput
                                    style={{
                                        marginHorizontal: 8,
                                        borderRadius: 10,
                                        width: 40,
                                        backgroundColor: '#dddddd',
                                        paddingVertical: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                    maxLength={3}
                                    keyboardType = 'numeric'
                                    placeholder="0"
                                    onChangeText={handleCapacity}
                                    value={minCapacity.toString()}
                                />
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                alignItems: 'center',
                                left: 20,
                                paddingTop: 15,
                            }}>
                                <Text>
                                    Minimum Stars
                                </Text>

                                <View style={{
                                    flexDirection: 'row',
                                    paddingBottom: 0,
                                    flex: 1,
                                    paddingRight: 30,
                                    justifyContent: 'flex-end',
                                }}>
                                    <Pressable onPress={() => {
                                        onChangeMinStars(1);
                                    }}>
                                        <Image
                                            style={filterStyles.star}
                                            source={minStars >= 1 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                                        />
                                    </Pressable>

                                    <Pressable onPress={() => {
                                        onChangeMinStars(2);
                                    }}>
                                        <Image
                                            style={filterStyles.star}
                                            source={minStars >= 2 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                                        />
                                    </Pressable>

                                    <Pressable onPress={() => {
                                        onChangeMinStars(3);
                                    }}>
                                        <Image
                                            style={filterStyles.star}
                                            source={minStars >= 3 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                                        />
                                    </Pressable>

                                    <Pressable onPress={() => {
                                        onChangeMinStars(4);
                                    }}>
                                        <Image
                                            style={filterStyles.star}
                                            source={minStars >= 4 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                                        />
                                    </Pressable>

                                    <Pressable onPress={() => {
                                        onChangeMinStars(5);
                                    }}>
                                        <Image
                                            style={filterStyles.star}
                                            source={minStars >= 5 ? require('../../assets/images/star-100.png') : require('../../assets/images/star-0.png')}

                                        />
                                    </Pressable>

                                </View>
                            </View>
                            <View
                                style={{
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    flex: 1,
                                    flexDirection: 'row'
                            }}
                            >
                                <Pressable
                                    style={{
                                        alignItems: 'center',
                                        height: 40,
                                        width: '30%',
                                        alignContent: 'flex-start',
                                        padding: 10,
                                        margin: 10,
                                        borderRadius: 20,
                                        backgroundColor: '#888888',}}
                                    onPress={() => {
                                        setMinCapacity(0);
                                        onChangeMinStars(1);
                                        onChangeMaxStars(5);
                                        setShelter(false);
                                        setFilter({
                                            'minimumStar': 1,
                                            'maximumStar': 5,
                                            'minimumCap': 0,
                                            'minimumReviews': 0,
                                            'needsShelter': false,
                                        });
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >CLEAR</Text>
                                </Pressable>
                                <Pressable
                                    style={{
                                        alignItems: 'center',
                                        height: 40,
                                        width: '30%',
                                        alignContent: 'flex-end',
                                        paddingVertical: 10,
                                        margin: 10,
                                        borderRadius: 20,
                                        backgroundColor: '#8969ff',}}
                                    onPress={() => {
                                        console.log("min capacity: " + minCapacity + "ksjbd")
                                        if (minCapacity === "") {
                                            console.log("hello");
                                            setMinCapacity(0);
                                            setFilter({
                                                'minimumStar': minStars,
                                                'maximumStar': maxStars,
                                                'minimumCap': 0,
                                                'minimumReviews': 0,
                                                'needsShelter': shelter,
                                            });
                                        } else{
                                            setFilter({
                                                'minimumStar': minStars,
                                                'maximumStar': maxStars,
                                                'minimumCap': minCapacity,
                                                'minimumReviews': 0,
                                                'needsShelter': shelter,
                                            });
                                        }
                                        setFilterVisible(false);
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >SUBMIT</Text>
                                </Pressable>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableOpacity>
        </Modal>);
}



export default FilterPopUp;

const filterStyles = StyleSheet.create({
    star: {
        width: 20,
        height: 20,
        resizeMode:'contain'
    },
})
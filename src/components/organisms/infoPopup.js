import {Image, StyleSheet, Text, View} from "react-native";

function InfoPopup({desc, image}) {

    return (
        <View style={styles.bottomView}>
            <Image
                style={{width:'50%', height:'100%', resizeMode:'contain'}}
                source={{uri: image}} />
            <Text>{desc}</Text>
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
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flexDirection:"row",
        justifyContent: 'flex-start',
        //padding: 15,
        borderRadius: 15,
        // margin: 5,
        height: '30%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
});
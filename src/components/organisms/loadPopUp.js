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
    ActivityIndicator
} from "react-native";

function LoadPopUp({load}) {

    return (
        <Modal
            animationType="none"
            visible={load}
            transparent={true}
            style={{justifyContent: 'center', alignItems: 'center'}}
        >
           <View
           style={{
               alignItems: 'center',
               width: '100%',
               height: '100%',
               justifyContent: 'center',
           }}>
               <ActivityIndicator
                   size="large"
                   color='#000000'
                   style={{
                       transform: [{scale: 1.5}]
                   }}
                   />
           </View>
        </Modal>);
}



export default LoadPopUp;

import React from 'react';
import {Image} from 'react-native';

function MarkerImage({size}) {
    return (<Image
        source={require('../../assets/images/parking-marker.png')}
        style={{width: size, height: size}}
        resizeMode="contain"
    />);
}

export default MarkerImage;
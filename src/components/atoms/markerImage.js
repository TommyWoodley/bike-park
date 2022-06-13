import React from 'react';
import {Image} from 'react-native';

const MarkerImage = () =>
    <Image
        source={require('../../assets/images/parking-marker.png')}
        style={{width: 50, height: 50}}
        resizeMode="center"
    />;

export default MarkerImage;
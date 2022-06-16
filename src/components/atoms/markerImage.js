import React from 'react';
import {Image} from 'react-native';

function MarkerImage({isSelected}) {
    return (<Image
        source={isSelected ? require('../../assets/images/parking-marker-selected.png') : require('../../assets/images/parking-marker.png')}
        style={{width: isSelected ? 60 : 50, height: isSelected ? 60 : 50, resizeMode:"cover"}}

    />);
}

export default MarkerImage;
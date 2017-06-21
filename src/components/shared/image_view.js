/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image,Text, StyleSheet,Dimensions, ActivityIndicator} from 'react-native';
import OImage from './image'

const FULL_HEIGHT = Dimensions.get('window').height;
const IMAGE_HEIGHT = FULL_HEIGHT/2- 70;  //70 is the navbar height

export default class ImageView extends Component{

    constructor(props){
        super(props);
    }

    _getOptWidth(width){
        return width * (Dimensions.get('window').width/width);
    }

    displayImage(){
        return(
            <OImage
                style={[{
                        width:this._getOptWidth(this.props.width),
                        height:IMAGE_HEIGHT ,//25 is half navbar height
                        zIndex:1000
                    },styles.image]}
                source={this.props.source}
                blurRadius={this.props.blur} >
                {this.props.children}
            </OImage>
        );
    }

    render(){
        return (
            <View style={styles.imageContainer}>
                {this.displayImage()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    imageContainer:{},
    image:{
        alignItems:'center',
        justifyContent:'center'
    },
    spinner:{flex:1,width:100,height:100}
});
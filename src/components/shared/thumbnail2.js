/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image, Text, StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import OImage from './image';

const FULL_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_WIDTH = FULL_WIDTH*0.70;
const IMG_DIM= THUMBNAIL_WIDTH/2-5;

export default class Thumbnail extends Component{
    render(){
        return (
        <TouchableOpacity style={[styles.thumbnail,this.props.style]} onPress={this.props.onPress}>
            <OImage
                style={styles.image}
                source={this.props.imageSource}
            />

            <View style={styles.bodyContainer}>
                {this.props.children}
            </View>
        </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({

    thumbnail:{
        width:THUMBNAIL_WIDTH,
        borderColor:'#ebebeb',
       // backgroundColor:'red',
        borderWidth:1,
        padding:10,
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start'

    },
    imageContainer:{
        flex:1
    },
    image:{
        //flex:1,
        width:IMG_DIM,
        height:IMG_DIM
    },
    bodyContainer:{
       flex:1
        //flex:1,
        //backgroundColor:'red',
        //alignItems:'stretch'

    },
});
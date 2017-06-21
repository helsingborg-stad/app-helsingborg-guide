/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image, Text, StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OImage from './image';

const FULL_WIDTH= Dimensions.get('window').width;
const IMAGE_WIDTH = FULL_WIDTH/2-(FULL_WIDTH/5);

export default class ContentThumbnail extends Component{

    displayImage(){
        const checkMarkIcon = (
            <View style={styles.checkedContainer}>
                <Icon name="ios-checkmark-circle-outline" size={20} color="white" />
            </View>
        );
        let checkMark = this.props.checked?checkMarkIcon:null;

        return(
            <OImage style={[styles.image , {}]}
                   source={this.props.imageSource}>
                {checkMark}
            </OImage>
        );
    }

    render(){

        return (
        <View style={styles.thumbnail}>
            {this.displayImage()}
            <View style={styles.bodyContainer}>
                {this.props.children}
            </View>
        </View>
        );
    }

}

const styles = StyleSheet.create({

    thumbnail:{
        flex:1,
        borderColor:'#ebebeb',
        backgroundColor:'white',
        //borderWidth:1,
        padding:5,
        justifyContent:'flex-start',
        alignItems:'center',
        height:IMAGE_WIDTH +100,


    },
    image:{
        //flex:3,
        width:IMAGE_WIDTH,
        height:IMAGE_WIDTH
    },
    bodyContainer:{maxWidth:IMAGE_WIDTH,minWidth:IMAGE_WIDTH,flex:4, justifyContent:'flex-start',alignItems:'flex-start'},
    checkedContainer:{
        width:30,
        height:30,
        backgroundColor:'#D35098',
        position:'absolute',
        top:0,
        left:0,
        zIndex:1000,
        justifyContent:'center',
        alignItems:'center'
    }
});
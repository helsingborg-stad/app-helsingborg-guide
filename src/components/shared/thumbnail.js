/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image, Text, StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import OImage from './image';

const FULL_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_WIDTH = FULL_WIDTH*0.70;

export default class Thumbnail extends Component{
    render(){
        return (
            <View style={[styles.thumbnail,this.props.style]}>
                <TouchableOpacity style={{flex:1}} onPress={this.props.onPress}>

                    <OImage style={styles.image}
                            source={this.props.imageSource} >
                        {this.props.labelOverlay}
                    </OImage>

                    <View style={styles.bodyContainer}>
                        {this.props.children}
                    </View>
                    {this.props.buttonOverlay}
                </TouchableOpacity>
            </View>


        );
    }

}

const styles = StyleSheet.create({

    thumbnail:{
        width:THUMBNAIL_WIDTH,
        borderColor:'#ebebeb',
        backgroundColor:'white',
        borderWidth:1,
        padding:5,
        justifyContent:'center'
    },
    image:{
        flex:3,
    },
    bodyContainer:{flex:4},
    overlay:{
        position:'absolute',
        flex:1,
        width:THUMBNAIL_WIDTH,
        top:0,
        left:0,
        zIndex:100000,
        backgroundColor:'red'
    }
});
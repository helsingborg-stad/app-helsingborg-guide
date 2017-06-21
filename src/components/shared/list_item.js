/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, Image} from 'react-native';
import OImage from './image';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class ListItem extends Component{

    displayImage(){

        const checkMarkIcon = (
            <View style={styles.checkedContainer}>
                <Icon name="face" size={20} color="white" />
            </View>
        );

        let checkMark = this.props.checked?checkMarkIcon:null;

        return(
            <OImage style={styles.thumbnail}
                   source={this.props.imageSource} >

                {checkMark}
            </OImage>
        );
    }
    render(){
        return (
            <View style={styles.listItem}>
                <View style={styles.thumbnailContainer}>
                    {this.displayImage()}
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.props.content}</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    listItem:{
        height:120,
        flexDirection:'row',
        //backgroundColor:'white',
        marginVertical:10,
        justifyContent:'center',
        alignItems:'center'
    },
    thumbnailContainer:{
        flex:5,
        //backgroundColor:'white'
    },
    thumbnail:{width:100,height:100},
    titleContainer:{flex:9,padding:1,alignItems:'center',justifyContent:'center'},
    title:{fontSize:16,fontWeight:'300',lineHeight:19},

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
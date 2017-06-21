/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet,TouchableOpacity} from 'react-native';
import ImageView from './image_view'
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';



export default class Thumbnail extends Component{
    render(){
        return (
        <ImageView width={300} height={400}
                   source={this.props.imageSource}>
            <TouchableOpacity  onPress={this.props.onPress}
                               style={styles.infoView}>
                <View  style={styles.titleTextContainer}>
                    <Text style={styles.titleText} >{this.props.content}</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Icon name="chevron-right" size={25} />
                </View>
            </TouchableOpacity>
        </ImageView>
        );
    }

}

const styles = StyleSheet.create({

    infoView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height:90,
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.94)',
        flexDirection:'row',
        justifyContent:'center'
    },
    titleTextContainer:{flex:9, justifyContent:'center',paddingHorizontal:10},
    titleText: {
        color: '#232323',
        fontWeight: 'bold',
        fontSize: 25
    },
    iconContainer:{flex:1,justifyContent:'center'}
});
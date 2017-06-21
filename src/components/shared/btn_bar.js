/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonsBarItem from './btn_bar_item'


export default class ButtonsBar extends Component{
    render(){
        return (
            <View style={styles.bar} >
                {this.props.children}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    bar:{minHeight:60,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        //padding:10,
        backgroundColor:'white'
    },
});


/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet} from 'react-native';

const COLORS =['#D35098', '#712082', '#A84C98', '#7B075E', '#A61380'];

export default class ColoredBar extends Component{

    constructor(props){
        super(props);
        this.state = {colors:COLORS};
    }

    displayBars(){
        if(this.props.visible)
        return this.state.colors.map((item,index)=>{
            let style = {backgroundColor:item};
            return (
                <View key={index} style={[styles.bar, style ]}>
                </View>
            );
        });

    }
    render(){
        return (
            <View style={styles.barsContainer}>
                {this.displayBars()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    barsContainer:{
        flex:1,
        maxWidth:10,
       // backgroundColor:'#7B075E',
       // zIndex:500
    },
    bar:{flex:1},

});
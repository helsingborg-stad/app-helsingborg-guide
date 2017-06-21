/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component, } from 'react';
import {View,Text, StyleSheet, TouchableWithoutFeedback, Animated} from 'react-native';
import ViewContainer from './view_container'


export default class ScaledTouchableItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            animValue: new Animated.Value(0)
        };

        this.onPressIn = this.onPressIn.bind(this);
        this.onPressOut = this.onPressOut.bind(this);
    }

    onPressIn(){

        Animated.spring(this.state.animValue,{toValue:1}).start();
    }
    onPressOut(){
        Animated.spring(this.state.animValue,{toValue:0}).start();
    }
    render(){
        let scaleAnim = this.state.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, this.props.ratio]
        });
        let style={transform:[{scale:scaleAnim}]};
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}
                                      onPressIn={this.onPressIn}
                                      onPressOut={this.onPressOut} >
                <Animated.View style={[style,styles.mainContainer,this.props.style]}>
                    {this.props.children}
                </Animated.View>
            </TouchableWithoutFeedback>

        );
    }

}

const styles = StyleSheet.create({
    mainContainer:{
        zIndex:100
    }
});
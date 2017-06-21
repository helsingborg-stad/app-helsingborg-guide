/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, Dimensions, Animated, TouchableOpacity} from 'react-native';
import ViewContainer from './view_container'

const FULL_WIDTH = Dimensions.get('window').width;

export default class FloatingBtn extends Component{

    constructor(props){
        super(props);
        this.state={
            animValue: new Animated.Value(0),
        }
    }

    componentWillMount(){
        this.animate(this.props.visible)
    }

    componentWillReceiveProps(nextProps){
        this.animate(nextProps.visible);
    }

    animate(visible){
        if(visible)
            Animated.spring(this.state.animValue,{toValue:1, friction:2}).start();
        else
            Animated.spring(this.state.animValue,{toValue:0}).start();

    }


    render(){

        let indexAnim = this.state.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 1000]
        });


        return (
            <Animated.View style={[styles.wrapper,{zIndex:indexAnim}]}>
                <Animated.View style={[ {flex:1,transform:[{scale:this.state.animValue}]}]} >
                    <TouchableOpacity onPress={this.props.onPress} activeOpacity={.9} style={styles.mainContainer}>
                        <Text style={styles.text}>{this.props.content}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

        );
    }

}

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        height:32,
        width:FULL_WIDTH,
       // backgroundColor:'red',
        position:'absolute',
        top:70,
        left:0,
        zIndex:1000,
        alignItems:'center',
    },
    mainContainer:{
        flex:1,
        height:32,
        maxWidth:140,
        backgroundColor:'rgba(211,80,152,1)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50,
        paddingHorizontal:15,
        zIndex:2000,

    },
    text:{fontSize:14,color:'white'}
});
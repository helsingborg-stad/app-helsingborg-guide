/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet,TouchableOpacity,TouchableWithoutFeedback, Dimensions, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class RoundedBtn extends Component{

    constructor(props){
        super(props);
        this.state={
            animValue: new Animated.Value(1)
        };
        this.onPressIn = this.onPressIn.bind(this);
        this.onPressOut = this.onPressOut.bind(this);
    }
    componentDidMount(){

    }

    displayBtn(){
        const close = this.props.idle || (<Icon name="info" size={20} color="white" />);
        const open = this.props.active || (<Icon name="times" size={20} color="white" />);
        const icon = (this.props.isActive)?open:close;
        let _styles = [styles.closeBtn, this.props.style];
        if(this.props.disabled)
            _styles.push(styles.disabled);
        if(this.props.outline)
            _styles.push(styles.outline);

        let animatedStyle = {
            transform:[{scale:this.state.animValue}]
        };

        return (
            <Animated.View style={[{flex:1},animatedStyle]}>
                <TouchableWithoutFeedback
                                  onPressIn={this.onPressIn}
                                  onPressOut = {this.onPressOut}
                                  onPress={()=>this.toggle()}>

                    <View style={styles.mainContainer}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>{this.props.label}</Text>
                        </View>
                        <View style={[styles.btnContainer]}>
                            <View disabled ={this.props.disabled || false}
                                  style={[_styles]} >
                                {icon}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>


            </Animated.View>

        );
    }

    toggle(){
        this.props.onPress();
    }

    onPressIn(e){
        Animated.spring(this.state.animValue,{toValue:1.4}).start();
    }
    onPressOut(e){
        Animated.spring(this.state.animValue,{toValue:1}).start();
    }

    render(){


        return (
            this.displayBtn()
        );
    }


}

const styles = StyleSheet.create({

    mainContainer: {
        flex:1,
        minWidth:200,
        //backgroundColor:'red',
        flexDirection:'row'
    },

    btnContainer:{
        flex:1
    },

    closeBtn:{
        backgroundColor:'#b4b4b4',
        width:32,
        height:32,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center'
    },
    bigger:{
        width:45,
        height:45     ,
        backgroundColor:'#ed57ac',

    },
    disabled:{backgroundColor:'#f6f6f6', },
    outline:{
        backgroundColor:'rgba(0,0,0,0)',
        borderWidth:2,
        borderColor:'white'
    },
    labelContainer: {
        flex:3,
       // backgroundColor:'orange',
        justifyContent:'center',
        alignItems:'flex-end',
        paddingHorizontal:10
    },
    labelText: {
        color:'#D35098',
        fontSize:16
    }


});
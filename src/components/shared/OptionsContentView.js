/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component , Children} from 'react';
import {View,Text, StyleSheet, Button, Dimensions, TouchableOpacity, LayoutAnimation} from 'react-native';
import ViewContainer from '../shared/view_container'
import Icon from 'react-native-vector-icons/FontAwesome';
import RoundedBtn from '../shared/roundedBtn';
const FULL_HEIGHT = Dimensions.get('window').height;
const FULL_WIDTH = Dimensions.get('window').width;
const BOX_HEIGHT = Dimensions.get('window').height*(.5);
const BOX_WIDTH = Dimensions.get('window').width*(.36);
const PARENT_FAB_WIDTH = 35;
const PARENT_FAB_HEIGHT = 70;
const CHILD_FAB_WIDTH = 32;
const PARENT_FAB_BTN_DIM = 20;

const CENTER_HEIGHT = (BOX_HEIGHT-PARENT_FAB_HEIGHT)/2;
const xZERO = CENTER_HEIGHT+CHILD_FAB_WIDTH/2;
const RADIUS = BOX_WIDTH-CHILD_FAB_WIDTH-20;
const TOTAL_CHILD = 3;

export default class OptionsContentView extends Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    createPosition(index, count){
        let top, right;
        let angle = (Math.PI/count)/2 + (Math.PI/count)*index;

        right =RADIUS*Math.sin(angle);
        top= xZERO+RADIUS*Math.cos(angle);

        return {top,right};
    }


    displayFabChildrenBox(){
        const childrenCount = Children.count(this.props.children);

        let children = Children.map(this.props.children, (child,index)=>{
            let childPositionStyle = this.createPosition(index,childrenCount);
            return (
                <View style = {[styles.child,childPositionStyle]}>
                    {child}
                </View>
            );
        });

        return(
            <View style={styles.fabChildrenContainer}>
                {children}
            </View>
        );

    }

    render(){

        return (
            <View style={[styles.mainContainer]}>
                {this.displayFabChildrenBox()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainContainer:{
         flex:1,
        backgroundColor:'rgba(255,255,255,0.94)'
    },

    fabChildrenContainer:{
        height:FULL_HEIGHT,
        width:FULL_WIDTH,
        position:'absolute',
        right:0,
        top:xZERO,
        backgroundColor:'rgba(255,255,255,0)',
        borderTopLeftRadius:BOX_WIDTH,
        borderBottomLeftRadius:BOX_WIDTH,
    },
    child:{
        position:'absolute',

    },


});


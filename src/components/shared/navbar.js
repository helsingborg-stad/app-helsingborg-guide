/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet} from 'react-native';


export default class Navbar extends Component{
    constructor(props){
        super(props);
        this.state ={
        };
    }

    render(){
        return (
            <View style={[styles.navBar,
             {backgroundColor:this.props.backgroundColor},
             ]} >
                <View style={styles.btnContainer}>
                    {this.props.leftButton}
                </View>

                <View style={styles.titleContainer}>
                    <Text style={[styles.title]}>{this.props.title}</Text>
                </View>

                <View  style={styles.btnContainer}>
                    {this.props.rightButton}
                </View>

            </View>
        );
    }

}

Navbar.defaultProps = {

};

const styles = StyleSheet.create({
    navBar:{
        height:50,
        backgroundColor:'#7B075E',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'stretch',
        //paddingHorizontal:15
    },
    btnContainer:{maxWidth:50,flex:1,justifyContent:'flex-start',alignItems:'stretch'},
    titleContainer:{flex:4,justifyContent:'center',flexDirection:'row', alignItems:'center'},
    title:{fontSize:19,fontWeight:'100',color:'white',textAlign:'center'},

});
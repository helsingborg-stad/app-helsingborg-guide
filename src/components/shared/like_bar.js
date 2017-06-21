/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class LikeBar extends Component{
    render(){
        return (
            <View style={styles.bar} >
                <TouchableOpacity style={styles.left}>
                    <Icon name="heart-o" size={25} color="red"/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.right}>
                    <Icon name="share" size={25}/>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    bar:{height:50,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10,
        backgroundColor:'white'
    },
    left:{flex:1,flexDirection:'row'},
    right:{flex:1,flexDirection:'row',justifyContent:'flex-end'},
});
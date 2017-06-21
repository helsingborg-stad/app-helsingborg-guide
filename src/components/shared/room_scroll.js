/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class RoomScroll extends Component{
    render(){
        return (
           <View style={styles.roomScroll}>
               <TouchableOpacity style={styles.searchBtnContainer}>
                   <Icon name="search" size={20}/>
               </TouchableOpacity>
               <View style={styles.scrollContainer}>
                   <ScrollView
                       contentContainerStyle={styles.scrollView}
                       horizontal={true}>
                       <TouchableOpacity>
                         <Text style={styles.text}>Room 01</Text>
                        </TouchableOpacity>
                       <TouchableOpacity>
                           <Text style={styles.text}>Room 02</Text>
                       </TouchableOpacity>
                       <TouchableOpacity>
                           <Text style={styles.text}>Room 03</Text>
                       </TouchableOpacity>
                       <TouchableOpacity>
                           <Text style={styles.text}>Room 04</Text>
                       </TouchableOpacity>
                   </ScrollView>
               </View>
           </View>
        );
    }

}

const styles = StyleSheet.create({
    roomScroll:{
        height:60,
        flexDirection:'row',
        backgroundColor:'#e4e4e4',
        paddingHorizontal:10
    },
    searchBtnContainer:{flex:1,justifyContent:'center'},
    scrollContainer:{
        flex:4,
        alignItems:'center'
    },
    scrollView:{alignItems:'center'},
    text:{ minWidth:120, fontSize:16, fontWeight:'bold' }

});
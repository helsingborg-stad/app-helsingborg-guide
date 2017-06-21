/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text,Image, StyleSheet, TouchableOpacity} from 'react-native';


export default class DetailedAvatarListItem extends Component{

    constructor(props){
        super(props);
        this.state={}
    }

    render(){
        return (
            <TouchableOpacity activeOpacity={0.6}
                              style={[styles.wrapper, this.props.style]}>
                <View style={styles.avatarContainer}>
                    <Image style={[styles.avatar]} source={this.props.source} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                    <View style={styles.bodyContainer}>
                        <Text style={styles.bodyText}>{this.props.body}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    wrapper:{
        //flex:1,
       minHeight:100,
        backgroundColor:'rgba(255,255,255,.7)',
        flexDirection:'row',
        justifyContent:'center'
    },
    avatarContainer:{
        flex:1,
        padding:10,
        justifyContent:'center',
        alignItems:'center'
    },
    avatar:{
        width:65,
        height:65,
        borderRadius:40,
        borderWidth:1,
        borderColor:'white',
    },
    contentContainer:{
        flex:4,
        padding:10
    },
    titleContainer:{
        flex:1,
    },
    title:{
        fontSize:14,
        fontWeight:'bold'
    },
    bodyContainer:{
        flex:2,
        paddingTop:7,
    },
    bodyText:{
        fontSize:11,
        fontWeight:'300'
    }

});
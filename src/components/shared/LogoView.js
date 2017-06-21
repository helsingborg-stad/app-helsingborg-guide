/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text,Image, StyleSheet} from 'react-native';


export default class LogoView extends Component{

    constructor(props){
        super(props);
        this.state={}
    }

    displayLogo(logoType, placeholder){
        if(!logoType)
            return (<Text style={styles.title}>{placeholder}</Text> );

        switch (logoType.mime_type){
            case 'image/svg+xml':
                return (<Text style={styles.title}>{placeholder}</Text>  );
            case 'image/png':
                return (
                    <Image source={{uri:logoType.url}}
                           resizeMethod={'scale'}
                           resizeMode={'stretch'}
                           style={{width:parseFloat(logoType.width/5), height:parseFloat(logoType.height/5)}}
                    />
                );
            default:
                return (<Text style={styles.title}>{placeholder}</Text>  );

        }
    }

    render(){
        return (
           this.displayLogo(this.props.logoType, this.props.placeHolder)
        );
    }

}

const styles = StyleSheet.create({
    title:{fontSize:23,fontWeight:'bold', textAlign:'center'},
});
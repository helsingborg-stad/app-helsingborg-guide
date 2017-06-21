/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image,Text, StyleSheet,Dimensions, ActivityIndicator} from 'react-native';

const FULL_WIDTH= Dimensions.get('window').width;
const FULL_HEIGHT= Dimensions.get('window').height;

export default class BackgroundImage extends Component{

    constructor(props){
        super(props);

        this.state ={
          loading:false
        };

        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);

    }

    onLoadStart(){
        this.setState({loading:true});
    }
    onLoadEnd(){
        this.setState({loading:false});

    }

    displaySpinner(){
       if(this.state.loading)
        return (
            <ActivityIndicator
                style={[styles.spinner]}
            />
        );
    }

    displayImage(){
        let source = this.props.source;

            let imageSize= {
                width:FULL_WIDTH,
                height:FULL_HEIGHT,
            };
        return(
            <Image
                style={[styles.image, imageSize]}
                source={source}
                blurRadius={this.props.blur}
                onLoadStart={this.onLoadStart}
                onLoadEnd ={this.onLoadEnd}
                resizeMethod={'scale'}
                resizeMode={'cover'}
            >
                {this.props.children}
                {this.displaySpinner()}

            </Image>
        );
    }

    render(){
        return (
            <View style={[styles.imageContainer,this.props.style]}>
                {this.displayImage()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    imageContainer:{
        flex:1,
        position:'absolute',
        top:0,
        left:0,
        zIndex:0,
        alignItems:'center',
        justifyContent:'center'
    },
    image:{
        alignItems:'center',
        justifyContent:'flex-start'
    },
    spinner:{
        flex:3,
        padding:10,
        alignItems:'center',
        justifyContent:'flex-start'
    }
});
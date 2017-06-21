/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image,Text, StyleSheet,Dimensions , ActivityIndicator} from 'react-native';
import OImage from './image';

const MAX_IMAGE_HEIGHT = Dimensions.get('window').height*(0.65);



export default class ImageView extends Component{

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


    _getOptWidth(width){
        return width * (Dimensions.get('window').width/width);
    }
    _getOptHeight(height){
        return height * (Dimensions.get('window').height/height);
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
        let uri = this.props.source;
        if(!uri||!uri.uri)
            uri = require('../../images/no-image-featured-image.png');
        return(
            <OImage
                style={[{
                        width:this._getOptWidth(this.props.width),
                        height:this._getOptHeight(this.props.height),
                        maxHeight:MAX_IMAGE_HEIGHT //25 is half navbar height
                    },styles.image]}
                source={uri}
                blurRadius={this.props.blur}
                onLoadStart={this.onLoadStart}
                onLoadEnd ={this.onLoadEnd}
            >
                {this.displaySpinner()}
                {this.props.children}
            </OImage>
        );
    }

    render(){
        return (
            <View style={styles.imageContainer}>
                {this.displayImage()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    imageContainer:{},
    image:{
        alignItems:'center',
        justifyContent:'center'
    },
    spinner:{flex:1,width:100,height:100}
});
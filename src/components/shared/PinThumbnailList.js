/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Image, Text, StyleSheet,TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ContentThumbnailPin from '../shared/contentThumbnailPin';


export default class PinThumbnailList extends Component{


    displayObjects(){
        if(!this.props.contentObjects || Object.keys(this.props.contentObjects).length==0)
            return;
        let contentObjects = this.props.contentObjects;
        let keys = Object.keys(contentObjects);
        let getMetric = (objectKey)=>{
            let metric;
            metric = this.props.metrics.find(item=>item.objectKey==objectKey);
            return metric?metric:{isVisited:false};
        };
        const createThumbnail = function (key) {
            let imageUri = null;
            let width ,height = 0;
            const metric = getMetric(key);
            ////console.log('metric',metric);
            if(contentObjects[key].image && contentObjects[key].image.length){
                const imageObj = contentObjects[key].image[0].sizes;
                imageUri = imageObj.medium;
                width = imageObj["medium-width"];
                height = imageObj["medium-height"];
            }

            let text = (
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={{fontSize:16,fontWeight:'300', marginVertical:3}}>{'#'+contentObjects[key].id}</Text>
                    <Text style={{fontSize:14, marginVertical:3}}>{contentObjects[key].title}</Text>
                </View>
            );

            return (
                <View key={key}
                    //activeOpacity ={0.8}
                                  //onPress={()=>{this._goToContentObjectScene(contentObjects[key], key)}}
                                  style={[styles.ContentThumbnailContainer]}>

                    <ContentThumbnailPin source={{uri:imageUri}}
                                         imageWidth={width}
                                         imageHeight={height}
                                         checked={metric.isVisited||false}>
                        {text}
                    </ContentThumbnailPin>
                    <Text>Hi there I am a performance text</Text>
                </View>

            );
        };
        const leftKeys = keys.slice(0,keys.length/2);
        const rightKeys = keys.slice(keys.length/2 );
        let leftList =  leftKeys.map(key=>{
            return createThumbnail(key);
        });
        let rightList =  rightKeys.map(key=>{
            return createThumbnail(key);
        });

        return (
            <View style={{flex:1,flexDirection:'row'}}>
                <View style={{flex:1, paddingLeft:20, paddingRight:10, paddingVertical:20}}>
                    {leftList}
                </View>
                <View style={{flex:1,  paddingLeft:10, paddingRight:20, paddingVertical:20}}>
                    {rightList}
                </View>
            </View>
        );

    };

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }


    render(){

        return (
            <View style={styles.objectsContainer}>
                {this.displayObjects()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    objectsContainer:{
        flex:1,
        //backgroundColor:'red',
        //flexWrap:'wrap',
        //flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom:20,
    },
    ContentThumbnailContainer:{
        //width:HALF_WIDTH,
        //height:220,
        //flexDirection:'row',

    },
});
/**
 * Created by msaeed on 2017-02-04.
 */
/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet,StatusBar, TouchableOpacity} from 'react-native';
import ViewContainer from '../shared/view_container'
import Navbar from '../shared/navbar'
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import pathHelper from '../../lib/polylineHelpers';


const markerImage = require('../../images/marker.png');


export default class MapScene extends Component{
    title = 'Map';
    constructor(props){
        super(props);
        this.state ={
            region:{
                latitude: 56.04765769999999,
                longitude:  12.6888389,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            markers:[]
        };
    }

    _onRegionChange(region) {
       // console.log('new region:',region);
        //this.setState({region:region });
    }

    _onMarkerPressed(data){
        console.log('marker pressed:',data);
    }

    componentDidMount(){
        this.setState({markers:this.props.markers});
    }

    _showMarkers(){
        if(this.state.markers)
        return this.state.markers.map((marker,index)=><MapView.Marker
            key ={index}
            coordinate={marker}
            image={markerImage}
        />)
    }

    _showPolyLine(step,index){
        const helper = pathHelper();
        return (<MapView.Polyline
                    key={index}
                    coordinates={ helper.decodePath(step.polyline.points)}
                    strokeColor="salmon"
                    strokeWidth={5}
                    onPress={(data)=>console.log('path is pressed', data)}
        />);
    }
    //
    // _showDirectionsPath(){
    //     const steps =  _DIRECTIONS.routes[0].legs[0].steps;
    //     return steps.map((step,index)=>this._showPolyLine(step,index));
    // }


    render(){

        const rightBtn = (
            <TouchableOpacity>
                <Icon name="search" size={20} color="white" />
            </TouchableOpacity>
        );

        const leftBtn = (
            <TouchableOpacity onPress={()=>this.props.navigator.pop()} >
                <Icon name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
        );
        return (
            <ViewContainer >
                <Navbar title={this.title}
                        leftButton={leftBtn}
                        rightButton={ rightBtn}
                />
                <View style={styles.mapViewContainer} >
                    <MapView
                        style={styles.map}
                        region={this.state.region}
                        onRegionChange={this._onRegionChange}
                        //cacheEnabled={true}
                    >
                        {this._showMarkers() }
                        {/*{this._showDirectionsPath()}*/}
                    </MapView>
                </View>
            </ViewContainer>
        );
    }

}

const styles = StyleSheet.create({
    mapViewContainer:{flex:1, justifyContent:'flex-start',alignItems:'stretch'},
    map:{flex:1}
});
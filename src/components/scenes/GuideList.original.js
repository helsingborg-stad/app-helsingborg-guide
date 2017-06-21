import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, ListView, Navigator, TouchableHighlight,TouchableOpacity, Image, StatusBar,Button , Linking, AsyncStorage } from 'react-native';

import * as guideActions from '../../actions/guideActions';
import { NativeModules } from 'react-native';
import styles from '../../styles/styles';
import GuideView from './GuideView';
import ViewContainer from '../shared/view_container';
import Navbar from '../shared/navbar';
import Thumbnail from '../shared/thumbnail';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import RoundedThumbnail from '../shared/thumbnail_rounded';
import {LocationService} from "../../services/locationService";
import RoundedBtn from '../shared/roundedBtn';
import MenuView from '../shared/MenuView';
import MenuContent from './MenuContent';
import {TimingService} from '../../services/timingService';
import {IS_WELCOMED} from "../../lib/my_consts";
import {LangService} from "../../services/langService";


const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let markersTimeout;
const TIMEOUT = 3000;
const THUMBNAIL_WIDTH = 250;


const markerImageActive = require('../../images/marker_active_3.png');
const markerImageInActive = require('../../images/marker_inactive.png');


class GuideList extends Component {
    static get defaultProps() {
        return {
          title: LangService.strings.APP_NAME
        };
    }

    locationService;
    timingService;
    markersTimeout;
    xCurrentOffset;

    constructor(props) {
    super(props);

    this.state = {
      guides: this.props.guides || [],
        region:{
            latitude: 56.04765769999999,
            longitude:  12.6888389,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        markers:this.props.markers,
        active:this.props.active,//guidegroup which is slided to.
        position:{},//geolocation
        menuVisible:false

    };

    this.locationService = LocationService.getInstance();
    this.timingService = TimingService.getInstance();
    this.renderRow = this.renderRow.bind(this);
    this.guidePress = this.guidePress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.guides.length != nextProps.guides.length) {
            this.setState({
                guides: nextProps.guides ,
                active:nextProps.active,
                markers:nextProps.markers
                });
        }
    }

    componentDidMount(){
        //console.log('page did mount');
        if(this.state.guides.length)
            this.markersTimeout = setTimeout(() => {
                this.focusMarkers(this.state.markers);
            }, TIMEOUT);
    }

    componentWillUnmount(){
        if(this.markersTimeout)
            clearTimeout(this.markersTimeout);

        this.locationService.clearWatch();
    }

    toggleMenu(){
        this.setState({menuVisible:!this.state.menuVisible});
    }



    sortGuideGroupsList(position){
        //this.setState({position});
        let guides =[];
        this.state.markers.forEach(marker=>{
            let mathDistance = this.locationService.getMathDistance(position.coords,marker.location);
            let guide = this.state.guides.find(item=>item.id == marker.guideGroupId);
            guide['distance'] = mathDistance;
            guides.push(guide);
        });
        guides.sort((a,b)=>a.distance-b.distance);
        this.setState({guides, active:guides[0]});
        this.scrollToGuideThumbnail(0, true);
    }

    guidePress(guide) {
    this.props.navigator.push({
      component:GuideView,
      title:'Guide',
      passProps:{guide:guide}
    })
  }

//#########################
//Map Methods
//##########################

    _onRegionChange(region) {
        // //console.log('new region:',region);
        //this.setState({region:region });
    }

    _onMarkerPressed(marker){
        //console.log('marker pressed:',this.state.guides);
        if(this.state.guides && this.state.guides.length){
            let guideIndex = this.state.guides.findIndex(item=>item.id == marker.guideGroupId);
            this.scrollToGuideThumbnail(guideIndex, false)
        }

    }

    scrollToGuideThumbnail(index, animated){
        let shift = THUMBNAIL_WIDTH * index;
        this.guideListView.scrollTo({x:shift, animated:animated});
    }


    _showMarkers(){

        if(!this.state.markers.length || !Object.keys(this.state.active).length )
            return null;
        let activeGroupGuide = this.state.active.id;
        return this.state.markers.map((marker,index)=>{
            if(!marker.location.latitude||!marker.location.latitude)
                return null;
            let image = (marker.guideGroupId==activeGroupGuide)?markerImageActive:markerImageInActive;
            return(
                <MapView.Marker
                    key ={marker.guideGroupId}
                    coordinate={marker.location}
                    image={image}
                    identifier={marker.guideId}
                    onPress={()=>this._onMarkerPressed(marker)}
                />
            );
        });
    }

    focusMarkers(markers){
        //console.log('markers from focus markers method',this.state.markers);

        const edgePadding = {
            top: 100,
            right: 50,
            bottom: 20,
            left: 50
        };
        const options = { edgePadding: edgePadding, animated: true };
        if(markers && markers.length){}
        this.map.fitToCoordinates(markers.map(marker=>marker.location), options);


    }

    onMapLongPress(){
        this.locationService.getGeoLocation().then(position=> {
            this.sortGuideGroupsList(position);
        });
    }

//##########################################

    openGoogleMapApp(lat,lng,slug){

        let url = 'google.navigation:q='+lat+','+lng;

        //let url =  encodeURI('geo:'+lat+','+lng+'?saddr='+slug);
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                //console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

//########################################3
    displayLogo(guideGroup){
        let logoType = guideGroup.apperance.logotype;
        if(!logoType)
            return (<Text style={styles.title}>{guideGroup.name}</Text>  );

        switch (logoType.mime_type){
            case 'image/svg+xml':
            return (<Text style={styles.title}>{guideGroup.name}</Text>  );
            case 'image/png':
            return (
                <Image source={{uri:logoType.url}} style={{width:parseFloat(logoType.width/5), height:parseFloat(logoType.height/5)}}/>
            );
            default:
            return (<Text style={styles.title}>{guideGroup.name}</Text>  );

        }
    }
    displayOpeningTime(guideGroup){
        const openingList = guideGroup._embedded.location[0].open_hours;
        const expList = guideGroup._embedded.location[0].open_hour_exceptions;
        let opening = this.timingService.getOpeningHours(openingList,expList);
        let text = opening?(opening):'';
        return (
            <View style={styles.openTimeContainer}>
                <Text style={styles.openTimeText}>{text}</Text>
            </View>
        );
    }
    displayComingSoon(guideGroup){
        if(!guideGroup.settings.active)
        return (
            <View style={{flex:1, padding:5, borderRadius:0, position:'absolute',top:-29, left:0, backgroundColor:'#A84C98'}}>
                <Text style={{fontWeight:'bold',color:'white'}}>{LangService.strings.COMING_SOON}</Text>
            </View>
        );
    }

    //ViewList render method.
    renderRow(rowData, section) {
       return <Thumbnail
           key={rowData.id}
           imageSource={{uri:rowData.apperance.image.url}}
           title={rowData.name}
           onPress={()=>{ this.guidePress(rowData)}}>
           <View style={styles.titleContainer}>
               <RoundedBtn style = {{position:'absolute', top:-95,right:10, zIndex:100, width:40, height:40, backgroundColor:'#D35098'}}
                           active = {(<Icon name="directions" size={20} color="white" />)}
                           idle = {(<Icon name="directions" size={20} color="white" />)}
                           onPress={()=>{this.openGoogleMapApp(rowData._embedded.location[0].latitude,rowData._embedded.location[0].longitude,rowData._embedded.location[0].slug)}}/>
               {this.displayLogo(rowData)}
               {this.displayOpeningTime(rowData)}
               {this.displayComingSoon(rowData)}
           </View>


           {/*{this.displaySmallImages(rowData)}*/}
       </Thumbnail>
  }

    onScroll(e){

        let xOffset = e.nativeEvent.contentOffset.x;
        let index = Math.abs(parseInt(xOffset/(THUMBNAIL_WIDTH-20)));

        //console.log('active index', (xOffset/(THUMBNAIL_WIDTH)));
        //console.log('offset', xOffset);

        if(this.state.guides[index].id!=this.state.active.id){
            this.setState({active:this.state.guides[index]});
            let correspondingMarker = this.state.markers.find(marker=>marker.guideGroupId == this.state.guides[index].id);
            this.map.animateToCoordinate(correspondingMarker.location);
        }

    }

    render() {
        let rightBtn = (
            <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}}
                              onPress={()=>this.toggleMenu()}>

                <Icon name="menu" size={20} color="white" />
            </TouchableOpacity>
        );
        return (
          <ViewContainer >
            <Navbar title={GuideList.defaultProps.title}
                    rightButton={ rightBtn}
                    backgroundColor='#7B075E'
            />

              <MenuView visible={this.state.menuVisible}>
                 <MenuContent navigator={this.props.navigator} onToggle={this.toggleMenu.bind(this)}/>
              </MenuView>

              <View style={styles.mapViewContainer} >
                  <MapView
                      style={styles.map}
                      ref={ref => { this.map = ref; }}
                      initialRegion={this.state.region}
                      showsUserLocation={true}
                      onRegionChange={this._onRegionChange}
                      onLongPress={()=>this.onMapLongPress()}
                  >
                      {this._showMarkers() }
                      {/*{this._showDirectionsPath()}*/}
                  </MapView>
              </View>

             <View style={styles.listViewContainer}>
                 <ListView
                     contentContainerStyle={styles.guideScroll}
                     ref={ref => { this.guideListView = ref; }}
                     enableEmptySections={true}
                     dataSource={ds.cloneWithRows(this.state.guides)}
                     renderRow={this.renderRow}
                     horizontal={true}
                     onScroll={(e)=>this.onScroll(e)}
                     scrollEventThrottle={1}
                     //pageSize={1}
                     //pagingEnabled={true}
                     //snapToInterval={250}
                    // snapToAlignment="center"
                     //renderSeparator={()=><View style={{width:50,height:250}}></View>}
                     showsHorizontalScrollIndicator={false}
                 />
             </View>
          </ViewContainer>
        )
    }
}

//##########################################
function makeMarkersFromLocations(guideGroups){
    if(!guideGroups || !guideGroups.length)
        return [];
    return guideGroups.map(item=>{
        let marker ={location:{latitude:null,longitude:null},guideGroupId:item.id};
        if(!item._embedded || !item._embedded.location.length)
            return marker;
        let location = item._embedded.location[0];
        marker.location.latitude = parseFloat( location.latitude);
        marker.location.longitude = parseFloat(location.longitude);
        return marker;
    });
}

//store config

function mapStateToProps(state, ownProps) {
    //console.log('state',state);
    return {
        guides: state.guides || [] ,
        active:state.guides[0] ||{},
        markers:makeMarkersFromLocations(state.guides|| [])
    };
}
function mapDispatchToProps(dispatch) {
  return {
    guideActions: bindActionCreators(guideActions, dispatch),

  };
}
export default connect(mapStateToProps, mapDispatchToProps)(GuideList);
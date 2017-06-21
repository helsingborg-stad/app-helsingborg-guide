import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, ListView, Navigator,NetInfo, TouchableHighlight,TouchableOpacity, Image, StatusBar,Button , Linking, AsyncStorage,Platform } from 'react-native';

import * as guideActions from '../../actions/guideActions';
import * as subLocationActions from '../../actions/subLoactionActions';
import * as internetActions from '../../actions/internetActions';
import * as menuActions from '../../actions/menuActions';

import { NativeModules } from 'react-native';
import styles from '../../styles/styles';
import GuideView from './GuideView';
import ViewContainer from '../shared/view_container';
import LogoView from '../shared/LogoView';
import Navbar from '../shared/navbar';
import Thumbnail from '../shared/thumbnail';
import SlimNotificationBar from '../shared/SlimNotificationBar';
import NoInternetText from '../shared/noInternetText';
import MapThumbnailsView from '../shared/MapThumbnailsView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedBtn from '../shared/roundedBtn';
import {TimingService} from '../../services/timingService';
import {LangService} from "../../services/langService";

class GuideList extends Component {
    static get defaultProps() {
        return {
          title: LangService.strings.APP_NAME
        };
    }

    timingService;

    constructor(props) {
    super(props);

    this.state = {
        guides: this.props.guides || [],
        active:this.props.active || [],
        markers:this.props.markers || {},
        langChanged:false,
        internet:this.props.internet,
    };

    this.timingService = TimingService.getInstance();
    this.renderRow = this.renderRow.bind(this);
    this.guidePress = this.guidePress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.guides.length != nextProps.guides.length)||this.state.langChanged) {
            this.setState({
                guides: nextProps.guides ,
                active:nextProps.active,
                markers:nextProps.markers,
                langChanged:false
                });
        }
        if(nextProps.internet!=this.state.internet)
            this.setState({internet:nextProps.internet});

    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }



    toggleMenu(){
        this.props.menuActions.toggleMenu();
    }

    guidePress(guide) {
        this.props.navigator.push({
          component:GuideView,
          title:'Guide',
          passProps:{guide:guide}
        })
  }


//##########################################

    openGoogleMapApp(lat,lng,slug){
        let daddr = lat+','+lng;

        let myPosition = this.props.geolocation;
        let saddr='';
        if(myPosition)
            saddr = myPosition.coords.latitude+','+myPosition.coords.longitude;

        let url ='google.navigation:q='+daddr;
        if(Platform.OS=='ios')
            url = 'http://maps.apple.com/?t=m&dirflg=d&daddr='+daddr+'&saddr='+saddr;

        console.log('geo url',url);
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

//########################################3
    displayLogo(guideGroup){
        let logoType = guideGroup.apperance.logotype;
        return (<LogoView logoType={logoType} placeHolder={guideGroup.name}/>);
    }
    displayOpeningTime(guideGroup){
        if(!guideGroup)
            return null;
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
            <View style={{position:'absolute',bottom:0,left:0, height:27}}>
                <View style={{flex:1,paddingHorizontal:7,justifyContent:'center',backgroundColor:'#A84C98'}}>
                    <Text style={{fontWeight:'300',color:'white', textAlign:'center'}}>{LangService.strings.COMING_SOON}</Text>
                </View>
            </View>
        );
    }

    //ViewList render method.
    renderRow(rowData, section) {

        const location = rowData._embedded.location[0];

        let button = (
            <RoundedBtn style = {styles.navigateBtn}
                        active = {(<Icon name="directions" size={20} color="white" />)}
                        idle = {(<Icon name="directions" size={20} color="white" />)}
                        onPress={()=>{this.openGoogleMapApp(location.latitude,location.longitude,location.slug)}}/>
        );
        let label = this.displayComingSoon(rowData);

        return <Thumbnail key={rowData.id}
                       imageSource={{uri:rowData.apperance.image.sizes.medium}}
                       title={rowData.name}
                        buttonOverlay={button}
                        labelOverlay={label}
                       onPress={()=>{ this.guidePress(rowData)}}>

           <View style={styles.titleContainer}>
               {this.displayLogo(rowData)}
               {this.displayOpeningTime(rowData)}
           </View>

       </Thumbnail>
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

              <SlimNotificationBar visible={!this.state.internet&&this.state.guides.length} style={{top:50}}>
                  <NoInternetText/>
              </SlimNotificationBar>

            <Navbar title={GuideList.defaultProps.title}
                    rightButton={ rightBtn}
                    backgroundColor='#7B075E'
            />
              <MapThumbnailsView items={this.state.guides}
                                 active={this.state.active}
                                 markers={this.state.markers}
                                 connected={this.state.internet}
                                 renderRow={this.renderRow}/>


          </ViewContainer>
        )
    }
}

//##########################################
function makeMarkersFromLocations(guideGroups){
    if(!guideGroups || !guideGroups.length)
        return [];
    return guideGroups.map(item=>{
        let marker ={location:{latitude:null,longitude:null},itemId:item.id};
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
   
    return {
        guides: state.guides || [] ,
        active:state.guides[0] ||{},
        markers:makeMarkersFromLocations(state.guides|| []),
        internet:state.internet.connected,
        geolocation:state.geolocation

    };
}
function mapDispatchToProps(dispatch) {
  return {
    guideActions: bindActionCreators(guideActions, dispatch),
      subLocationActions: bindActionCreators(subLocationActions, dispatch),
      internetActions:  bindActionCreators(internetActions, dispatch),
      menuActions:  bindActionCreators(menuActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(GuideList);
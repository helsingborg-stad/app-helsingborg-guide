import React, { Component } from 'react';
import { View,Modal, Text, Button, Navigator, TouchableOpacity,TouchableHighlight, StyleSheet,ScrollView, Dimensions ,LayoutAnimation} from 'react-native';

import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewContainer from '../shared/view_container'
import Navbar from '../shared/navbar'
import ImageView from '../shared/image_view'
import ContentThumbnail from '../shared/contentThumbnail';
import ContentThumbnailPin from '../shared/contentThumbnailPin';
import PinThumbnailList from '../shared/PinThumbnailList';

import ObjectView from "./ObjectView";
import ButtonsBar from '../shared/btn_bar'
import ButtonsBarItem from '../shared/btn_bar_item'
import Footer from '../shared/footer'
import RoundedBtn from '../shared/roundedBtn';
import Keypad from '../shared/KeyPad';
import Fab from '../shared/fab'
import {LangService} from "../../services/langService";
import MediaPlayer from '../shared/MediaPlayer'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as audioActions from "../../actions/audioActions";
import * as subLocationActions from '../../actions/subLoactionActions';
import {MediaService} from '../../services/mediaService';
import {BeaconService} from '../../services/beaconService';


const HALF_WIDTH = Dimensions.get('window').width/2;
const THIRD_WIDTH = Dimensions.get('window').width/3;
const LIST = 1;
const GRID = 2;
const BEACON_REGION_ID="edd1ebeac04e5defa017";

class SubLocationView extends Component {
  static get defaultProps() {
    return {
      title: 'SubLocation'
    };
  }

  currentYOffset;
    mediaService;
    beaconService;

  constructor(props) {
    super(props);

    this.state = {
        subLocation:this.props.subLocation,
        view:LIST,
        viewArticle:false,
        keypadVisible:false,
        fabVisible:true,
        audio:this.props.audio,
        closestBeacon:{}
    };
    this.currentYOffset = 0;
      this.mediaService = MediaService.getInstance();
      this.beaconService = BeaconService.getInstance();
      this.onAudioCompleted = this.onAudioCompleted.bind(this);
      this.onBeaconRangingResult = this.onBeaconRangingResult.bind(this);
      this.startListeningToBeacons = this.startListeningToBeacons.bind(this);
      this.onBeaconServiceConnected = this.onBeaconServiceConnected.bind(this);


  }

  componentDidMount(){
    this.listenToAudioEvents();
    //this.initBeaconService();
  }
    componentWillUnmount(){
        this.releaseAudioFile();
        //this.unbindBeaconService();
    }

    componentWillReceiveProps(nextProps) {
        //console.log('SubLocationView received a new props');
        this.setState({
            audio: nextProps.audio ,
            //subLocation:nextProps.subLocation
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    onAudioCompleted(){
        this.releaseAudioFile();
    }
    releaseAudioFile(){
        this.mediaService.unSubscribeOnCompleted(this.onAudioCompleted);

        if(!this.state.audio.hasAudio)
            return;

        let title = '';
        let avatar_url =  '';
        let audio = {hasAudio:false,title,avatar_url, isPlaying:false};
        this.props.audioActions.releaseAudioFile(audio);
        this.mediaService.release();
    }
    listenToAudioEvents(){
        this.mediaService.onCompleted(this.onAudioCompleted);
    }

    _goToContentObjectScene(contentObject, objectKey){
        this.props.navigator.push({
            component: ObjectView,
            title:'ContentObject',
            type:'modal',
            passProps:{contentObject, objectKey , subLocationId:this.state.subLocation.id}
        });
    }

    changeView(view){
        this.setState({view:view});
    }

    //############################################
    //BEACON SEGMENT
    //############################################
    initBeaconService(){
        this.beaconService.init();
        this.beaconService.onRangingResult(this.onBeaconRangingResult);
        this.beaconService.onServiceConnected(this.onBeaconServiceConnected);
    }
    unbindBeaconService(){
        this.stopListeningToBeacons();
        this.beaconService.unSubscribeOnRangingResult(this.onBeaconRangingResult);
        this.beaconService.unSubscribeOnServiceConnected(this.onBeaconServiceConnected);
        this.beaconService.unbind();
    }
    startListeningToBeacons(){
        this.beaconService.startRanging(BEACON_REGION_ID);
    }
    stopListeningToBeacons(){
        this.beaconService.stopRanging(BEACON_REGION_ID);
    }

    onBeaconRangingResult(data){
        let closest = this.beaconService.getTheClosest(data.beacons || []);
        // if(data.beacons.length)
        //     console.log('beacons data', data.beacons.map(item=>{return{bid:item.bid,distance:item.distance}}));
       console.log('new closest beacons data', closest);
        //console.log('current closest beacons data', this.state.closestBeacon);

        if(!closest)
            return;
        if(closest.nid != '0x'+this.state.subLocation.guideBeacon.nid)
            return;
         if(closest.bid == this.state.closestBeacon.bid && closest.nid == this.state.closestBeacon.nid)
             this.setState({closestBeacon:closest});
        if( ((parseFloat(this.state.closestBeacon.distance)-(parseFloat(closest.distance)))) < 0)
            return;
        console.log('new beacon will take place');
        this.setState({closestBeacon:closest});
    }
    onBeaconServiceConnected(){
        this.startListeningToBeacons();
    }
    displayNearByObjects(){
        return null;
        let subAttractions = this.state.subLocation.subAttractions;
        let contentObjects = this.state.subLocation.contentObjects;
       // console.log('subAttractions',subAttractions);

        if(!contentObjects || !Object.keys(contentObjects).length ||
            !subAttractions || !subAttractions.length ||
            !Object.keys(this.state.closestBeacon).length)
            return;


        const nid = this.state.closestBeacon.nid;
        const nearByBID =this.state.closestBeacon.bid;
        let subAttraction = subAttractions.find(item=> '0x'+item.bid == nearByBID);
        if(!subAttraction)
            return;

        let contents = subAttraction.content[0].split(',');
        let getMetric = (objectKey)=>{
            let metric;
            metric = this.props.metrics.find(item=>item.objectKey==objectKey);
            return metric?metric:{isVisited:false};
        };
        return contents.map(key=>{
            let imageUri = null;
            const metric = getMetric(key);
            ////console.log('metric',metric);
            if(contentObjects[key].image && contentObjects[key].image.length)
                imageUri = contentObjects[key].image[0].sizes.thumbnail;
            let _width;
            let _height;
            if(this.state.view==LIST){
                _width = HALF_WIDTH;
                _height=220;
            }

            else if(this.state.view==GRID){
                _width = THIRD_WIDTH;
                _height = THIRD_WIDTH;
            }

            let text = (
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={{fontSize:16,fontWeight:'300', marginVertical:3}}>{'#'+contentObjects[key].id}</Text>
                    <Text style={{fontSize:14, marginVertical:3}}>{contentObjects[key].title}</Text>
                </View>
            );
            if(this.state.view==GRID)
                text = null;
            return (
                <TouchableOpacity key={key}
                    //activeOpacity ={0.8}
                                  onPress={()=>{this._goToContentObjectScene(contentObjects[key], key)}}
                                  style={[styles.ContentThumbnailContainer, {width:_width, height:_height}]}>

                    <ContentThumbnail imageSource={{uri:imageUri}} checked={metric.isVisited||false}>
                        {text}
                    </ContentThumbnail>
                </TouchableOpacity>

            );
        });
    };

//###############################################################

    displayBtnBar(){
        return(
            <ButtonsBar>

                <ButtonsBarItem onPress={()=>{this.changeView(GRID)}}
                                name="th"
                                color="#7B075E"
                                size={25}
                />
                <ButtonsBarItem onPress={()=>{this.changeView(LIST)}}
                                name="th-large"
                                color="#7B075E"
                                size={25}
                />
                <ButtonsBarItem onPress={()=>{}}
                                name="heart-o"
                                color="#7B075E"
                                size={25}
                />
            </ButtonsBar>
        );
    }
    displayMainImage(){
        console.log('render image');
        let images = this.state.subLocation.guide_images;
        ////console.log('images',images);
        if( images && images.length)
            return (
                <ImageView source={{uri:images[0].url}}   width={images[0].width} height={images[0].height}/>
            );
        return null;
    }
    displayArticle(){
        const article = (
            <View style={styles.articleContainer}>

                <Text style={{fontSize:19,lineHeight:21, marginVertical:10}}>{LangService.strings.ABOUT+' '+this.state.subLocation.title.plain_text}</Text>
                <Text style={styles.article}>{this.state.subLocation.description_plain}</Text>
            </View>
        );

        if(this.state.viewArticle)
            return article;
        else return null;
    }
    displayCloseBtn(){

        const disabled = (!this.state.subLocation.description_plain ||this.state.subLocation.description_plain=='' );
        return (
            <View style={styles.closeBtnContainer}>
                <RoundedBtn
                    disabled={disabled}
                    active = {(<Icon name="times" size={20} color="white" />)}
                    idle = {(<Icon name="info" size={20} color="white" />)}
                    onPress={()=>this.toggleArticleView()}/>
            </View>
        );


    }
    toggleArticleView(){
        this.setState({viewArticle:!this.state.viewArticle});
    }
    displayKeypad(){
        if(this.state.keypadVisible)
            return(
                <Keypad onClose={()=>this.toggleKeypadVisibility()}/>
            );
        return null
    }
    toggleKeypadVisibility(){
        this.setState({keypadVisible:!this.state.keypadVisible})
    }
    displayAudioPlayer(){
        const player = (
            <MediaPlayer onClosePress={this.onAudioCompleted} />
        );
        if(this.state.audio.hasAudio)
            return player;
    }
    onScroll(e){
        const TOUCH_THRESHOLD = 10;
        const SCROLL_THRESHOLD = 250;
        let yOffset = e.nativeEvent.contentOffset.y;
        let visible= this.state.fabVisible;
        if(yOffset>SCROLL_THRESHOLD && yOffset > this.currentYOffset+TOUCH_THRESHOLD && this.state.fabVisible){
            visible = false;
        }
        else if(yOffset < this.currentYOffset-TOUCH_THRESHOLD && !this.state.fabVisible){
          visible = true;
        }
        LayoutAnimation.easeInEaseOut();
        this.setState({fabVisible:visible});
        this.currentYOffset = yOffset;

    }

    displayFabs(){
        if(this.state.fabVisible)
        return (
            <Fab visible={this.state.fabVisible}>
                <RoundedBtn style = {styles.fabBtn}
                            active = {(<Icon name="search" size={20} color="white" />)}
                            idle = {(<Icon name="search" size={20} color="white" />)}
                            onPress={()=>{this.toggleKeypadVisibility()}}/>
                <RoundedBtn style = {styles.fabBtn}
                            isActive={this.state.viewArticle}
                            disabled={!this.state.subLocation.description_plain ||this.state.subLocation.description_plain=='' }
                            active = {(<Icon name="times" size={20} color="white" />)}
                            idle = {(<Icon name="info" size={20} color="white" />)}
                            onPress={()=>this.toggleArticleView()}/>
                <RoundedBtn style = {styles.fabBtn}
                            active = {(<Icon name="download" size={20} color="white" />)}
                            idle = {(<Icon name="download" size={20} color="white" />)}
                            onPress={()=>{}}/>
            </Fab>
        );
    }


    display(){
      const leftBtn = (
          <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}}
                            onPress={()=>this.props.navigator.pop()}>
              <Icon name="chevron-left" size={20} color="white" />
          </TouchableOpacity>
      );

      if(this.state.subLocation && Object.keys(this.state.subLocation).length ){
         return (
             <ViewContainer >
                 <Navbar title={this.state.subLocation.guidegroup[0].name}
                         leftButton={leftBtn}
                         backgroundColor='#7B075E'
                 />
                 <View style={{flex:1}}>
                     <ScrollView contentContainerStyle={styles.scrollView}
                                 onScroll={(e)=>this.onScroll(e)}>
                         <View style={styles.imageViewContainer} >
                             {this.displayMainImage()}
                         </View>

                         <View style={styles.bodyContainer}>
                             <View style={styles.titleContainer}>
                                 <Text style={styles.title}>{this.state.subLocation.title.plain_text}</Text>
                             </View>
                             {this.displayArticle()}
                             <View style={styles.nearByTextContainer}>
                                 <Text style={styles.nearByText}>{LangService.strings.SOMETHING_NEAR_BY}</Text>
                             </View>
                             <View style={styles.objectsContainer}>
                                 {this.displayNearByObjects()}
                             </View>
                             <View style={styles.nearByTextContainer}>
                                 <Text style={styles.nearByText}>{"List"}</Text>
                             </View>

                             <PinThumbnailList contentObjects={this.state.subLocation.contentObjects}
                                               metrics={this.props.metrics}/>
                         </View>
                     </ScrollView>
                     {this.displayFabs()}
                     {/*{this.displayKeypad()}*/}
                 </View>


                 <Footer>
                     {this.displayAudioPlayer()}
                 </Footer>
             </ViewContainer>
         );
      }

      return null;
  }

  render() {
    return (
        this.display()
    )
  }
}

const styles = StyleSheet.create({
    scrollView:{},
    imageViewContainer:{maxHeight:250,flex:1,backgroundColor:'#c60b05'},
    bodyContainer:{
        flex:1,

        alignItems:'stretch',
        backgroundColor:'white'
    },
    titleContainer:{flex:1, paddingHorizontal:34, paddingVertical:28},
    title:{fontSize:22,fontWeight:'300',lineHeight:26},
    articleContainer:{flex:4, paddingHorizontal:34, paddingVertical:10},
    article:{fontSize:14,lineHeight:25},
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
    closeBtnContainer:{
        flex:1,
        alignItems:'center',
        paddingTop:20,
        paddingBottom:40,
        borderBottomWidth:4,
        borderBottomColor:'#ebebeb',
    },
    nearByTextContainer:{paddingHorizontal:34, paddingVertical:20,justifyContent:'center'},
    nearByText:{fontSize:18,lineHeight:21},
    fabBtn:{width:40, height:40 , backgroundColor:'#D35098'}


});

//store config
function getSubLocation(subLocations,id) {
    return subLocations.find(item=>item.id == id );
}

function mapStateToProps(state, ownProps) {
    return {
        audio: state.audio ,
        subLocation:getSubLocation(state.subLocations,ownProps.subLocationId),
        metrics:state.metrics

    };
}
function mapDispatchToProps(dispatch) {
    return {
        audioActions: bindActionCreators(audioActions, dispatch),
        subLocationActions: bindActionCreators(subLocationActions, dispatch),

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SubLocationView);

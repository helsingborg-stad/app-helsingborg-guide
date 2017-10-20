import React, { Component } from 'react';
import { View, Text, Button, Navigator,Image, TouchableOpacity,StyleSheet,ScrollView,Dimensions ,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewContainer from '../shared/view_container'
import Navbar from '../shared/navbar'
// import PhotoView from 'react-native-photo-view';
import {FetchService} from "../../services/FetchService";


const MAX_SCALE = 2.5;
const MIN_SCALE = 0.95;
const FULL_WIDTH = Dimensions.get('window').width;

export default class ImageScene extends Component {

    fetchService;

  constructor(props) {
    super(props);
    this.state = {
        source:null
    };

    this.fetchService = FetchService.getInstance();
  }

    componentDidMount(){
        this.setSource();
     }


        //not used
       loadFile(fullPath){
            if(Platform.OS=='ios'){
                this.fetchService.readFile(fullPath).then(data=>{
                    this.setState({source:{uri:'data:image/png;base64,'+data}});
                });
            }else if(Platform.OS=='android'){
                this.setState({source:{uri:'file://'+fullPath}});
            }
        }


    setSource(){
        let uri = this.props.image.sizes.large;
        if(typeof uri=='string'){
            this.fetchService.isExist(uri).then(exist=>{
                let fullPath = this.fetchService.getFullPath(uri);
                if(exist){
                    this.setState({source:{uri:'file://'+fullPath}});
                }else {
                    this.setState({source:{uri :uri}});
                }

            })
        }
        else
            this.setState({source : require('../../images/no-image-featured-image.png')});


    }


    render() {
        let sizes = this.props.image.sizes;
        let width = parseInt(sizes['large-width']);
        let height = parseInt(sizes['large-height']);
        let scale = width/FULL_WIDTH;

      const leftBtn = (
          <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}}
                            onPress={()=>this.props.navigator.pop()}>
              <Icon name="chevron-left" size={20} color="white" />
          </TouchableOpacity>
      );

      return (
          <ViewContainer style={styles.mainContainer}>
              <Navbar title={this.props.image.caption}
                      leftButton={leftBtn}
                      backgroundColor='rgba(0,0,0,0.4)'

              />
              {/* <PhotoView
                  source={this.state.source}
                  minimumZoomScale={MIN_SCALE}
                  maximumZoomScale={MAX_SCALE}
                  androidScaleType="centerInside"
                  onLoad={() => {}}
                  style={{flex:1,width:width/scale,height:height/scale}} /> */}

          </ViewContainer>
      );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'black'
    },

});

/**
 * Created by msaeed on 2017-02-04.
 */
/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, ScrollView, Button, Dimensions, Image, TouchableOpacity,  AsyncStorage} from 'react-native';
import ViewContainer from '../shared/view_container'
import FirstInstructionSlide from '../shared/FirstInstructionSlide'
import NormalInstructionSlide from '../shared/NormalInstructionSlide'
import Swiper from 'react-native-swiper';
import GuideList from "./GuideList";
import {IS_WELCOMED} from '../../lib/my_consts';
import {LangService} from "../../services/langService";
import ColoredBar from "../shared/ColoredBar";


const STYLES = [
    {backgroundColor: '#7B075E'},
    {backgroundColor: '#A61380'},
    {backgroundColor: '#c44f8a'},

];

const IMAGE1 = require('../../images/firstInstructionImage.png');
const FULL_HEIGHT = Dimensions.get('window').height;

export default class WelcomeView extends Component{

    constructor(props){
        super(props);
        this.state = {
            index:0,
            total:0
        };
        this._onMomentumScrollEnd=this. _onMomentumScrollEnd.bind(this);
    }

    componentDidMount(){
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.index ==0 || nextState.index==1||nextState.index==nextState.total-1 || nextState.index== nextState.total-2)
            return true;

        return false;
    }

    skipPress() {
        const mainRoute = {
            title: 'GuidesList',
            type:'fade',
            component:GuideList
        };
        AsyncStorage.setItem(IS_WELCOMED,JSON.stringify(true));
        this.props.navigator.resetTo(mainRoute);
    }


    displaySlides(){
        let instructions = LangService.instructions.steps;
        return instructions.map((item,index)=>{
            let btnText = (index==instructions.length-1)?LangService.strings.LETS_GO:LangService.strings.JUMP_OVER;
            if(index==0)
            return (<FirstInstructionSlide key={index} styler={STYLES[index]}
                                           content={item.content}
                                           closeBtnText={btnText}
                                           backgroundImageSource={IMAGE1}
            />);

            return (<NormalInstructionSlide key={index} styler={STYLES[index]}
                                           content={item.content}
                                           thumbnailSource={item.thumbnail}
                                           closeBtnText={btnText}
                                            onBtnPress={()=>this.skipPress()}
                                           backgroundImageSource={item.background}
            />);

        });
    }

    _onMomentumScrollEnd(e,state,context){
        this.setState({index:context.state.index, total:context.state.total});
    }

    displaySkipBtn(){

        if(this.state.index==0)
            return <View></View>;
       
        return (
            <View  style={styles.btnContainer}>
                <TouchableOpacity onPress ={()=>this.skipPress()}>
                    <Text style={styles.btnText}>
                        {(this.state.index==this.state.total-1)?LangService.strings.LETS_GO:LangService.strings.JUMP_OVER}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    displayColorBar(){
        return(
            <View style={{position:'absolute', height:FULL_HEIGHT,width:20, top:0,left:0}}>
                <ColoredBar visible={true}/>
            </View>
        );
    }

    render(){

        const dot = (<View style={styles.dot} /> );
        const activeDot = (<View style={styles.activeDot} />);

        return (
             <ViewContainer style={[styles.wrapper]} >

                 <Swiper style={styles.swiper}
                         onMomentumScrollEnd ={this._onMomentumScrollEnd}
                         loop={false}
                         dot = {dot}
                         paginationStyle={styles.pagination}
                         activeDot = {activeDot}
                         showsButtons={false}>
                     {this.displaySlides()}

                 </Swiper>
                 {this.displaySkipBtn()}
                 {this.displayColorBar()}

             </ViewContainer>
        );
    }

}

const styles = StyleSheet.create({
    wrapper: {
        flex:1,
    },
    swiper: {
        flex:1,
        backgroundColor: '#7B075E',

    },
    dot:{backgroundColor:'white',
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 6,
        marginBottom: 6
    },
    activeDot:{backgroundColor: '#D35098',
        width: 14,
        height: 14,
        borderRadius: 7,
        marginLeft: 11,
        marginRight:11,
        marginTop: 7,
        marginBottom: 7
    },
    pagination:{
        top:300
    },
    btnContainer:{
        flex:1,
        position:'absolute',
        bottom:Dimensions.get('window').width*(.2),
        width:Dimensions.get('window').width,
        left:0,
        //paddingVertical:20,
        //backgroundColor:'red',
        backgroundColor:'rgba(0,0,0,0)',
        alignItems:'center',
        justifyContent:'center',
    },
    btnText:{
        color: '#fff',
        fontSize: 14,
        lineHeight:23,
        borderBottomWidth:1,
        borderBottomColor:'white'
    },

});
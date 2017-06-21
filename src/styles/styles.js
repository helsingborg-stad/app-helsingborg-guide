import { StyleSheet } from 'react-native';

//########### THIS STYLES SHEET IS NOT GLOBAL IS THE ONE USED IN THE GUIDELIST VIEW
//######################################################
//######################################################

export default StyleSheet.create(styles = {

    mapViewContainer:{flex:4, justifyContent:'flex-start',alignItems:'stretch'},
    map:{flex:1},
    openTimeContainer:{paddingVertical:20},
    openTimeText:{fontSize:16,fontWeight:'300',lineHeight:19},

    guideList: {
        flex:1
    },

    listViewContainer:{
        flex:3
    },

    guideScroll: {
        justifyContent:'flex-start',
        alignItems:'center',
        paddingHorizontal:50,
        backgroundColor:'#fefefe'
    },

    titleContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:1,
        //backgroundColor:'blue',
    },
    title:{fontSize:23,fontWeight:'bold', textAlign:'center'},

    navigateBtn:{
        position:'absolute',
        top:6,
        right:6,
        zIndex:100,
        width:40,
        height:40,
        backgroundColor:'#D35098'
    },

    guideView:{
        height: 400,
        flex:1,
        flexDirection: 'column',
    },
    guideViewImage: {
    
        
        height: 350,
        resizeMode: 'cover',
        overflow: 'hidden',
        
    }

});
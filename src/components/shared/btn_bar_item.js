/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ICON_SIZE = 20;

export default class ButtonsBarItem extends Component{
    render(){
        let _styles = [styles.item];
        let _iconStyles = [styles.icon];
        let _textStyles = [styles.title];
        if(this.props.disabled){
            _styles.push(styles.disabledBkgd);
            _iconStyles.push(styles.disabledText);
            _textStyles.push(styles.disabledText);
        }

        return (
            <TouchableOpacity disabled={this.props.disabled}
                              style={_styles}
                              onPress={(event)=>this.props.onPress(event)}>
                <View style={styles.mainContainer}>
                    <View style={styles.iconContainer}>
                        <Icon style={_iconStyles} name={this.props.name} size={this.props.size ||ICON_SIZE } color={this.props.color}/>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={_textStyles}>{this.props.text}</Text>
                    </View>
                </View>

            </TouchableOpacity>

        );
    }

}

const styles = StyleSheet.create({
    item:{flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        minHeight:60,
        borderWidth:1,
        borderColor:'#cecece',
    },
    mainContainer:{
        maxWidth:120,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    iconContainer:{flex:1, alignItems:'center'},
    icon:{},
    titleContainer:{flex:2,alignItems:'center'},
    title:{},
    disabledText:{
        color:'#cecece',
    },
    disabledBkgd:{
        backgroundColor:'#f2f2f2'
    }
});
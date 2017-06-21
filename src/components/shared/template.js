/**
 * Created by msaeed on 2017-02-04.
 */
import React, {Component} from 'react';
import {View,Text, StyleSheet} from 'react-native';
import ViewContainer from './view_container'


export default class MyComponent extends Component{

    constructor(props){
        super(props);
        this.state={}
    }

    render(){
        return (
            <ViewContainer >
                <Text>Hi from template</Text>
            </ViewContainer>
        );
    }

}

const styles = StyleSheet.create({
    f:{}
});
import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import TabNavigator from './Navigator';

export default class Home extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <TabNavigator deconnect={this.props.deconnect}/>
        );
    }
}
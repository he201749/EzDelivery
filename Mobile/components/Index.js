import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Home from './Home';
import Login from './Login';

export default class Index extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loaded: false
        }
    }

    goodConnection = () =>{
        this.setState({loaded:true});
    }
    render(){
        if(this.state.loaded){
            return(<Home />)
        }else{
            return(<Login goodConnection={this.goodConnection}/>)
        }
    }
}
import * as React from 'react';
import Home from './Home';
import Login from './Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    deconnect = () =>{
        this.setState({loaded:false});
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then((value)=>{
            if(value==='deco'){
                this.setState({loaded:false});
            }
            else{
                this.setState({loaded:true});
            }
        })
    }


    render(){
        if(this.state.loaded){
            return(<Home deconnect={this.deconnect}/>
 )
        }else{
            return(<Login goodConnection={this.goodConnection}/>)
        }
    }
}
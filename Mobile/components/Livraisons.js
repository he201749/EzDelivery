 
import React, {useState} from 'react';  
import { StyleSheet, Text, View,Modal } from "react-native";
import {server} from '../constante';
import axios from 'axios';
import { ListItem} from 'react-native-elements';
import { Appbar, IconButton, Colors } from 'react-native-paper';

 
class LivraisonsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'damiendelestienne4@gmail.com',
            tabLiv:[],
            tabBoites:[],
            modalVisible: false
        }
    }
    addLivraison = () =>{
        console.log('add');
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
    delLivraison =async (id) =>{
        let res =await axios.delete(server+'/api/livraisons/'+id);
        if(res.data){
            let res2= await axios.get(server+'/api/livraisons/mail/'+this.state.mail);
            this.setState({tabLiv:res2.data});
        }
    }
    findBoite = (num) =>{
        for(let i=0;i<this.state.tabBoites.length;i++){
            if(num==this.state.tabBoites[i].boite){
                return this.state.tabBoites[i].nom;
            }
        }
    }
    componentDidMount(){
        axios.get(server+'/api/livraisons/mail/'+this.state.mail)
        .then( res => {

            this.setState({tabLiv:res.data});
        })
        axios.get(server+'/api/acces/'+this.state.mail)
        .then( res => {
            this.setState({tabBoites:res.data});
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render(){
        return (  
            <View>
                <Appbar.Header  style={{backgroundColor:'#c0dfef'}}>
                    
                    <Appbar.Content title="Livraisons"  style={{alignItems:'center'}}/>
                    <Appbar.Action icon="plus" onPress={this.addLivraison} />

                </Appbar.Header>

                <View style={styles.container}>       
                     {
                            this.state.tabLiv.map((l, i) => (
                            <ListItem key={i} bottomDivider style={{width:"100%"}}>
                                <ListItem.Content>
                                    <ListItem.Title style={{width:"100%"}}>
                                        <View style={{display:'inline-block',width:'90%'}}>
                                            <Text>{l.nom}</Text>
                                        </View>
                                        <View style={{display:'inline-block', width:'10%'}}>
                                            <IconButton
                                                icon="delete"
                                                color='#226557'
                                                size={30}
                                                onPress={() => this.delLivraison(l.id)}
                                        />
                                        </View>
                                    </ListItem.Title>
                                    <ListItem.Subtitle><Text>Numéro de colis: {l.numcolis}</Text></ListItem.Subtitle>
                                    <ListItem.Subtitle style={{width:"100%"}}>
                                        <View style={{display:'inline-block',width:'50%'}}>
                                            <Text>Passée le: {new Date(l.datedebut).toLocaleDateString()}</Text>
                                        </View>
                                        <View style={{display:'inline-block', width:'50%'}}>
                                            <Text>Statut: {l.datefin==null ? <Text style={{color:'red'}}>Non livré</Text> : <Text style={{color:'green'}}>Livré le: {new Date(l.datefin).toLocaleDateString()}</Text>}</Text>
                                        </View>
                                    </ListItem.Subtitle>
                                    <ListItem.Subtitle><Text>Boites aux lettres: {this.findBoite(l.boite)}</Text></ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                            ))
                    }
                </View> 
            </View>
            );  
    }
}

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
         flexDirection: 'column', 
        alignItems: 'center'  
    },
});
    

export default LivraisonsScreen;



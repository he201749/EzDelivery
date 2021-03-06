import React from 'react';  
import { StyleSheet, Text, View,Modal, Button,TouchableOpacity, ScrollView} from "react-native";
import {server} from '../constante';
import axios from 'axios';
import { ListItem} from 'react-native-elements';
import { Appbar, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';



class BoitesScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'',
            token:'',
            tabBoites:[],
            modalVisible: false,
            txtAlert:'',
            numBoiteAdd:'',
            mdpBoiteAdd:'',
            nomBoiteAdd:'',
            modalVisibleAsk: false,
            boiteDelete:0
        }
    }
    setModalVisible = () => {
        this.setState({ modalVisible: true });
    }

    setModalVisibleAsk = (id) => {
        this.setState({ modalVisibleAsk: true });
        this.setState({ boiteDelete: id });
    }

    delAcces = async () =>{
        let res =await axios.delete(server+'/api/acces/'+this.state.boiteDelete,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
        if(res.data){
            let res2= await axios.get(server+'/api/acces',{ headers: {'Authorization': `Bearer ${this.state.token}` }});
            this.setState({tabBoites:res2.data});
            this.setState({ modalVisibleAsk: false });
        }

    }
    closeAsk = () => {
        this.setState({ modalVisibleAsk: false });
    }

    openDoor = (ip) =>{
        axios.post('http://'+ip+':8090/openDoor');
    }

    handleNumBoite = (text) =>{
        this.setState({numBoiteAdd:text})
    }

    handlemdpBoite = (text) =>{
        this.setState({mdpBoiteAdd:text})
    }

    handleNomBoite = (text) =>{
        this.setState({nomBoiteAdd:text})
    }
    clean=() =>{
        this.setState({numBoiteAdd:''});
        this.setState({mdpBoiteAdd:''});
        this.setState({nomBoiteAdd:''});
    }
    addBoite=async()=>{
        if(this.state.numBoiteAdd!='' && this.state.mdpBoiteAdd!='' && this.state.nomBoiteAdd!=''){
            let newBoite={
                mail: this.state.mail,
                num: this.state.numBoiteAdd,
                mdp: this.state.mdpBoiteAdd,
                nom: this.state.nomBoiteAdd
            }
            let res= await axios.post(server+'/api/acces',newBoite,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
            if(res.data){
                axios.get(server+'/api/acces',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
                .then( res2 => {
                    this.setState({tabBoites:res2.data});
                    this.setState({txtAlert:''});
                    this.setState({modalVisible:false});
                    this.clean();
                })
            }
            else{
                this.setState({txtAlert:"Les informations entrées sont incorrectes"});
            }
        }
        else{
            this.setState({txtAlert:'Veuillez remplir tous les champs'});
        }
    }

    stopBoite=() =>{
        this.setState({txtAlert:''});
        this.setState({modalVisible:false});
        this.clean();
    }
    componentDidMount(){
        AsyncStorage.getItem('mail').then((value)=>{
            this.setState({mail:value});
            AsyncStorage.getItem('token').then((value2)=>{
                this.setState({token:value2});
                axios.get(server+'/api/acces', { headers: {'Authorization': `Bearer ${value2}` }})
                .then( res => {
                    this.setState({tabBoites:res.data});
                })
            })
        })
    }

   render(){
        return (  
                <View >  
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                    <View>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Veuillez entrer le numéro de la boite aux lettres</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
                                placeholder = "Numéro de boite"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                keyboardType="numeric"
                                onChangeText = {this.handleNumBoite}/>
                            <Text style={styles.modalText}>Veuillez entrer le mot de passe de la boite aux lettres</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
                                secureTextEntry={true}
                                placeholder = "Mot de passe"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handlemdpBoite}/>
                            <Text style={styles.modalText}>Veuillez entrer un nom pour votre boite aux lettres</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
                                placeholder = "Nom de votre boite"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handleNomBoite}/>
                            <Text style={{color:'red',marginTop:10}}>{this.state.txtAlert}</Text>
                            <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.addBoite}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Ajouter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.stopBoite}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Annuler</Text>
                                </TouchableOpacity>
      
        
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisibleAsk}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                    <View>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText2}>Êtes-vous sûr de vouloir supprimer cette boite aux lettres ?</Text>
                            <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.delAcces}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Oui</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.closeAsk}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Non</Text>
                                </TouchableOpacity>
      
        
                            </View>
                        </View>
                    </View>
                </Modal>

                    <Appbar.Header  style={{backgroundColor:'#c0dfef'}}>
                    <Appbar.Content title="Boites aux lettres" />
                    <Appbar.Action icon="plus" onPress={this.setModalVisible} />

                </Appbar.Header>

                <ScrollView style={{height:'86%'}}>
                     {
                            this.state.tabBoites.map((l, i) => (
                            <ListItem key={i} bottomDivider style={{width:"100%"}}>
                                <ListItem.Content>
                                    <ListItem.Title style={{fontSize:25}}>{l.nom}</ListItem.Title>
                                    <ListItem.Subtitle style={{marginTop:10}}><Text style={{color:'#9E9E9E'}}>Numéro de la boite: </Text><Text>{l.boite}</Text></ListItem.Subtitle>
                                </ListItem.Content>
                                <Button title="Ouvrir" onPress={()=> this.openDoor(l.ip)} color='#226557'/>
                                <IconButton
                                                icon="delete"
                                                color='#226557'
                                                size={30}
                                                onPress={() => this.setModalVisibleAsk(l.boite)}
                                />
                            </ListItem>
                            ))
                    }
                </ScrollView> 
                    
                
                </View>  
            );  
    }
}


const styles = StyleSheet.create({  
    container: {  
        flex: 1, 
         flexDirection: 'column',
        justifyContent: 'center',  
        alignItems: 'center'  
    },  
    modalView: {
        width:330,
        margin: 120,
        marginLeft:25,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.35,
        shadowRadius: 150,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        marginTop:10,
        fontSize:17,
        width:250
      },
      modalText2: {
        marginBottom: 15,
        marginTop:10,
        fontSize:17,
        textAlign:'center'
      },
      input: {
        width:200,
        height: 40,
        marginBottom:15
     },
     loginScreenButton:{
         width:120,
         height:50,
        backgroundColor:'#226557',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
      loginText:{
          marginTop:15,
          color:'#fff',
          textAlign:'center',
          paddingLeft : 10,
          paddingRight : 10
      },

});




export default BoitesScreen;



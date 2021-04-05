 
import React, {useState} from 'react';  
import { StyleSheet, Text, View,Modal,TextInput, Button,TouchableOpacity, ScrollView} from "react-native";
import {server} from '../constante';
import axios from 'axios';
import { ListItem} from 'react-native-elements';
import { Appbar, IconButton} from 'react-native-paper';
import CheckBox from 'react-native-check-box';

 
class LivraisonsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'damiendelestienne4@gmail.com',
            tabLiv:[],
            tabBoites:[],
            modalVisible: false,
            selectedBoite:'1',
            numColis:'',
            descriptionColis:'',
            txtAlert:'',
            modalGiftVisible:false,
            numeroBoiteGift:'',
            mdpBoiteGift:'',
            numColisGift:'',
            animationSuccess:false,
            tabCheck: []
        }
    }
    handleNumBoiteGift = (text) =>{
        this.setState({numeroBoiteGift:text})
    }
    handlemdpBoiteGift = (text) =>{
        this.setState({mdpBoiteGift:text})
    }
    handleNumColisGift = (text) =>{
        this.setState({numColisGift:text})
    }
    setModalVisible = () => {
        this.setState({ modalVisible: true });
    }
    setModalGiftVisible = () => {
        this.setState({ modalGiftVisible: true });
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
    closeSuccess = () =>{
        this.setState({animationSuccess:false})
    }
    handleNumColis = (text) => {
        this.setState({ numColis: text })
    }

    handleDescription = (text) => {
        this.setState({ descriptionColis: text })
    }

    sendNewLivraison = async () =>{
        if(this.state.numColis!='' && this.state.descriptionColis!='' && this.state.selectedBoite!=''){
            let newLiv= {
                numcolis : this.state.numColis,
                mail : this.state.mail,
                boite : this.state.selectedBoite,
                nom : this.state.descriptionColis,
                cadeau : 0
            };
            let res= await axios.post(server+'/api/livraisons',newLiv);
            if(res.data){
                let res2= await axios.get(server+'/api/livraisons/mail/'+this.state.mail);
                this.setState({tabLiv:res2.data});
            }
            this.setState({modalVisible:false});
            this.setState({txtAlert:''});
            let tab=[];
            for(let i=0;i<this.state.tabCheck.length;i++){
                tab.push(false);
            }
            this.setState({tabCheck:tab});
        }
        else{
            this.setState({txtAlert:'Veuillez remplir tous les champs'});
        }
    }
    stopNewLiv = () =>{
        this.setState({modalVisible:false});
        this.setState({txtAlert:''});
        let tab=[];
            for(let i=0;i<this.state.tabCheck.length;i++){
                tab.push(false);
            }
        this.setState({tabCheck:tab});
    }

    sendGiftLiv=async ()=>{
        if(this.state.numColisGift!='' && this.state.numeroBoiteGift!='' && this.state.mdpBoiteGift!=''){
            let newLiv= {
                mail : this.state.mail,
                numcolis : this.state.numColisGift,
                boite : this.state.numeroBoiteGift,
                mdp : this.state.mdpBoiteGift
            };
            let res= await axios.post(server+'/api/gift',newLiv);
            if(res.data){
                this.setState({modalGiftVisible:false});
                this.setState({txtAlert:''});
                this.setState({animationSuccess:true})
            }
            else{
                this.setState({txtAlert:"Les informations entrées sont incorrectes"});
            }
        }
        else{
            this.setState({txtAlert:'Veuillez remplir tous les champs'});
        }
    }
    stopGiftLiv=()=>{
        this.setState({modalGiftVisible:false});
        this.setState({txtAlert:''});
    }
    setTabCheck=(num)=>{
        let tab=[];
        for(let i=0;i<this.state.tabCheck.length;i++){
            tab.push(false);
        }
        tab[num]=true;
        this.setState({tabCheck:tab});
    }
    componentDidMount(){
        axios.get(server+'/api/livraisons/mail/'+this.state.mail)
        .then( res => {

            this.setState({tabLiv:res.data});
        })
        axios.get(server+'/api/acces/'+this.state.mail)
        .then( res => {
            this.setState({tabBoites:res.data});
            let tab=[];
            for(let i=0;i<res.data.length;i++){
                tab.push(false);
            }
            this.setState({tabCheck:tab});
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render(){
        return (  
            <View>
                <Appbar.Header  style={{backgroundColor:'#c0dfef'}}>
                    <Appbar.Action icon="gift" onPress={this.setModalGiftVisible} />
                    <Appbar.Content title="Livraisons" />
                    <Appbar.Action icon="plus" onPress={this.setModalVisible} />

                </Appbar.Header>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            hasBackdrop={true}
                            backdropOpacity={10}
                >
                    <ScrollView style={{height:'86%'}}>
                        <View style={styles.modalView}>
                            <Text style={{fontSize:17,textAlign: "center"}}>Veuillez choisir la boite aux lettres</Text>
                            {
                            this.state.tabBoites.map((l, i) => (
                                <View style={{flexDirection:'row'}}>
                                <Text style={{marginRight: 100,marginTop:20,width:90}}>{this.findBoite(l.boite)}</Text>
                                <CheckBox
                                        style={{ marginRight: 10,marginTop:15}}
                                        onClick={()=>{
                                        this.setState({
                                            selectedBoite:l.boite
                                        })
                                        this.setTabCheck(i)
                                        }}
                                        isChecked={this.state.tabCheck[i]}
                                />
                            </View>
                                
                            ))
                    }
                  
                            <Text style={styles.modalText}>Veuillez entrer le numéro de colis</Text>
                            <TextInput style = {styles.input}

                                placeholder = "Numéro de colis"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handleNumColis}/>
                            <Text style={styles.modalText}>Veuillez ajouter une description à votre commande</Text>
                            <TextInput style = {styles.input}

                                placeholder = "Description"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handleDescription}/>
                            <Text style={{color:'red'}}>{this.state.txtAlert}</Text>
                            <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.sendNewLivraison}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Enregistrer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.stopNewLiv}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Annuler</Text>
                                </TouchableOpacity>
      
        
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalGiftVisible}
                            hasBackdrop={true}
                            backdropOpacity={10}
                >
                    <View>
                        <View style={styles.modalView}>
                            <Text style={{fontSize:17,textAlign: "center"}}>Veuillez entrer le numéro de la boite aux lettres</Text>
                            <TextInput style = {styles.input}

                                placeholder = "Numéro de boites"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                keyboardType="numeric"
                                onChangeText = {this.handleNumBoiteGift}/>
                            <Text style={styles.modalText}>Veuillez entrer le mot de passe de la boite aux lettres</Text>
                            <TextInput style = {styles.input}

                                placeholder = "Mot de passe"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handlemdpBoiteGift}/>
                            <Text style={styles.modalText}>Veuillez entrer le numéro du colis</Text>
                            <TextInput style = {styles.input}

                                placeholder = "Numéro de colis"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handleNumColisGift}/>
                            <Text style={{color:'red',marginTop:10}}>{this.state.txtAlert}</Text>
                            <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.sendGiftLiv}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Faire un cadeau</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.stopGiftLiv}
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
                            visible={this.state.animationSuccess}
                            hasBackdrop={true}
                            backdropOpacity={10}
                >
                    <View>
                        <View style={styles.modalView2}>
                            <Text style={{fontSize:17,textAlign: "center"}}>Livraison cadeau bien effectuée</Text>
                                <TouchableOpacity
                                        style={styles.loginScreenButton2}
                                        onPress={this.closeSuccess}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Fermer</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <ScrollView style={{height:'86%'}}>
                     {
                            this.state.tabLiv.map((l, i) => (
                            <ListItem key={i} bottomDivider style={{width:"100%"}}>
                                <ListItem.Content>
                                    <ListItem.Title style={{fontSize:25}}>{l.nom}</ListItem.Title>
                                    <ListItem.Subtitle style={{marginTop:10}}><Text>Numéro de colis: {l.numcolis}</Text></ListItem.Subtitle>
                                    <ListItem.Subtitle><Text>Passée le: {new Date(l.datedebut).toLocaleDateString()}</Text></ListItem.Subtitle>
                                    <ListItem.Subtitle>
                                            <Text>Statut: {l.datefin==null ? <Text style={{color:'red'}}>Non livré</Text> : <Text style={{color:'green'}}>Livré le {new Date(l.datefin).toLocaleDateString()}</Text>}</Text>
                                    </ListItem.Subtitle>
                                    <ListItem.Subtitle><Text>Boites aux lettres: {this.findBoite(l.boite)}</Text></ListItem.Subtitle>
                                </ListItem.Content>
                                <IconButton
                                                icon="delete"
                                                color='#226557'
                                                size={30}
                                                onPress={() => this.delLivraison(l.id)}
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
        marginTop:40,
        textAlign: "center",
        fontSize:17
      },
      input: {
        width:200,
        height: 40,
        borderColor: '#226557',
        borderWidth: 1
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
      modalView2: {
        width:330,
        margin: 320,
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
    loginScreenButton2:{
        marginTop:30,
        width:120,
        height:45,
       backgroundColor:'#226557',
       borderRadius:10,
       borderWidth: 1,
       borderColor: '#fff'
     },
    });

export default LivraisonsScreen;


/*
                            <View style={{flexDirection:'row'}}>
                                <Text style={{padding: 10}}>Oui</Text>
                                <CheckBox
                                        style={{ padding: 10}}
                                        onClick={()=>{
                                        this.setState({
                                            cadeau:true
                                        })
                                        }}
                                        isChecked={this.state.cadeau}
                                />
                                <Text style={{padding: 10}}>Non</Text>
                                <CheckBox
                                        style={{ padding: 10}}
                                        onClick={()=>{
                                        this.setState({
                                            cadeau:false
                                        })
                                        }}
                                        isChecked={!this.state.cadeau}
                                />
                            </View>
*/
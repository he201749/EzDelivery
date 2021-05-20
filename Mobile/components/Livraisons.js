 
import React from 'react';  
import { StyleSheet, Text, View,Modal, Button,TouchableOpacity, ScrollView} from "react-native";
import {server} from '../constante';
import axios from 'axios';
import { ListItem} from 'react-native-elements';
import { Appbar, IconButton} from 'react-native-paper';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';

 
class LivraisonsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'',
            token:'',
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
            tabCheck: [],
            triRien: true,
            triStatut: false,
            triBoites: false,
            modalVisibleAskDelete:false,
            idtodelete:0,
            modalVisibleAskModify:false,
            idtomodify:0
        }
    }

    cleanNewLiv = () =>{
        this.setState({numColis:''});
        this.setState({descriptionColis:''});
        this.setState({selectedBoite:''});
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
        axios.get(server+'/api/acces',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
        .then( res => {
            this.setState({tabBoites:res.data});
            if(res.data.length>0){
                this.setState({ modalVisible: true });
            }
        })
    }
    setModalGiftVisible = () => {
        this.setState({ modalGiftVisible: true });
    }
    delLivraison =async () =>{
        let res =await axios.delete(server+'/api/livraisons/'+this.state.idtodelete,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
        if(res.data){
            this.setState({triBoites:false,triStatut:false,triRien:true})
            let res2= await axios.get(server+'/api/livraisonsmail',{ headers: {'Authorization': `Bearer ${this.state.token}` }});
            this.setState({tabLiv:res2.data});
            this.setState({modalVisibleAskDelete:false})
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
                boite : this.state.selectedBoite,
                nom : this.state.descriptionColis,
                cadeau : 0
            };
            let res= await axios.post(server+'/api/livraisons',newLiv,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
            if(res.data){
                this.setState({triBoites:false,triStatut:false,triRien:true})
                let res2= await axios.get(server+'/api/livraisonsmail',{ headers: {'Authorization': `Bearer ${this.state.token}` }});
                this.setState({tabLiv:res2.data});
            }
            this.cleanNewLiv();
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
        this.cleanNewLiv();
    }

    cleanGiftLiv = () =>{
        this.setState({numColisGift:''});
        this.setState({numeroBoiteGift:''});
        this.setState({mdpBoiteGift:''});
    }
    sendGiftLiv=async ()=>{
        if(this.state.numColisGift!='' && this.state.numeroBoiteGift!='' && this.state.mdpBoiteGift!=''){
            let newLiv= {
                numcolis : this.state.numColisGift,
                boite : this.state.numeroBoiteGift,
                mdp : this.state.mdpBoiteGift
            };
            let res= await axios.post(server+'/api/gift',newLiv,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
            if(res.data){
                this.setState({modalGiftVisible:false});
                this.setState({txtAlert:''});
                this.setState({animationSuccess:true})
                this.cleanGiftLiv();
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
        this.cleanGiftLiv();
    }
    setTabCheck=(num)=>{
        let tab=[];
        for(let i=0;i<this.state.tabCheck.length;i++){
            tab.push(false);
        }
        tab[num]=true;
        this.setState({tabCheck:tab});
    }
    triRien = () =>{
        if(!this.state.triRien){
            this.setState({triBoites:false,triStatut:false,triRien:true})
            axios.get(server+'/api/livraisonsmail',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
            .then( res => {
                this.setState({tabLiv:res.data});
            })
        }
    }
    triStatut = () =>{
        if(!this.state.triStatut){
            this.setState({triBoites:false,triRien:false,triStatut:true})
            axios.get(server+'/api/livraisonsmailstatut',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
            .then( res => {
                this.setState({tabLiv:res.data});
            })
        }
    }
    triBoites = () =>{
        if(!this.state.triBoites){
            this.setState({triStatut:false,triRien:false,triBoites:true})
            axios.get(server+'/api/livraisonsmailboites',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
            .then( res => {
                this.setState({tabLiv:res.data});
            })
        }
    }
    modifyStatus = async () =>{
        let res=await axios.put(server+'/api/modifylivraisons/'+this.state.idtomodify)
        if(res.data){
            this.setState({triBoites:false,triStatut:false,triRien:true})
            let res2= await axios.get(server+'/api/livraisonsmail',{ headers: {'Authorization': `Bearer ${this.state.token}` }});
            this.setState({tabLiv:res2.data});
            this.setState({modalVisibleAskModify:false})
        }
    }

    openmodaldelete = (id)=>{
        this.setState({idtodelete:id})
        this.setState({modalVisibleAskDelete:true})
    }

    openmodalmodify = (id)=>{
        this.setState({idtomodify:id})
        this.setState({modalVisibleAskModify:true})
    }

    closeAskModify = () =>{
        this.setState({modalVisibleAskModify:false})
    }

    closeAskDelete = () =>{
        this.setState({modalVisibleAskDelete:false})
    }

    componentDidMount(){
        AsyncStorage.getItem('mail').then((value)=>{
            this.setState({mail:value});
            AsyncStorage.getItem('token').then((value2)=>{
                this.setState({token:value2});
                axios.get(server+'/api/livraisonsmail',{ headers: {'Authorization': `Bearer ${value2}` }})
                .then( res => {
                    this.setState({tabLiv:res.data});
                })
                axios.get(server+'/api/acces',{ headers: {'Authorization': `Bearer ${value2}` }})
                .then( res => {
                    this.setState({tabBoites:res.data});
                    let tab=[];
                    for(let i=0;i<res.data.length;i++){
                        tab.push(false);
                    }
                    this.setState({tabCheck:tab});
                })
            })
        })
    }

    render(){
        return (  
            <View>
                <Appbar.Header  style={{backgroundColor:'#c0dfef'}}>
                    <Appbar.Action icon="gift" onPress={this.setModalGiftVisible} />
                    <Appbar.Content title="Livraisons"/>
                    <Appbar.Action icon="plus" onPress={this.setModalVisible} />

                </Appbar.Header>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisibleAskDelete}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                    <View style={{marginTop:'40%'}}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText2}>Êtes-vous sûr de vouloir supprimer cette livraison ?</Text>
                            <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.delLivraison}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Oui</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.closeAskDelete}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Non</Text>
                                </TouchableOpacity>
      
        
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisibleAskModify}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                    <View style={{marginTop:'40%'}}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText2}>Êtes-vous sûr de vouloir modifier le statut de cette livraison ?</Text>
                            <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.modifyStatus}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Oui</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.closeAskModify}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Non</Text>
                                </TouchableOpacity>
      
        
                            </View>
                        </View>
                    </View>
                </Modal>
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
                                <View style={{flexDirection:'row'}} key={i}>
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
                                mode='outlined'
                                placeholder = "Numéro de colis"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handleNumColis}/>
                            <Text style={styles.modalText}>Veuillez ajouter une description à votre commande</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
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
                            <Text style={styles.modalText}>Veuillez entrer le numéro de la boite aux lettres</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
                                placeholder = "Numéro de boite"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                keyboardType="numeric"
                                onChangeText = {this.handleNumBoiteGift}/>
                            <Text style={styles.modalText}>Veuillez entrer le mot de passe de la boite aux lettres</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
                                secureTextEntry={true}
                                placeholder = "Mot de passe"
                                placeholderTextColor = "#226557"
                                autoCapitalize = "none"
                                onChangeText = {this.handlemdpBoiteGift}/>
                            <Text style={styles.modalText}>Veuillez entrer le numéro du colis</Text>
                            <TextInput style = {styles.input}
                                mode='outlined'
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
                    <View style={{height:30,flexDirection:'row' }}>
                        <Text style={{fontSize:17,marginTop:5,color:'#226557'}}>Trier par : </Text>
                        <CheckBox onClick={this.triRien} isChecked={this.state.triRien} style={{marginTop:4,marginLeft:13}}/>
                        <Text style={{fontSize:17,marginTop:5,color:'#226557'}}>Pas de tri</Text>
                        <CheckBox onClick={this.triStatut} isChecked={this.state.triStatut} style={{marginTop:4,marginLeft:13}}/>
                        <Text style={{fontSize:17,marginTop:5,color:'#226557'}}>Statut</Text>
                        <CheckBox onClick={this.triBoites} isChecked={this.state.triBoites} style={{marginTop:4,marginLeft:13}}/>
                        <Text style={{fontSize:17,marginTop:5,color:'#226557'}}>Boites</Text>
                    </View>
                     {
                            this.state.tabLiv.map((l, i) => (
                            <ListItem key={i} bottomDivider style={{width:"100%"}}>
                                <ListItem.Content >
                                    <ListItem.Title style={{fontSize:25,color:'#226557'}}>{l.nom}</ListItem.Title>
                                    <ListItem.Subtitle style={{marginTop:10}}><Text style={{color:'#9E9E9E'}}>Numéro de colis:</Text> <Text style={{color:'#226557'}}>{l.numcolis}</Text></ListItem.Subtitle>
                                    <ListItem.Subtitle><Text style={{color:'#9E9E9E'}}>Passée le: </Text><Text style={{color:'#226557'}}>{new Date(l.datedebut).toLocaleDateString()}</Text></ListItem.Subtitle>
                                    <ListItem.Subtitle>
                                            <Text style={{color:'#9E9E9E'}}>Statut: </Text><Text>{l.datefin==null ? <Text style={{color:'red'}}>Non livré</Text> : <Text style={{color:'green'}}>Livré le {new Date(l.datefin).toLocaleDateString()}</Text>}</Text>
                                    </ListItem.Subtitle>
                                    <ListItem.Subtitle><Text style={{color:'#9E9E9E'}}>Boites aux lettres: </Text><Text style={{color:'#226557'}}>{this.findBoite(l.boite)}</Text></ListItem.Subtitle>
                                </ListItem.Content>
                                <View style={{flexDirection:'line'}}>
                                {l.datefin==null?
                                <IconButton
                                                icon="check"
                                                color='#226557'
                                                size={30}
                                                onPress={() => this.openmodalmodify(l.id)}
                                /> : null}
                                <IconButton
                                                icon="delete"
                                                color='#226557'
                                                size={30}
                                                onPress={() => this.openmodaldelete(l.id)}
                                />
                                </View>
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
        marginTop:15,
        fontSize:17,
        width:250
      },
      input: {
        width:200,
        height: 40,
        marginBottom: 10
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



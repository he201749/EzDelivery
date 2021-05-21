import React from 'react';  
import { StyleSheet, Text, View,Modal, TouchableOpacity} from "react-native";
import {server,instance} from '../constante';
import axios from 'axios';
import { Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import {verifyMail,verifyPassword} from '../function';


class ProfileScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'',
            token:'',
            nom: '',
            prenom: '',
            modaleVisibleMail: false,
            newMail:'',
            mdp:'',
            txtAlert:'',
            recoModal: false,
            modalMdp:false,
            ancienmdp:'',
            nouveaumdp:'',
            nouveaumdp2:'',
            mdpsuccesmodal:false,
            delModal: false
        }
    }
    cleanMdp=()=>{
        this.setState({ancienmdp:''})
        this.setState({nouveaumdp:''})
        this.setState({nouveaumdp2:''})
        this.setState({txtAlert:''})
    }
    cleanMail=()=>{
        this.setState({newMail:''})
        this.setState({mdp:''})
        this.setState({txtAlert:''})
    }
    closeChangeMail = () =>{
        this.setState({modaleVisibleMail:false})
        this.cleanMail();
    }
    handleNom=(text)=>{
        axios.put(server+'/api/utilisateurs/nom',{txt:text},{ headers: {'Authorization': `Bearer ${this.state.token}` }});
        axios.get(server+'/api/utilisateurs',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
        .then(res => {
            this.setState({nom:res.data[0].nom});
            this.setState({prenom:res.data[0].prenom});
        })
    }
    handlePrenom=(text)=>{
        axios.put(server+'/api/utilisateurs/prenom',{txt:text},{ headers: {'Authorization': `Bearer ${this.state.token}` }});
        axios.get(server+'/api/utilisateurs',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
        .then(res => {
            this.setState({nom:res.data[0].nom});
            this.setState({prenom:res.data[0].prenom});
        })
    }

    handleMailVisible=()=>{
        this.setState({modaleVisibleMail:true})
    }
    handleMailChange=(text)=>{
        this.setState({newMail:text})
    }

    changeMail=async()=>{
        if(this.state.newMail!='' && this.state.mail!=''){
            if(verifyMail(this.state.newMail)){
                let usr={
                    newmail: this.state.newMail
                }
                let res=await axios.put(server+'/api/utilisateurs/mail',usr,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
                if(res.data){
                    this.cleanMail();
                    this.setState({modaleVisibleMail:false});
                    this.setState({recoModal:true});
                    let txtasync='deco'
                    await AsyncStorage.setItem('token', txtasync);
                }
                else{
                    this.setState({txtAlert:'Données incorrectes'})
                }
            }
            else{
                this.setState({txtAlert:'Veuillez entrer une adresse mail valide'})
            }
        }
        else{
            this.setState({txtAlert:'Veuillez remplir tous les champs'})
        }
    }
    changeMdpModal=()=>{
        this.setState({modalMdp:true})
    }

    closeReco= async()=>{
        this.setState({recoModal:false});
        let txtasync='deco'
        await AsyncStorage.setItem('token', txtasync);
        this.props.deconnect();
    }

    handleOldMdp=(text)=>{
        this.setState({ancienmdp:text})
    }
    handleNewMdp=(text)=>{
        this.setState({nouveaumdp:text})
    }
    handleNewMdp2=(text)=>{
        this.setState({nouveaumdp2:text})
    }
    closeMdp=()=>{
        this.cleanMdp();
        this.setState({modalMdp:false})
    }
    changeMdp=async()=>{
        if(this.state.ancienmdp!='' && this.state.nouveaumdp!='' && this.state.nouveaumdp2!=''){
            if(verifyPassword(this.state.nouveaumdp)){
                if(this.state.nouveaumdp==this.state.nouveaumdp2){
                    let usr={
                        newmdp:this.state.nouveaumdp,
                        mdp: this.state.ancienmdp
                    }
                    let res=await axios.put(server+'/api/utilisateurs/mdp',usr,{ headers: {'Authorization': `Bearer ${this.state.token}` }});
                    if(res.data){
                        this.cleanMdp();
                        this.setState({modalMdp:false});
                        this.setState({mdpsuccesmodal:true})
                    }
                    else{
                        this.setState({txtAlert:'Ancien mot de passe incorrect'})
                    }
                }
                else{
                    this.setState({txtAlert:'Les deux mots de passes ne sont pas identiques'})
                }
            }
            else{
                this.setState({txtAlert:'Le mot de passe nécessite au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'})
            }
        }
        else{
            this.setState({txtAlert:'Veuillez remplir tous les champs'})
        }
    }
    deco =async()=>{
        let txtasync='deco'
        await AsyncStorage.setItem('token', txtasync);
        this.props.deconnect();

    }
    closemdpsucces=()=>{
        this.setState({mdpsuccesmodal:false})
    }
    openDelModal=()=>{
        this.setState({delModal:true});
    }
    closeDelModal=()=>{
        this.setState({delModal:false});
    }
    deleteAccount =async ()=>{
        await axios.delete(server+'/api/utilisateurs',{ headers: {'Authorization': `Bearer ${this.state.token}` }})
        let txtasync='deco';
        await AsyncStorage.setItem('token', txtasync);
        this.setState({delModal:false});
        this.props.deconnect();
    }
    componentDidMount(){
        AsyncStorage.getItem('mail').then((value)=>{
            this.setState({mail:value});
            AsyncStorage.getItem('token').then((value2)=>{
                this.setState({token:value2});
                axios.get(server+'/api/utilisateurs',{ headers: {'Authorization': `Bearer ${value2}` }})
                .then( res => {
                    this.setState({nom:res.data[0].nom});
                    this.setState({prenom:res.data[0].prenom});
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
                            visible={this.state.modaleVisibleMail}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                            <View>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Entrez la nouvelle adresse mail</Text>
                                    <TextInput style = {styles.input}
                                        mode='outlined'
                                        placeholder = "exemple@exemple.com"
                                        placeholderTextColor = "#226557"
                                        autoCapitalize = "none"
                                        onChangeText = {this.handleMailChange}/>
                                    <Text style={{color:'red',marginTop:10}}>{this.state.txtAlert}</Text>
                                    <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.changeMail}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Confirmer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.closeChangeMail}
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
                            visible={this.state.recoModal}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                            <View>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText2}>Adresse mail changée, veuillez maintenant vous reconnecter</Text>
                                   <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.closeReco}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Ok</Text>
                                    </TouchableOpacity>
                            </View>
                    </View>
                    </Modal>  
                    <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.delModal}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                            <View>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Êtes-vous sur ? Toutes vos données seront supprimées</Text>
                                    <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.deleteAccount}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Confirmer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.closeDelModal}
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
                            visible={this.state.modalMdp}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                            <View>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Entrez votre ancien mot de passe</Text>
                                    <TextInput style = {styles.input}
                                        mode='outlined'
                                        secureTextEntry={true}
                                        placeholder = "Mot de passe"
                                        placeholderTextColor = "#226557"
                                        autoCapitalize = "none"
                                        onChangeText = {this.handleOldMdp}/>
                                    <Text style={styles.modalText}>Entrez votre nouveau mot de passe</Text>
                                    <TextInput style = {styles.input}
                                        mode='outlined'
                                        secureTextEntry={true}
                                        placeholder = "Mot de passe"
                                        placeholderTextColor = "#226557"
                                        autoCapitalize = "none"
                                        onChangeText = {this.handleNewMdp}/>
                                    <Text style={styles.modalText}>Entrez votre nouveau mot de passe</Text>
                                    <TextInput style = {styles.input}
                                        mode='outlined'
                                        secureTextEntry={true}
                                        placeholder = "Mot de passe"
                                        placeholderTextColor = "#226557"
                                        autoCapitalize = "none"
                                        onChangeText = {this.handleNewMdp2}/>
                                    <Text style={{color:'red',marginTop:10}}>{this.state.txtAlert}</Text>
                                    <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.changeMdp}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Confirmer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.closeMdp}
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
                            visible={this.state.mdpsuccesmodal}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                            <View>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText2}>Mot de passe changé avec succès</Text>
                                   <TouchableOpacity
                                                style={styles.loginScreenButton}
                                                onPress={this.closemdpsucces}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Ok</Text>
                                    </TouchableOpacity>
                            </View>
                    </View>
                    </Modal>           
                    <Appbar.Header  style={{backgroundColor:'#c0dfef'}}>
                        <Appbar.Content title="Profil" />
                    </Appbar.Header>  
                    <Text style={{color:"#226557", fontSize:20,marginLeft:15,marginTop:20}}>Nom:</Text>
                    <TextInput style={styles.txtField}
                        mode='outlined'
                        editable= {true}
                        placeholder = {this.state.nom}
                        placeholderTextColor = "#226557"
                        onChangeText = {this.handleNom}
                    />
                    <Text style={{color:"#226557", fontSize:20,marginLeft:15,marginTop:20}}>Prénom:</Text>
                    <TextInput style={styles.txtField}
                        mode='outlined'
                        editable= {true}
                        placeholder = {this.state.prenom}
                        placeholderTextColor = "#226557"
                        onChangeText = {this.handlePrenom}
                    />
                    <Text style={{color:"#226557", fontSize:20,marginLeft:15,marginTop:20}}>Mail:</Text>
                    <TextInput style={styles.txtField}
                        mode='outlined'
                        editable= {false}
                        placeholder = {this.state.mail}
                        placeholderTextColor = "#226557"
                    />
                    <TouchableOpacity
                                        style={styles.loginScreenButton2}
                                        onPress={this.handleMailVisible}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText2}>Modifier l'adresse mail</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                                        style={styles.loginScreenButton2}
                                        onPress={this.changeMdpModal}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText2}>Modifier le mot de passe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                                        style={styles.loginScreenButton2}
                                        onPress={this.deco}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText2}>Déconnexion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                                        style={styles.loginScreenButton2}
                                        onPress={this.openDelModal}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText2}>Supprimer mon compte</Text>
                    </TouchableOpacity>
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
    loginScreenButton2:{
        width:250,
        height:50,
       backgroundColor:'#226557',
       borderRadius:10,
       borderWidth: 1,
       borderColor: '#fff',
       marginTop:20,
       alignSelf:'center'
     },
     loginText2:{
         fontSize:16,
         marginTop:15,
         color:'#fff',
         textAlign:'center',
         paddingLeft : 10,
         paddingRight : 10
     },
     txtField:{
        width:300,
        height:40,
        marginTop:10,
        alignSelf:'center'
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
        width:250,
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
      modalText2: {
        marginBottom: 15,
        marginTop:10,
        fontSize:17,
        width:250,
        textAlign:'center'
      }
});  

export default ProfileScreen;
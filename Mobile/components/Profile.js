import React from 'react';  
import { StyleSheet, Text, View,Modal, Button,TouchableOpacity, ScrollView} from "react-native";
import {server} from '../constante';
import axios from 'axios';
import { ListItem} from 'react-native-elements';
import { Appbar, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';

class ProfileScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'',
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
            mdpsuccesmodal:false
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
        axios.put(server+'/api/utilisateurs/nom/'+this.state.mail,{txt:text});
        axios.get(server+'/api/utilisateurs/'+this.state.mail)
        .then(res => {
            this.setState({nom:res.data[0].nom});
            this.setState({prenom:res.data[0].prenom});
        })
    }
    handlePrenom=(text)=>{
        axios.put(server+'/api/utilisateurs/prenom/'+this.state.mail,{txt:text});
        axios.get(server+'/api/utilisateurs/'+this.state.mail)
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
    handleMdp=(text)=>{
        this.setState({mdp:text})
    }

    changeMail=async()=>{
        if(this.state.newMail!='' && this.state.mail!=''){
            let usr={
                mail:this.state.newMail,
                mdp: this.state.mdp
            }
            let res=await axios.put(server+'/api/utilisateurs/mail/'+this.state.mail,usr);
            if(res.data){
                this.cleanMail();
                this.setState({modaleVisibleMail:false});
                this.setState({recoModal:true});
            }
            else{
                this.setState({txtAlert:'Données incorrectes'})
            }
        }
        else{
            this.setState({txtAlert:'Veuillez remplir tous les champs'})
        }
    }
    changeMdpModal=()=>{
        this.setState({modalMdp:true})
    }

    closeReco=()=>{
        this.setState({recoModal:false});
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
            if(this.state.nouveaumdp==this.state.nouveaumdp2){
                let usr={
                    newmdp:this.state.nouveaumdp,
                    mdp: this.state.ancienmdp
                }
                let res=await axios.put(server+'/api/utilisateurs/mdp/'+this.state.mail,usr);
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
            this.setState({txtAlert:'Veuillez remplir tous les champs'})
        }
    }
    closemdpsucces=()=>{
        this.setState({mdpsuccesmodal:false})
    }
    componentDidMount(){
        AsyncStorage.getItem('mail').then((value)=>{
            this.setState({mail:value});
            axios.get(server+'/api/utilisateurs/'+this.state.mail)
            .then( res => {
                this.setState({nom:res.data[0].nom});
                this.setState({prenom:res.data[0].prenom});
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
                                    <Text style={styles.modalText}>Entrez votre mot de passe</Text>
                                    <TextInput style = {styles.input}
                                        mode='outlined'
                                        secureTextEntry={true}
                                        placeholder = "Mot de passe"
                                        placeholderTextColor = "#226557"
                                        autoCapitalize = "none"
                                        onChangeText = {this.handleMdp}/>
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
        height:60,
       backgroundColor:'#226557',
       borderRadius:10,
       borderWidth: 1,
       borderColor: '#fff',
       marginTop:30,
       alignSelf:'center'
     },
     loginText2:{
         fontSize:20,
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
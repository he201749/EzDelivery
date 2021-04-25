import React from 'react';  
import { StyleSheet, Text, View,Modal, Button,TouchableOpacity, ScrollView} from "react-native";
import {server} from '../constante';
import axios from 'axios';
import { ListItem} from 'react-native-elements';
import { Appbar, IconButton} from 'react-native-paper';
import CreerCompte from './CreerCompte';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';




export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loaded: false,
            mail:'',
            mdp: '',
            txtAlert:'',
            modalVisible: false,
            modalSucces: false,
            txtSucces:'',
            forgetModal:false,
            mailForget:''
        }
    }
    openSucces = () =>{
        this.setState({txtSucces:'Compte créé, vous pouvez vous connecter'})
    }

    clean = () =>{
        this.setState({txtAlert:""});
        this.setState({mail:""});
        this.setState({mdp:""});
        this.setState({txtSucces:""});
    }
    setModalVisible=()=>{
        this.setState({modalVisible:true});
        this.setState({txtAlert:""});
        this.setState({txtSucces:""});
    }
    handleMail= (text) => {
        this.setState({mail:text});
    }

    closeModal=()=>{
        this.setState({modalVisible:false});
    }

    handleMdp= (text) => {
        this.setState({mdp:text});
    }
    openForgetModal=()=>{
        this.setState({txtAlert:''});
        this.setState({forgetModal:true});
    }
    handleMailForget=(text)=>{
        
        this.setState({mailForget:text})
    }
    sendPwdForget=async ()=>{
        if(this.state.mailForget!=''){
            let res= await axios.post(server+'/api/resetPwd/'+this.state.mailForget);
            if(res.data){
                this.setState({mailForget:''});
                this.setState({txtAlert:''});
                this.setState({forgetModal:false});
            }
            else{
                this.setState({txtAlert:"Une erreur s'est produite"});
            }
        }
        else{
            this.setState({txtAlert:'Veuillez indiquer votre adresse mail'});
        }
    }
    closePwdForget=()=>{
        this.setState({mailForget:''});
        this.setState({txtAlert:''});
        this.setState({forgetModal:false});
    }
    connect= async() =>{
        if(this.state.mail!='' && this.state.mdp!=''){
            
            let user={
                mail: this.state.mail,
                mdp: this.state.mdp
            }
            let res= await axios.post(server+'/api/utilisateurs',user);
            if(res.data){
                await AsyncStorage.setItem('mail', this.state.mail)
                await AsyncStorage.setItem('token', res.data)
                this.setState({mail:''});
                this.setState({mdp:''});
                this.setState({txtAlert:''});
                this.clean();
                this.props.goodConnection();
            }
            else{
                this.setState({txtAlert:"Les informations entrées sont incorrectes"});
            }
        }
        else{
            this.setState({txtAlert:"Veuillez remplir tous les champs"});
        }

    }
    render(){
        return(
            <View style={styles.container}>
                 <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                    <ScrollView>
                        <View style={styles.modalView}>
                            <CreerCompte close={this.closeModal} open={this.openSucces}/>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.forgetModal}
                            hasBackdrop={true}
                            backdropOpacity={10}
                        >
                    <View>
                        <View style={styles.modalView2}>
                            <Text style={styles.modalText2}>Un email va vous être envoyé.</Text>
                            <Text style={styles.modalText2}>Veuillez entrer votre addresse mail:</Text>
                            <TextInput style = {styles.input2}
                                    mode='outlined'
                                    placeholder = "exemple@exemple.com"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleMailForget}/>
                                    <Text style={{color:'red',marginTop:5,textAlign:'center'}}>{this.state.txtAlert}</Text>
                                    <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:15}}>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton2}
                                                onPress={this.sendPwdForget}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Envoyer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                style={styles.loginScreenButton2}
                                                onPress={this.closePwdForget}
                                                underlayColor='#fff'>
                                                <Text style={styles.loginText}>Annuler</Text>
                                        </TouchableOpacity>
            
                
                                    </View>

                        </View>
                    </View>
                </Modal>
                <Text style={{marginTop:100,color:'#226557',fontSize:40}}>EzDelivery</Text>
                <Text style={{marginTop:50,color:'green',fontSize:18}}>{this.state.txtSucces}</Text>
                <View style={styles.body}>
                    <Text style={{fontSize:17,textAlign: "left",marginTop:20,marginLeft:20,color:'#226557'}}>Adresse email:</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    placeholder = "exemple@exemple.com"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleMail}/>
                    <Text style={{fontSize:17,textAlign: "left",marginLeft:20, color:'#226557'}}>Mot de passe:</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    secureTextEntry={true}
                                    placeholder = "········"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleMdp}/>
                    <Text style={{color:'red',marginTop:5,textAlign:'center'}}>{this.state.txtAlert}</Text>
                    <Text style={{color: 'blue',marginLeft:20}}
                        onPress={this.openForgetModal}>
                                             Mot de passe oublié ?
                    </Text>
                    <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.connect}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Se connecter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.setModalVisible}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({  
    container: {  
        flex: 1, 
         flexDirection: 'column',
        alignItems: 'center',
        backgroundColor:'#c0dfef'
    },  
      input: {
        width:250,
        height: 40,
        marginTop:20,
        marginBottom: 20,
      
        marginLeft:20
     },
     loginScreenButton:{
         width:200,
         height:50,
        backgroundColor:'#226557',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        marginLeft:50,
        marginTop:20
      },
      body:{
          marginTop:20,
          backgroundColor:'white',
          height:440,
          width:300,
          borderRadius: 20,


        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.35,
        shadowRadius: 150,
        elevation: 5,
      },
      loginText:{
        marginTop:15,
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    },
    modalView: {
        width:330,
        margin: 40,
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
      modalText2: {
        marginBottom: 15,
        marginTop:10,
        fontSize:17,
        width:250
      },
      input2: {
        width:250,
        height: 40,
        marginBottom:15
     },
     loginScreenButton2:{
        width:120,
        height:50,
       backgroundColor:'#226557',
       borderRadius:10,
       borderWidth: 1,
       borderColor: '#fff'
     },
     modalView2: {
        width:330,
        margin: 200,
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
});
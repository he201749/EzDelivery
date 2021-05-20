import axios from 'axios';
import * as React from 'react';
import { StyleSheet, Text, View,TouchableOpacity} from "react-native";
import {server} from '../constante';
import { TextInput } from 'react-native-paper';
import {verifyMail,verifyPassword} from '../function';

export default class CreerCompte extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mail:'',
            mdp: '',
            mdp2:'',
            nom:'',
            prenom:'',
            txtAlert:''
        }
    }

    clean = () =>{
        this.setState({prenom:''})
        this.setState({nom:''})
        this.setState({mail:''})
        this.setState({mdp:''})
        this.setState({mdp2:''})
        this.setState({txtAlert:''})
    }

    handlePrenom = (text) =>{
        this.setState({prenom:text})
    }

    handleNom = (text) =>{
        this.setState({nom:text})
    }

    handleMail = (text) =>{
        this.setState({mail:text})
    }

    handleMdp = (text) =>{
        this.setState({mdp:text})
    }

    handleMdp2 = (text) =>{
        this.setState({mdp2:text})
    }

    stop=() =>{
        this.clean();
        this.props.close();
    }

    creer= async() =>{
            if(this.state.mail!='' && this.state.nom!='' && this.state.prenom!='' && this.state.mdp!='' && this.state.mdp2!='' ){
                if(verifyMail(this.state.mail)){
                    if(verifyPassword(this.state.mdp)){
                        if(this.state.mdp != this.state.mdp2){
                            this.setState({txtAlert:'Les deux mots de passes ne sont pas identiques'})
                        }else{
                            let usr={
                                mail: this.state.mail,
                                mdp : this.state.mdp,
                                nom: this.state.nom,
                                prenom: this.state.prenom
                            }
                            let res= await axios.post(server+'/api/newUtilisateurs', usr);
                            if(res.data=='existant'){
                                this.setState({txtAlert:'Adresse email déjà utilisée'})
                            }
                            else if(!res.data){
                                this.setState({txtAlert:"Une erreur s'est produite"})
                            }else if(res.data){
                                this.clean();
                                this.props.close();
                                this.props.open();
                            }      
                        }  
                    }
                    else{
                        this.setState({txtAlert:'Le mot de passe nécessite au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'})
                    }
                }
                else{
                    this.setState({txtAlert:'Mauvaise adresse email'})
                }
            }
            else{
                this.setState({txtAlert:'Veuillez remplir tous les champs'})
            }
    }


    render(){

        return(
            <View>
                <Text style={{fontSize:17,textAlign: "left",color:'#226557'}}>Prénom</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    placeholder = "Jean"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handlePrenom}/>
                    <Text style={{fontSize:17,textAlign: "left", color:'#226557'}}>Nom</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    placeholder = "Depont"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleNom}/>
                    <Text style={{fontSize:17,textAlign: "left", color:'#226557'}}>Adresse email</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    placeholder = "exemple@exemple.com"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleMail}/>
                    <Text style={{fontSize:17,textAlign: "left", color:'#226557'}}>Mot de passe</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    secureTextEntry={true}
                                    placeholder = "········"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleMdp}/>
                    <Text style={{fontSize:17,textAlign: "left", color:'#226557'}}>Retapez votre mot de passe</Text>
                    <TextInput style = {styles.input}
                                    mode='outlined'
                                    secureTextEntry={true}
                                    placeholder = "········"
                                    placeholderTextColor = "#226557"
                                    autoCapitalize = "none"
                                    onChangeText = {this.handleMdp2}/>
                    <Text style={{color:'red',marginTop:5,textAlign:'center'}}>{this.state.txtAlert}</Text>
                    <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.creer}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Créer mon compte</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                                        style={styles.loginScreenButton}
                                        onPress={this.stop}
                                        underlayColor='#fff'>
                                        <Text style={styles.loginText}>Annuler</Text>
                    </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({  
      input: {
        width:250,
        height: 40,
        marginTop:20,
        marginBottom: 20,
     },
     loginScreenButton:{
         width:200,
         height:50,
        backgroundColor:'#226557',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        marginLeft:25,
        marginTop:20
      },
      loginText:{
        marginTop:15,
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    },


});

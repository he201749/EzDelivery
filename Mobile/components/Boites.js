 
import React, {useState} from 'react';  
import {StyleSheet, Text, TextInput, Button, View,Image,Dimensions} from 'react-native';

class BoitesScreen extends React.Component{

   render(){
        return (  
                <View style={styles.container}>  
            
                    <Text>Boites </Text>
                
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


});  

export default BoitesScreen;



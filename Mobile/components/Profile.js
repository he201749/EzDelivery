import React, {useState} from 'react';  
import {StyleSheet, Text, View} from 'react-native';
 
class ProfileScreen extends React.Component{
   
    render(){
        return (  
                <View style={styles.container}>       
                    <Text>Profil </Text>       
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

export default ProfileScreen;
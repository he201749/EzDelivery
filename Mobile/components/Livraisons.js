 
import React, {useState} from 'react';  
import {StyleSheet, Text, View} from 'react-native';
 
class LivraisonsScreen extends React.Component{
   
    render(){
        return (  
                <View style={styles.container}>       
                    <Text>Livraisons </Text>       
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

export default LivraisonsScreen;



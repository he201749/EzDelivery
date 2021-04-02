import React from 'react';
import {  View } from 'react-native';
import {  createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';


import LivraisonsScreen from './Livraisons';
import BoitesScreen from './Boites';
import ProfileScreen from './Profile';

const TabNavigator = createMaterialBottomTabNavigator(
  { 
    Livraisons: {
      screen: LivraisonsScreen,
      navigationOptions: {
        tabBarLabel: 'Livraisons',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor}]} size={20} name={'box-open'} />
          </View>
        ),
      },
    },

       Boites: {
      screen: BoitesScreen,
      navigationOptions: {
        tabBarLabel: 'Boites aux lettres',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon3
              style={[{ color: tintColor }]} size={25} name={'mailbox'} />
          </View>
        ),
       
      },
    },

    Profil: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profil',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon2
              style={[{ color: tintColor }]} size={25} name={'user'} />
          </View>
        ),
       
      },
    },


  },

     
  {
    initialRouteName: 'Livraisons',
    activeColor: '#226557',
    inactiveColor: '#9E9E9E',
    barStyle: { backgroundColor: '#c0dfef' },
  }
);

export default createAppContainer(TabNavigator);








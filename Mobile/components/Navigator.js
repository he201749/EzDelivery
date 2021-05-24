import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import LivraisonsScreen from './Livraisons';
import BoitesScreen from './Boites';
import ProfileScreen from './Profile';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


const Tab = createMaterialBottomTabNavigator();

export default class TabNavigator extends React.Component{

  constructor(props){
      super(props);
  }

  render(){
    return(
      <NavigationContainer>
              <Tab.Navigator
                initialRouteName="Livraisons"
                activeColor="#226557"
                inactiveColor= '#9E9E9E'
                barStyle={{ backgroundColor: '#c0dfef' }}
              >
            <Tab.Screen
              name="Livraisons"
              component={LivraisonsScreen}
              options={{
                tabBarLabel: 'Livraisons',
                tabBarIcon: ({ color }) => (
                  <Icon style={[{ color: color}]} size={20} name={'box-open'} />
                ),
              }}
            />
            <Tab.Screen
              name="Boites"
              component={BoitesScreen}
              options={{
                tabBarLabel: 'Boites aux lettres',
                tabBarIcon: ({ color }) => (
                  <Icon3
                    style={[{ color: color }]} size={25} name={'mailbox'} />
                ),
              }}
            />
            <Tab.Screen
              name="Profil"
              options={{
                tabBarLabel: 'Profil',
                tabBarIcon: ({ color }) => (
                  <Icon2
                    style={[{ color: color }]} size={25} name={'user'} />
                ),
              }}
            >
              {()=><ProfileScreen deconnect={this.props.deconnect} />}
              </Tab.Screen>
          </Tab.Navigator>
      </NavigationContainer>
    )
  }
}



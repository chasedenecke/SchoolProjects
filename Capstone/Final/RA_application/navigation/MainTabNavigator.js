import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SurveyScreen from '../screens/SurveyScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import CameraScreen from '../screens/CameraScreen';
import SubmitScreen from '../screens/SubmitScreen';
import JointScreen from '../screens/JointScreen';


const SurveyStack = createStackNavigator({
  Survey: SurveyScreen,
  Joint: JointScreen,
  Camera: CameraScreen,
  Submit: SubmitScreen,
});

//ios-clipboard
SurveyStack.navigationOptions = ({ navigation }) => {
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  let isVisible = true;
  if (routeName == 'Camera' | routeName == 'Joint'| routeName == 'Submit') {
    isVisible = false;
  }

  return {
    tabBarLabel: 'Survey',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? 'ios-clipboard' : 'md-clipboard'}
      />
    ),
    tabBarVisible: isVisible,
  };
};

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});
//ios-home
HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
        ? `ios-hand`
        : 'md-hand'
      }
    />
  ),
};


const AboutUsStack = createStackNavigator({
  AboutUs: AboutUsScreen,
});

AboutUsStack.navigationOptions = {
  tabBarLabel: 'About Us',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : `md-information-circle${focused ? '' : '-outline'}`
      }
    />
  ),
};

export default createBottomTabNavigator({
  SurveyStack,
  HomeStack,
  AboutUsStack,
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.tintColorActive,
      inactiveTintColor: Colors.tintColorDefault,
      inactiveBackgroundColor: Colors.tabBarBackground,
      activeBackgroundColor: Colors.tabBarBackground,
    },
  }
);

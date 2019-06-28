import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import NetworkSetupScreen from '../screens/NetworkSetupScreen';

export default createAppContainer(createSwitchNavigator(
  {
    NetworkSetup: NetworkSetupScreen,
    Main: MainTabNavigator,
  },
  {
    initialRouteName: 'NetworkSetup',
  }
));
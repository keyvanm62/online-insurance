import React from "react";
import { View, Text} from "react-native";
import { Root } from "native-base";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './src/login';
import Register from './src/register';
import Dashboard from './src/dashboard';
import Home from './src/home';
import Forget from './src/forget';
import Location from './src/location';
import Visit from './src/visit';
import Invite from './src/inv';
import Profile from './src/profile';
import Setting from './src/setting';
import List from './src/list';
import Payment from './src/payment';
import Order from './src/order';
import Verify from './src/verify';
import Newpass from './src/newpass';
import Splash from './src/splash';

const MainNavigator = createStackNavigator({
  Splash: {screen: Splash},
  Login: {screen: Login},
  Forget: {screen: Forget},
  Register: {screen: Register},
  Location: {screen: Location},
  Dashboard: {screen: Dashboard},
  Visit: {screen: Visit},
  Home: {screen: Home},
  Invite: {screen: Invite},
  Profile: {screen: Profile},
  Setting: {screen: Setting},
  List: {screen: List},
  Payment: {screen: Payment},
  Order: {screen: Order},
  Verify: {screen: Verify},
  Newpass: {screen: Newpass},
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 }
);

const App = createAppContainer(MainNavigator);

export default () =>
  <Root>
    <App />
  </Root>;

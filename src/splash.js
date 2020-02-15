import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Toast, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Splash extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      password : null,
      username : null,
      showToast: false,
      token : null
    }
  }
  //-------------
  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.checkLogin();
      }
    );
  }
  //-------------
  checkLogin()
  {
    const {navigate} = this.props.navigation;
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/isTokenValid/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "token="+token
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        if(ret.status == true)
        {
          navigate('Dashboard');
        }
        else {
          navigate('Login');
        }
      })
      .done();
    });
  }
  //-------------
  render(){
    const {navigate} = this.props.navigation;
    const {height, width} = Dimensions.get('window');
    return (
      <View style={ styles.container }>
        <ImageBackground source={require('./img/bg.png')} style={styles.backgroundImage} resizeMode='stretch'>
          <View style={ styles.logoHolder }>
            <Image source={require('./img/Logosp.png')} style={styles.logo} />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#f6f8fb'
  },
  holder : {
    width : '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo : {
    width : width * 0.5,
    height : width * 0.5,
    resizeMode: 'contain',
  },
  loginBox : {
    width : '90%' ,
    backgroundColor : '#fdfefe' ,
    borderRadius : 20 ,
    height : width * 0.58,
    marginTop : 15,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2.84,

    elevation: 4,
    marginBottom : 10,
    alignItems: 'center',
  },
  input : {
    width : '90%',
    borderColor : '#c6d1e1' ,
    borderWidth : 1 ,
    borderRadius : 10,
    height : width * 0.16,
    marginTop : 20,
    backgroundColor : '#fdfefe',
    flexDirection : 'row'
  },
  userIcon : {
    width : '15%',
    flexDirection : 'row'
  },
  inputText : {
    width : '85%'
  },
  borderRight : {
    borderRightWidth: 1,
    borderRightColor: '#c6d1e1',
    width : '10%',
    height : width * 0.1,
    marginTop : 8
  },
  userAvatar : {
    width : '90%',
    justifyContent : 'center'
  },
  avatarLogin : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
    marginLeft : 14
  },
  forgetRemember : {
    width : '90%',
    marginTop : 20
  },
  welcomeText : {
    textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.2) , color : '#242e3a' , marginTop : 20
  },
  logoHolder: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: - width * 0.1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
  },
});

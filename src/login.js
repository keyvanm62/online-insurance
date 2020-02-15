import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Toast, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Login extends React.Component {
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
      })
      .done();
    });
  }
  //-------------
  login()
  {
    let username = this.state.username;
    let password = this.state.password;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(username) === false)
    {
      Toast.show({
        text: "Wrong Email!",
        buttonText: "Okay",
        duration: 3000
      })
    }
    else {
      if(password.length < 6) {
        Toast.show({
          text: "Password Required!",
          buttonText: "Okay",
          duration: 3000
        })
      }
      else {
        const {navigate} = this.props.navigation;
        fetch("https://care.archcab.com/CareApi/v1/userLogin", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: "email="+username+"&password="+password
        })
        .then((response) => response.json())
        .then((responseData) => {
          var res = JSON.stringify(responseData);
          var ret = JSON.parse(res);
          if(ret.status == true)
          {
            AsyncStorage.setItem('token', ret.result);
            navigate('Dashboard');
          }
          else {
            Toast.show({
              text: ret.result,
              buttonText: "Okay",
              duration: 3000
            })
          }
        })
        .done();
      }
    }
  }
  //-------------
  render(){
    const {navigate} = this.props.navigation;
    const {height, width} = Dimensions.get('window');
    return (
        <Container style={ styles.container }>
          <Content>
            <View style={styles.holder}>
              <Image source={require('./img/logo.png')} style={styles.logo} />
              <Text style={styles.welcomeText}>Welcome To Medical Care Service</Text>
            </View>
            <View style={styles.holder}>
              <View style={styles.loginBox}>
                <View style={styles.input}>
                  <View style={styles.userIcon}>
                    <View style={styles.userAvatar}>
                      <Image source={require('./img/avatarlogin.png')} style={styles.avatarLogin} />
                    </View>
                    <View style={styles.borderRight}></View>
                  </View>
                  <View style={styles.inputText}>
                    <Input
                      placeholder='Username'
                      style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                      placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                      placeholderTextColor="#c6d1e1"
                      onChangeText={(text) =>this.setState({username:text})}
                    />
                  </View>
                </View>
                <View style={styles.input}>
                  <View style={styles.userIcon}>
                    <View style={styles.userAvatar}>
                      <Image source={require('./img/password.png')} style={styles.avatarLogin} />
                    </View>
                    <View style={styles.borderRight}></View>
                  </View>
                  <View style={styles.inputText}>
                    <Input
                      placeholder='Password'
                      style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                      placeholderTextColor="#c6d1e1"
                      placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                      onChangeText={(text) =>this.setState({password:text})}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
                <View style={styles.forgetRemember}>
                  <TouchableOpacity onPress={() => navigate('Forget')}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#28c7af'}}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.login()} style={{width : '90%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.14 , alignItems:'center' , marginBottom : 10 , marginTop : 20 , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#FFF'}}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate('Location')} style={{width : '90%', borderRadius : 8 , backgroundColor : '#FFF' ,height : width * 0.14 , alignItems:'center' , marginBottom : 20 , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#3c435d'}}>Register</Text>
              </TouchableOpacity>
            </View>
          </Content>
        </Container>
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
  }
});

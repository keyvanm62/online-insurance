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
import { Toast, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Verify extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      email : null,
      code : null
    }
  }
  //------------
  forget()
  {
    const {navigate} = this.props.navigation;
    let email = this.props.navigation.state.params.email;
    let code = this.state.code;
    if(code == null)
    {
      Toast.show({
        text: "Wrong Email!",
        buttonText: "Okay",
        duration: 3000
      })
    }
    else {
      fetch("https://care.archcab.com/CareApi/v1/userCheckToken", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "email="+email+"&smstoken="+code
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        if(ret.status == false)
        {
          Toast.show({
            text: "Invalid Code!",
            buttonText: "Okay",
            duration: 3000
          })
        }
        else {
          navigate('Newpass' , {email : email , code : code});
        }
        console.log(ret);
      })
      .done();
    }
  }
  //------------
  render(){
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    return (
        <Container style={ styles.container }>
          <Content>
          <Button transparent onPress={() => this.props.navigation.goBack()} style={{marginTop : 25 , marginLeft : 10}}>
            <Image source={require('./img/left-arrow.png')} style={styles.arrowLeft} />
          </Button>
          <View style={styles.holder , { marginTop : -55 , justifyContent : 'center' , alignItems : 'center'}}>
            <Image source={require('./img/logo.png')} style={styles.logo} />
          </View>
          <View style={styles.holderText}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2.3) , color : '#242e3a' }}>Recover Password</Text>
          </View>
          <View style={styles.holderText , { marginTop : 10 , marginLeft : 20}}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.2) , color : '#242e3a' }}>Enter the Code who sent to your Email</Text>
          </View>
          <View style={styles.holder}>
            <View style={styles.loginBoxOneCols}>
            <View style={styles.input}>
              <View style={styles.userIcon}>
                <View style={styles.userAvatar}>
                  <Image source={require('./img/password.png')} style={styles.avatarLogin} />
                </View>
                <View style={styles.borderRight}></View>
              </View>
              <View style={styles.inputText}>
                <Input
                  placeholder='Insert Your Code'
                  keyboardType='numeric'
                  style={{fontSize : RFPercentage(2) , width : '100%' , marginLeft : 10}}
                  placeholderTextColor="#c6d1e1"
                  onChangeText={(text) =>this.setState({code:text})}
                  style={{fontSize : RFPercentage(2) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular' , marginTop : -5}}
                  placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                />
              </View>
            </View>
            </View>
          </View>
          <View style={styles.holder}>
            <TouchableOpacity onPress={() => this.forget()} style={{width : '90%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.15 , alignItems:'center' , marginBottom : 10 , marginTop : 20 , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#FFF'}}>Validate</Text>
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
    borderRadius : 10 ,
    height : 325,
    marginTop : 15,
    marginBottom : 10,
    alignItems: 'center',
    flexDirection : 'column'
  },
  input : {
    width : '90%',
    borderRadius : 10,
    height : width * 0.2,
    marginTop : 8,
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
    height : width * 0.15,
    marginTop : 8
  },
  userAvatar : {
    width : '90%'
  },
  avatarLogin : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
    marginTop : 20,
    marginLeft : 6
  },
  forgetRemember : {
    width : '90%',
    marginTop : 20
  },
  arrowLeft : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
  },
  holderText : {
    width : '100%',
    paddingLeft : 20
  },
  twoRows : {
    width : '100%',
    flexDirection : 'row'
  },
  inputLeft : {
    width : '50%',
    borderRightWidth: 1,
    borderRightColor: '#c6d1e1',
    borderBottomWidth: 1,
    borderBottomColor: '#c6d1e1',
    height : 80,
    flexDirection : 'column'
  },
  inputRight : {
    width : '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#c6d1e1',
    height : 80,
    flexDirection : 'column'
  },
  iconBox : {
    flexDirection : 'row',
    width : '100%'
  },
  icon : {
    width : '10%'
  },
  iconLeftSide : {
    marginTop : 10,
    marginLeft : 10,
    width : 15,
    height : 15,
    resizeMode: 'contain',
  },
  textIcon : {
    width : '90%'
  },
  inputLocation : {
    width : '100%',
    height : 60,
  },
  oneBox : {
    width : '100%'
  },
  inputFullWidth : {
    width : '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#c6d1e1',
    height : 80,
    flexDirection : 'column'
  },
  inputLast : {
    width : '100%',
    height : 80,
    flexDirection : 'column'
  },
  loginBoxOneCols : {
    width : '90%' ,
    backgroundColor : '#fdfefe' ,
    borderRadius : 10 ,
    height : width * 0.2,
    marginTop : 15,
    marginBottom : 10,
    alignItems: 'center',
    flexDirection : 'column'
  },
  loginBoxTwoCols : {
    width : '90%' ,
    backgroundColor : '#fdfefe' ,
    borderRadius : 10 ,
    height : 160,
    marginTop : 15,
    marginBottom : 10,
    alignItems: 'center',
    flexDirection : 'column'
  },
  closeIcon: {
    width : 25,
    height : 25,
    resizeMode: 'contain',
  },
  welcomeText : {
    textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : 18 , color : '#242e3a' , marginTop : 20
  }
});

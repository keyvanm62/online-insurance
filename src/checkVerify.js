import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Toast ,Container ,Button, Title , FooterTab , Footer , Content , Drawer} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-community/async-storage';

export default class CheckVerify extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      verify : 0
    }
  }
  //-------------
  componentDidMount() {
    this.forceUpdate();
  }
  //-------------
  forceUpdate()
  {
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/isUserVerify", {
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
        if(ret.status == false)
        {
          this.setState({ verify: 1 });
        }
      })
      .done();
    });
  }
  //----------------
  verifyEmail()
  {
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/userVerify", {
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
        console.log(ret);
        if(ret.status == true)
        {
          Toast.show({
            text: "Verify Email sent to Your Email",
            buttonText: "Okay",
            duration: 3000
          })
        }
      })
      .done();
    });
  }
  //----------------
  render(){
    return (
      <View>
      {this.state.verify == 1?
        <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
          <View style={styles.verifyBox}>
            <View style={styles.verifyTextBox}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Pleae Verify Your Email</Text>
            </View>
            <View style={styles.verifyButtonBox}>
              <TouchableOpacity onPress={() => this.verifyEmail()} style={{width : '90%', borderRadius : 15 , backgroundColor : '#28c7af' ,height : width * 0.1 , alignItems:'center' , marginTop : width * 0.027}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.9) , color : '#FFF' , marginTop : width * 0.028}}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      : null }
      </View>
    );
  }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width : '90%',
    height : width * 0.8,
    backgroundColor : '#f6f8fb',
    position: 'absolute',
    borderRadius : 15
  },
  closeIcon : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
  },
  contactIcon : {
    width : width * 0.1,
    height : width * 0.1,
    resizeMode: 'contain',
  },
  verifyBox : {
    width : '94%',
    height : width * 0.15,
    borderColor : '#28b4ae',
    borderWidth : 1,
    borderRadius : 15,
    flexDirection : 'row',
    marginTop : width * 0.02,
    backgroundColor : '#b0f3e6'
  },
  verifyTextBox : {
    width : '60%',
    paddingTop : width * 0.05,
    paddingLeft : 10
  },
  verifyButtonBox : {
    width : '40%'
  },
});

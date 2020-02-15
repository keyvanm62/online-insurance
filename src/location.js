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
import Geolocation from '@react-native-community/geolocation';
import { Toast, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import Geocoder from 'react-native-geocoder';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Location extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      zip : null,
      error: null,
      latitude : null,
      longitude : null,
    }
  }
  //------------
  location()
  {
    Geolocation.getCurrentPosition(
      info => {
        this.setState({latitude:info.coords.latitude});
        this.setState({longitude:info.coords.longitude});
        var pos = {
          lat: info.coords.latitude,
          lng: info.coords.longitude
        };
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + info.coords.latitude + ',' + info.coords.longitude + '&key=AIzaSyCuKx_kI81GUXeXObVjKJx9mPK1w6yvFNk')
          .then((response) => response.json())
          .then((responseJson) => {
            var res = JSON.stringify(responseJson);
            var ret = JSON.parse(res);
            console.log(ret.results[0].address_components[6].long_name);
            this.setState({zip:ret.results[0].address_components[6].long_name});
            this.zipcode();
        });
      });
  }
  //------------
  zipcode()
  {
    const {navigate} = this.props.navigation;
    let zip = this.state.zip;
    if(zip === '' || zip == null || zip.length < 5)
    {
      Toast.show({
        text: "Wrong ZipCode",
        buttonText: "Okay",
        duration: 3000
      })
    }
    else {
      fetch("https://care.archcab.com/CareApi/v1/isPostalCodeHasService", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "zipcode="+zip
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        if(ret.status == true)
        {
          navigate("Register" , { zipcode : zip });
        }
        else {
          Toast.show({
            text: "This ZipCode is not in Our Location Service",
            buttonText: "Okay",
            duration: 3000
          })
        }
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
          <Header style={styles.headerStyle}>
            <Left style={{flex: 1}}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Image source={require('./img/left-arrow.png')} style={styles.arrowLeft} />
              </Button>
            </Left>
            <Body style={{flex: 1 , alignItems : 'center'}}>
              <Image source={require('./img/logo.png')} style={styles.logo} /></Body>
            <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
          <View style={{backgroundColor : '#f6f8fb' , width : '100%' , marginTop : width * 0.05}}>
            <View style={styles.holderText}>
              <View style={{width : '90%'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2.3) , color : '#242e3a' }}>Your Location</Text>
              </View>
            </View>
            <View style={styles.holderText , { marginTop : 20 , marginLeft : 20}}>
              <View style={{width : '90%'}}>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b' }}>First, Let's Find out if care is Available in your Neighborhood</Text>
              </View>
            </View>
            <View style={styles.locationHolder}>
              <TouchableOpacity onPress={() => this.location()} style={{marginBottom : 10}}>
                <Image source={require('./img/location.png')} style={styles.locationImage} />
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b' }}>Use my Location</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width : '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
          <View style={{backgroundColor : '#f6f8fb' , width : '100%' , paddingBottom : 20}}>
            <View style={styles.holder}>
              <View style={styles.holderText}>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2.3) , color : '#242e3a' , marginTop : 20}}>Zip code</Text>
                </View>
              </View>
              <View style={styles.loginBoxOneCols}>
              <View style={styles.input}>
                <View style={styles.userIcon}>
                  <View style={styles.userAvatar}>
                    <Image source={require('./img/mailbox.png')} style={styles.avatarLogin} />
                  </View>
                  <View style={styles.borderRight}></View>
                </View>
                <View style={styles.inputText}>
                  <Input
                    placeholder='Enter Zip Code'
                    style={{fontSize : RFPercentage(2.1) , width : '100%' , marginLeft : 10}}
                    placeholderTextColor="#c6d1e1"
                    onChangeText={(text) =>this.setState({zip:text})}
                    style={{fontSize : RFPercentage(2.1) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular' , marginTop : -5}}
                    placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                    keyboardType='numeric'
                  />
                </View>
              </View>
              </View>
            </View>
          </View>
          </Content>
          <Footer style={{backgroundColor : '#28c7af'}}>
            <FooterTab style={styles.footer}>
              <TouchableOpacity onPress={() => this.zipcode()} style={{width : '100%' , backgroundColor : '#28c7af' ,height : width * 0.17 , alignItems:'center' , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#FFF'}}>Check Availablity</Text>
              </TouchableOpacity>
            </FooterTab>
          </Footer>
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
    width : width * 0.15,
    height : width * 0.15,
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
  arrowLeft : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
  },
  holderText : {
    width : '100%',
    backgroundColor : '#f6f8fb',
    justifyContent : 'center',
    alignItems : 'center'
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
    height : width * 0.22,
    marginTop : 25,
    marginBottom : 10,
    alignItems: 'center',
    flexDirection : 'column',
  },
  loginBoxTwoCols : {
    width : '90%' ,
    backgroundColor : '#fdfefe' ,
    borderRadius : 10 ,
    height : width * 0.1,
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
  },
  locationHolder : {
    width : '100%',
    alignItems : 'center',
    justifyContent : 'center',
    marginTop : 10
  },
  locationImage : {
    width : width * 0.4,
    height : width * 0.4,
    resizeMode: 'contain',
  },
  footer : {
    backgroundColor : '#28c7af'
  },
  headerStyle : {
    backgroundColor : '#f6f8fb'
  },
  bodyStyle : {
    alignItems: 'flex-end',
    marginRight : width * 0.13
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import { DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Setting extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      notification : 'notification.png',
      switch1Value: false,
      switch2Value: true,
      switch3Value: true,
      switch4Value: true,
    }
  }
  //------------
  toggleSwitch2 = (value) => {
     this.setState({switch2Value: value})
  }
  //------------
  toggleSwitch1 = (value) => {
     this.setState({switch1Value: value})
  }
  //------------
  toggleSwitch3 = (value) => {
     this.setState({switch3Value: value})
  }
  //------------
  toggleSwitch4 = (value) => {
     this.setState({switch4Value: value})
  }
  //------------
  render(){
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    return (
        <Container style={ styles.container }>
          <Header transparent>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Image source={require('./img/left-arrow.png')} style={styles.arrowLeft} />
            </Button>
          </Left>
          <Body style={{flex: 1 , alignItems : 'center'}}>
            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Setting</Text>
          </Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
            <View style={{width: '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.2 , borderRadius : 8}}>
                <View style={{width : '80%' , flexDirection : 'row'}}>
                  <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center'}}>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000' , marginLeft : 10 }}>Apple Health</Text>
                    </View>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8495af', marginTop : 10 , marginLeft : 10 }}>Share your Health Data with your care Doctor</Text>
                    </View>
                  </View>
                </View>
                <View style={{width : '20%' , justifyContent : 'center'}}>
                  <Switch
                    onValueChange = {this.toggleSwitch1}
                    value = {this.state.switch1Value}
                    style={{marginTop : 10}}
                  />
                </View>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.2 , borderRadius : 8}}>
                <View style={{width : '80%' , flexDirection : 'row'}}>
                  <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center'}}>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginLeft : 10 }}>Health Record</Text>
                    </View>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8495af', marginTop : 10 , marginLeft : 10 }}>Share your Health Data with your Care Doctor</Text>
                    </View>
                  </View>
                </View>
                <View style={{width : '20%' , justifyContent : 'center'}}>
                  <Switch
                    onValueChange = {this.toggleSwitch2}
                    value = {this.state.switch2Value}
                    style={{marginTop : 10}}
                  />
                </View>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.2 , borderRadius : 8}}>
                <View style={{width : '80%' , flexDirection : 'row'}}>
                  <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center'}}>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000' , marginLeft : 10 }}>Notification</Text>
                    </View>
                  </View>
                </View>
                <View style={{width : '20%' , justifyContent : 'center'}}>
                  <Switch
                    onValueChange = {this.toggleSwitch3}
                    value = {this.state.switch3Value}
                    style={{marginTop : 10}}
                  />
                </View>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.2 , borderRadius : 8}}>
                <View style={{width : '80%' , flexDirection : 'row'}}>
                  <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center'}}>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginLeft : 10 }}>Location</Text>
                    </View>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8495af', marginTop : 10 , marginLeft : 10 }}>Enable Location to Auto</Text>
                    </View>
                  </View>
                </View>
                <View style={{width : '20%' , justifyContent : 'center'}}>
                  <Switch
                    onValueChange = {this.toggleSwitch4}
                    value = {this.state.switch4Value}
                    style={{marginTop : 10}}
                  />
                </View>
              </View>
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
    width : 190,
    height : 190,
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
    borderColor : '#c6d1e1' ,
    borderWidth : 1 ,
    borderRadius : 10,
    height : 70,
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
    height : 50,
    marginTop : 8
  },
  userAvatar : {
    width : '90%'
  },
  avatarLogin : {
    width : 23,
    height : 23,
    resizeMode: 'contain',
    marginTop : 1
  },
  forgetRemember : {
    width : '90%',
    marginTop : 20
  },
  arrowLeft : {
    width : 20,
    height : 20,
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
    height : 80,
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
  footer : {
    backgroundColor : '#f6f8fb'
  },
  arrowRight : {
    width : 20,
    height : 20,
    resizeMode: 'contain',
  },
  profileImage : {
    width : 80,
    height : 80,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  gift : {
    width : 50,
    height : 50,
    resizeMode: 'contain',
  }
});

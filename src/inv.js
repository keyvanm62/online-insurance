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
import { DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Invite extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      notification : 'notification.png',
    }
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
            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Invite Friend</Text>
          </Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
            <View style={{width: '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , alignItems : 'center' , justifyContent : 'center'}}>
                <Image source={require('./img/logo.png')} style={styles.logo} />
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , alignItems : 'center' , justifyContent : 'center'}}>
                <Image source={require('./img/gift.png')} style={styles.gift} />
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , alignItems : 'center' , justifyContent : 'center'}}>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2.1) , color : '#29bfae'}}>Share Care</Text>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , alignItems : 'center' , justifyContent : 'center'}}>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#1a2f4b'}}>Love Care? Share With Friends</Text>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , alignItems : 'center' , justifyContent : 'center'}}>
                <View style={{width : '20%'}}></View>
                <View style={{width : '15%' , alignItems : 'center' , justifyContent : 'center'}}>
                  <TouchableOpacity onPress={() => console.log('facebook')} style={{width : '100%'}}>
                    <Image source={require('./img/facebook.png')} style={styles.gift} />
                  </TouchableOpacity>
                </View>
                <View style={{width : '15%' , alignItems : 'center' , justifyContent : 'center'}}>
                  <TouchableOpacity onPress={() => console.log('facebook')} style={{width : '100%'}}>
                    <Image source={require('./img/twitter-logo.png')} style={styles.gift} />
                  </TouchableOpacity>
                </View>
                <View style={{width : '15%' , alignItems : 'center' , justifyContent : 'center'}}>
                  <TouchableOpacity onPress={() => console.log('facebook')} style={{width : '100%'}}>
                    <Image source={require('./img/Google.png')} style={styles.gift} />
                  </TouchableOpacity>
                </View>
                <View style={{width : '15%' , alignItems : 'center' , justifyContent : 'center'}}>
                  <TouchableOpacity onPress={() => console.log('facebook')} style={{width : '100%'}}>
                    <Image source={require('./img/instagram2.png')} style={styles.gift} />
                  </TouchableOpacity>
                </View>
                <View style={{width : '20%'}}></View>
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
    width : width * 0.5,
    height : width * 0.5,
    resizeMode: 'contain',
  },
  arrowLeft : {
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
    width : width * 0.1,
    height : width * 0.1,
    resizeMode: 'contain',
  }
});

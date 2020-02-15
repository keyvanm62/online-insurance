import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Container ,Button, Title , FooterTab , Footer , Content , Drawer} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Contact extends React.Component {
  render(){
    return (
        <Container style={ styles.container }>
          <Content>
            <View style={{width : '100%' , flexDirection : 'column'}}>
              <TouchableOpacity onPress={this.props.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center'}}>
                <Image source={require('./img/infromationColor.png')} style={styles.contactIcon} />
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#000' , marginTop : 10 }}>Contact Care</Text>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000' , marginTop : 10 }}>How would you like to contact care?</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('tel:989126183138')} style={{width : '90%', marginTop : 15 , backgroundColor : '#49ba92' , borderRadius : 15 , height : width * 0.13 }}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF' , marginTop : width * 0.045 }}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('mailto:support@example.com') } style={{width : '90%', marginTop : 15 , borderColor : '#5070cc' , borderRadius : 15 , height : width * 0.13 , borderWidth : 1 }}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#5070cc' , marginTop : width * 0.045 }}>Email</Text>
                  </TouchableOpacity>
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
  }
});

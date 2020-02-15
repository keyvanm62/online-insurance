import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Container ,Button, Title , FooterTab , Footer , Content , Drawer} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Error extends React.Component {
  //-------
  render(){
    return (
        <Container style={ styles.container }>
          <Content>
            <View style={{width : '100%' , flexDirection : 'column'}}>
              <TouchableOpacity onPress={this.props.toggle} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#000' , marginTop : 10 }}>Error</Text>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000' , marginTop : 10 }}>{this.props.error}</Text>
                  <TouchableOpacity onPress={() => this.props.toggle()} style={{width : '90%', marginTop : 15 , backgroundColor : '#49ba92' , borderRadius : 15 , height : width * 0.13 }}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF' , marginTop : width * 0.045 }}>Ok</Text>
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
    height : width * 0.5,
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

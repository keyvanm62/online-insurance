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
  FlatList,
} from 'react-native';
import { Toast , DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import Modal from "@kalwani/react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import Error from './error';
import CheckVerify from './checkVerify';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Visit extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      notification : 'notification.png',
      isModalVisible: false,
      isModalVisible5: false,
      id : 0,
      service : [{}],
      visitDate : [{}],
      selectedDate : 0.1,
      selectedTime : 0.1,
      refreshTime : null,
      refresh : null,
      visitTime : [{}],
      profileImage : '/Content/Images/Theme/noprofilephoto.jpg',
      name : '',
      startDate : null,
    }
  }
  //------------
  componentDidMount() {
    this.forceUpdate();
  }
  //------------
  forceUpdate()
  {
    const {navigate} = this.props.navigation;
    let chooseToken = this.props.navigation.state.params.token;
    fetch("https://care.archcab.com/CareApi/v1/readUserInformation", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "token="+chooseToken
    })
    .then((response) => response.json())
    .then((responseData) => {
      var res = JSON.stringify(responseData);
      var ret = JSON.parse(res);
      this.setState({ name: ret[0].name});
      this.setState({ profileImage: ret[0].photo});
      console.log(ret);
    })
    .done();
    //----------
    fetch("https://care.archcab.com/CareApi/v1/readServiceList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: ""
    })
    .then((response) => response.json())
    .then((responseData) => {
      var res = JSON.stringify(responseData);
      var ret = JSON.parse(res);
      this.setState({service:ret});
      console.log(ret);
    })
    .done();
    //------
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
        if(ret.status == false)
        {
          navigate('Login');
        }
      })
      .done();
    });
  }
  //------------
  next()
  {
    const {navigate} = this.props.navigation;
    if(this.state.startDate != null)
    {

      navigate('Order' , {
        startDate : this.state.startDate,
        visitDateText : this.state.visitDateText,
        reason : this.state.reason,
        service_id : this.state.id,
        zipcode : this.props.navigation.state.params.zipcode ,
        lat : this.props.navigation.state.params.lat,
        lng : this.props.navigation.state.params.lng,
        address : this.props.navigation.state.params.address,
        patient : this.props.navigation.state.params.patient,
        ste : this.props.navigation.state.params.ste,
        instruction : this.props.navigation.state.params.instruction,
        token : this.props.navigation.state.params.token
      });
    }
    else {
      this.setState({ errorMessage: 'Please Set Date & Time of Your Visit' });
      this.toggleModal1();
    }
  }
  //------------
  datePick(id , date)
  {
    this.setState({
        refresh: !this.state.refresh,
        selectedDate : id,
        visitDateText : date
    });
    const {navigate} = this.props.navigation;
    let zipcode = this.props.navigation.state.params.zipcode;
    let service = this.state.id;
    fetch("https://care.archcab.com/CareApi/v1/readFreeTimesList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "service_id="+service+"&zipcode="+zipcode+"&date="+date
    })
    .then((response) => response.json())
    .then((responseData) => {
      var res = JSON.stringify(responseData);
      var ret = JSON.parse(res);
      if (ret && ret.length) {
        this.setState({ visitTime: ret });
      }
      else {
        Toast.show({
          text: "Sorry, We don't have Service For Your Selected Date",
          buttonText: "Okay",
          duration: 3000
        })
      }
      console.log(ret);
    })
    .done();
  }
  //------------
  toggleModal1 = () => {
    this.setState({ isModalVisible5: !this.state.isModalVisible5 });
  };
  //------------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //------------
  resume(id)
  {
    const {navigate} = this.props.navigation;
    let zipcode = this.props.navigation.state.params.zipcode;
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/readFreeDatesList", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "service_id="+id+"&zipcode="+zipcode
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        if (ret && ret.length) {
          this.setState({ id: id });
          this.setState({ visitDate: ret });
          this.setState({ isModalVisible: !this.state.isModalVisible });
        }
        else {
          Toast.show({
            text: "Sorry, We don't have Service For Your Selected Service or Zipcode",
            buttonText: "Okay",
            duration: 3000
          })
        }
        console.log(ret);
      })
      .done();
    });
  }
  //------------
  renderVisitDate(index , item)
  {
    const {height, width} = Dimensions.get('window');
    let color;
    let text;
    if(this.state.selectedDate == item)
    {
      color = "#28c7af";
      text = "#FFF";
    }
    else {
      color = "#fdfefe";
      text = "#000";
    }
    return(
      <View>
        <TouchableOpacity onPress={() => this.datePick(item , index.date)}>
           <View style={[styles.timeBox,{ backgroundColor: color}]} >
              <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : text}}>{index.date}</Text>
           </View>
         </TouchableOpacity>
      </View>
    );
  }
  //------------
  renderService(index,item)
  {
    const {height, width} = Dimensions.get('window');
    return(
      <View style={{width : '100%' , marginTop : 20 , backgroundColor : '#FFF' , borderRadius : 15 , height : width * 0.2 , overflow : 'hidden'}}>
        <TouchableOpacity onPress={() => this.resume(index.id)} style={{flexDirection : 'row'}}>
          <View style={{width : '4%' , backgroundColor : '#8591ff' , height : width * 0.2}}></View>
          <View style={{width : '96%' , flexDirection : 'row' , justifyContent : 'center'}}>
            <View style={{width : '20%' , justifyContent : 'center'}}>
              <Image source={{uri: 'https://care.archcab.com'+index.photo}} style={styles.reasonIcon} />
            </View>
            <View style={{width : '80%' , justifyContent : 'center'}}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#1a2f4b' , marginLeft : 5}}>{index.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  renderVisitTime(index ,item)
  {
    const {height, width} = Dimensions.get('window');
    let color;
    let text;
    if(this.state.selectedTime == item)
    {
      color = "#28c7af";
      text = "#FFF";
    }
    else {
      color = "#fdfefe";
      text = "#000";
    }
    return(
      <View>
        <TouchableOpacity onPress={() => this.timePick(item , index.startDate)}>
          <View style={[styles.timeBox1,{ backgroundColor: color}]} >
             <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : text}}>{index.startDate} - {index.endDate}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  timePick(id , startDate)
  {
    this.setState({
        refresh: !this.state.refreshTime,
        selectedTime : id,
        startDate : startDate
    });
  }
  //------------
  setVisit()
  {
    let reason = this.state.reason;
    if(reason == null)
    {
      this.setState({ errorMessage: 'Please Insert Your Reason Details' });
      this.toggleModal1();
    }
    else {
      if(this.state.startDate == null)
      {
        this.setState({ errorMessage: 'Please Pick Date & Time of Your Visit' });
        this.toggleModal1();
      }
      else {
        this.toggleModal();
      }
    }
  }
  //------------
  render(){
    const {navigate} = this.props.navigation;
    const {height, width} = Dimensions.get('window');
    return (
        <Container style={ styles.container }>
          <Header transparent>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Image source={require('./img/left-arrow.png')} style={styles.arrowLeft} />
            </Button>
          </Left>
          <Body style={{flex: 1 , alignItems : 'center'}}>
            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Visit Details</Text>
          </Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
            <CheckVerify />
            <View style={{width: '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20}}>
                <View style={{width : '10%' , justifyContent : 'center'}}>
                  <Image source={require('./img/avatar.png')} style={styles.avatarLogin} />
                </View>
                <View style={{width : '90%' , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b'}}>Patient & Location:</Text>
                </View>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , backgroundColor : '#FFF' , borderRadius : 15 , height : width * 0.25}}>
                <View style={{width : '20%'}}>
                  <View style={{width : width * 0.2 , height : width * 0.2 , borderWidth : 4 , borderColor : '#2896ae' , borderRadius : width * 0.1 , marginLeft : 10 , marginTop : 10 , justifyContent : 'center' , alignItems : 'center'}}>
                    <View style={{width : width * 0.18,height : width * 0.18 , borderRadius : width * 0.09, overflow : 'hidden' , marginTop : 0 , marginLeft : 0 , borderWidth : 2 , borderColor : '#FFF'}}>
                      <Image source={{uri: 'https://care.archcab.com'+this.state.profileImage}} style={styles.profileImage} />
                    </View>
                  </View>
                </View>
                <View style={{width : '80%' , flexDirection : 'column'}}>
                  <View style={{width : '100%' , marginLeft : 30 , marginTop : 20}}>
                    <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>{this.state.name}</Text>
                  </View>
                  <View style={{width : '90%' , marginLeft : 30 , marginTop : 5 , marginRight : 10}}>
                    <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#1a2f4b'}}>{this.props.navigation.state.params.address}</Text>
                  </View>
                </View>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Visit Reason</Text>
              </View>
              <FlatList scrollEnabled={true}
                  keyExtractor={(item , index)=> index}
                  showsVerticalScrollIndicator={false}
                  data={this.state.service}
                  style={{width : '90%'}}
                  renderItem={({item,index}) => this.renderService(item,index)}
              />
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Date & Time</Text>
              </View>
              {this.state.startDate == null?
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , height : width * 0.2 , marginBottom : 20}}>
                  <ImageBackground source={require('./img/Khatchin.png')} style={styles.backgroundImage} resizeMode='stretch'>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Not Set</Text>
                  </ImageBackground>
                </View>
              : null }
              {this.state.startDate != null?
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , height : width * 0.2 , marginBottom : 20}}>
                  <ImageBackground source={require('./img/Khatchin.png')} style={styles.backgroundImage1} resizeMode='stretch'>
                    <View style={{width : '30%' , alignItems : 'center' , justifyContent : 'center'}}>
                      <Image source={require('./img/calendar.png')} style={styles.calenderIcon} />
                    </View>
                    <View style={{width : '70%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Date : {this.state.visitDateText}</Text>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , marginTop : 3}}>Time : {this.state.startDate}</Text>
                    </View>
                  </ImageBackground>
                </View>
              : null }
            </View>
          </Content>
          <Footer style={{backgroundColor : '#28c7af'}}>
            <FooterTab style={styles.footer}>
              <TouchableOpacity onPress={() => this.next()} style={{width : '100%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.18 , alignItems:'center' , marginBottom : 20 , flexDirection : 'row' , justifyContent : 'center'}}>
                <View style={{width : '55%' , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#FFF' , marginTop : -5}}>Continue</Text>
                </View>
                <View style={{width : '45%' , paddingLeft : 10 , justifyContent : 'center'}}>
                  <Image source={require('./img/right-arrow.png')} style={styles.arrowRight} />
                </View>
              </TouchableOpacity>
            </FooterTab>
          </Footer>
          <Modal isVisible={this.state.isModalVisible} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Date</Text>
              <View style={{width : '100%' , height : width * 0.25 , padding : 20 , marginTop : -20}}>
                <ScrollView stickyHeaderIndices={[0]} style={{flex : 1}} horizontal >
                  <View>
                    <View style={{flex: 1, flexDirection: 'row' , marginTop : 5}}>
                      <View style={{flexDirection : 'column'}}>
                        <FlatList scrollEnabled={true}
                            keyExtractor={(item , index)=> index}
                            showsVerticalScrollIndicator={false}
                            data={this.state.visitDate}
                            style={{width : '100%'}}
                            horizontal
                            renderItem={({item,index}) => this.renderVisitDate(item,index)}
                            extraData={this.state.refresh}
                        />
                      </View>
                     </View>
                  </View>
                 </ScrollView>
              </View>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , marginTop : -10 , marginLeft : 20}}>Time</Text>
              <View style={{width : '100%' , height : width * 0.25 , padding : 20 , marginTop : -20}}>
                <ScrollView stickyHeaderIndices={[0]} style={{flex : 1}} horizontal >
                  <View>
                    <View style={{flex: 1, flexDirection: 'row' , marginTop : 5}}>
                      <View style={{flexDirection : 'column'}}>
                        <FlatList scrollEnabled={true}
                            keyExtractor={(item , index)=> index}
                            showsVerticalScrollIndicator={false}
                            data={this.state.visitTime}
                            style={{width : '100%'}}
                            horizontal
                            renderItem={({item,index}) => this.renderVisitTime(item,index)}
                            extraData={this.state.refreshTime}
                        />
                      </View>
                     </View>
                  </View>
                 </ScrollView>
              </View>
              <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , marginTop : 20 , marginLeft : 20}}>Details</Text>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center' , height : 150 , marginTop : 10}}>
                <View style={{backgroundColor : '#FFF' , width : '90%' , borderRadius : 15 , height : 150}}>
                  <Input
                    placeholder='Describe Symptoms for the doctor'
                    style={{fontSize : RFPercentage(1.6) , width : '100%'}}
                    placeholderTextColor="#c6d1e1"
                    onChangeText={(text) =>this.setState({reason:text})}
                    style={{fontSize : RFPercentage(1.6) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular' , marginTop : 10}}
                    placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                    multiline={true}
                  />
                </View>
              </View>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <TouchableOpacity onPress={() => this.setVisit()} style={{width : '90%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.15 , alignItems:'center' , marginBottom : 10 , marginTop : 20 , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>Set Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible5} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal1}>
            <Error toggle={this.toggleModal1} error={this.state.errorMessage}/>
          </Modal>
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
    width : 70,
    height : 70,
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
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
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
    backgroundColor : '#28c7af'
  },
  arrowRight : {
    width : 20,
    height : 20,
    resizeMode: 'contain',
  },
  profileImage : {
    width : width * 0.18,
    height :  width * 0.18,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  reasonIcon : {
    width : width * 0.07,
    height :  width * 0.07,
    resizeMode: 'contain',
    marginLeft : 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
  },
  backgroundImage1 :
  {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
    flexDirection : 'row'
  },
  timeBox : {
    borderRadius : 20 ,
    height : width * 0.08,
    marginTop : 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2.84,

    elevation: 4,
    width : width * 0.27,
    marginRight : 10,
    justifyContent : 'center',
    alignItems : 'center'
  },
  timeBox1 : {
    backgroundColor : '#fdfefe' ,
    borderRadius : 20 ,
    height : width * 0.08,
    marginTop : 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2.84,

    elevation: 4,
    alignItems: 'center',
    justifyContent : "center",
    width : width * 0.27,
    marginRight : 10
  },
  calenderIcon :{
    width : width * 0.08,
    height : width * 0.08,
    resizeMode: 'contain',
  }
});

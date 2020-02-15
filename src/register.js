import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Toast, DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Register extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      isModalVisible: false,
      isModalVisible1: false,
      selected2: 1,
      sex : [
        {
          name: 'Insert Your Sex',
          id: 1,
        },
      ],
      name : null,
      family : null,
      email : null,
      phone : null,
      password : null,
      reason : [{}],
      hear : [{}],
      hearId : null,
      reasonId : null,
      birth : null,
      hearText : 'How did about Medical Care App?',
      reasonText : 'What is Your May Reason?',
      token : null,
      sexId : 1,
    }
  }
  //------------
  toggleModalTwo = () => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //------------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //------------
  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.forceUpdate();
      }
    );
  }
  //------------
  forceUpdate()
  {
    fetch("https://care.archcab.com/CareApi/v1/readSexList", {
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
      this.setState({ sex: ret});
    })
    .done();
    //-----------------
    fetch("https://care.archcab.com/CareApi/v1/readMainReasonList", {
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
      this.setState({ reason: ret});
    })
    .done();
    //-----------------
    fetch("https://care.archcab.com/CareApi/v1/readHearAppList", {
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
      this.setState({ hear: ret});
    })
    .done();
  }
  //------------
  onValueChange2(value: string) {
    this.setState({
      selected2: value,
      sexId : value.id
    });
  }
  //------------
  register()
  {
    const {navigate} = this.props.navigation;
    let name = this.state.name;
    let family = this.state.family;
    let password = this.state.password;
    let phone = this.state.phone;
    let email = this.state.email;
    let sex = this.state.sexId;
    let reason = this.state.reasonId;
    let hear = this.state.hearId;
    let birth = this.state.birth;
    let myDate = new Date(birth);
    let year = myDate.getFullYear();
    let month = (1 + myDate.getMonth()).toString().padStart(2, '0');
    let day = myDate.getDate().toString().padStart(2, '0');
    let pickedTime = year + '/' + day + '/' + month;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(name == null)
    {
      Toast.show({
        text: "Name is Required. You must be Fill it",
        buttonText: "Okay",
        duration: 3000
      })
    }
    else {
      if(family == null)
      {
        Toast.show({
          text: "Family is Required. You must be Fill it",
          buttonText: "Okay",
          duration: 3000
        })
      }
      else {
        if(pickedTime == null)
        {
          Toast.show({
            text: "Birthday is Required. You must be Fill it",
            buttonText: "Okay",
            duration: 3000
          });
        }
        else {
          if(sex == null)
          {
            Toast.show({
              text: "Sex is Required. You must be Fill it",
              buttonText: "Okay",
              duration: 3000
            });
          }
          else {
            if(reg.test(email) === false)
            {
              Toast.show({
                text: "Wrong Email!",
                buttonText: "Okay",
                duration: 3000
              });
            }
            else {
              if(password == null & password.length >= 8)
              {
                Toast.show({
                  text: "Password is Required. You must be Fill it",
                  buttonText: "Okay",
                  duration: 3000
                });
              }
              else {
                if(phone == null)
                {
                  Toast.show({
                    text: "Phone is Required. You must be Fill it",
                    buttonText: "Okay",
                    duration: 3000
                  });
                }
                else {
                  if(hear == null || reason == null)
                  {
                    Toast.show({
                      text: "Questions's awnsers is Required.",
                      buttonText: "Okay",
                      duration: 3000
                    });
                  }
                  else {
                    fetch("https://care.archcab.com/CareApi/v1/userRegisteration", {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: "email="+email+"&sex_id="+sex+"&name="+name+"&lastname="+family+"&birthdate="+pickedTime+"&tel="+phone+"&password="+password+"&mediaclcareapp="+hear+"&reason="+reason
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
                      console.log(ret);
                    })
                    .done();
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  //------------
  renderItem(index,item){
    const {height, width} = Dimensions.get('window');
    return(
      <View style={{width: '100%'}}>
        <TouchableOpacity onPress={() => this.pickReason(index.id , index.name)} style={{flex : 1 , flexDirection : 'column'}}>
          <View style={{width: '100%'}}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : 14 , color : '#000', marginTop : 8 , marginLeft : 10 }}>{index.name}</Text>
          </View>
          <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 1 , marginTop : 10}}></View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  renderItem1(index,item){
    const {height, width} = Dimensions.get('window');
    return(
      <View style={{width: '100%'}}>
        <TouchableOpacity onPress={() => this.pickHear(index.id , index.name)} style={{flex : 1 , flexDirection : 'column'}}>
          <View style={{width: '100%'}}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : 14 , color : '#000', marginTop : 8 , marginLeft : 10 }}>{index.name}</Text>
          </View>
          <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 1 , marginTop : 10}}></View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  pickHear(id , name)
  {
    this.setState({hearText: name});
    this.setState({hearId: id});
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  //------------
  pickReason(id , name)
  {
    this.setState({reasonText: name});
    this.setState({reasonId: id});
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  }
  //------------
  render(){
    const {navigate} = this.props.navigation;
    const {height, width} = Dimensions.get('window');
    let jobItems = this.state.sex.map((v,i) => {
      return <Picker.Item key={i} value={v} label={v.name} />
    });
    return (
        <Container style={ styles.container }>
          <Header transparent>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Image source={require('./img/left-arrow.png')} style={styles.arrowLeft} />
            </Button>
          </Left>
          <Body style={{flex: 1 , alignItems : 'center'}}><Image source={require('./img/logo.png')} style={styles.logo} /></Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={styles.holderText}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#242e3a' }}>Register Client</Text>
            </View>
            <View style={styles.holder}>
              <View style={styles.loginBox}>
                <View style={styles.twoRows}>
                  <View style={styles.inputLeft}>
                    <View style={styles.iconBox}>
                      <View style={styles.icon}>
                        <Image source={require('./img/name.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={styles.textIcon}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : 12 }}>First Name</Text>
                      </View>
                    </View>
                    <View style={styles.inputLocation}>
                      <Input
                        placeholder='Insert Your Name'
                        style={{fontSize : RFPercentage(1.6) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#c6d1e1"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : 14 }}
                        onChangeText={(text) =>this.setState({name:text})}
                      />
                    </View>
                  </View>
                  <View style={styles.inputRight}>
                    <View style={styles.iconBox}>
                      <View style={styles.icon}>
                        <Image source={require('./img/name.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={styles.textIcon}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : 12 }}>Last Name</Text>
                      </View>
                    </View>
                    <View style={styles.inputLocation}>
                      <Input
                        placeholder='Insert Your Last Name'
                        style={{fontSize : RFPercentage(1.6) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#c6d1e1"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' ,fontSize : 14 }}
                        onChangeText={(text) =>this.setState({family:text})}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.twoRows}>
                  <View style={styles.inputLeft}>
                    <View style={styles.iconBox}>
                      <View style={styles.icon}>
                        <Image source={require('./img/cake.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={styles.textIcon}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : 12 }}>Date Of Birth</Text>
                      </View>
                    </View>
                    <View style={styles.inputLocation , { paddingTop : 0}}>
                    <DatePicker
                      defaultDate={new Date(2018, 4, 4)}
                      minimumDate={new Date(1990, 1, 1)}
                      maximumDate={new Date(2018, 12, 31)}
                      locale={"en"}
                      format="YYYY-MM-DD"
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"spinner"}
                      placeHolderText="Select date"
                      textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular',fontSize : RFPercentage(1.6)}}
                      placeHolderTextStyle={{ color: "#d3d3d3" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) }}
                      onDateChange={(text) =>this.setState({birth:text})}
                      disabled={false}
                      />
                    </View>
                  </View>
                  <View style={styles.inputRight}>
                    <View style={styles.iconBox}>
                      <View style={styles.icon}>
                        <Image source={require('./img/gender.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={styles.textIcon}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : 12 }}>Sex</Text>
                      </View>
                    </View>
                    <View style={styles.inputLocation , { marginTop : -7}}>
                      <Picker
                        mode="dropdown"
                        iosHeader="Insert Your Sex"
                        //iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined , fontSize : RFPercentage(1.6) , fontFamily : 'Roboto-Regular'}}
                        placeholder="Insert Your Sex"
                        placeholderStyle={{ color: "#8d949c" ,fontSize : RFPercentage(1.6) }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}
                      >
                        {jobItems}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.oneBox}>
                <View style={styles.inputFullWidth}>
                  <View style={styles.iconBox}>
                    <View style={styles.icon}>
                      <Image source={require('./img/envelop.png')} style={styles.iconLeftSide} />
                    </View>
                    <View style={styles.textIcon}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : 0 }}>Email Address</Text>
                    </View>
                  </View>
                  <View style={styles.inputLocation}>
                    <Input
                      placeholder='Insert Your Email'
                      style={{fontSize : RFPercentage(1.6) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                      placeholderTextColor="#c6d1e1"
                      placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : 14 }}
                      onChangeText={(text) =>this.setState({email:text})}
                    />
                  </View>
                </View>
                </View>
                <View style={styles.oneBox}>
                  <View style={styles.inputLast1}>
                    <View style={styles.iconBox}>
                      <View style={styles.icon}>
                        <Image source={require('./img/password1.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={styles.textIcon}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : 0 }}>Password</Text>
                      </View>
                    </View>
                    <View style={styles.inputLocation}>
                      <Input
                        placeholder='Insert Your Password'
                        style={{fontSize : RFPercentage(1.6) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#c6d1e1"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : 14}}
                        onChangeText={(text) =>this.setState({password:text})}
                        secureTextEntry={true}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.holder}>
              <View style={styles.loginBoxOneCols}>
                <View style={styles.oneBox}>
                  <View style={styles.inputLast}>
                    <View style={styles.iconBox}>
                      <View style={styles.icon}>
                        <Image source={require('./img/smartphone.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={styles.textIcon}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginTop : 8 , marginLeft : -5 }}>Phone Number</Text>
                      </View>
                    </View>
                    <View style={styles.inputLocation}>
                      <Input
                        placeholder='+1 55668879'
                        keyboardType='numeric'
                        style={{fontSize : RFPercentage(1.6) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#c6d1e1"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : 14}}
                        onChangeText={(text) =>this.setState({phone:text})}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.holderText}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#242e3a'  , marginBottom : 5}}>Question:</Text>
            </View>
            <View style={styles.holder}>
              <View style={styles.loginBoxOneCols}>
                <View style={styles.oneBox}>
                  <View style={styles.inputLast}>
                    <TouchableOpacity onPress={() => this.toggleModal()} style={{flex : 1}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c',marginLeft : 10 , marginTop : 25 }}>{this.state.hearText}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.holder}>
              <View style={styles.loginBoxOneCols}>
                <View style={styles.oneBox}>
                  <View style={styles.inputLast}>
                    <TouchableOpacity onPress={() => this.toggleModalTwo()} style={{flex : 1}}>
                    <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c',marginLeft : 10 , marginTop : 25 }}>{this.state.reasonText}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Content>
          <Footer style={{backgroundColor : '#28c8ae'}}>
            <FooterTab style={styles.footer}>
              <TouchableOpacity onPress={() => this.register()} style={{width : '100%'}}>
                <View style={{width : '100%' , alignItems: 'center',justifyContent: 'center' , height : width * 0.18 , backgroundColor : '#28c8ae' , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#FFF'}}>Finish</Text>
                </View>
              </TouchableOpacity>
            </FooterTab>
          </Footer>
          <Modal isVisible={this.state.isModalVisible} style={{alignItems: 'center',flexDirection : 'column'}}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>How did you find out about Care Excellence?</Text>
              <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 2 , marginTop : 10}}></View>
              <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                <FlatList style={{margin : 5 , width : '90%' }} scrollEnabled={true}
                    keyExtractor={(item , index)=>'key'+index}
                    showsVerticalScrollIndicator={false}
                    data={this.state.hear}
                    renderItem={({item,index}) => this.renderItem1(item,index)}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible1} style={{alignItems: 'center',flexDirection : 'column'}}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModalTwo} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>What is Your Main Reason?</Text>
              <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 2 , marginTop : 10}}></View>
              <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                <FlatList style={{margin : 5 , width : '90%' }} scrollEnabled={true}
                    keyExtractor={(item , index)=>'key'+index}
                    showsVerticalScrollIndicator={false}
                    data={this.state.reason}
                    renderItem={({item,index}) => this.renderItem(item,index)}
                />
              </View>
            </View>
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
    width : width * 0.15,
    height : width * 0.15,
    resizeMode: 'contain',
  },
  loginBox : {
    width : '90%' ,
    backgroundColor : '#fdfefe' ,
    borderRadius : 10 ,
    height : width * 0.7,
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
    marginTop : 40,
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
    width : 20,
    height : 20,
    resizeMode: 'contain',
    marginTop : 20,
    marginLeft : 14
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
    height : width * 0.16,
    flexDirection : 'column'
  },
  inputRight : {
    width : '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#c6d1e1',
    height : width * 0.16,
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
    width : '90%',
    justifyContent : 'center'
  },
  inputLocation : {
    width : '100%',
    height : width * 0.1,
    justifyContent : 'center'
  },
  oneBox : {
    width : '100%'
  },
  inputFullWidth : {
    width : '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#c6d1e1',
    height : width * 0.18,
    flexDirection : 'column'
  },
  inputLast : {
    width : '100%',
    height : width * 0.15,
    flexDirection : 'column'
  },
  inputLast1 : {
    width : '100%',
    height : width * 0.15,
    flexDirection : 'column'
  },
  loginBoxOneCols : {
    width : '90%' ,
    backgroundColor : '#fdfefe' ,
    borderRadius : 10 ,
    height : width * 0.18,
    marginTop : 5,
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
    backgroundColor : '#28c8ae'
  }
});

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
  Switch,
  FlatList,
} from 'react-native';
import { DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import Modal from "@kalwani/react-native-modal";
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Error from './error';
import CheckVerify from './checkVerify';

export default class Profile extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      isModalVisible: false,
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      isModalVisible4: false,
      isModalVisible5: false,
      isModalVisible6: false,
      avatarSource: null,
      sex : [
        {
          name: 'Insert Your Sex',
          id: 1,
        },
      ],
      switch1Value: false,
      switch2Value: false,
      memberList : [{}],
      avatarSource: null,
      uploadImage : null,
      relationship : [{}],
      secondContact : 0,
      chosenDate: new Date(),
      profile_token : null,
      deleteShow : 0,
      profilePhoto : '/Content/Images/Theme/noprofilephoto.jpg',
    }
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.setDate = this.setDate.bind(this);
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
  componentDidMount() {
    this.forceUpdate();
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        const {navigate} = this.props.navigation;
        if(this.props.navigation.state.params.new == 1)
        {
          this.toggleModal1();
        }
      }
    );
  }
  //------------
  forceUpdate()
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
        if(ret.status == false)
        {
          navigate('Login');
        }
      })
      .done();
      //----------
      fetch("https://care.archcab.com/CareApi/v1/readMemberList", {
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
        this.setState({ memberList: ret});
      })
      .done();
      //-----------
    });
    //---------
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
    //---------
    fetch("https://care.archcab.com/CareApi/v1/readRelationshipList", {
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
      this.setState({ relationship: ret});
    })
    .done();
  }
  //------------
  setRelationship(id , type)
  {
    this.setState({ relationshipId: id});
    if(type == 2)
    {
      this.toggleModal2();
    }
    else {
      this.toggleModal5();
    }

  }
  //------------
  renderRelationship(index,item)
  {
    var {height, width} = Dimensions.get('window');
    return(
      <View style={{width : '100%' , flexDirection : 'column'}}>
        <TouchableOpacity onPress={() => this.setRelationship(index.id , 2)} style={{flex : 1 , flexDirection : 'column'}}>
          <View style={{width: '100%'}}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginTop : 8 , marginLeft : 10 }}>{index.name}</Text>
          </View>
          <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 1 , marginTop : 10}}></View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  renderRelationship1(index,item)
  {
    var {height, width} = Dimensions.get('window');
    return(
      <View style={{width : '100%' , flexDirection : 'column'}}>
        <TouchableOpacity onPress={() => this.setRelationship(index.id , 1)} style={{flex : 1 , flexDirection : 'column'}}>
          <View style={{width: '100%'}}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginTop : 8 , marginLeft : 10 }}>{index.name}</Text>
          </View>
          <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 1 , marginTop : 10}}></View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  openProfile(token)
  {
    let newtoken = token;
    AsyncStorage.getItem('token', (err , token) => {
      if(newtoken != token)
      {
        this.setState({ deleteShow: 1});
      }
      else {
        this.setState({ deleteShow: 0});
      }
    });
    fetch("https://care.archcab.com/CareApi/v1/readSecondary", {
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
      this.setState({ esname: ret[0].Name});
      this.setState({ esfamily: ret[0].Lastname});
      this.setState({ esphone: ret[0].Phone});
      this.setState({ relationshipId: ret[0].Relation});
    })
    .done();
    //--------
    fetch("https://care.archcab.com/CareApi/v1/readInsuranceStatus", {
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
      this.setState({ switch1Value: ret[0]['medicare']});
      this.setState({ switch2Value: ret[0]['useinsurance']});
    })
    .done();
    //--------
    fetch("https://care.archcab.com/CareApi/v1/readUserInformation", {
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
      //console.log(ret);
      this.setState({ ename: ret[0]['fname']});
      this.setState({ efamily: ret[0]['lname']});
      this.setState({ eemail: ret[0]['email']});
      this.setState({ ephone: ret[0]['tel']});
      this.setState({ profilePhoto: ret[0]['photo']});
      this.setState({ selected2: ret[0]['sex']});
    })
    .done();
    this.setState({profile_token: token});
    this.toggleModal();
  }
  //------------
  renderAddress(index,item)
  {
    var {height, width} = Dimensions.get('window');
    return(
      <View style={{width : '25%'}}>
        <TouchableOpacity onPress={() => this.openProfile(index.id)} style={{flex : 1}}>
          <View style={{width : width * 0.2 , height :  width * 0.2 , borderRadius : width * 0.1 , overflow : 'hidden'}}>
            <Image source={{uri: 'https://care.archcab.com'+index.photo}} style={styles.patient} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  registerProfile()
  {
    let name = this.state.name;
    let family = this.state.family;
    let image_url = this.state.uploadImage;
    let phone = this.state.phone;
    let email = this.state.email;
    let birth = this.state.chosenDate;
    let sex = this.state.sexId;
    let enrolled = this.state.switch1Value;
    let insurance = this.state.switch2Value;
    let myDate = new Date(birth);
    let year = myDate.getFullYear();
    let month = (1 + myDate.getMonth()).toString().padStart(2, '0');
    let day = myDate.getDate().toString().padStart(2, '0');
    let pickedTime = year + '/' + day + '/' + month;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(name == null)
    {
      this.setState({ errorMessage: 'Please Insert Name' });
      this.toggleModal3();
    }
    else {
      if(family == null)
      {
        this.setState({ errorMessage: 'Please Insert Family' });
        this.toggleModal3();
      }
      else {
        if(pickedTime == null)
        {
          this.setState({ errorMessage: 'Please Insert Birthday' });
          this.toggleModal3();
        }
        else {
          if(sex == null)
          {
            this.setState({ errorMessage: 'Please Select Sex' });
            this.toggleModal3();
          }
          else {
            if(reg.test(email) === false)
            {
              this.setState({ errorMessage: 'Please Insert Email' });
              this.toggleModal3();
            }
            else {
              if(phone == null)
              {
                this.setState({ errorMessage: 'Please Insert Phone' });
                this.toggleModal3();
              }
              else {
                if(this.state.secondContact == 1)
                {
                  AsyncStorage.getItem('token', (err , token) => {
                    fetch("https://care.archcab.com/CareApi/v1/subUserRegisteration", {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: "email="+email+"&sex_id="+sex+"&name="+name+"&lastname="+family+"&birthdate="+pickedTime+"&tel="+phone+"&token="+token
                    })
                    .then((response) => response.json())
                    .then((responseData) => {
                      var res = JSON.stringify(responseData);
                      var ret = JSON.parse(res);
                      if(ret.status == true)
                      {
                        let image = "/Content/Images/Theme/noprofilephoto.jpg";
                        if(this.state.uploadImage != null)
                        {
                          image = this.state.uploadImage;
                        }
                        console.log(image);
                        let newToken = ret.result;
                        console.log(newToken);
                        console.log('changeProfileImage');
                        fetch("https://care.archcab.com/CareApi/v1/changeProfileImage", {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body: "token="+newToken+"&url="+image
                        })
                        .then((response) => response.json())
                        .then((responseData) => {
                          var res = JSON.stringify(responseData);
                          var ret = JSON.parse(res);
                          console.log(ret);
                        })
                        .done();
                        //-------------
                        console.log(this.state.sphone);
                        fetch("https://care.archcab.com/CareApi/v1/userSecondaryContact", {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body: "token="+newToken+"&name="+this.state.sname+"&lastname="+this.state.sfamily+"&tel="+this.state.sphone+"&relationship="+this.state.relationshipId
                        })
                        .then((response) => response.json())
                        .then((responseData) => {
                          var res = JSON.stringify(responseData);
                          var ret = JSON.parse(res);
                          console.log('userSecondaryContact');
                          console.log(ret);
                        })
                        .done();
                        //--------------
                        fetch("https://care.archcab.com/CareApi/v1/userInsuranceStatus", {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body: "token="+newToken+"&medicare="+enrolled+"&useinsurance="+insurance
                        })
                        .then((response) => response.json())
                        .then((responseData) => {
                          var res = JSON.stringify(responseData);
                          var ret = JSON.parse(res);
                          console.log('userInsuranceStatus');
                          console.log(ret);
                        })
                        .done();
                        //--------------
                        this.forceUpdate();
                        this.toggleModal1();
                      }
                    })
                    .done();
                  });
                }
                else {
                  this.setState({ errorMessage: 'Please Set Secondary Contact' });
                  this.toggleModal3();
                }
              }
            }
          }
        }
      }
    }

  }
  //------------
  onValueChange2(value: string) {
    this.setState({
      selected2: value,
      sexId : value.id
    });
  }
  //---------------
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        let type = response.type.split('/');
        this.setState({
          avatarSource: source,
          data: response.data
        });
        AsyncStorage.getItem('token', (err , token) => {
          let formData = [{}];
          formData = ({
              "extension": type[1],
              "imagedata": 'data:image/jpeg;base64,' + response.data
          });
          fetch("https://care.archcab.com/CareApi/v1/uploadImageTemp", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then((response) => response.json())
          .then((responseData) => {
            var res = JSON.stringify(responseData);
            var ret = JSON.parse(res);
            console.log(ret);
            if(ret.status == true)
            {
              this.setState({ uploadImage: ret.result });
            }
          })
          .done();
        });
      }
    });
  }
  //------------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //------------
  toggleModal1 = () => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //------------
  toggleModal2 = () => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2 });
  };
  //------------
  toggleModal3 = () => {
    this.setState({ isModalVisible3: !this.state.isModalVisible3 });
  };
  //------------
  toggleModal4 = () => {
    this.setState({ isModalVisible4: !this.state.isModalVisible4 });
  };
  //------------
  toggleModal5 = () => {
    this.setState({ isModalVisible5: !this.state.isModalVisible5 });
  };
  //------------
  toggleModal6 = () => {
    this.setState({ isModalVisible6: !this.state.isModalVisible6 });
  };
  //------------
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  //------------
  secondContact(type)
  {
    if(type == 1)
    {
      if(this.state.sname == null)
      {
        this.setState({ errorMessage: 'Please Insert Contact Name' });
        this.toggleModal3();
      }
      else {
        if(this.state.sfamily == null)
        {
          this.setState({ errorMessage: 'Please Insert Contact Family' });
          this.toggleModal3();
        }
        else {
          if(this.state.sphone == null)
          {
            this.setState({ errorMessage: 'Please Insert Contact Phone' });
            this.toggleModal3();
          }
          else {
            if(this.state.relationshipId == null)
            {
              this.setState({ errorMessage: 'Please Choose Relationship Patein' });
              this.toggleModal3();
            }
            else {
              this.setState({ secondContact: 1 });
              this.toggleModal1();
            }
          }
        }
      }
    }
    else {
      if(this.state.esname == null)
      {
        this.setState({ errorMessage: 'Please Insert Contact Name' });
        this.toggleModal3();
      }
      else {
        if(this.state.esfamily == null)
        {
          this.setState({ errorMessage: 'Please Insert Contact Family' });
          this.toggleModal3();
        }
        else {
          if(this.state.esphone == null)
          {
            this.setState({ errorMessage: 'Please Insert Contact Phone' });
            this.toggleModal3();
          }
          else {
            if(this.state.relationshipId == null)
            {
              this.setState({ errorMessage: 'Please Choose Relationship Patein' });
              this.toggleModal3();
            }
            else {
              this.setState({ secondContact: 1 });
              this.toggleModal();
            }
          }
        }
      }
    }
  }
  //------------
  deleteProfile(token)
  {
    fetch("https://care.archcab.com/CareApi/v1/userdelete", {
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
      this.forceUpdate();
      this.toggleModal();
    })
    .done();
  }
  //------------
  editprofile()
  {
    let name = this.state.ename;
    let family = this.state.efamily;
    let image_url = this.state.uploadImage;
    let phone = this.state.ephone;
    let email = this.state.eemail;
    let birth = this.state.chosenDate;
    let sex = this.state.sexId;
    let enrolled = this.state.switch1Value;
    let insurance = this.state.switch2Value;
    let myDate = new Date(birth);
    let year = myDate.getFullYear();
    let month = (1 + myDate.getMonth()).toString().padStart(2, '0');
    let day = myDate.getDate().toString().padStart(2, '0');
    let pickedTime = year + '/' + day + '/' + month;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let userToken = this.state.profile_token;
    if(name == null)
    {
      this.setState({ errorMessage: 'Please Insert Name' });
      this.toggleModal3();
    }
    else {
      if(family == null)
      {
        this.setState({ errorMessage: 'Please Insert Family' });
        this.toggleModal3();
      }
      else {
        if(pickedTime == null)
        {
          this.setState({ errorMessage: 'Please Insert Birthday' });
          this.toggleModal3();
        }
        else {
          if(sex == null)
          {
            this.setState({ errorMessage: 'Please Select Sex' });
            this.toggleModal3();
          }
          else {
            if(reg.test(email) === false)
            {
              this.setState({ errorMessage: 'Please Insert Email' });
              this.toggleModal3();
            }
            else {
              if(phone == null)
              {
                this.setState({ errorMessage: 'Please Insert Phone' });
                this.toggleModal3();
              }
              else {
                if(this.state.secondContact == 1)
                {
                  AsyncStorage.getItem('token', (err , token) => {
                    fetch("https://care.archcab.com/CareApi/v1/UserEditRegisteration", {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: "email="+email+"&sex_id="+sex+"&name="+name+"&lastname="+family+"&birthdate="+pickedTime+"&tel="+phone+"&token="+userToken
                    })
                    .then((response) => response.json())
                    .then((responseData) => {
                      var res = JSON.stringify(responseData);
                      var ret = JSON.parse(res);
                      if(ret.status == true)
                      {
                        if(this.state.uploadImage != null)
                        {
                          image = this.state.uploadImage;
                          fetch("https://care.archcab.com/CareApi/v1/changeProfileImage", {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: "token="+userToken+"&url="+image
                          })
                          .then((response) => response.json())
                          .then((responseData) => {
                            var res = JSON.stringify(responseData);
                            var ret = JSON.parse(res);
                            console.log(ret);
                          })
                          .done();
                        }
                        //-------------
                        fetch("https://care.archcab.com/CareApi/v1/userSecondaryContact", {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body: "token="+userToken+"&name="+this.state.esname+"&lastname="+this.state.esfamily+"&tel="+this.estate.sphone+"&relationship="+this.state.relationshipId
                        })
                        .then((response) => response.json())
                        .then((responseData) => {
                          var res = JSON.stringify(responseData);
                          var ret = JSON.parse(res);
                          console.log('userSecondaryContact');
                          console.log(ret);
                        })
                        .done();
                        //--------------
                        fetch("https://care.archcab.com/CareApi/v1/userInsuranceStatus", {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body: "token="+userToken+"&medicare="+enrolled+"&useinsurance="+insurance
                        })
                        .then((response) => response.json())
                        .then((responseData) => {
                          var res = JSON.stringify(responseData);
                          var ret = JSON.parse(res);
                          console.log('userInsuranceStatus');
                          console.log(ret);
                        })
                        .done();
                        //--------------
                        this.forceUpdate();
                        this.toggleModal();
                      }
                    })
                    .done();
                  });
                }
                else {
                  this.setState({ errorMessage: 'Please Set Secondary Contact' });
                  this.toggleModal3();
                }
              }
            }
          }
        }
      }
    }
  }
  //------------
  render(){
    const {navigate} = this.props.navigation;
    const {height, width} = Dimensions.get('window');
    let jobItems = this.state.sex.map((v,i) => {
      return <Picker.Item style={{fontSize : RFPercentage(1.8)}} itemTextStyle={{ fontSize:12, color: '#d00'}} key={i} value={v} label={v.name} />
    });
    return (
        <Container style={ styles.container }>
          <Header transparent>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Image source={require('./img/left-arrow.png')} style={styles.arrowLeft} />
            </Button>
          </Left>
          <Body style={{flex: 1 , alignItems : 'center'}}>
            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Profile</Text>
          </Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
            <CheckVerify />
            <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center', marginTop : width * 0.06}}>
              <View style={{width : '90%' , flexDirection : 'row'}}>
                <View style={{width : '10%'}}>
                  <Image source={require('./img/avatar.png')} style={styles.avatarIcon} />
                </View>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Tab To Select A Patient:</Text>
                </View>
              </View>
              <View style={{width : '90%' , justifyContent : 'center' , alignItems : 'center'}}>
                <TouchableOpacity onPress={() => this.toggleModal1()} style={{flex : 1}}>
                  <Image source={require('./img/new.png')} style={styles.newImage} />
                </TouchableOpacity>
              </View>
              <View style={{width : '90%' , flexDirection : 'row'}}>
                <FlatList style={{margin : 5 }} scrollEnabled={true}
                          keyExtractor={(item , index)=>'key'+index}
                          showsVerticalScrollIndicator={false}
                          data={this.state.memberList}
                          numColumns={4}                  // set number of columns
                          renderItem={({item,index}) => this.renderAddress(item,index)}/>
              </View>
            </View>
          </Content>
          <Modal isVisible={this.state.isModalVisible} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal}>
            <View style={{ width : '110%', backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              {this.state.deleteShow == 1?
                <TouchableOpacity onPress={() => this.deleteProfile(this.state.profile_token)} style={{width : '30%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#e25e8d' , marginTop : -20 , marginLeft : 20}}>Delete Account</Text>
                </TouchableOpacity>
              : null }
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : width * 0.1 , height : width * 0.1 , borderRadius : 35 , overflow : 'hidden' , borderWidth : 2 , borderColor : '#FFF'}}>
                    {this.state.avatarSource === null ? (
                      <ImageBackground source={{uri: 'https://care.archcab.com'+this.state.profilePhoto}} style={styles.backgroundImage} resizeMode='stretch'>
                        <View style={{width : 54 , height : 54 , borderRadius : 27 , overflow : 'hidden'}}>
                        </View>
                      </ImageBackground>
                    ) : (
                      <ImageBackground source={this.state.avatarSource} style={styles.backgroundImage} resizeMode='stretch'>
                        <View style={{width : 54 , height : 54 , borderRadius : 27 , overflow : 'hidden'}}>
                        </View>
                      </ImageBackground>
                    )}
                </View>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#3c98ef' , marginTop : 8}}>Edit Profile Photo</Text>
                </TouchableOpacity>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 10}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%' , justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>First Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : 5}}>
                      <Input
                        placeholder='Insert Your Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({ename:text})}
                        value={this.state.ename}
                      />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width *0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Last Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : 5}}>
                      <Input
                        placeholder='Insert Your Last Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({efamily:text})}
                        value={this.state.efamily}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/cake.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Date of Birth</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
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
                        textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8)}}
                        placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , marginTop : 10 , marginLeft : 3 }}
                        onDateChange={this.setDate}
                        disabled={false}
                        />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/gender.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Sex</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -5}}>
                      <Picker
                        mode="dropdown"
                        iosHeader="Insert Your Sex"
                        //iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        placeholder="Insert Your Sex"
                        placeholderStyle={{ color: "#000" , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        textStyle={{ color: "#000" , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        itemTextStyle={{ color: "#000" , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        placeholderIconColor="#000"
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}
                      >
                        {jobItems}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%', justifyContent : 'center'}}>
                        <Image source={require('./img/envelop.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '93%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Email Address</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                      <Input
                        placeholder='Insert Your Email'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                        onChangeText={(text) =>this.setState({eemail:text})}
                        value={this.state.eemail}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%' , justifyContent : 'center'}}>
                        <Image source={require('./img/smartphone.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '93%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Phone Number</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                      <Input
                        placeholder='+1 55668879'
                        keyboardType='numeric'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                        onChangeText={(text) =>this.setState({ephone:text})}
                        value = {this.state.ephone}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <TouchableOpacity onPress={() => this.toggleModal5()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000', marginLeft : 10 }}>Secondary Contact</Text>
                    </View>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/right-arrow-color.png')} style={styles.arrowIcon} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '70%' , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000',  marginLeft : 10 }}>Enrolled in Medicaid</Text>
                  </View>
                  <View style={{width : '30%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Switch
                      onValueChange = {this.toggleSwitch1}
                      value = {this.state.switch1Value}
                    />
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.018 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '70%' , flexDirection : 'row'}}>
                    <View style={{width : '50%', justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000' , marginLeft : 10 }}>User Insurance?</Text>
                    </View>
                    <View style={{width : '30%' , justifyContent : 'center'}}>
                      <Image source={require('./img/infromation.png')} style={styles.infoIcons} />
                    </View>
                  </View>
                  <View style={{width : '30%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Switch
                      onValueChange = {this.toggleSwitch2}
                      value = {this.state.switch2Value}
                    />
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.02 , backgroundColor : '#28bdae' , height : width * 0.14 , borderRadius : 8 , marginBottom : width * 0.02}}>
                  <TouchableOpacity onPress={() => this.editprofile()} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.2) , color : '#FFF' , marginTop : 0 }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible1} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal1}>
            <View style={{ width : '110%', backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal1} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : width * 0.1 , height : width * 0.1 , borderRadius : 35 , overflow : 'hidden' , borderWidth : 2 , borderColor : '#FFF'}}>
                    {this.state.avatarSource === null ? (
                      <ImageBackground source={require('./img/default_profile.png')} style={styles.backgroundImage} resizeMode='stretch'>
                        <View style={{width : 54 , height : 54 , borderRadius : 27 , overflow : 'hidden'}}>
                        </View>
                      </ImageBackground>
                    ) : (
                      <ImageBackground source={this.state.avatarSource} style={styles.backgroundImage} resizeMode='stretch'>
                        <View style={{width : 54 , height : 54 , borderRadius : 27 , overflow : 'hidden'}}>
                        </View>
                      </ImageBackground>
                    )}
                </View>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#3c98ef' , marginTop : 8}}>Add Profile Photo</Text>
                </TouchableOpacity>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 10}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%' , justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>First Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , paddingTop : 5}}>
                      <Input
                        placeholder='Insert Your Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({name:text})}
                      />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width *0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Last Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , paddingTop : 5}}>
                      <Input
                        placeholder='Insert Your Last Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({family:text})}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/cake.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Date of Birth</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
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
                        textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8)}}
                        placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , marginTop : 10 , marginLeft : 3 }}
                        onDateChange={this.setDate}
                        disabled={false}
                        />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/gender.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Sex</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -5}}>
                      <Picker
                        mode="dropdown"
                        iosHeader="Insert Your Sex"
                        //iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        placeholder="Insert Your Sex"
                        placeholderStyle={{ color: "#000" , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        textStyle={{ color: "#000" , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        itemTextStyle={{ color: "#000" , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                        placeholderIconColor="#000"
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}
                      >
                        {jobItems}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%', justifyContent : 'center'}}>
                        <Image source={require('./img/envelop.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '93%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Email Address</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                      <Input
                        placeholder='Insert Your Email'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                        onChangeText={(text) =>this.setState({email:text})}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%' , justifyContent : 'center'}}>
                        <Image source={require('./img/smartphone.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '93%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Phone Number</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                      <Input
                        placeholder='+1 55668879'
                        keyboardType='numeric'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                        onChangeText={(text) =>this.setState({phone:text})}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <TouchableOpacity onPress={() => this.toggleModal2()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000', marginLeft : 10 }}>Secondary Contact</Text>
                    </View>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/right-arrow-color.png')} style={styles.arrowIcon} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '70%' , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000',  marginLeft : 10 }}>Enrolled in Medicaid</Text>
                  </View>
                  <View style={{width : '30%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Switch
                      onValueChange = {this.toggleSwitch1}
                      value = {this.state.switch1Value}
                    />
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.018 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '70%' , flexDirection : 'row'}}>
                    <View style={{width : '50%', justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000' , marginLeft : 10 }}>User Insurance?</Text>
                    </View>
                    <View style={{width : '30%' , justifyContent : 'center'}}>
                      <Image source={require('./img/infromation.png')} style={styles.infoIcons} />
                    </View>
                  </View>
                  <View style={{width : '30%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Switch
                      onValueChange = {this.toggleSwitch2}
                      value = {this.state.switch2Value}
                    />
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.02 , backgroundColor : '#28bdae' , height : width * 0.14 , borderRadius : 8 , marginBottom : width * 0.02}}>
                  <TouchableOpacity onPress={() => this.registerProfile()} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.2) , color : '#FFF' , marginTop : 0 }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal2}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal2} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000', marginTop : 8 , marginLeft : 10 }}>Secondary Contact</Text>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.05}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%' , justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>First Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -1}}>
                      <Input
                        placeholder='Insert Your Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({sname:text})}
                        value={this.state.sname}
                      />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Last Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -1}}>
                      <Input
                        placeholder='Insert Your Last Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({sfamily:text})}
                        value={this.state.sfamily}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%', justifyContent : 'center'}}>
                        <Image source={require('./img/smartphone.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '93%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Phone Number</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
                      <Input
                        placeholder='+1 55668879'
                        keyboardType='numeric'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                        onChangeText={(text) =>this.setState({sphone:text})}
                        value={this.state.sphone}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <TouchableOpacity onPress={() => this.toggleModal4()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginLeft : 10 }}>Relationship to Patein</Text>
                    </View>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/right-arrow-color.png')} style={styles.iconLeftSide} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#28bdae' , height : width * 0.13 , borderRadius : 8 , marginBottom : width * 0.05}}>
                  <TouchableOpacity onPress={() => this.secondContact(1)} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#FFF' , marginTop : 0 }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible3} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal3}>
            <Error toggle={this.toggleModal3} error={this.state.errorMessage}/>
          </Modal>
          <Modal isVisible={this.state.isModalVisible4} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal4}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal4} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000', marginTop : 8 , marginLeft : 10 }}>Relationship to Patien</Text>
                </View>
                <View style={{width: '90%' , height : 1 , marginBottom : width * 0.05}}></View>
                <FlatList scrollEnabled={true}
                    style={{width : '90%'}}
                    keyExtractor={(item , index)=>'key'+index}
                    showsVerticalScrollIndicator={false}
                    data={this.state.relationship}
                    renderItem={({item,index}) => this.renderRelationship(item,index)}
                />
                <View style={{width: '90%' , height : 1 , marginBottom : width * 0.1}}></View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible5} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal5}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal5} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000', marginTop : 8 , marginLeft : 10 }}>Secondary Contact</Text>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.05}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%' , justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>First Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -1}}>
                      <Input
                        placeholder='Insert Your Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({esname:text})}
                        value={this.state.esname}
                      />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '10%', justifyContent : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Last Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -1}}>
                      <Input
                        placeholder='Insert Your Last Name'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({esfamily:text})}
                        value={this.state.esfamily}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%', justifyContent : 'center'}}>
                        <Image source={require('./img/smartphone.png')} style={styles.iconLeftSide1} />
                      </View>
                      <View style={{width : '93%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Phone Number</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
                      <Input
                        placeholder='+1 55668879'
                        keyboardType='numeric'
                        style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                        onChangeText={(text) =>this.setState({esphone:text})}
                        value={this.state.esphone}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <TouchableOpacity onPress={() => this.toggleModal6()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginLeft : 10 }}>Relationship to Patein</Text>
                    </View>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/right-arrow-color.png')} style={styles.iconLeftSide} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#28bdae' , height : width * 0.13 , borderRadius : 8 , marginBottom : width * 0.05}}>
                  <TouchableOpacity onPress={() => this.secondContact(2)} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#FFF' , marginTop : 0 }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible6} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal6}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal6} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#000', marginTop : 8 , marginLeft : 10 }}>Relationship to Patien</Text>
                </View>
                <View style={{width: '90%' , height : 1 , marginBottom : width * 0.05}}></View>
                <FlatList scrollEnabled={true}
                    style={{width : '90%'}}
                    keyExtractor={(item , index)=>'key'+index}
                    showsVerticalScrollIndicator={false}
                    data={this.state.relationship}
                    renderItem={({item,index}) => this.renderRelationship1(item,index)}
                />
                <View style={{width: '90%' , height : 1 , marginBottom : width * 0.1}}></View>
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
    width : width * 0.03,
    height : width * 0.03,
    resizeMode: 'contain',
  },
  iconLeftSide1 : {
    width : width * 0.03,
    height : width * 0.03,
    resizeMode: 'contain',
    marginTop : 7,
    marginLeft : 7
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
  },
  avatarIcon : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
  },
  newImage : {
    width : 120,
    height : 120,
    resizeMode: 'contain',
  },
  patient : {
    width : width * 0.2,
    height : width * 0.2,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  profimeImageEdit : {
    width : 150,
    height : 150,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
    alignItems : 'center'
  },
  deleteIcon : {
    width : 20,
    height : 20,
    resizeMode: 'contain',
    marginTop : 17,
    marginLeft : 17
  },
  infoIcon : {
    width : 20,
    height : 20,
    resizeMode: 'contain',
    marginRight : 10
  },
  infoIcons : {
    width : width * 0.03,
    height : width * 0.03,
    resizeMode: 'contain',
  },
  arrowIcon : {
    width : width * 0.03,
    height : width * 0.03,
    resizeMode: 'contain',
  }
});

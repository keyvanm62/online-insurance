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
  FlatList,
  ImageBackground,
} from 'react-native';
import { Toast , DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import Modal from "@kalwani/react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import Error from './error';
import CheckVerify from './checkVerify';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ImagePicker from 'react-native-image-picker';

export default class Order extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      notification : 'notification.png',
      switch2Value: true,
      isModalVisible: false,
      isModalVisible1: false,
      isModalVisible2: false,
      avatarSource: null,
      avatarSource1: null,
      sex : [
        {
          name: 'Insert Your Sex',
          id: 1,
        },
      ],
      price : 0,
      total : 0,
      insurance : [{}],
      insurance_company_name : '',
      chosenDate: new Date(),
      remember : 'Insert Your Member Number',
      fname : 'Insert Your Name',
      lname : 'Insert Your Last Name',
      cards : [{}],
      showCard : 0,
    }
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.selectPhotoTapped1 = this.selectPhotoTapped1.bind(this);
    this.setDate = this.setDate.bind(this);
  }
  //------------
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
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
    const {navigate} = this.props.navigation;
    let zipcode = this.props.navigation.state.params.zipcode;
    let service_id = this.props.navigation.state.params.service_id;
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/getServicePrice", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "token="+token+"&zipcode="+zipcode+"&service_id="+service_id
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        this.setState({ price: ret.fee});
        this.setState({ total: ret.total});
      })
      .done();
      //----------
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
      //--------------
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
        this.setState({ fname: ret[0].fname});
        this.setState({ lname: ret[0].lname});
        this.setState({ sex_id: ret[0].sex});
        this.setState({ cardfront: ret[0].cardfront});
        this.setState({ cardback: ret[0].cardback});
      })
      .done();
      //------------
      fetch("https://care.archcab.com/CareApi/v1/readCardList", {
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
        this.setState({ cards: ret});
        if (ret && ret.length) {
          this.setState({showCard: 1});
          this.setState({last4: ret[0].last4});
          this.setState({card_id: ret[0].id});
          this.setState({brand: ret[0].brand});
        }
      })
      .done();
    });
    //--------
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
    fetch("https://care.archcab.com/CareApi/v1/readInsuranceList", {
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
      this.setState({ insurance: ret});
    })
    .done();
  }
  //------------
  onValueChange2(value: string) {
    this.setState({
      selected2: value,
      sex_id : value.id
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
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        let type = response.type.split('/');
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          image_data: response.data,
          image_type : type[1]
        });
      }
    });
  }
  //----------
  selectPhotoTapped1() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        let type = response.type.split('/');
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource1: source,
          image_data1: response.data,
          image_type1 : type[1]
        });
      }
    });
  }
  //---------------
  toggleModalTwo = () => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //------------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //------------
  toggleModal3 = () => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2 });
  };
  //------------
  toggleSwitch2 = (value) => {
     this.setState({switch2Value: value})
  }
  //------------
  renderInsurance(index , item)
  {
    const {height, width} = Dimensions.get('window');
    return(
      <View style={{width : "100%" , justifyContent : 'center' , alignItems : 'center'}}>
        <TouchableOpacity onPress={() => this.pickInsurance(index.id , index.name)} style={{width : "100%" , justifyContent : 'center' , alignItems : 'center'}}>
          <View style={{width: '90%'}}>
            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#000', marginTop : 8 , marginLeft : 10 }}>{index.name}</Text>
          </View>
          <View style={{width: '90%' , backgroundColor : '#e8ecf1' , height : 1 , marginTop : 10}}></View>
        </TouchableOpacity>
      </View>
    );
  }
  //------------
  pickInsurance(id , name)
  {
    this.setState({ insurance_company_id: id});
    this.setState({ insurance_company_name: id});
    this.toggleModal3();
    this.toggleModal();
  }
  //------------
  updateInsurance()
  {
    const {navigate} = this.props.navigation;
    let birth = this.state.chosenDate;
    let myDate = new Date(birth);
    let year = myDate.getFullYear();
    let month = (1 + myDate.getMonth()).toString().padStart(2, '0');
    let day = myDate.getDate().toString().padStart(2, '0');
    let pickedTime = year + '/' + day + '/' + month;

    let formData = [{}];
    formData = ({
      "token" : this.props.navigation.state.params.token,
      "sex_id": this.state.sex_id,
      "name" : this.state.fname,
      "lastname" : this.state.lastname,
      "birthdate" : pickedTime,
      "type" : this.state.insurance_company_id,
      "insuranceno" : this.state.remember,
      "frontextension" : this.state.image_type,
      "frontimagedata" : 'data:image/jpeg;base64,' + this.state.image_type,
      "backimagedata": 'data:image/jpeg;base64,' + this.state.image_type1,
      "backextension" : this.state.image_type1
    });

    fetch("https://care.archcab.com/CareApi/v1/updateInsurance", {
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
      this.forceUpdate();
      this.toggleModal();
    })
    .done();
  }
  //------------
  deleteCard(id)
  {
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/deleteCard", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "token="+token+"&card="+id
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        this.forceUpdate();
      })
      .done();
    });
  }
  //------------
  renderCard(index,item)
  {
    console.log(item);
    var {height, width} = Dimensions.get('window');
    return(
      <View style={{width : '90%' , flexDirection : 'column' , padding : 3}}>
          <View style={{width : '100%' , flexDirection : 'column' , backgroundColor : '#49ba94' , height : width * 0.27 , borderRadius : 15 , marginTop : 25}}>
            <View style={{width : '100%' , flexDirection : 'row'}}>
              <View style={{width : '50%' , marginLeft : -4 , marginTop : -10}}>
                <Image source={require('./img/tick.png')} style={styles.checkedIcon} />
              </View>
              <View style={{width : '50%' , alignItems: 'flex-end' , paddingRight : 5 , marginTop : 10}}>
                <TouchableOpacity onPress={() => this.deleteCard(index.id)} style={{flex : 1}}>
                  <Image source={require('./img/delete-button.png')} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{width : '100%' , marginTop : 10}}>
              <TouchableOpacity onPress={() => this.pickCard(index.id ,index.last4 , index.brand)} style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , flexDirection : 'column'}}>
                <View style={{width : '80%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>Card Number</Text>
                </View>
                <View style={{width : '80%' , flexDirection : 'row' , marginTop : 10}}>
                  <View style={{width : '20%'}}>
                      <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>{index.first4}</Text>
                  </View>
                  <View style={{width : '5%'}}></View>
                  <View style={{width : '20%'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>****</Text>
                  </View>
                  <View style={{width : '5%'}}></View>
                  <View style={{width : '20%'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>****</Text>
                  </View>
                  <View style={{width : '5%'}}></View>
                  <View style={{width : '20%'}}>
                      <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>{index.last4}</Text>
                  </View>
                </View>
                <View style={{width : '100%' , flexDirection : 'row'}}>
                  <View style={{width : '70%'}}></View>
                  <View style={{width : '30%' , flexDirection : 'row'}}>
                    <View style={{width : "50%" , justifyContent : 'center'}}>
                        <Image source={require('./img/Master.png')} style={styles.masterIcon} />
                    </View>
                    <View style={{width : "50%" , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>{index.brand}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    );
  }
  //-----------
  pickCard(id , last , brand)
  {
    this.setState({showCard: 1});
    this.setState({last4: last});
    this.setState({card_id: id});
    this.setState({brand: brand});
    this.toggleModalTwo();
  }
  //-----------
  addCard()
  {
    this.toggleModalTwo();
    const {navigate} = this.props.navigation;
    navigate('Payment' , { addCard : 1})
  }
  //-----------
  visit()
  {
    const {navigate} = this.props.navigation;
    let chooseToken = this.props.navigation.state.params.token;
    let bank = this.state.card_id;
    let reason = this.props.navigation.state.params.reason;
    //let service_id = this.props.navigation.state.params.service_id;
    //let zipcode = this.props.navigation.state.params.zipcode;
    let googlelat = this.props.navigation.state.params.lat;
    let googlelng = this.props.navigation.state.params.lng;
    let address = this.props.navigation.state.params.address;
    let appartment = this.props.navigation.state.params.ste;
    let instruction = this.props.navigation.state.params.instruction;
    let date = this.props.navigation.state.params.visitDateText;
    //let startDate = this.props.navigation.state.params.startDate;
    let cvbmedicare = this.state.switch2Value;
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
          Toast.show({
            text: "Please Verify Your Account First",
            buttonText: "Okay",
            duration: 3000
          })
        }
        else {
          fetch("https://care.archcab.com/CareApi/v1/reserveDates", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "payertoken="+token+"&zipcode="+this.props.navigation.state.params.zipcode+"&token="+chooseToken+"&cardid="+bank+"&=reason"+reason+"&service_id="+this.props.navigation.state.params.service_id+"&googlelat="+googlelat+"&googlelng="+googlelng+"&address="+address+"&appartment="+appartment+"&instruction="+instruction+"&date="+date+"&startdate="+this.props.navigation.state.params.startDate+"&cvbmedicare="+cvbmedicare
          })
          .then((response) => response.json())
          .then((responseData) => {
            var res = JSON.stringify(responseData);
            var ret = JSON.parse(res);
            navigate('List');
          })
          .done();
        }
      })
      .done();
    });
  }
  //-----------
  render(){
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    let jobItems = this.state.sex.map((v,i) => {
      return <Picker.Item style={{fontSize : 12}} itemTextStyle={{ fontSize:12, color: '#d00'}} key={i} value={v} label={v.name} />
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
            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Payment Details</Text>
          </Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
            <CheckVerify />
            <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center' , flexDirection : 'column'}}>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : 15}}>
                <View style={{width : '10%' , justifyContent : 'center'}}>
                  <Image source={require('./img/business-cards.png')} style={styles.businessIcon} />
                </View>
                <View style={{width : '90%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , }}>Your Visit Has a Flat Free of Only</Text>
                </View>
              </View>
              <View style={{width : '90%' , marginTop : 15 , backgroundColor : '#FFF' , height : width * 0.2 , borderRadius : 10 , justifyContent : 'center'}}>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#c6d1e1'}}>Your Visit</Text>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(3.5) , color : '#49ba93' , marginTop : 0}}>${this.state.price}</Text>
              </View>
              <View style={{width : '90%' , marginTop : 10 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 10}}>
                <TouchableOpacity onPress={() => this.toggleModal()} style={{flex : 1 , flexDirection : 'row'}}>
                  <View style={{width : '10%', marginLeft : 15 , justifyContent : 'center'}}>
                    <Image source={require('./img/avatar.png')} style={styles.businessIcon} />
                  </View>
                  <View style={{width : '70%' , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Add Insurance ( Optional )</Text>
                  </View>
                  <View style={{width : '10%', marginLeft : 23 , justifyContent : 'center'}}>
                    <Image source={require('./img/right-arrow-color.png')} style={styles.businessIcon} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{width : '90%' , marginTop : 10 , flexDirection : 'row'}}>
                <View style={{width : '10%' , justifyContent : 'center'}}>
                  <Image source={require('./img/credit-card-color.png')} style={styles.businessIcon} />
                </View>
                <View style={{width : '70%' , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Payment Method</Text>
                </View>
                <View style={{width : '20%'}}>
                  <TouchableOpacity onPress={() => this.toggleModalTwo()} style={{flex : 1 , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#28bdae' , }}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.showCard == 1?
                <View style={{width : '90%' , flexDirection : 'column' , backgroundColor : '#49ba94' , height : width * 0.25 , borderRadius : 15 , marginTop : 10}}>
                  <View style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '50%' , marginLeft : -3 , marginTop : 0}}>
                    </View>
                    <View style={{width : '50%' , alignItems: 'flex-end' , paddingRight : 10 , marginTop : 10}}>
                    </View>
                  </View>
                  <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , flexDirection : 'column' , marginTop : 10}}>
                      <View style={{width : '80%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#FFF'}}>Card Number</Text>
                      </View>
                      <View style={{width : '80%' , flexDirection : 'row' , marginTop : 5}}>
                        <View style={{width : '20%'}}>
                            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>****</Text>
                        </View>
                        <View style={{width : '5%'}}></View>
                        <View style={{width : '20%'}}>
                          <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>****</Text>
                        </View>
                        <View style={{width : '5%'}}></View>
                        <View style={{width : '20%'}}>
                          <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>****</Text>
                        </View>
                        <View style={{width : '5%'}}></View>
                        <View style={{width : '20%'}}>
                            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>{this.state.last4}</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '70%'}}></View>
                        <View style={{width : '30%' , flexDirection : 'row'}}>
                          <View style={{width : "50%" , justifyContent : 'center'}}>
                              <Image source={require('./img/Master.png')} style={styles.masterIcon} />
                          </View>
                          <View style={{width : "50%" , justifyContent : 'center'}}>
                            <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>{this.state.brand}</Text>
                          </View>
                        </View>
                      </View>
                  </View>
                </View>
              : null }
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.08}}>
                <View style={{width : '10%' , justifyContent : 'center'}}>
                  <Image source={require('./img/invoice.png')} style={styles.businessIcon} />
                </View>
                <View style={{width : '90%' , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>SUMMARY</Text>
                </View>
              </View>
              <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.04}}>
                <View style={{width : '50%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#1a2f4b' , }}>You Pay</Text>
                </View>
                <View style={{width : '50%'}}>
                  <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.6) , color : '#1a2f4b' , }}>${this.state.total}</Text>
                </View>
              </View>
              <View style={{width : '90%'}}>
                <View style={{width : '100%' , borderColor : '#e8ecf1' , borderWidth : 0.6 , marginTop : 10}}></View>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : '#c6d1e1' , marginTop : 5}}>Payment will be Processed 2 Days Before The Visit</Text>
              </View>
              <View style={{width : '90%' , flexDirection : 'row'}}>
                <View style={{width : '85%' , flexDirection : 'row'}}>
                  <View style={{width : '100%' , flexDirection : 'column'}}>
                    <View style={{width : '100%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#000', marginTop : 15 }}>Is Cvb dsrg enrolled in Medicare</Text>
                    </View>
                  </View>
                </View>
                <View style={{width : '15%' , justifyContent : 'center'}}>
                  <Switch
                    onValueChange = {this.toggleSwitch2}
                    value = {this.state.switch2Value}
                    style={{marginTop : 10}}
                  />
                </View>
              </View>
              <View style={{width : '90%'}}>
                <TouchableOpacity onPress={() => this.visit()} style={{width : '100%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.13 , alignItems:'center' , marginBottom : 10 , marginTop : 20 , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#FFF'}}>Book Visit</Text>
                </TouchableOpacity>
              </View>
              <View style={{width : '80%' , marginBottom : 10}}>
                <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#c6d1e1' , marginTop : 5}}>Third Party services such as tab tests and imaging have additional costs,bilied by a third party or to your insurance</Text>
              </View>
            </View>
          </Content>
          <Modal isVisible={this.state.isModalVisible} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal}>
            <View style={{ width : '110%' , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Add Insurance</Text>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 10}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row' , justifyContent : 'center' , marginTop : width * 0.02}}>
                      <View style={{width : '10%' , justifyContent : 'center' , alignItems : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={{width : '90%' , justifyContent : 'center'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginLeft : 10 }}>First Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1}}>
                      <Input
                        placeholder={this.state.fname}
                        style={{fontSize : RFPercentage(1.4) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({fname:text})}
                      />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row' , marginTop : width * 0.02}}>
                      <View style={{width : '10%' , justifyContent : 'center' , alignItems : 'center'}}>
                          <Image source={require('./img/name.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={{width : '90%'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginLeft : 10 }}>Last Name</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1}}>
                      <Input
                        placeholder={this.state.lname}
                        style={{fontSize : RFPercentage(1.4) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#000"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        onChangeText={(text) =>this.setState({family:text})}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row' , marginTop : width * 0.02}}>
                      <View style={{width : '10%' , justifyContent : 'center' , alignItems : 'center'}}>
                          <Image source={require('./img/cake.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={{width : '90%' , justifyContent : 'center'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginLeft : 10 }}>Date of Birth</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -10}}>
                      <DatePicker
                        defaultDate={new Date(2018, 4, 4)}
                        minimumDate={new Date(1990, 1, 1)}
                        maximumDate={new Date(2018, 12, 31)}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"spinner"}
                        placeHolderText="Select date"
                        textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4)}}
                        placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , marginTop : 10 , marginLeft : 3 }}
                        onDateChange={this.setDate}
                        disabled={false}
                        />
                    </View>
                  </View>
                  <View style={{width : '2%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 5 , flexDirection : 'column'}}>
                    <View style={{width : '100%' , flexDirection : 'row' , marginTop : width * 0.02}}>
                      <View style={{width : '10%' , justifyContent : 'center' , alignItems : 'center'}}>
                          <Image source={require('./img/gender.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={{width : '90%' , justifyContent : 'center'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginLeft : 10 }}>Sex</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : -10}}>
                      <Picker
                        mode="dropdown"
                        //iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined , fontSize : RFPercentage(1.4) , fontFamily : 'Roboto-Regular'}}
                        placeholder="Insert Your Sex"
                        placeholderStyle={{ color: "#8d949c" , fontSize : RFPercentage(1.4) , fontFamily : 'Roboto-Regular'}}
                        textStyle={{ color: "#8d949c" , fontSize : RFPercentage(1.4) , fontFamily : 'Roboto-Regular'}}
                        itemTextStyle={{ color: "#8d949c" , fontSize : RFPercentage(1.4) , fontFamily : 'Roboto-Regular'}}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}
                      >
                        {jobItems}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <TouchableOpacity onPress={() => this.toggleModal3()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginLeft : 10 }}>Insurance Provider</Text>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#000', marginTop : 5 , marginLeft : 10 }}>{this.state.insurance_company_name}</Text>
                    </View>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/right-arrow-color.png')} style={styles.iconLeftSide} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , marginTop : 10 , marginLeft : 20}}>Scan Insurance Card</Text>
              <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center' , marginTop : 10}}>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8}}>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , borderRadius : 10 , height : width * 0.18}}>
                    {this.state.avatarSource === null ? (
                      <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)} style={{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
                        <Image source={require('./img/photo-camera.png')} style={styles.photoCamera} />
                        <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Scan Front of Card</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)} style={{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
                        <Image source={this.state.avatarSource} style={styles.photoCamera} />
                        <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Scan Front of Card</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{width : '1%'}}></View>
                  <View style={{width : '49%' , backgroundColor : '#FFF' , borderRadius : 10 , height : width * 0.18}}>
                    {this.state.avatarSource1 === null ? (
                      <TouchableOpacity onPress={this.selectPhotoTapped1.bind(this)} style={{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
                        <Image source={require('./img/photo-camera.png')} style={styles.photoCamera} />
                        <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Scan Back of Card</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={this.selectPhotoTapped1.bind(this)} style={{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
                        <Image source={this.state.avatarSource1} style={styles.photoCamera} />
                        <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Scan Front of Card</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 8 , backgroundColor : '#FFF' , height : width * 0.15 , borderRadius : 8}}>
                  <View style={{width : '100%' , flexDirection : 'column' , marginTop : width * 0.02}}>
                    <View style={{width : '100%' , flexDirection : 'row'}}>
                      <View style={{width : '7%' , justifyContent : 'center' , alignItems : 'center'}}>
                        <Image source={require('./img/credit-card-Black.png')} style={styles.iconLeftSide} />
                      </View>
                      <View style={{width : '93%' , justifyContent : 'center'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#8d949c', marginLeft : 10 }}>Member Card</Text>
                      </View>
                    </View>
                    <View style={{width : '100%' , height : width * 0.1 , marginTop : 0}}>
                      <Input
                        placeholder='Insert Your Member Number'
                        style={{fontSize : RFPercentage(1.4) , width : '100%' , marginLeft : 10 , fontFamily : 'Roboto-Regular'}}
                        placeholderTextColor="#8d949c"
                        placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) }}
                        onChangeText={(text) =>this.setState({remember:text})}
                        keyboardType='numeric'
                      />
                    </View>
                  </View>
                </View>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 10 , backgroundColor : '#28bdae' , height : width * 0.13 , borderRadius : 8 , marginBottom : 5}}>
                  <TouchableOpacity onPress={() => this.updateInsurance()} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                    <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#FFF' , marginTop : 0 }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible1} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModalTwo}>
            <View style={{ width : '110%', backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModalTwo} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Add or Pick Payment</Text>
              <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center' , marginTop : 10}}>
                <View style={{width : '90%' , flexDirection : 'row' , marginTop : 20 , height : width * 0.2 , marginBottom : 20}}>
                  <TouchableOpacity onPress={() => this.addCard()} style={{flex : 1}} >
                    <ImageBackground source={require('./img/Khatchin.png')} style={styles.backgroundImage} resizeMode='stretch'>
                      <View style={{width : '30%' , alignItems : 'center' , justifyContent : 'center'}}>
                        <Image source={require('./img/credit-card-Black.png')} style={styles.calenderIcon} />
                      </View>
                      <View style={{width : '70%' , justifyContent : 'center'}}>
                        <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Add New Card</Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{width : '100%' , marginBottom : 20}}>
                <ScrollView stickyHeaderIndices={[0]} style={{flex : 1}} horizontal >
                  <View>
                    <View style={{flex: 1, marginTop : 5 , flexDirection: 'row'}}>
                      <FlatList scrollEnabled={true}
                          keyExtractor={(item , index)=> index}
                          showsVerticalScrollIndicator={false}
                          data={this.state.cards}
                          horizontal
                          renderItem={({item,index}) => this.renderCard(item,index)}
                      />
                     </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal3}>
            <View style={{ width : '110%', backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal3} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Select Insurance Provider</Text>
              <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 2 , marginTop : 10}}></View>
              <View style={{width : '100%' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                <FlatList scrollEnabled={true}
                    keyExtractor={(item , index)=> index}
                    showsVerticalScrollIndicator={false}
                    data={this.state.insurance}
                    style={{width : '100%' , marginBottom : 20}}
                    renderItem={({item,index}) => this.renderInsurance(item,index)}
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
    marginLeft : 10,
    width : width * 0.04,
    height : width * 0.04,
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
  businessIcon : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
  },
  deleteIcon : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
  },
  photoCamera : {
    width : width * 0.1,
    height : width * 0.1,
    resizeMode: 'contain',
  },
  checkedIcon  : {
    width : 25,
    height : 25,
    resizeMode: 'contain',
  },
  deleteIcon : {
    width : 17,
    height : 17,
    resizeMode: 'contain',
  },
  masterIcon : {
    width : width * 0.1,
    height : width * 0.1,
    resizeMode: 'contain',
  },
  backgroundImage :
  {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
    flexDirection : 'row'
  },
  calenderIcon :{
    width : width * 0.08,
    height : width * 0.08,
    resizeMode: 'contain',
  }
});

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
  KeyboardAvoidingView,
} from 'react-native';
import { DatePicker, PickerItem , Items, Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input , Picker} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Error from './error';
import CheckVerify from './checkVerify';
import Modal from "@kalwani/react-native-modal";

export default class Payment extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      isModalVisible: false,
      isModalVisible1: false,
      isModalVisible2: false,
      cards : [{}],
      chosenDate: new Date(),
      chosenDate1: new Date(),
      selected : 1,
      selectedCard : null
    }
    this.setDate = this.setDate.bind(this);
    this.setDate1 = this.setDate1.bind(this);
  }
  //------------
  setDate1(newDate) {
    this.setState({ chosenDate1: newDate });
  }
  //------------
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  //------------
  toggleModal2 = () => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2 });
  };
  //------------
  toggleModal1 = () => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //------------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //------------
  componentDidMount() {
    this.forceUpdate();
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        const {navigate} = this.props.navigation;
        if(this.props.navigation.state.params.addCard == 1)
        {
          this.toggleModal();
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
      fetch("https://care.archcab.com/CareApi/v1/readCardList", {
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
        this.setState({ cards: ret});
        console.log(ret);
      })
      .done();
      //-----------
    });
  }
  //------------
  addCard()
  {
    let holder = this.state.holder;
    let number = this.state.number;
    let country = this.state.country;
    let state = this.state.state;
    let city = this.state.city;
    let address1 = this.state.address1;
    let address2 = this.state.address2;
    let cvc = this.state.cvc;
    let zipcode = this.state.zipcode;
    let month = this.state.chosenDate1;
    let year = this.state.chosenDate;
    let myDate = new Date(month);
    let month1 = (1 + myDate.getMonth()).toString().padStart(2, '0');
    let myDate1 = new Date(year);
    let year1 = myDate.getFullYear();
    if(holder == null)
    {
      this.setState({ errorMessage: 'Please Insert Holder Name' });
      this.toggleModal1();
    }
    else {
      if(number == null)
      {
        this.setState({ errorMessage: 'Please Insert Card Number' });
        this.toggleModal1();
      }
      else {
        if(country == null)
        {
          this.setState({ errorMessage: 'Please Insert Country Name' });
          this.toggleModal1();
        }
        else {
          if(state == null)
          {
            this.setState({ errorMessage: 'Please Insert State Name' });
            this.toggleModal1();
          }
          else {
            if(city == null)
            {
              this.setState({ errorMessage: 'Please Insert City Name' });
              this.toggleModal1();
            }
            else {
              if(address1 == null)
              {
                this.setState({ errorMessage: 'Please Insert Address' });
                this.toggleModal1();
              }
              else {
                if(zipcode == null)
                {
                  this.setState({ errorMessage: 'Please Insert Zipcode' });
                  this.toggleModal1();
                }
                else {
                  if(cvc == null)
                  {
                    this.setState({ errorMessage: 'Please Insert CVC Number' });
                    this.toggleModal1();
                  }
                  else {
                    if(month == null)
                    {
                      this.setState({ errorMessage: 'Please Insert Exp Month' });
                      this.toggleModal1();
                    }
                    else {
                      if(year == null)
                      {
                        this.setState({ errorMessage: 'Please Insert Exp Year' });
                        this.toggleModal1();
                      }
                      else {
                        AsyncStorage.getItem('token', (err , token) => {
                          fetch("https://care.archcab.com/CareApi/v1/addCard", {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: "token="+token+"&holder="+holder+"&number="+number+"&exp_year="+year1+"&exp_month="+month1+"&cvc="+cvc+"&country="+country+"&state="+state+"&city="+city+"&addr_1="+address1+"&addr_2="+address2+"&zipcode="+zipcode
                          })
                          .then((response) => response.json())
                          .then((responseData) => {
                            var res = JSON.stringify(responseData);
                            var ret = JSON.parse(res);
                            if(res.status == true)
                            {
                              this.forceUpdate();
                              this.toggleModal();
                            }
                            else {
                              this.setState({ errorMessage: "Sorry! We don't support your Card." });
                              this.toggleModal1();
                            }
                          })
                          .done();
                        });
                      }
                    }
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
  editCard(id , last)
  {
    AsyncStorage.getItem('token', (err , token) => {
      this.setState({ selectedCard: id});
      fetch("https://care.archcab.com/CareApi/v1/readCardInformation", {
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
        this.setState({ eholder: ret.holder});
        this.setState({ ecountry: ret.country});
        this.setState({ estate: ret.state});
        this.setState({ ecity: ret.city});
        this.setState({ eaddress1: ret.addr_1});
        this.setState({ eaddress2: ret.addr_2});
        this.setState({ ezipcode: ret.zipcode});
        this.setState({ last4: last});
        this.toggleModal2();
      })
      .done();
    });
  }
  //------------
  updateCard()
  {
    let holder = this.state.holder;
    let country = this.state.country;
    let state = this.state.state;
    let city = this.state.city;
    let address1 = this.state.address1;
    let address2 = this.state.address2;
    let zipcode = this.state.zipcode;
    let month = this.state.chosenDate1;
    let year = this.state.chosenDate;
    let myDate = new Date(month);
    let month1 = (1 + myDate.getMonth()).toString().padStart(2, '0');
    let myDate1 = new Date(year);
    let year1 = myDate.getFullYear();
    if(holder == null)
    {
      this.setState({ errorMessage: 'Please Insert Holder Name' });
      this.toggleModal1();
    }
    else {
      if(country == null)
      {
        this.setState({ errorMessage: 'Please Insert Country Name' });
        this.toggleModal1();
      }
      else {
        if(state == null)
        {
          this.setState({ errorMessage: 'Please Insert State Name' });
          this.toggleModal1();
        }
        else {
          if(city == null)
          {
            this.setState({ errorMessage: 'Please Insert City Name' });
            this.toggleModal1();
          }
          else {
            if(address1 == null)
            {
              this.setState({ errorMessage: 'Please Insert Address' });
              this.toggleModal1();
            }
            else {
              if(zipcode == null)
              {
                this.setState({ errorMessage: 'Please Insert Zipcode' });
                this.toggleModal1();
              }
              else {
                if(month == null)
                {
                  this.setState({ errorMessage: 'Please Insert Exp Month' });
                  this.toggleModal1();
                }
                else {
                  if(year == null)
                  {
                    this.setState({ errorMessage: 'Please Insert Exp Year' });
                    this.toggleModal1();
                  }
                  else {
                    AsyncStorage.getItem('token', (err , token) => {
                      fetch("https://care.archcab.com/CareApi/v1/updateCard", {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: "token="+token+"&holder="+holder+"&exp_year="+year1+"&exp_month="+month1+"&card="+this.state.selectedCard+"&country="+country+"&state="+state+"&city="+city+"&addr_1="+address1+"&addr_2="+address2+"&zipcode="+zipcode
                      })
                      .then((response) => response.json())
                      .then((responseData) => {
                        var res = JSON.stringify(responseData);
                        var ret = JSON.parse(res);
                        if(res.status == true)
                        {
                          this.forceUpdate();
                          this.toggleModal2();
                        }
                      })
                      .done();
                    });
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
    var {height, width} = Dimensions.get('window');
    return(
      <View style={{width : '100%' , flexDirection : 'column' , padding : 3}}>
        {item == 0?
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
              <TouchableOpacity onPress={() => this.editCard(index.id ,index.last4)} style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , flexDirection : 'column'}}>
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
        : null }
        {item != 0?
          <View style={{width : '100%' , flexDirection : 'column' , backgroundColor : '#4d7ac5' , height : width * 0.27 , borderRadius : 15 , marginTop : 15}}>
          <View style={{width : '100%' , flexDirection : 'row'}}>
            <View style={{width : '100%' , alignItems: 'flex-end' , paddingRight : 10 , marginTop : 10}}>
              <TouchableOpacity onPress={() => this.deleteCard(index.id)} style={{flex : 1}}>
                <Image source={require('./img/delete-button.png')} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , flexDirection : 'column' , marginTop : 10}}>
            <TouchableOpacity onPress={() => this.editCard(index.id , index.last4)} style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , flexDirection : 'column'}}>
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
        : null }
      </View>
    );
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
            <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.3) , color : '#1a2f4b'}}>Payment</Text>
          </Body>
          <Right style={{flex: 1}}></Right>
          </Header>
          <Content>
            <View style={{width: '100%' , backgroundColor : '#e8ecf1' , height : 5}}></View>
            <CheckVerify />
            <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center' , marginTop : 20}}>
              <View style={{width : '90%' , flexDirection : 'row'}}>
                <View style={{width : '50%' , flexDirection : 'row'}}>
                  <TouchableOpacity onPress={() => this.toggleModal()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/credit-card-color.png')} style={styles.arrowLeft} />
                    </View>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginLeft : 10}}>Credit Card</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width : '50%'}}>
                  <TouchableOpacity onPress={() => this.toggleModal()} style={{width : '100%' , flexDirection : 'row'}}>
                    <View style={{width : '90%' , justifyContent : 'center'}}>
                      <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginRight : 10}}>Add Card</Text>
                    </View>
                    <View style={{width : '10%' , justifyContent : 'center'}}>
                      <Image source={require('./img/Path.png')} style={styles.arrowLeft} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList scrollEnabled={true}
                  keyExtractor={(item , index)=> index}
                  showsVerticalScrollIndicator={false}
                  data={this.state.cards}
                  style={{width : '90%'}}
                  renderItem={({item,index}) => this.renderCard(item,index)}
              />
            </View>
          </Content>
          <Modal isVisible={this.state.isModalVisible} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal}>
            <View style={{ width : '110%', height : width * 1.55 ,backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Add New Credit Card</Text>
              <ScrollView>
                <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Holder Name</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg Alex'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({holder:text})}
                          value={this.state.holder}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Card Number</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='4444 4444 4444 4444'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({number:text})}
                          value={this.state.number}
                          keyboardType='numeric'
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Country</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg USA'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({country:text})}
                          value={this.state.country}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>State</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg CA'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({state:text})}
                          value={this.state.state}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>City</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg CA'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({city:text})}
                          value={this.state.city}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Address Line 1</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg Smiles Dental Clinic,Poly Park'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({address1:text})}
                          value={this.state.address1}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Address Line 2</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg Smiles Dental Clinic,Poly Park'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({address2:text})}
                          value={this.state.address2}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>ZipCode</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='67832'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({zipcode:text})}
                          value={this.state.zipcode}
                          keyboardType='numeric'
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>CVC</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg 2134'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({cvc:text})}
                          value={this.state.cvc}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : 10}}>
                    <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 8 }}>Exp Month</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
                        <DatePicker
                          defaultDate={new Date(2018, 4, 4)}
                          minimumDate={new Date(1990, 1, 1)}
                          maximumDate={new Date(2018, 12, 31)}
                          locale={"en"}
                          format="YYYY-MM"
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          animationType={"fade"}
                          androidMode={"spinner"}
                          placeHolderText="MM/YY"
                          textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8)}}
                          placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , marginTop : 10 , marginLeft : 3 }}
                          onDateChange={this.setDate1}
                          disabled={false}
                          />
                      </View>
                    </View>
                    <View style={{width : '2%'}}></View>
                    <View style={{width : '49%' , backgroundColor : '#FFF' , height : width *0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 8 }}>Exp Year</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
                        <DatePicker
                          defaultDate={new Date(2018, 4, 4)}
                          minimumDate={new Date(1990, 1, 1)}
                          maximumDate={new Date(2018, 12, 31)}
                          locale={"en"}
                          format="YYYY-MM"
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          animationType={"fade"}
                          androidMode={"spinner"}
                          placeHolderText="MM/YY"
                          textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8)}}
                          placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , marginTop : 10 , marginLeft : 3 }}
                          onDateChange={this.setDate}
                          disabled={false}
                          />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.02 , backgroundColor : '#28bdae' , height : width * 0.14 , borderRadius : 8 , marginBottom : width * 0.02}}>
                    <TouchableOpacity onPress={() => this.addCard()} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                      <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.2) , color : '#FFF' , marginTop : 0 }}>Save Card</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal2}>
            <View style={{ width : '110%', height : width * 1.55 , backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModal2} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Edit Credit Card</Text>
              <ScrollView>
                <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Holder Name</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg Alex'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({eholder:text})}
                          value={this.state.eholder}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Card Number</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='**** **** **** ****'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular' , color : '#8d949c'}}
                          placeholderTextColor="#8d949c"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          editable={false}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Country</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg USA'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({ecountry:text})}
                          value={this.state.ecountry}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>State</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg CA'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({estate:text})}
                          value={this.state.estate}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>City</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg CA'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({ecity:text})}
                          value={this.state.ecity}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Address Line 1</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg Smiles Dental Clinic,Poly Park'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({eaddress1:text})}
                          value={this.state.eaddress1}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>Address Line 2</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='Eg Smiles Dental Clinic,Poly Park'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({eaddress2:text})}
                          value={this.state.eaddress2}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.015 , backgroundColor : '#FFF' , height : width * 0.15 ,  borderRadius : 8 }}>
                    <View style={{width : '100%' , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 10 }}>ZipCode</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -3}}>
                        <Input
                          placeholder='67832'
                          style={{fontSize : RFPercentage(1.8) , width : '100%' , marginLeft : 5 , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#000"
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) }}
                          onChangeText={(text) =>this.setState({ezipcode:text})}
                          value={this.state.ezipcode}
                          keyboardType='numeric'
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : 10}}>
                    <View style={{width : '49%' , backgroundColor : '#FFF' , height : width * 0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 8 }}>Exp Month</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
                        <DatePicker
                          defaultDate={new Date(2018, 4, 4)}
                          minimumDate={new Date(1990, 1, 1)}
                          maximumDate={new Date(2018, 12, 31)}
                          locale={"en"}
                          format="YYYY-MM"
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          animationType={"fade"}
                          androidMode={"spinner"}
                          placeHolderText="MM/YY"
                          textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8)}}
                          placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , marginTop : 10 , marginLeft : 3 }}
                          onDateChange={this.setDate1}
                          disabled={false}
                          />
                      </View>
                    </View>
                    <View style={{width : '2%'}}></View>
                    <View style={{width : '49%' , backgroundColor : '#FFF' , height : width *0.18 , borderRadius : 5 , flexDirection : 'column'}}>
                      <View style={{width : '100%' , flexDirection : 'row'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#8d949c', marginTop : 8 , marginLeft : 8 }}>Exp Year</Text>
                        </View>
                      </View>
                      <View style={{width : '100%' , height : width * 0.1 , marginTop : -8}}>
                        <DatePicker
                          defaultDate={new Date(2018, 4, 4)}
                          minimumDate={new Date(1990, 1, 1)}
                          maximumDate={new Date(2018, 12, 31)}
                          locale={"en"}
                          format="YYYY-MM"
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          animationType={"fade"}
                          androidMode={"spinner"}
                          placeHolderText="MM/YY"
                          textStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8)}}
                          placeHolderTextStyle={{ color: "#000" , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , marginTop : 10 , marginLeft : 3 }}
                          onDateChange={this.setDate}
                          disabled={false}
                          />
                      </View>
                    </View>
                  </View>
                  <View style={{width : '90%' , flexDirection : 'row' , marginTop : width * 0.02 , backgroundColor : '#28bdae' , height : width * 0.14 , borderRadius : 8 , marginBottom : width * 0.02}}>
                    <TouchableOpacity onPress={() => this.updateCard()} style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
                      <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.2) , color : '#FFF' , marginTop : 0 }}>Save Card</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible1} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal1}>
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
  },
  checkedIcon  : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
  },
  deleteIcon : {
    width : width * 0.045,
    height : width * 0.045,
    resizeMode: 'contain',
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
  masterIcon : {
    width : width * 0.1,
    height : width * 0.1,
    resizeMode: 'contain',
  }
});

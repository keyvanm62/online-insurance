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
import { Toast ,Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input } from 'native-base';
import Sidebar from './sidebar';
import Error from './error';
import CheckVerify from './checkVerify';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Modal from "@kalwani/react-native-modal";
import flagImg from './img/maps-and-flags-medium.png';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class Dashboard extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      isModalVisible: false,
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      isModalVisible4: false,
      selectedZipCode : null,
      name : '',
      profileImage : '/Content/Images/Theme/noprofilephoto.jpg',
      memberList : [{}],
      latitude : 37.78825,
      longitude : -122.432,
      address : '',
      mainMap : null,
      addressList : [{}],
      patient : null,
      ste : null,
      instruction : null,
      chooseToken : null,
      newlat : null,
      newlng : null,
      newzip : null,
      newste : null,
      newadderss : null,
      newinstraction : null,
      errorMessage : '',
      sex : 'Male',
    }
  }
  //-------------
  componentDidMount() {
    this.forceUpdate();
  }
  //------------
  forceUpdate()
  {
    const {navigate} = this.props.navigation;
    AsyncStorage.getItem('token', (err , token) => {
      this.setState({ chooseToken: token });
      //console.log(token);
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
      //-------------
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
        this.setState({ name: ret[0].name});
        this.setState({ profileImage: ret[0].photo});
        if(ret[0].sex == 1)
        {
          this.setState({ sex: 'Male'});
        }
        else if(ret[0].sex == 2)
        {
          this.setState({ sex: 'Woman'});
        }
        else {
          this.setState({ sex: 'Other'});
        }
      })
      .done();
      //-------------
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
        //console.log(ret);
      })
      .done();
      //--------------
      this.getAddressList(0 , '');
      //--------------
      Geolocation.getCurrentPosition(
        info => {
          var pos = {
            lat: info.coords.latitude,
            lng: info.coords.longitude
          };
          //console.log(info.coords);

          fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + info.coords.latitude + ',' + info.coords.longitude + '&key=AIzaSyCuKx_kI81GUXeXObVjKJx9mPK1w6yvFNk')
            .then((response) => response.json())
            .then((responseJson) => {
              var res = JSON.stringify(responseJson);
              var ret = JSON.parse(res);
              var count = ret.results[0].address_components.length;
              //console.log(ret.results[0].address_components);
              //console.log(ret.results[0].address_components[count-1].long_name);
              this.setState({latitude:info.coords.latitude});
              this.setState({longitude:info.coords.longitude});
              let map = this.renderMap(0);
              this.setState({mainMap:map});
              this.setState({zipcode:ret.results[0].address_components[count-1].long_name});

              this.setState({stex:ret.results[0].address_components[1].long_name});
              this.setState({address:ret.results[1].formatted_address});
              //alert('address'+this.state.zipcode);

          });

        });
    });
  }
  //---------------
  getAddressList(status , token)
  {
    if(status == 1)
    {
      this.setState({ chooseToken: token});
    }
    const {navigate} = this.props.navigation;
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/readAddrExtra", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "token="+this.state.chooseToken,
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        this.setState({ addressList: ret});
        //console.log(ret);
      })
      .done();
    });
  }
  //---------------
  setLocation(id , lat , lng , instruction , address , apartment , zipcode)
  {
    this.setState({latitude:lat});
    this.setState({longitude:lng});
    this.setState({address:address});
    this.setState({patient:address});
    this.setState({ste:apartment});
    this.setState({instruction:instruction});
    this.setState({selectedZipCode:zipcode});
    let map = this.renderMap(id);
    setTimeout(() => {
      let map = this.renderMap(id);
      this.setState({mainMap:map});
    }, 1000)
    this.toggleModal();
  }
  //---------------
  editAddress(id , address , lat , lng , zipcode , appartment , instruction)
  {
    this.setState({eaddress:address});
    this.setState({ezip:zipcode});
    this.setState({este:appartment});
    this.setState({einstraction:instruction});
    this.setState({eid:id});
    this.toggleModalFour();
  }
  //---------------
  editAddressSave()
  {
    let lat = this.state.newlat;
    let lng = this.state.newlng;
    let zip = this.state.ezip;
    let address = this.state.eadderss;
    let ste = this.state.este;
    let instruction = this.state.einstraction;
    let id = this.state.eid;
    if(lat == null || lng == null)
    {
      this.setState({ errorMessage: 'Please Set Your Location With Marker' });
      this.toggleModalFive();
    }
    else {
      if(address.length < 5)
      {
        this.setState({ errorMessage: 'Address Filed is Required' });
        this.toggleModalFive();
      }
      else {
        if(zip.length < 4)
        {
          this.setState({ errorMessage: 'Zipcode Filed is Required' });
          this.toggleModalFive();
        }
        else
        {
          if(ste == null)
          {
            this.setState({ errorMessage: 'Apt/ste Filed is Required' });
            this.toggleModalFive();
          }
          else {
            if(instruction == null)
            {
              this.setState({ errorMessage: 'Instruction Filed is Required' });
              this.toggleModalFive();
            }
            else {
              AsyncStorage.getItem('token', (err , token) => {
                console.log("token="+token+"&id="+id+"&address="+address+"&zipcode="+zip+"&apartment="+ste+"&instruction="+instruction+"&lat="+lat+"&lng="+lng);

                fetch("https://care.archcab.com/CareApi/v1/editAddress", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: "token="+token+"&id="+id+"&address="+address+"&zipcode="+zip+"&apartment="+ste+"&instruction="+instruction+"&lat="+lat+"&lng="+lng
                })
                .then((response) => response.json())
                .then((responseData) => {
                  var res = JSON.stringify(responseData);
                  var ret = JSON.parse(res);
                  console.log(ret);
                  if(ret.status == true)
                  {
                    this.toggleModalFour();
                    this.forceUpdate();
                  }
                  else {
                    this.setState({ errorMessage: 'Please Try Again. We have some error' });
                    this.toggleModalFive();
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
  //---------------
  renderAddress(index,item)
  {
    var {height, width} = Dimensions.get('window');
    return(
      <View>
        {index.type == 1?
        <View style={{width : '100%' , backgroundColor : '#FFF' , height : width * 0.24 , borderRadius : 15 , flexDirection : 'row'}}>
          <TouchableOpacity onPress={() => this.editAddress(index.id , index.address , index.lat , index.lng , index.zipcode , index.appartment , index.instruction )} style={{position : 'absolute',right : width * 0.05 , top : width * 0.05 , zIndex : 2}}>
            <Image source={require('./img/edit.png')} style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setLocation(index.id , index.lat , index.lng , index.instruction , index.address , index.appartment , index.zipcode)} style={{flex : 1, flexDirection : 'row'}}>
            <View style={{width : '20%' , justifyContent : 'center'}}>
              <Image source={require('./img/home_icn.png')} style={styles.selectIconStyle} />
            </View>
            <View style={{width : '80%' , flexDirection : 'column' , justifyContent : 'center'}}>
              <View style={{width : '100%'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginLeft : width * 0.05}}>Home</Text>
              </View>
              <View style={{width : '100%'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.5) , color : '#1a2f4b' , marginTop : 5 , marginLeft : width * 0.05}}>{index.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        : null }
        {index.type == 2?
          <View style={{width : '100%' , backgroundColor : '#FFF' , height : width * 0.24 , borderRadius : 15 , flexDirection : 'row' , marginTop : width * 0.02}}>
            <TouchableOpacity onPress={() => this.editAddress(index.id , index.address , index.lat , index.lng , index.zipcode , index.appartment , index.instruction )} style={{position : 'absolute',right : width * 0.05 , top : width * 0.05 , zIndex : 2}}>
              <Image source={require('./img/edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setLocation(index.id , index.lat , index.lng , index.instruction , index.address , index.appartment , index.zipcode)} style={{flex : 1, flexDirection : 'row'}}>
              <View style={{width : '20%' , justifyContent : 'center'}}>
                <Image source={require('./img/Work_icn.png')} style={styles.selectIconStyle} />
              </View>
              <View style={{width : '80%' , flexDirection : 'column' , justifyContent : 'center'}}>
                <View style={{width : '100%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginLeft : width * 0.05}}>Work</Text>
                </View>
                <View style={{width : '100%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.5) , color : '#1a2f4b' , marginTop : 5 , marginLeft : width * 0.05}}>{index.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        : null }
      </View>
    );
  }
  //---------------
  renderOtherAddress(index,item)
  {
    var {height, width} = Dimensions.get('window');
    return(
      <View>
        {index.type == 3?
        <View style={{width : '100%' , backgroundColor : '#FFF' , height : width * 0.24 , borderRadius : 15 , flexDirection : 'row' , marginTop : width * 0.02}}>
          <TouchableOpacity onPress={() => this.editAddress(index.id , index.address , index.lat , index.lng , index.zipcode , index.appartment , index.instruction )} style={{position : 'absolute',right : width * 0.05 , top : width * 0.05 , zIndex : 2}}>
            <Image source={require('./img/edit.png')} style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setLocation(index.id , index.lat , index.lng , index.instruction , index.address , index.appartment , index.zipcode)} style={{flex : 1, flexDirection : 'row'}}>
            <View style={{width : '20%' , justifyContent : 'center'}}>
              <Image source={require('./img/other_icn.png')} style={styles.selectIconStyle} />
            </View>
            <View style={{width : '80%' , flexDirection : 'column' , justifyContent : 'center'}}>
              <View style={{width : '100%'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginLeft : width * 0.05}}>Other</Text>
              </View>
              <View style={{width : '100%'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.5) , color : '#1a2f4b' , marginTop : 5 , marginLeft : width * 0.05}}>{index.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        : null }
      </View>
    );
  }
  //---------------
  renderMap(id)
  {
    return(
      <View style={styles.MainContainer}>
        <MapView
          key={ `${id}${Date.now()}` }
          style={styles.mapStyle}
          showsUserLocation={false}
          zoomEnabled={true}
          zoomControlEnabled={true}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>

          <Marker
            image={flagImg}
            coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
            title={"Marker Title"}
            description={"Marker Description Text"}
          />
        </MapView>
      </View>
    );
  }
  //------------
  resume()
  {
    const {navigate} = this.props.navigation;
    if(this.state.selectedZipCode != null)
    {
      navigate('Visit' , {
        zipcode : this.state.selectedZipCode ,
        lat : this.state.latitude,
        lng : this.state.longitude,
        address : this.state.address,
        patient : this.state.patient,
        ste : this.state.ste,
        instruction : this.state.instruction,
        token : this.state.chooseToken
      });
    }
    else {
      Toast.show({
        text: "Please Select a Address First",
        buttonText: "Okay",
        duration: 3000
      })
    }
  }
  //------------
  toggleModalFive = () => {
    this.setState({ isModalVisible4: !this.state.isModalVisible4 });
  };
  //------------
  toggleModalFour = () => {
    this.setState({ isModalVisible3: !this.state.isModalVisible3 });
  };
  //------------
  toggleModalThree = () => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2 });
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //------------
  toggleModalTwo = () => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //------------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //-----------
  closeDrawer = () => {
    this.drawer._root.close()
  };
  //-----------
  openDrawer = () => {
    this.drawer._root.open()
  };
  //------------
  chooseNewToken(newToken)
  {
    this.getAddressList(1 , newToken);
  }
  //------------
  renderMember(index,item){
    const {height, width} = Dimensions.get('window');
    return(
      <View style={{flexDirection : 'column' , marginLeft : width * 0.02}}>
        {index.id == this.state.chooseToken?
        <View>
        <Image source={require('./img/tickgreen.png')} style={styles.tickIcon} />
          <View style={{justifyContent : 'center' , alignItems : 'center' , flexDirection : 'column' , height : width * 0.22 , width : width * 0.22 , borderRadius : width * 0.11 , overflow : 'hidden' , borderWidth : 3 , borderColor : '#288fae' , marginLeft : 5, paddingTop : -5}}>

            <View style={styles.profile}>
               <Image source={{uri: 'https://care.archcab.com'+index.photo}} style={styles.patient} />
            </View>

          </View>
          <View>
             <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : '#000' , marginTop : width * 0.02}}>{index.name}</Text>
          </View>
        </View>
        : null }
        {index.id != this.state.chooseToken?
          <View style={{flexDirection : 'column'}}>
            <TouchableOpacity onPress={() => this.chooseNewToken(index.id)} style={{flexDirection : 'column' , flex : 1}} >
              <View style={styles.profile1}>
                 <Image source={{uri: 'https://care.archcab.com'+index.photo}} style={styles.patient} />
              </View>
              <View>
                 <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : '#000' , marginTop : width * 0.02}}>{index.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        : null }
      </View>
    );
  }
  //------------
  addNewAddress()
  {
    let lat = this.state.newlat;
    let lng = this.state.newlng;
    let zip = this.state.newzip;
    let address = this.state.newadderss;
    let ste = this.state.newste;
    let instruction = this.state.newinstraction;
    if(lat == null || lng == null)
    {
      this.setState({ errorMessage: 'Please Set Your Location With Marker' });
      this.toggleModalThree();
    }
    else {
      if(address.length < 5)
      {
        this.setState({ errorMessage: 'Address Filed is Required' });
        this.toggleModalThree();
      }
      else {
        if(zip.length < 4)
        {
          this.setState({ errorMessage: 'Zipcode Filed is Required' });
          this.toggleModalThree();
        }
        else
        {
          if(ste == null)
          {
            this.setState({ errorMessage: 'Apt/ste Filed is Required' });
            this.toggleModalThree();
          }
          else {
            if(instruction == null)
            {
              this.setState({ errorMessage: 'Instruction Filed is Required' });
              this.toggleModalThree();
            }
            else {
              let type = 0;
              let home;
              let work;
              home = Array.isArray(this.state.addressList) && this.state.addressList.find(el => el.type == 1);
              if(home)
              {
                work = Array.isArray(this.state.addressList) && this.state.addressList.find(el => el.type == 2);
                if(work)
                {
                  type = 3;
                }
                else {
                  type = 2;
                }
              }
              else {
                type = 1;
              }
              AsyncStorage.getItem('token', (err , token) => {
                fetch("https://care.archcab.com/CareApi/v1/addAddress", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: "token="+token+"&type="+type+"&address="+address+"&zipcode="+zip+"&apartment="+ste+"&instruction="+instruction+"&lat="+lat+"&lng="+lng
                })
                .then((response) => response.json())
                .then((responseData) => {
                  var res = JSON.stringify(responseData);
                  var ret = JSON.parse(res);
                  if(ret.status == true)
                  {
                    this.toggleModalTwo();
                    this.forceUpdate();
                    this.toggleModal();
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
  //------------
  setNewCoordinates(doordinates)
  {
    this.setState({ newlat: doordinates.coordinate.latitude });
    this.setState({ newlng: doordinates.coordinate.longitude });
  }
  //------------
  setCurrentLocationServer()
  {
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/addAddress", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "token="+token+"&type=3&address="+this.state.address+"&zipcode="+this.state.zipcode+"&apartment="+this.state.stex+"&instruction="+this.state.address+"&lat="+this.state.latitude+"&lng="+this.state.longitude
      })
      .then((response) => response.json())
      .then((responseData) => {
        var res = JSON.stringify(responseData);
        var ret = JSON.parse(res);
        console.log(ret);
        if(ret.status == true)
        {
          this.forceUpdate();
          this.toggleModal();
        }
      })
      .done();
    });
  }
  //------------
  render(){
    const {navigate} = this.props.navigation;
    const {height, width} = Dimensions.get('window');
    return (
      <Drawer
        side="left"
        ref={(ref) => { this.drawer = ref; }}
        content={<Sidebar closeDrawer= {this.closeDrawer} navigation={navigate} name={this.state.name} image={this.state.profileImage} sex={this.state.sex}/>}
        onClose={() => this.closeDrawer()} >
        <Container style={ styles.container }>
          <Content>
            <View style={styles.header}>
              <View style={{width : '70%' , paddingLeft : 15 , paddingTop : width * 0.05 , flexDirection : 'row'}}>
                <View style={{width : '10%' , marginRight : 20 , alignItems : 'center' , justifyContent : 'center'}}>
                  <Button transparent onPress={()=>this.openDrawer()} style={{flex : 1 , alignItems : 'center' , justifyContent : 'center'}}>
                    <Image source={require('./img/menu1.png')} style={styles.menu} />
                  </Button>
                </View>
                <View style={{flexDirection : 'row' , width : '90%' , justifyContent : 'center' , alignItems : 'center'}}>
                  <View style={{width : '30%' , width : width * 0.12,height : width * 0.12 , borderRadius : width * 0.6, overflow : 'hidden'}}>
                    <Image source={{uri: 'https://care.archcab.com'+this.state.profileImage}} style={styles.profileImage} />
                  </View>
                  <View style={{width : '70%' , flexDirection : 'column' , marginLeft : 10}}>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontSize : RFPercentage(1.5) , fontFamily : 'Roboto-Regular'}}>Hello, {this.state.name}</Text>
                    </View>
                    <View style={{width : '100%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.8) , color : '#1a2f4b'}}></Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{width : '30%' , alignItems: 'flex-end' , paddingRight : 15 , alignItems : 'center' , justifyContent : 'center' , paddingTop : width * 0.05}}>
                <View style={{width : 100,flexDirection : 'row'}}>
                  <View style={{width : '100%' , alignItems: 'flex-end'}}>
                    <Button transparent onPress={()=>navigate('List')}>
                      <Image source={require('./img/notification.png')} style={styles.menu} />
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <CheckVerify />
            <View style={{width : '100%' , flexDirection : 'row' , paddingLeft : 15 , marginTop : width * 0.03}}>
              <View style={{width : '10%'}}>
                <Image source={require('./img/avatar.png')} style={styles.user} />
              </View>
              <View style={{width : '90%' , marginTop : width * 0.005}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#1a2f4b'}}>Tap To Select A Patient: </Text>
              </View>
            </View>
            <View style={styles.profilePlace}>
              <View style={{width : '25%'}}>
                <TouchableOpacity onPress={() => navigate('Profile' , { new : 1})} style={{flex : 1}}>
                <View style={{flexDirection : 'column' , flex : 1}}>
                   <View style={{marginLeft : -22 , marginTop : width * -0.045}}>
                      <Image source={require('./img/new.png')} style={styles.new} />
                   </View>
                   <View>
                      <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#c8d6e9' , marginTop : width * -0.065 }}>New</Text>
                   </View>
                </View>
                </TouchableOpacity>
              </View>
              <View style={{width : '75%'}}>
              <ScrollView stickyHeaderIndices={[0]} style={{flex : 1}} horizontal >
                <View>
                  <View style={{flex: 1, flexDirection: 'row' , marginTop : 5}}>
                    <FlatList scrollEnabled={true}
                        keyExtractor={(item , index)=>'key'+index}
                        showsVerticalScrollIndicator={false}
                        data={this.state.memberList}
                        horizontal
                        renderItem={({item,index}) => this.renderMember(item,index)}
                    />
                   </View>
                </View>
               </ScrollView>
              </View>
            </View>
            <View style={styles.borderPlace}>
              <Image source={require('./img/border.png')} style={styles.border} />
            </View>
            <View style={styles.box}>
              <View style={{width : '10%'}}>
                <Image source={require('./img/placeholder.png')} style={styles.user} />
              </View>
              <View style={{width : '90%' , justifyContent : 'center'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#1a2f4b'}}>Your Location: </Text>
              </View>
            </View>
            <View style={styles.box}>
              <View style={{width : '100%'}}>
                <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.5) , color : '#000'}}>{this.state.address}</Text>
              </View>
            </View>
            <View style={{width : '100%' , alignItems: 'center', justifyContent: 'center'}}>
              {this.state.mainMap}
            </View>
            <View style={{width : '100%' , alignItems: 'center', justifyContent: 'center' , marginTop : -60}}>
              <View style={{width : '85%' , backgroundColor : '#fdfefe' , borderRadius : 20 , height : 170}}>
                <View style={{width : '100%' , flexDirection : 'column'}}>
                  <View style={{width : '100%' , flexDirection : 'row' , height : 70}}>
                    <View style={{width : '70%' , paddingLeft : 10 , marginTop : 10 , paddingRight : 5}}>
                      <TouchableOpacity onPress={() => this.toggleModal()} style={{ width : '100%' , height :60}}>
                      <View style={{flex : 1}} pointerEvents='none'>
                        <Input
                          placeholder="Patient Location"
                          style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#c6d1e1"
                          editable={false}
                          value={this.state.patient}
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        />
                      </View>
                      </TouchableOpacity>
                      <Image source={require('./img/search_icon.png')} style={styles.searchIcon} />
                    </View>
                    <View style={{width : '30%' , marginTop : 10 , paddingRight : 10}}>
                      <TouchableOpacity onPress={() => this.toggleModal()} style={{width : '100%' , height :60}}>
                        <View style={{flex : 1}} pointerEvents='none'>
                          <Input
                            placeholder="Apt/ste"
                            editable={false}
                            value={this.state.ste}
                            placeholderTextColor="#c6d1e1"
                            placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                            style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{width : '100%' , height : 70 , marginTop : 10 }}>
                    <TouchableOpacity onPress={() => this.toggleModal()} style={{width : '100%' , height :60}}>
                      <View style={{alignItems: 'center', justifyContent: 'center' , flex : 1}} pointerEvents='none'>
                        <Input
                          placeholder='Entry Instruction "e.g. gate code, parking"'
                          style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , width : '95%' , fontFamily : 'Roboto-Regular'}}
                          placeholderTextColor="#c6d1e1"
                          editable={false}
                          value={this.state.instruction}
                          placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{width : '100%' , alignItems: 'center', justifyContent: 'center' , marginTop : width * 0.05}}>
              <TouchableOpacity onPress={() => this.resume()} style={{width : '90%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.15 , alignItems:'center' , marginBottom : 20 , flexDirection : 'row'}}>
                <View style={{width : '55%' , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#FFF'}}>Continue</Text>
                </View>
                <View style={{width : '45%' , paddingLeft : 10}}>
                  <Image source={require('./img/right-arrow.png')} style={styles.arrowRight} />
                </View>
              </TouchableOpacity>
            </View>
          </Content>
          <Modal isVisible={this.state.isModalVisible} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal}>
            <View style={{ width : '110%', height : width * 1.55,backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
                <TouchableOpacity onPress={this.toggleModal} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                  <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
                </TouchableOpacity>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2.1) , color : '#1a2f4b' , marginTop : width * -0.08 , marginLeft : 20}}>Select Address</Text>
                  <View style={{width : '100%' , marginTop : width * 0.05 , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                    <FlatList scrollEnabled={true}
                        style={{width : '90%'}}
                        keyExtractor={(item , index)=>'key'+index}
                        showsVerticalScrollIndicator={false}
                        data={this.state.addressList}
                        renderItem={({item,index}) => this.renderAddress(item,index)}
                    />
                    <TouchableOpacity onPress={() => this.setCurrentLocationServer()} style={{width : '90%' , marginTop : width * 0.02}}>
                    <View style={{width : '100%' , backgroundColor : '#FFF' , height : 80 , borderRadius : 15 , flexDirection : 'row'}}>
                      <View style={{width : '20%'}}>
                        <Image source={require('./img/Current_icn.png')} style={styles.selectIconStyle} />
                      </View>
                      <View style={{width : '80%' , flexDirection : 'column'}}>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b' , marginTop : 15 , marginLeft : width * 0.06}}>Current Location</Text>
                        </View>
                        <View style={{width : '100%'}}>
                          <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : '#1a2f4b' , marginTop : 5 , marginLeft : width * 0.06}}>32 Smiles Dental Clinic, Polly Park, Manhattan, USA - 021</Text>
                        </View>
                      </View>
                    </View>
                    </TouchableOpacity>
                    <View style={{width : '100%' , backgroundColor : '#e8ecf1' , height : 5 , marginTop : 20 , marginBottom : 20}}></View>
                    <View style={{width : '90%'}}>
                      <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Other</Text>
                    </View>
                    <View style={{width : '90%' , height : width * 0.4}}>
                      <View style={{flex : 1}}>
                        <ScrollView>
                        <FlatList scrollEnabled={true}
                            style={{width : '100%'}}
                            keyExtractor={(item , index)=>'key'+index}
                            showsVerticalScrollIndicator={false}
                            data={this.state.addressList}
                            renderItem={({item,index}) => this.renderOtherAddress(item,index)}
                        />
                        </ScrollView>
                      </View>
                    </View>
                    <View style={{width : '90%' , height : 60 , marginTop : 10 , marginBottom : width * 0.1}}>
                      <TouchableOpacity onPress={() => this.toggleModalTwo()} style={{flex : 1}}>
                        <ImageBackground source={require('./img/Khatchin.png')} style={styles.backgroundImage} resizeMode='stretch'>
                          <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#1a2f4b'}}>Add New Address</Text>
                          <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.2) , color : '#1a2f4b'}}>Tap to Search</Text>
                        </ImageBackground>
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
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Add New Address</Text>
              <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , marginTop : 10}}>
                <View style={{width : '90%' , borderRadius : 15 , overflow : 'hidden'}}>
                  <MapView
                    style={styles.mapStyle1}
                    showsUserLocation={false}
                    zoomEnabled={true}
                    zoomControlEnabled={true}
                    initialRegion={{
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Marker
                      coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                      image={flagImg}
                      onDrag={e => console.log('onDrag', e.nativeEvent)}
                      onDragEnd={e => this.setNewCoordinates(e.nativeEvent)}
                      draggable
                    />
                  </MapView>
                  <View style={{width : '100%' , alignItems: 'center', justifyContent: 'center' , marginTop : -60}}>
                    <View style={{width : '95%' , backgroundColor : '#fdfefe' , borderRadius : 20 , height : 230}}>
                      <View style={{width : '100%' , flexDirection : 'column'}}>
                        <View style={{width : '100%' , height : width * 0.15 , marginTop : 10, justifyContent : 'center' , alignItems : 'center' }}>
                            <Input
                              placeholder='Address'
                              style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , width : '95%' , fontFamily : 'Roboto-Regular'}}
                              placeholderTextColor="#c6d1e1"
                              placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                              onChangeText={(text) =>this.setState({newadderss:text})}
                              value={this.state.newaddress}
                            />
                            <Image source={require('./img/search_icon.png')} style={styles.searchIcon} />
                        </View>
                        <View style={{width : '100%' , flexDirection : 'row' , height : width * 0.15 , marginTop : 0}}>
                          <View style={{width : '70%' , paddingLeft : 10 , marginTop : 10 , paddingRight : 5}}>
                            <Input
                              placeholder="Zip Code"
                              keyboardType='numeric'
                              style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                              placeholderTextColor="#c6d1e1"
                              placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                              onChangeText={(text) =>this.setState({newzip:text})}
                              value={this.state.newzip}
                            />
                          </View>
                          <View style={{width : '30%' , marginTop : 10 , paddingRight : 10}}>
                              <Input
                                placeholder="Apt/ste"
                                onChangeText={(text) =>this.setState({newste:text})}
                                placeholderTextColor="#c6d1e1"
                                value={this.state.newste}
                                placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                                style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                              />
                          </View>
                        </View>
                        <View style={{width : '100%' , height : width * 0.15 , marginTop : 10 , justifyContent : 'center' , alignItems : 'center'}}>
                            <Input
                              placeholder='Entry Instruction "e.g. gate code, parking"'
                              style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , width : '95%' , fontFamily : 'Roboto-Regular'}}
                              placeholderTextColor="#c6d1e1"
                              onChangeText={(text) =>this.setState({newinstraction:text})}
                              placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                              value={this.state.newinstraction}
                            />
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => this.addNewAddress()} style={{width : '95%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.15 , alignItems:'center' , marginBottom : 10 , marginTop : width * 0.06 , justifyContent : 'center'}}>
                          <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#FFF'}}>Save Address</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModalThree}>
            <Error toggle={this.toggleModalThree} error={this.state.errorMessage}/>
          </Modal>
          <Modal isVisible={this.state.isModalVisible4} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModalFive}>
            <Error toggle={this.toggleModalFive} error={this.state.errorMessage}/>
          </Modal>
          <Modal isVisible={this.state.isModalVisible3} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModalFour}>
            <View style={{ width : '110%', backgroundColor : '#f6f8fb' , position: 'absolute', bottom : -20}}>
              <TouchableOpacity onPress={this.toggleModalFour} style={{width : '100%' , alignItems: 'flex-end' , marginTop : 10 , paddingRight : 10 }}>
                <Image source={require('./img/Close-dialog.png')} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Bold' , fontSize : RFPercentage(2) , color : '#1a2f4b' , marginTop : -5 , marginLeft : 20}}>Edit Address</Text>
              <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , marginTop : 10}}>
                <View style={{width : '90%' , borderRadius : 15 , overflow : 'hidden'}}>
                  <MapView
                    style={styles.mapStyle1}
                    showsUserLocation={false}
                    zoomEnabled={true}
                    zoomControlEnabled={true}
                    initialRegion={{
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Marker
                      coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                      image={flagImg}
                      onDrag={e => console.log('onDrag', e.nativeEvent)}
                      onDragEnd={e => this.setNewCoordinates(e.nativeEvent)}
                      draggable
                    />
                  </MapView>
                  <View style={{width : '100%' , alignItems: 'center', justifyContent: 'center' , marginTop : -60}}>
                    <View style={{width : '95%' , backgroundColor : '#fdfefe' , borderRadius : 20 , height : 230}}>
                      <View style={{width : '100%' , flexDirection : 'column'}}>
                        <View style={{width : '100%' , height : width * 0.15 , marginTop : 10, justifyContent : 'center' , alignItems : 'center' }}>
                            <Input
                              defaultValue={this.state.eaddress}
                              style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , width : '95%' , fontFamily : 'Roboto-Regular'}}
                              placeholderTextColor="#c6d1e1"
                              placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                              onChangeText={(text) =>this.setState({eadderss:text})}
                            />
                        </View>
                        <View style={{width : '100%' , flexDirection : 'row' , height : width * 0.15 , marginTop : 0}}>
                          <View style={{width : '70%' , paddingLeft : 10 , marginTop : 10 , paddingRight : 5}}>
                            <Input
                              defaultValue={this.state.ezip}
                              keyboardType='numeric'
                              style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                              placeholderTextColor="#c6d1e1"
                              placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                              onChangeText={(text) =>this.setState({ezip:text})}
                            />
                            <Image source={require('./img/search_icon.png')} style={styles.searchIcon} />
                          </View>
                          <View style={{width : '30%' , marginTop : 10 , paddingRight : 10}}>
                              <Input
                                defaultValue={this.state.este}
                                onChangeText={(text) =>this.setState({este:text})}
                                placeholderTextColor="#c6d1e1"
                                placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                                style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , fontFamily : 'Roboto-Regular'}}
                              />
                          </View>
                        </View>
                        <View style={{width : '100%' , height : width * 0.15 , marginTop : 10 , justifyContent : 'center' , alignItems : 'center'}}>
                            <Input
                              defaultValue={this.state.einstraction}
                              style={{borderColor : '#c6d1e1' , borderWidth : 1 , borderRadius : 10 , fontSize : RFPercentage(1.8) , width : '95%' , fontFamily : 'Roboto-Regular'}}
                              placeholderTextColor="#c6d1e1"
                              onChangeText={(text) =>this.setState({einstraction:text})}
                              placeholderStyle={{ fontFamily : 'Roboto-Regular' }}
                            />
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => this.editAddressSave()} style={{width : '95%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.15 , alignItems:'center' , marginBottom : 10 , marginTop : width * 0.06 , justifyContent : 'center'}}>
                          <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(2) , color : '#FFF'}}>Edit Address</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </Container>
      </Drawer>
    );
  }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#f6f8fb'
  },
  footer : {
    backgroundColor : '#f6f8fb'
  },
  menu : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
  },
  profileImage : {
    width : width * 0.12,
    height : width * 0.12,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  user : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
  },
  new : {
    width : width * 0.36,
    height : width * 0.36,
    resizeMode: 'contain',
  },
  patient : {
    width : width * 0.2,
    height : width * 0.2,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  profile : {
    width : width * 0.2 , height : width * 0.2 , borderRadius : width * 0.1 , overflow : 'hidden' ,
    borderColor : '#FFF' , borderWidth : 4,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profile1 : {
    width : width * 0.22 , height : width * 0.22 , borderRadius : width * 0.11 , overflow : 'hidden' ,
    borderColor : '#FFF' , borderWidth : 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profilePlace : {
    width : '100%' , paddingLeft : 5 , flexDirection : 'row' , marginTop : width * 0.03
  },
  borderPlace : {
    width : '100%' , marginTop : width * 0.02
  },
  border : {
    width : '100%',
    height : 5
  },
  box : {
    width : '100%' , flexDirection : 'row' , marginTop :  width * 0.04 , paddingLeft : 15
  },
  mapStyle: {
    width : '100%',
    height : width * 1,
    marginTop : 0
  },
  mapStyle1 : {
    width : '100%',
    height : width * 0.7,
    marginTop : 0
  },
  MainContainer: {
    width : '90%',
    height : width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop : 0,
    borderRadius : 15,
    overflow : 'hidden',
    backgroundColor : '#000',
    marginTop : 15
  },
  header : {
    width : '100%' , flexDirection : 'row'
  },
  searchIcon : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
    position : 'absolute',
    right : 15,
    top : 20
  },
  arrowRight : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
  },
  closeIcon : {
    width : width * 0.07,
    height : width * 0.07,
    resizeMode: 'contain',
  },
  selectIconStyle : {
    width : width * 0.2,
    height : width * 0.2,
    resizeMode: 'contain',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
  },
  verifyBox : {
    width : '94%',
    height : width * 0.15,
    borderColor : '#28b4ae',
    borderWidth : 1,
    borderRadius : 15,
    flexDirection : 'row',
    marginTop : width * 0.02,
    backgroundColor : '#b0f3e6'
  },
  verifyTextBox : {
    width : '60%',
    paddingTop : width * 0.05,
    paddingLeft : 10
  },
  verifyButtonBox : {
    width : '40%'
  },
  errorConatiner : {
    width : '90%',
    height : width * 0.8,
    backgroundColor : '#f6f8fb',
    position: 'absolute',
    borderRadius : 15
  },
  tickIcon : {
    width : width * 0.06,
    height : width * 0.06,
    resizeMode: 'contain',
    position : 'absolute',
    top : width * 0.001,
    right : width * 0.01,
    zIndex: 2
  },
  editIcon : {
    width : width * 0.038,
    height : width * 0.038,
    resizeMode: 'contain',
  }
});

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
  Linking,
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title , FooterTab , Footer , Content , Drawer , Input } from 'native-base';
import Sidebar from './sidebar';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import flagImg from './img/maps-and-flags-medium.png';
import CheckVerify from './checkVerify';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "@kalwani/react-native-modal";
import Error from './error';

export default class List extends React.Component {
  constructor(Props){
    super(Props);
    this.state ={
      name : '',
      profileImage : '/Content/Images/Theme/noprofilephoto.jpg',
      sex : 'Male',
      resrve : [{}],
      isModalVisible: false,
      isModalVisible1: false,
      reDate : [{}],
      reTime : [{}],
      selectedDate : 0.1,
      selectedTime : 0.1,
      refreshTime : null,
      refresh : null,
    }
  }
  //-----------
  toggleModal1 = () => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  };
  //-----------
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  //-----------
  componentDidMount() {
    this.forceUpdate();
  }
  //-----------
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
      //---------
      fetch("https://care.archcab.com/CareApi/v1/readReserveList", {
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
        this.setState({ resrve: ret});
      })
      .done();
    });
  }
  //-----------
  deleteResrve(id , userToken)
  {
    AsyncStorage.getItem('token', (err , token) => {
      fetch("https://care.archcab.com/CareApi/v1/deleteReserveDates", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "token="+userToken+"&id="+id
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
  //-----------
  reschedule(id , token)
  {
    this.setState({ havijTokan: token});
    this.setState({ resvre_id: id});
    fetch("https://care.archcab.com/CareApi/v1/rescheduleFreeDatesList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "token="+token+"&id="+id
    })
    .then((response) => response.json())
    .then((responseData) => {
      var res = JSON.stringify(responseData);
      var ret = JSON.parse(res);
      this.setState({ reDate: ret});
      this.toggleModal();
    })
    .done();
  }
  //-----------
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
  //-----------
  datePick(id , date)
  {
    this.setState({
        refresh: !this.state.refresh,
        selectedDate : id,
        visitDateText : date
    });
    fetch("https://care.archcab.com/CareApi/v1/rescheduleFreeTimesList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "id="+this.state.resvre_id+"&date="+date+"&token="+this.state.havijTokan
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
  //-----------
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
  //-----------
  timePick(id , startDate)
  {
    this.setState({
        refresh: !this.state.refreshTime,
        selectedTime : id,
        startDate : startDate
    });
  }
  //-----------
  setVisit()
  {
    let token = this.state.havijTokan;
    let id = this.state.resvre_id;
    let startDate = this.state.startDate;
    let date = this.state.visitDateText;
    fetch("https://care.archcab.com/CareApi/v1/reschedulereserveDates", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "id="+this.state.resvre_id+"&date="+date+"&token="+this.state.havijTokan+"&startdate="+startDate
    })
    .then((response) => response.json())
    .then((responseData) => {
      var res = JSON.stringify(responseData);
      var ret = JSON.parse(res);
      this.toggleModal();
      this.forceUpdate();
    })
    .done();
  }
  //-----------
  renderResrve(index , item)
  {
    const {height, width} = Dimensions.get('window');
    let lat;
    let lng;
    if(index.lat != 'undefined')
    {
      lat = 11;
      lng = 22;
    }
    else {
      lat = index.lat;
      lng = index.lng;
    }
    return(
      <View style={{width : '100%' , alignItems : 'center' , justifyContent : 'center' , marginTop : 10}}>
        <View style={{width : '90%' , paddingBottom : 10, borderRadius : 10 , backgroundColor : '#FFF' , flexDirection : 'column'}}>
          <View style={{width : '100%' , flexDirection : 'row'}}>
            <View style={{width : '65%' , flexDirection : 'row'}}>
              <View style={{width : '20%' , marginLeft : 10 , marginTop : 10}}>
                <View style={{width : width * 0.12 , height : width * 0.12 , borderRadius : width * 0.06 , overflow : 'hidden'}}>
                  <Image source={{uri: 'https://care.archcab.com'+index.photo}} style={styles.patient} />
                </View>
              </View>
              <View style={{width : '80%' , flexDirection : 'column'}}>
                <View style={{width : '100%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#000', marginTop : 15 , marginLeft : 10 }}>{index.name}</Text>
                </View>
                <View style={{width : '100%'}}>
                  <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.4) , color : '#8495af' , marginLeft : 10}}>{index.adress}</Text>
                </View>
              </View>
            </View>
            <View style={{width : '35%'}}>
              <TouchableOpacity onPress={() => this.deleteResrve(index.confirmationno , index.usertoken)} style={{width : '100%'}}>
                <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#e25e8d' , marginTop : 10 , marginRight : 10}}>Delete Visit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width : '100%' , flexDirection : 'row'  , marginTop : 10}}>
            <View style={{width : '7%' , justifyContent : 'center'}}>
              <Image source={require('./img/first-aid-kit.png')} style={styles.infoIcons} />
            </View>
            <View style={{width : '93%' , justifyContent : 'center' , paddingLeft : 10}}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#1a2f4b'}}>{index.reason}</Text>
            </View>
          </View>
          <View style={{width : '100%' , flexDirection : 'row'  , marginTop : 8}}>
            <View style={{width : '7%' , justifyContent : 'center'}}>
              <Image source={require('./img/calendar.png')} style={styles.infoIcons} />
            </View>
            <View style={{width : '93%' , justifyContent : 'center' , paddingLeft : 10}}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#1a2f4b'}}>{index.date}</Text>
            </View>
          </View>
          <View style={{width : '100%' , flexDirection : 'row'  , marginTop : 8}}>
            <View style={{width : '7%' , justifyContent : 'center'}}>
              <Image source={require('./img/clock.png')} style={styles.infoIcons} />
            </View>
            <View style={{width : '93%' , justifyContent : 'center' , paddingLeft : 10}}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#1a2f4b'}}>Between {index.time}</Text>
            </View>
          </View>
          <View style={{width : '100%' , flexDirection : 'row'  , marginTop : 8}}>
            <View style={{width : '7%' , justifyContent : 'center'}}>
              <Image source={require('./img/coin.png')} style={styles.infoIcons} />
            </View>
            <View style={{width : '93%' , justifyContent : 'center' , paddingLeft : 10}}>
              <Text style={{textAlign : 'left' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.6) , color : '#1a2f4b'}}>$ {index.fee}</Text>
            </View>
          </View>
          <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center' , marginTop : 10}}>
            <View style={{width : '95%' , borderRadius : 10 , overflow : 'hidden'}}>
              <MapView
                style={styles.mapStyle}
                showsUserLocation={false}
                zoomEnabled={true}
                zoomControlEnabled={true}
                initialRegion={{
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>

                <Marker
                  image={flagImg}
                  coordinate={{ latitude: lat, longitude: lng }}
                  title={"Marker Title"}
                  description={"Marker Description Text"}
                />
              </MapView>
            </View>
            <View style={{width : '95%' , flexDirection : 'row' , marginTop : 10}}>
              <View style={{width : '49%' , borderRadius : 10 , borderWidth : 1 , borderColor : '#28ccae' , height : width * 0.15 , justifyContent : 'center'}}>
                <TouchableOpacity onPress={() => Linking.openURL('tel:989126183138')} style={{flex : 1 , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : 16 , color : '#242e3a'}}>Call Heal</Text>
                </TouchableOpacity>
              </View>
              <View style={{width : '2%'}}></View>
              <View style={{width : '49%' , borderRadius : 10 , borderWidth : 1 , borderColor : '#28ccae' , height : width * 0.15 , justifyContent : 'center'}}>
                <TouchableOpacity onPress={() => this.reschedule(index.confirmationno , index.usertoken)} style={{flex : 1 , justifyContent : 'center'}}>
                  <Text style={{textAlign : 'center' , fontFamily : 'Roboto-Bold' , fontSize : 16 , color : '#242e3a'}}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  //-----------
  closeDrawer = () => {
    this.drawer._root.close()
  };
  //-----------
  openDrawer = () => {
    this.drawer._root.open()
  };
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
          <FlatList scrollEnabled={true}
              keyExtractor={(item , index)=> index}
              showsVerticalScrollIndicator={false}
              data={this.state.resrve}
              renderItem={({item,index}) => this.renderResrve(item,index)}
          />
          </Content>
        </Container>
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
                          data={this.state.reDate}
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
            <View style={{width : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
              <TouchableOpacity onPress={() => this.setVisit()} style={{width : '90%', borderRadius : 8 , backgroundColor : '#28c7af' ,height : width * 0.15 , alignItems:'center' , marginBottom : 10 , marginTop : 20 , justifyContent : 'center'}}>
                    <Text style={{textAlign : 'right' , fontFamily : 'Roboto-Regular' , fontSize : RFPercentage(1.8) , color : '#FFF'}}>Set Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible1} style={{alignItems: 'center',flexDirection : 'column'}} onModalHide={this.toggleModal1}>
          <Error toggle={this.toggleModal1} error={this.state.errorMessage}/>
        </Modal>
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
    width : 27,
    height : 27,
    resizeMode: 'contain',
  },
  new : {
    width : 125,
    height : 125,
    resizeMode: 'contain',
  },
  patient : {
    width : width * 0.12,
    height : width * 0.12,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  profile : {
    width : 80 , height : 80 , borderRadius : 40 , overflow : 'hidden' , marginLeft : 5,
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
    width : '100%' , paddingLeft : 5 , flexDirection : 'row' , marginTop : 15
  },
  borderPlace : {
    width : '100%' , marginTop : 20
  },
  border : {
    width : '100%',
    height : 5
  },
  box : {
    width : '100%' , flexDirection : 'row' , marginTop : 15 , paddingLeft : 15
  },
  mapStyle: {
    width : '100%',
    height : 250,
    marginTop : 0
  },
  MainContainer: {
    width : '90%',
    height : 250,
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
    width : 20,
    height : 20,
    resizeMode: 'contain',
    position : 'absolute',
    right : 15,
    top : 20
  },
  arrowRight : {
    width : 20,
    height : 20,
    resizeMode: 'contain',
  },
  closeIcon : {
    width : 30,
    height : 30,
    resizeMode: 'contain',
  },
  selectIconStyle : {
    width : 80,
    height : 80,
    resizeMode: 'contain',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', // or 'stretch',
    justifyContent: 'center',
  },
  patient : {
    width : 50,
    height : 50,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  infoIcons : {
    width : width * 0.05,
    height : width * 0.05,
    resizeMode: 'contain',
    marginLeft : 10,
  },
  mapStyle: {
    width : '100%',
    height : 100,
    marginTop : 0
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
});

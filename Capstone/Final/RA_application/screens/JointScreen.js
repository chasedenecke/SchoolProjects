import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Joints from '../constants/Joints';
import MyButton from '../components/MyButton';
import ScreenContainer from '../components/ScreenContainer';
import InfoModal from '../components/InfoModal';
import Hand from '../components/Hand';
import Joint from '../components/Joint';


export default class JointScreen extends React.Component {

  static navigationOptions = {
    tabBarVisible : false,
    header: null, //this will hide the header
  };

  constructor(props){
    super(props);
  }

  onSubmitPress(){
    this.props.navigation.navigate('Camera', {jointData : this.Hand.getInflamedJointsData()});
  }

  onNavBarPress(key){
    switch(key){
      case "QuestionMark":
        this.modalInfo.toggleVisiblity();
        break;
      case "BackArrow":
        this.props.navigation.goBack();
        break;
      default:
        console.log("ERROR");
        break;
    }
  }

  render() {
    return (
      <ScreenContainer title='Joint Selecter' isStack={true} needQuestion={true} onPress={this.onNavBarPress.bind(this)}> 
        <InfoModal onRef={ref => (this.modalInfo = ref)} visible={false}>
          <ScrollView contentContainerStyle={styles.text_container}>
            <Text style={[styles.body_text, {marginTop: 20, fontWeight: 'bold'}]}>
              How To Use:
            </Text>
            <Text style={[styles.body_text, {marginTop: 20}]}>
              Tap on the blue circles to indicate if that particular joint feels inflamed.
              The circle will turn red indicating that you have selected it as an inflamed Joint.
              Tapping the same circle again will reset it to not inflamed.
            </Text>
          </ScrollView>
        </InfoModal>
        <Hand onRef={ref => (this.Hand = ref)}/>
        <MyButton
          onPress ={this.onSubmitPress.bind(this)}
          text='Submit'
          style={{padding: 10}}
        />
      </ScreenContainer>
    );
  }
}

class DemoJoint extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Joint key={"DemoJoint"} cx={index.cx} cy={index.cy} r={index.r} onPress={() => this.onInflamedJointPress(index.key)}/>
    );
  }
}

const styles = StyleSheet.create({
  text_container: {
    padding: 20,
    alignItems: 'center'
  },
  title_text: {
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 'bold',
  },
  body_text: {
    textAlign: 'left',
    fontSize: 20,
    lineHeight: 25,
  },
  new_section: {

  },
});

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
const U = (props) => <Text style={{textDecorationLine: 'underline'}}>{props.children}</Text>
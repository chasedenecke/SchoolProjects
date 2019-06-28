import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ExpoLinksView } from '@expo/samples';
import { CheckBox } from 'react-native-elements';
import { postSubmission } from '../lib/networkUtils';
import MyButton from '../components/MyButton';
import MyCheckBox from '../components/MyCheckBox';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';

export default class LinksScreen extends React.Component {
  
  static navigationOptions = {
    tabBarVisible : false,
    header: null //this will hide the header
  };

  constructor(props){
    super(props);
    this.agreementAccepted = false;
    this.state = {
      error : false,
      submissionState: "waiting",
    };
    this.jointData = this.props.navigation.state.params.jointData;
    this.pictureData = this.props.navigation.state.params.pictureUri;
  }

  onCheckBoxPress(checkValue){
    this.agreementAccepted = checkValue;
  }

  onSubmitPress(){
    if(this.agreementAccepted){
      this.setState({        
        submissionState: "sending",
      });

      postSubmission(this.pictureData.uri , this.jointData).then((response) => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Survey' })],
        });
        this.props.navigation.dispatch(resetAction);
      }).catch((error) =>{
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Survey' })],
        });
        this.props.navigation.dispatch(resetAction);
      });
    }else{
      this.setState({
        error: true,
      });
    }
  }

  navigateToSurvey(){
    this.props.navigation.navigate('Survey');
  }

  onNavBarPress(){
    this.props.navigation.goBack();
  }

  sendData(){
    const url = "";
    fetch(url, {
      method: 'post',
      body: data
    }).then(res => {
      console.log(res)
    });
  }

  generateContent(){
    switch(this.state.submissionState){
      case "sending":
        return(
          <View style={[styles.content_container, {marginTop: "40%"}]}>
            <ActivityIndicator size="large" color={Colors.jointDefault} />
          </View>
        );
      case "sent":
      return(
        <View style={styles.content_container}>
          <Text>Data sent</Text>
        </View>
      );
      case "error":
        return(
          <View style={styles.content_container}>
            <Text>Error Sending Data</Text>
          </View>
        );
      case "waiting":
        return(
          <View style={styles.content_container}>
            <Text style={[styles.body_text]}>
              This is an optional research opportunity.
              By participating, you acknowledge that you are sharing data, including pictures of your hand, with researchers.
              The goal of this research is to measure inflammation in the hands of people with rheumatoid arthritis before, during, and after flares.
            </Text>
            <Text style={[styles.body_text, {marginTop: 20, fontWeight: 'bold'}]}>
              You may withdraw at any time and request that all of your data be deleted.
            </Text>
            <Text style={[styles.body_text, {marginTop: 20}]}>
              For additional information, view our <U>Terms & Conditions</U> and <U>Privacy Policy</U>
            </Text>
            <MyCheckBox
              onPress ={this.onCheckBoxPress.bind(this)}
              text='I understand and agree to participate'
              style={{marginTop:30}}
            />
            <MyButton
              onPress ={this.onSubmitPress.bind(this)}
              text='Accept & Submit'
              style={{marginTop:30}}
            />
            {
              this.state.error ?
              <Text>Must accept user agreement before submitting</Text> :
              null
            }
          </View>
        );
    }
  }

  render() {
    return (
      <ScreenContainer title='Review and Consent' isStack={true} onPress={this.onNavBarPress.bind(this)}> 
        <View style={{ flex: 1, }}>
          {this.generateContent()}
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  content_container: {
    padding: 20,
    height: '80%',
    flex: 1,
    justifyContent: 'space-between',
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
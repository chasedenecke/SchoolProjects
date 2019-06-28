import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ExpoLinksView } from '@expo/samples';
import {Keyboard} from 'react-native'

export default class QuestionScreen extends React.Component {

  static navigationOptions = {
    headerTintColor: 'black',
  };

  constructor(props){
    super(props);
    this.state = {
      currentQuestion: '',
      currentResponseType: '',
      inputText: '',
      loaded: false,
      error: false,
    };

    this.currentIndex = 0;
    this.questions = null;
    this.responses = [];

    fetch('http://192.168.1.97:3000/question/')
      .then((response) => response.json())
      .then((responseJson) => this.parseData(responseJson));

  }

  onPressNext(){
    Keyboard.dismiss();
    
    if(this.state.inputText === ""){
      this.setState({error: true});
      return;
    }
    
    var lastQuestion = false;
    this.setState({error: false});
    this.responses[this.currentIndex] = this.state.inputText;
    
    if(this.questions.length - 1 == this.currentIndex){
      this.props.navigation.navigate('Camera');
      return;
    }

    this.setState({inputText: ''});
    this.currentIndex += 1;

    this.setState( (prevState, props) => ({
      currentQuestion: this.questions[this.currentIndex].question,
      currentResponseType: this.questions[this.currentIndex].responseType,
    }));
  }

  onPressBack(){
    Keyboard.dismiss();
    var firstQuestion = true;

    if(0 == this.currentIndex){
      this.props.navigation.navigate('Links');
      return;
    }

    this.currentIndex -= 1;
    this.setState({inputText: this.responses[this.currentIndex]});

    this.setState( (prevState, props) => ({
      currentQuestion: this.questions[this.currentIndex].question,
      currentResponseType: this.questions[this.currentIndex].responseType,
    }));
  }

  parseData(data){
    this.questions = data.questions;
    this.setState( (prevState, props) => ({
      currentQuestion: this.questions[0].question,
      currentResponseType: this.questions[0].responseType,
      loaded: true,
    }));
  }

  render() {
    if(!this.state.loaded){
      return(
        <Text>Loading ...</Text>
      );
    }else{
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Text>{this.state.currentQuestion}</Text>
            {this.state.error &&
              <Text>Text input error</Text>
            }
            <TextInput
              style={{width: 80, height:30, borderColor: 'gray', borderWidth: 1}}
              keyboardType={this.state.currentResponseType}
              onChangeText={(text) => this.setState({inputText: text})}
              value={this.state.inputText}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onPressNext()}
            >
              <Text>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onPressBack()}
            >
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
   },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5
  },

});

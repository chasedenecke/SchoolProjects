import React from 'react';
import { View, StyleSheet, Text, Image, KeyboardAvoidingView} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ExpoLinksView } from '@expo/samples';
import { CheckBox } from 'react-native-elements';
import MyButton from '../components/MyButton';
import MyCheckBox from '../components/MyCheckBox';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';

import networkUtils from '../lib/networkUtils';

import { AppRegistry, TextInput } from 'react-native';

export default class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ip: '',
            user: ''
        };
    }

    onSubmitPress = () => {
        networkUtils.setIP(this.state.ip);
        networkUtils.setUser(this.state.user);
        this.props.navigation.navigate('Main');
    }
    

    render() {
        return(
            <KeyboardAvoidingView style={styles.content_container} behavior="padding" enabled>
                <Image
                    source={require('../assets/images/icon.png')}
                />
                <TextInput
                    placeholder="Username"
                    style={[styles.textInput]}
                    onChangeText={(text) => this.setState({user: text})}
                    value={this.state.user}
                />
                <TextInput
                    placeholder="Ip Address"
                    style={[styles.textInput]}
                    onChangeText={(text) => this.setState({ip: text})}
                    value={this.state.ip}
                />
                <MyButton
                    onPress={this.onSubmitPress}
                    text='Submit'
                    style={styles.button}
                />
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
  content_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  textInput: {
    marginTop: 20,
    height: 40,
    borderBottomColor: '#ffffff',
    borderBottomWidth: 2,
    textAlign: 'center',
    width: '80%'
  },
  button: {
      width: '80%',
      marginTop: 40
  }
});

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
const U = (props) => <Text style={{textDecorationLine: 'underline'}}>{props.children}</Text>
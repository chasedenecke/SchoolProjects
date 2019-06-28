import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Alert, TouchableOpacity } from 'react-native';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  parseData(data){
    var message = "";
    for (x in data){
      message += " " + data[x];
    }
    Alert.alert(message);
  }

  onPress(){

    fetch('http://192.168.1.97:3000')
      .then((response) => response.json())
      .then((responseJson) => this.parseData(responseJson));

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <TouchableOpacity
          onPress={this.onPress}>
          <Text>Send Request</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

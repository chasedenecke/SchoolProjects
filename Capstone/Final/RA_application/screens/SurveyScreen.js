import React from 'react';
import { Alert, View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ExpoLinksView } from '@expo/samples';
import MyButton from "../components/MyButton";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import ScreenContainer from '../components/ScreenContainer';

export default class SurveyScreen extends React.Component {
  static navigationOptions = {
    tabBarVisible : false,
    header: null //this will hide the header
  };

  _navigateToNextScreen(){
    this.props.navigation.navigate('Joint');
  }

  render() {
    return (
      <ScreenContainer title='Survey'>
        <View style={styles.content_container}>
          <MaterialCommunityIcons
            name="microscope"
            size={200}
            color={Colors.iconColor}
            style={styles.check_mark}
          />
          <View>
            <MyButton
              onPress ={this._navigateToNextScreen.bind(this)}
              text='Start'
            />
            <Text style={[styles.body_text, {marginTop: 20}]}>
              Press start to start survey to measure reheumatoid arthritis activity
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
const U = (props) => <Text style={{textDecorationLine: 'underline'}}>{props.children}</Text>

const styles = StyleSheet.create({
  content_container: {
    padding: 20,
    height: '80%',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  body_text: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 25,
    paddingRight:10,
    paddingLeft: 10,
  },
});

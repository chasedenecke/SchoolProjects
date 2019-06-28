import React from 'react';
import { View, StyleSheet, Text, ScrollView} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ExpoLinksView } from '@expo/samples';
import { CheckBox } from 'react-native-elements';
import MyButton from '../components/MyButton';
import MyCheckBox from '../components/MyCheckBox';
import ScreenContainer from '../components/ScreenContainer';
import Colors from '../constants/Colors';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    tabBarVisible : false,
    header: null //this will hide the header
  };

  render() {
    return(
      <ScreenContainer title='About Us'>
        <ScrollView contentContainerStyle={styles.content_container}>
          <Text style={[styles.body_text, {marginTop: 20, fontWeight: 'bold'}]}>
          About this Project:
          </Text>
          <Text style={[styles.body_text]}>
          This is a Senior Design Project built by OSU students in collaboration with Karate Health.
            In the healthcare field with growing costs, our goal was to use the advancements in Machine Learning to allow patients self-diagnosis rheumatoid arthritis activity.          </Text>
          <Text style={[styles.body_text, {marginTop: 20, fontWeight: 'bold'}]}>
          About Karate Health:
          </Text>
          <Text style={[styles.body_text]}>
          When it comes to their healthcare, patients are no longer in the backseat.
           From engaging health content to data-driven symptom insights, at Karate Health, we build tools that give patients a stronger and more informed voice in their own care.
          </Text>
          <Text style={[styles.body_text, {marginTop: 20}]}>
          For additional information, view Karate Health's <U>website</U>
          </Text>
        </ScrollView>
      </ScreenContainer>
    );
  }
}


const styles = StyleSheet.create({
  content_container: {
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
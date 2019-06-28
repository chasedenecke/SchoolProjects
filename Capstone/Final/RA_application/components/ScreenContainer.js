import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import Colors from '../constants/Colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export default class ScreenContainer extends React.Component {
  static navigationOptions = {
    tabBarVisible : false,
    header: null //this will hide the header
  };

  generateBackArrow(){
    if(this.props.isStack == true){
      return(
        <TouchableOpacity style={styles.backArrow} onPress={this.onPress.bind(this, "BackArrow")}>
          <Ionicons
            name="ios-arrow-back"
            size={32} color="white"
          />
        </TouchableOpacity>
      );
    }
    return;
  }

  generateQuestionMark(){
    if(this.props.needQuestion == true){
      return(
        <TouchableOpacity style={styles.infoButton} onPress={this.onPress.bind(this, "QuestionMark")}>
          <AntDesign
            name="question"
            size={32} color="white"
          />
        </TouchableOpacity>
      );
    }
    return(<View style={styles.fillerView}></View>);
  }

  onPress(key){
    if(typeof this.props !== 'undefined' && typeof this.props.onPress !== 'undefined'){   
        this.props.onPress(key);
    }
}

  render() {
    return (
      <View style={styles.outerContainer}>
        
        <View style={styles.phoneStatusBar}/>

        <View style={styles.headerContainer}>
        
          { this.generateBackArrow() }

          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{this.props.title}</Text>
          </View>  
          { this.generateQuestionMark() }
        
        </View>
        
        <View style={styles.innerContainer}>
          {this.props.children}
        </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  phoneStatusBar: {
    width: '100%',
    height:20,
    backgroundColor: Colors.phoneStatusBarColor,
  },
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width:'100%'
  },
  headerContainer: {
    width:'100%',
    backgroundColor: Colors.screenBackground,
    padding: 10,
    flex: 0,
    flexDirection: 'row',
    height: '10%'
  },
  textContainer:{
    alignSelf: 'flex-start',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  titleText:{
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto',
    color: Colors.titleTextColor,
  },
  backArrow:{
    alignSelf: 'flex-start',
    paddingRight:10,
    color: Colors.titleTextColor,
    justifyContent: 'center',
    height: '100%'
  },
  infoButton: {
    alignSelf: 'flex-start',
    color: Colors.titleTextColor,
    justifyContent: 'center',
    height: '100%'
  },
  fillerView: {
    width: 20,
    backgroundColor: 'blue',
    alignSelf: 'flex-start',
  },
});
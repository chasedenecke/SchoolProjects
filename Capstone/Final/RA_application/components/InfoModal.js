import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import MyButton from '../components/MyButton';
import Colors from '../constants/Colors';

export default class InfoModal extends React.Component{

    constructor(props){
      super(props);
    }
  
    state = {
      modalVisible: this.props.visible, 
    };
  
    toggleVisiblity(){
      this.setState(previousState => ({
        modalVisible: !previousState.modalVisible,
      }));
    }
  
    componentDidMount() {
      this.props.onRef(this);
    }
  
    componentWillUnmount() {
      this.props.onRef(undefined);
    }
  
    render(){
      return(
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}
          >
            <View style = {styles.popUpOuterContainer}>
              <View style = {styles.popUpInnerContainer}>
                {this.props.children}
                <MyButton style={{padding: 10}}text={'Close'} onPress={this.toggleVisiblity.bind(this)}/>
              </View>
            </View>
          </Modal>
        </View>
      );
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
    popUpOuterContainer:{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
    },
    popUpInnerContainer:{
        marginTop: '10%',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: 1,
        borderTopWidth: 5,
        borderTopLeftRadius:20,
        borderTopRightRadius: 20,
        borderColor: 'red',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});
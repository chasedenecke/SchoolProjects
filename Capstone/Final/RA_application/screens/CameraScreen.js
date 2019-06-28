import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Image,
  Dimensions,
  Modal,
  ScrollView
} from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
import { Entypo, Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default class CameraScreen extends React.Component {

  static navigationOptions = {
    tabBarVisible : false,
    header: null //this will hide the header
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    cameraImage: null,
    informed: false,
    modalVisible: true,
  };


  constructor(props){
    super(props);
    console.log("jointData: " + this.props.navigation.state.params.jointData.toString());
  }

  
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  async takePhoto(){
    if (this.camera) {
      const options = { quality: 1, base64: true, fixOrientation: true,
      exif: true};
      this.camera.takePictureAsync(options).then(photo => {
        //photo.exif.Orientation = 1;
        this.setState({
          cameraImage: photo,
        });
      })
     }
  }



  onPressCameraNav(key){
    switch(key){
      case "Back":
        this.props.navigation.goBack();
        break;
      case "Snap":
        this.takePhoto();
        break;
      case "Info":
        this.modalInfo.toggleVisiblity();
        break;
    }
  }

  onPressPictureDisplayNav(key){
    switch(key){
      case "Accept":
        this.props.navigation.navigate('Submit', {jointData : this.props.navigation.state.params.jointData, pictureUri : this.state.cameraImage});
        break;
      case "Reject":
        this.setState({
          cameraImage: null,
        });
        break;
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.state.cameraImage != null){
      return(
        <View style={{ flex: 1 }}>
          <Image
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'relative'}}
          source={{uri: this.state.cameraImage.uri}}
          />
          <PictureDisplayNav onPress={this.onPressPictureDisplayNav.bind(this)}/>          
        </View>
      );
    }else{
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref => {this.camera = ref;}} style={{ flex: 1 }} type={this.state.type}>
            <CameraNav onPress={this.onPressCameraNav.bind(this)}/>
          </Camera>
          <InfoModal onRef={ref => (this.modalInfo = ref)} visible={false}>
            <ScrollView contentContainerStyle={styles.text_container}>
              <Text style={[styles.body_text, {marginTop: 20, fontWeight: 'bold'}]}>
                How To Use:
              </Text>
              <Text style={[styles.body_text, {marginTop: 20}]}>
                Lay your hand on a flat surface with the back of the hand facing the camera.
                 Make sure the surface is monocolored and doesn't blend into the hand.
                 When taking the photo try not to tilt the camera.
                 Following These guidlines will help in providing you the most accurate analysis of joint inflamation.
              </Text>
            </ScrollView>
          </InfoModal>
        </View>
      );
    }
  }
}

class PictureDisplayNav extends React.Component{
  constructor(props){
    super(props);
  }

  onPressAccept(){
    this.props.onPress('Accept');
  }


  onPressReject(){
    this.props.onPress('Reject');
  }

  render(){
    return(
      <View style={styles.icons_view}>

        <TouchableOpacity onPress={this.onPressReject.bind(this)}>
          <Ionicons
            name="ios-close"
            size={60}
            color="white"
            style={[styles.icons,{marginLeft: 40}]}
          />              
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressAccept.bind(this)}>
          <Ionicons
            name="ios-checkmark"
            size={60}
            color="white"
            style={[styles.icons,{marginRight: 40}]}
          />
        </TouchableOpacity>
          
      </View>
    );
  }

}

class CameraNav extends React.Component{
  
  onPressSnap(){
    this.props.onPress('Snap');
  }

  onPressBack(){
    this.props.onPress('Back');
  }

  onPressInfo(){
    this.props.onPress('Info');
  }

  render(){
    return(
      <View style={styles.icons_view}>
        <TouchableOpacity onPress={this.onPressBack.bind(this)}>
          <Ionicons
            name="ios-arrow-back"
            size={32} color="white"
            style={[styles.icons,{marginLeft: 10, marginTop: 10}]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressSnap.bind(this)}>
          <Entypo
            name="circle"
            size={50}
            color="white"
            style={[styles.icons]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressInfo.bind(this)}>
          <Ionicons
            name="ios-help-circle-outline"
            size={32}
            color="white"
            style={[styles.icons,{marginRight: 10, marginTop: 10}]}
          />              
        </TouchableOpacity>
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
  icons_view: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom:0,
    width: '100%',
    justifyContent: 'space-between',
  },
  icons:{
    padding: 10,
    bottom:0,
  },
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
});
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebBrowser } from 'expo';
import ScreenContainer from '../components/ScreenContainer';
import InfoModal from '../components/InfoModal';
import DbTest from '../constants/DbTest';

import { Ionicons } from '@expo/vector-icons';
import { MonoText } from '../components/StyledText';

import { getSubmissions, getBaseUrl } from '../lib/networkUtils';

export default class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      currentSubmission: null,
    };
    this.modalInfo = null;
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.getSubmissions();
  }
  
  onSubmissionPress(photoURI){
    var url = getBaseUrl() + '/photo/' + photoURI;
    this.setState({
      cameraImageUrl: url,
    });
    this.modalInfo.toggleVisiblity();
  }

  getSubmissions(){
    getSubmissions("jmanosu").then((responseJson) => {
      this.setState({
        data: responseJson.submissions,
        loading: false,
        refreshing: false
      });
    })
    .catch(error => {
      this.setState({
        error,
        loading: false,
        refreshing: false
      });
    });
  }

  handleRefresh(){
    this.setState({
      refreshing: true,
      data: [],
    }, () => {
      this.getSubmissions();
    });
  }

  renderFooter(){
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
//ListFooterComponent={this.renderFooter}
  render() {
    return (
      <ScreenContainer title={'Home'}>
        <InfoModal onRef={ref => (this.modalInfo = ref)} visible={false}>
          <Image
            style={{width: "100%", height: "80%", marginTop: "10%"}}
            source={{uri: this.state.cameraImageUrl}}
          />
          <Text>
              {this.state.currentSubmission}
          </Text>
        </InfoModal>
        <View style={{width: '100%', height:'100%'}}>
        <FlatList
          data={this.state.data}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
          <SubmissionItem date={item.date} status={item.processed ? "Processed" : "Unprocessed" } onPress={this.onSubmissionPress.bind(this)} photoURI={item.photoUri}/>
          }
          onScrollBeginDrag={this.getSubmissions.bind(this)}
          keyExtractor={item => item._id+""}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh.bind(this)}    
        />
        </View>
      </ScreenContainer>
    );
  }

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

class SubmissionItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {checked : true};
  }

  onPress(){
    this.setState({
      checked : false
    });
    this.props.onPress(this.props.photoURI);
  }

  render(){
    return (
      <TouchableOpacity style={styles.flat_view_item} onPress={this.onPress.bind(this)}>
        <View style={styles.icon_view}>
        { this.state.checked ?
          <Ionicons
            name="md-square"
            size={25}
            color="red"
            style={styles.check_mark}
          />
          :
          <Ionicons
            name="md-square-outline"
            size={25}
            color="black"
            style={styles.check_mark}
          />
          }
        </View>
        <View style={styles.data_view}>
          <Text style={styles.name}>{this.props.date}</Text>
          <Text style={styles.email}>{this.props.status}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  flat_view_item:{
    width: '100%',
    height: 60,   
    padding: 10, 
    flexDirection: 'row',
  },
  icon_view:{
    alignSelf: 'flex-start',
    paddingRight: 20,
  },
  data_view:{
    alignSelf: 'flex-start',
    flexGrow: 1,
  },
  name: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto',
    fontSize: 18
  },
  email: {
    color: 'red'
  }
});

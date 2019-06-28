import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class MyCheckBox extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {checked : false};
    }

    onPressButton(){
        if(typeof this.props !== 'undefined' && typeof this.props.onPress !== 'undefined'){
            this.setState(previousState => ({
                checked : !previousState.checked
            })); 
            this.props.onPress(!this.state.checked);
        }
    }
    
    render() {
        return (
            <TouchableOpacity onPress={this.onPressButton.bind(this)} style={[styles.touchableOpacity, this.props.style]}>
                { this.state.checked ?
                    <View style={styles.icon_view}>
                        <Ionicons
                            name="md-square"
                            size={25}
                            color="red"
                            style={styles.check_mark}
                        />
                    </View> 
                    :
                    <View style={styles.icon_view}>
                        <Ionicons
                            name="md-square-outline"
                            size={25}
                            color="black"
                            style={styles.check_mark}
                        />
                    </View> 
                }
                <View style={styles.text_view}>
                    <Text style={styles.text}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableOpacity>
    );
  }
}

MyCheckBox.defaultProps = {
    onPress: null,
    Text: '',
}

const styles = StyleSheet.create({
    touchableOpacity:{
        width: '100%',
        height: 30,    
        flexDirection: 'row',
    },
    icon_view:{
        height: '100%',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',   
        paddingRight: 10,
    },
    text_view:{
        height: '100%',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        flexGrow: 1,
    },
    check_mark:{ 
    },
    text:{
        fontSize: 17,
    },
});
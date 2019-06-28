import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';


export default class MyButton extends React.Component {
    
    constructor(props) {
        super(props);
        if(this.props.color){
            this.color = {
                borderColor: this.props.color,
                color: this.props.color
            }
        }else{
            this.color = {
                borderColor: Colors.buttonColor,
                color: Colors.buttonColor
            }
        }
    }

    onPressButton(){
        if(typeof this.props !== 'undefined' && typeof this.props.onPress !== 'undefined'){   
            this.props.onPress();
        }
    }
    
    render() {
        return (
            <TouchableOpacity onPress={this.onPressButton.bind(this)} style={[styles.touchableOpacity, this.props.style]}>
                <View style={[this.color, styles.view]}>
                    <Text style={[this.color]}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableOpacity>
    );
  }
}

MyButton.defaultProps = {
    onPress: null,
    Text: '',
}

const styles = StyleSheet.create({
    touchableOpacity:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',        
    },
    view:{
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
        width: '100%',
        alignItems: 'center',
        flexGrow: 1,     
    }
});
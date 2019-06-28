import React from 'react';
import { Svg } from 'expo';
import Colors from '../constants/Colors';

  
export default class Joint extends React.Component {
    constructor(props){
      super(props);
      this.state = {inflamed : 0};
    }
  
    onJointPress(){
      this.props.onPress();
      this.setState(previousState => (
        {
          inflamed: !previousState.inflamed,
        }
      ))
    }
  
    render(){
      return(
        <Svg.Circle
            cx={this.props.cx}
            cy={this.props.cy}
            r={this.props.r}
            strokeWidth={2.5}
            stroke= {this.state.inflamed ? Colors.jointActive : Colors.jointDefault}
            fillOpacity="0"
            onPress={() => this.onJointPress()}
        />
      )
    }
  
}
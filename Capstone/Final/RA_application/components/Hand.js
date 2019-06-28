import React from 'react';
import { View, } from 'react-native';
import { Svg } from 'expo';
import Joints from '../constants/Joints';
import Joint from '../components/Joint';

export default class Hand extends React.Component{
  
    constructor(props){
      super(props);
      this.inflamedJoints = [];
      Joints.forEach(element => {
        this.inflamedJoints[element.key] = 0;
      });
    }
  
    onInflamedJointPress(key){
      this.inflamedJoints[key] = !this.inflamedJoints[key];
    }

    getInflamedJointsData(){
      return this.inflamedJoints;
    }
  
    shouldComponentUpdate(nextProps, nextState) {
      return false;
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
                <Svg height={500} width={300} key={"Hand"}>
                    <Svg.Image
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid"
                        opacity="0.5"
                        href={require('../assets/images/hand.png')}
                        fill="#f2140f"
                        background-position="center"
                        key={Math.random()}
                    />
                    {
                        jointListArr = Joints.map(index => (
                            <Joint key={"joint"+index.key} cx={index.cx} cy={index.cy} r={index.r} onPress={() => this.onInflamedJointPress(index.key)}/>
                        ))
                    }
                </Svg>
            </View>
        );
    }
}
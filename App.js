import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Vibration, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import NumericInput from 'react-native-numeric-input';



function pulse_scale(scale, duration) {
  return Math.round(scale * duration)
};

function createBeatStrengthArray(n) {
  let res = []
  for (let i=0; i<n; i++) {
    res.push(Dropdown())
  }
  return res
}

const Dropdown = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("strong");
  const [items, setItems] = useState([{label: 'Weak', value: 'weak'},
                                      {label: "Medium", value: "medium"},
                                      {label: "Strong", value: "strong"}]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      onChangeValue={(new_val) => {props.setFunction(new_val)}}
      setItems={setItems}
      containerStyle={{width: 80, height:30}}
      textStyle={{fontSize: 15}}
      showArrowIcon={false}
    />
    )
}

export default function Metronome() {
  
  const [BPM, setBPM] = useState(60)
  const [pulse_duration, setPD] = useState(50)
  const [beat_strengths, setBS] = useState(['strong', 'strong', 'strong', 'strong'])
  
  const [strong_scale, setSD] = useState(1)
  const [mid_scale, setMD] = useState(0.6)
  const [weak_scale, setLD] = useState(0.4)

  let modifyBeatIdx = function(idx) {
    const modify = (val) => {
      let res = [...beat_strengths];
      res[idx] = val;
      setBS(res);
    }

    return modify
  }

  let createPulse = function(vibration_scale) {
    let vibration_duration = pulse_scale(vibration_scale, pulse_duration)
    return [Math.round(60*1000/BPM) - vibration_duration, vibration_duration]
  }

  let strength_to_pulse = {
    "weak": createPulse(weak_scale),
    "medium": createPulse(mid_scale),
    "strong": createPulse(strong_scale),
  }

  let createMeter = function(strengths) {
     return [].concat.apply([], strengths.map(function(s){return strength_to_pulse[s]}))
  } 
  
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold' }}> BPM </Text>
      <Text> {BPM} </Text>
      <Slider
        value={BPM}
        minimumValue={22}
        maximumValue={300}
        step={1}
        onValueChange={newBPM => {
          Vibration.cancel()
          setBPM(newBPM);
          }
        }
        style={{"width": 300, "height": 20}}
      />
    
    <Text style={{ fontWeight: 'bold' }}> Beat accents </Text> 
    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', 
                  marginBottom: 30}}>
      <Dropdown setFunction={modifyBeatIdx(0)} />
      <Dropdown setFunction={modifyBeatIdx(1)} />
      <Dropdown setFunction={modifyBeatIdx(2)} />
      <Dropdown setFunction={modifyBeatIdx(3)} />
    </View>

    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
      <Button
        onPress={() => {Vibration.vibrate(createMeter(beat_strengths), true)}}
        title={"Play"}
      />

      <Button
        onPress={() => {
            Vibration.cancel();  
          }}
        title={"Stop"}
      />
    </View>
    <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

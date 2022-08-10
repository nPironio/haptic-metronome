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

const IntensitySlider = (props) => {
  return (
    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <Text style={{ fontWeight: 'bold' }}> {props.name} scale </Text>
        <Text> {props.scale.toFixed(3)} </Text>
        <Slider
          value={props.scale}
          minimumValue={0}
          maximumValue={1}
          step={0.001}
          onValueChange={newIntensity => {
            Vibration.cancel()
            props.setFunction(newIntensity);
            }
          }
          style={{"width": 100, "height": 20}}
        />
    </View>


  )
}

export default function Metronome() {
  
  const [BPM, setBPM] = useState(90)
  const [pulse_duration, setPD] = useState(50)
  const [beat_strengths, setBS] = useState(['strong', 'strong', 'strong', 'strong'])


  let [min_BPM, max_BPM] = [22, 220]
  let BPM_range = max_BPM - min_BPM

  let scale_set = function(bpm, max) {
    return (1/Math.exp(0.2*(bpm-min_BPM)/BPM_range)) * max
  }
  
  const [strong_scale, setSD] = useState(scale_set(BPM, 1))
  const [mid_scale, setMD] = useState(scale_set(BPM, 0.8))
  const [weak_scale, setLD] = useState(scale_set(BPM, 0.6))


  
  let setScales = function(bpm) {
    setSD(scale_set(bpm, 1))
    setMD(scale_set(bpm, 0.8))
    setLD(scale_set(bpm, 0.6))
  }

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
        minimumValue={min_BPM}
        maximumValue={max_BPM}
        step={1}
        onValueChange={newBPM => {
          Vibration.cancel()
          setBPM(newBPM);
          setScales(newBPM)
          }
        }
        style={{"width": 300, "height": 20}}
      />

      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <IntensitySlider scale={weak_scale} name={"Weak"} setFunction={setLD} />
        <IntensitySlider scale={mid_scale} name={"Medium"} setFunction={setMD} />
        <IntensitySlider scale={strong_scale} name={"Strong"} setFunction={setSD} />
      </View>
    
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

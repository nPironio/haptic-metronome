import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Vibration, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';



function pulse_scale(scale, duration) {
  return Math.round(scale * duration)
};

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Strong");
  const [items, setItems] = useState([{label: 'Weak', value: 'Weak'},
                                      {label: "Medium", value: "Medium"},
                                      {label: "Strong", value: "Strong"}]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      style={{width: 60, height: 20}}
    />
    )
}

export default function Metronome() {
  
  const [BPM, setBPM] = useState(60)
  const [pulse_duration, setPD] = useState(50)  
  
  const [strong_scale, setSD] = useState(0.9)
  const [mid_scale, setMD] = useState(0.7)
  const [weak_scale, setLD] = useState(0.5)

  let create_pulse = function(vibration_scale) {
    let vibration_duration = pulse_scale(vibration_scale, pulse_duration)
    return [Math.round(60*1000/BPM) - vibration_duration, vibration_duration]
  }
  
  return (
    <View style={styles.container}>
      <Text> BPM </Text>
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
    <Text> Beat accents </Text>
{/*    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
      <Dropdown />
      <Dropdown />
      <Dropdown />
      <Dropdown />
    </View>*/}
    <Button
      onPress={() => {    
            Vibration.vibrate(create_pulse(strong_scale), true); 
        }}
      title={"Strong"}
    />

    <Button
      onPress={() => {    
            Vibration.vibrate(create_pulse(mid_scale), true); 
        }}
      title={"Medium"}
    />

    <Button
      onPress={() => {    
            Vibration.vibrate(create_pulse(weak_scale), true); 
        }}
      title={"weak"}
    />

    <Button
      onPress={() => {
          Vibration.cancel();  
        }}
      title={"Stop"}
    />
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

import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Vibration, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';



function event_scale(scale, duration) {
  return Math.round(scale * duration)
}

export default function Metronome() {
  
  const [BPM, setBPM] = useState(60)
  const [pulse_duration, setPD] = useState(50)  
  const [strong_duration, setSD] = useState(event_scale(0.9, pulse_duration))
  const [mid_duration, setMD] = useState(event_scale(0.7, pulse_duration))
  const [light_duration, setLD] = useState(event_scale(0.5, pulse_duration))

  let create_pulse = function(vibration_duration) {
    let pulse = [Math.round(60*1000/BPM) - vibration_duration, vibration_duration] 
    console.log(pulse)
    return pulse
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
          setBPM(newBPM);
        }
      }
      style={{"width": 300, "height": 20}}
      />

      <Button
        onPress={() => {    
              Vibration.vibrate(create_pulse(strong_duration), true); 
          }}
        title={"Strong"}
      />

      <Button
        onPress={() => {    
              Vibration.vibrate(create_pulse(mid_duration), true); 
          }}
        title={"Medium"}
      />

      <Button
        onPress={() => {    
              Vibration.vibrate(create_pulse(light_duration), true); 
          }}
        title={"Light"}
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

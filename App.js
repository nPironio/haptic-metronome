import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Vibration, Text, TextInput, View } from 'react-native';


// let BPM = 10
// let pulse_duration = 3000
// 

// let events_in_pulse = 3


function create_pulse(duration, num_events, vibration_in_event, rest_time) {
  pulse = []
  console.log(pulse)
  event_duration = duration/num_events
  for (let i=0; i<num_events; i++) {
  pulse.push(event_duration - vibration_in_event)
  pulse.push(vibration_in_event)
  }
  pulse.push(rest_time)
  return pulse 
}


export default function Metronome() {
  
  const [BPM, setBPM] = useState(60)
  const [pulse_duration, setPD] = useState(180)
  const [events_in_pulse, setEP] = useState(100)
  let rest_time = Math.round(60*1000/BPM) - pulse_duration
  let event_duration = pulse_duration / events_in_pulse

  let strong_duration = Math.round(0.999 * event_duration)
  let mid_duration = Math.round(0.99 * event_duration)
  let light_duration = Math.round(0.9 * event_duration)

  return (
    <View style={styles.container}>
      <TextInput
        defaultValue={"BPM"}
        style = {{height: 40}}
        onChangeText={newBPM => {
          setBPM(parseInt(newBPM));
          rest_time = Math.round(60*1000/BPM) - pulse_duration;        
        }}
      />
      <Button
        onPress={() => {
              Vibration.vibrate(create_pulse(pulse_duration, events_in_pulse, strong_duration, rest_time), true); 
          }}
        title={"Strong"}
      />

      <Button
        onPress={() => {
              Vibration.vibrate(create_pulse(pulse_duration, events_in_pulse, mid_duration, rest_time), true); 
          }}
        title={"Mid"}
      />

      <Button
        onPress={() => {
              Vibration.vibrate(create_pulse(pulse_duration, events_in_pulse, light_duration, rest_time), true); 
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

import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Vibration, Text, View } from 'react-native';

export default function Metronome() {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
              Vibration.vibrate([250, 100, 150], true); 
          }}
        title={"Play"}
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

import { Link } from 'expo-router'
import {Platform, Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function RegisterEvent() {
  return (
    <SafeAreaView>
      <View className="bg-green-600">
        <TextInput
          editable
          maxLength={50}
          placeholder="Nazwa wydarzenia"
        />
        <TextInput
          editable
          maxLength={50}
          placeholder="Nazwa drużyny"
        />
        
        <DateTimePicker
              value={new Date()}
              mode='date'
              is24Hour={true}
              display="default"
              design='material'
            />

      </View>
      <Link href='/(entry)/register/key'>Wstecz</Link>
      <Link href='/(entry)/register/leader'>Dalej</Link>
      
    </SafeAreaView>
  );
}


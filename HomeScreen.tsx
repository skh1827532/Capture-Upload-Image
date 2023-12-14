import React from 'react';
import {View, Button} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Open Camera"
        onPress={() => navigation.navigate('Camera')}
      />
    </View>
  );
};

export default HomeScreen;

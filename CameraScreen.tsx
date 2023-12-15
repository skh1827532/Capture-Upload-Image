import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App'; // Import RootStackParamList from App.tsx

type CameraScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Camera'>;
};

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const cameraRef = useRef<RNCamera>(null);
  const [camType, setCamType] = useState(RNCamera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.on);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, width: 1280, height: 720 };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
      navigation.navigate('UploadScreen', { uri: data.uri });
    }
  };

  const handleFlip = () => {
    setCamType(
      camType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back,
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        type={camType}
        flashMode={flashMode}
        style={styles.preview}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}></RNCamera>

      <Button onPress={handleCapture} title="Take Picture" />

      <Button onPress={handleFlip} title="Flip Camera" />
    </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default CameraScreen;

import 'react-native-gesture-handler';
import React, {useState, useRef} from 'react';

import {Text, View, Button, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';

const CameraScreen = props => {
  const cameraRef = useRef(null);

  const [camType, setCamType] = useState(RNCamera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.on);
  const handleCapture = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
      props.navigation.navigate('UploadScreen', {uri: data.uri});
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
    <View style={{flex: 1}}>
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
      <View>
        <Button onPress={() => handleCapture()} title="Take Picture" />
        <Button onPress={() => handleFlip()} title="Flip Camera" />
      </View>
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

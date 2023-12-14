import React, {useState} from 'react';
import {View, Image, Button, ActivityIndicator, Alert} from 'react-native';
import RNFS from 'react-native-fs';

const UploadScreen = props => {
  const [loading, setLoading] = useState(false);
  const imageUri = props.route.params.uri; // The image URI

  const handleUpload = async () => {
    setLoading(true);

    try {
      const fileContent = await RNFS.readFile(imageUri, 'base64');
      const fileType = 'image/jpg'; // Assuming the image is a JPEG, change this according to your image type
      const fileName = 'upload.jpg'; // Change this to your desired file name

      let formData = new FormData();
      formData.append('image', {
        uri: `data:${fileType};base64,${fileContent}`,
        type: fileType,
        name: fileName,
      });

      const options = {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await fetch(
        'https://webhook.site/67e8d38f-3dae-48bc-ac11-b1fd949a87b5',
        options,
      );

      if (response.ok) {
        Alert.alert('Upload Successful', 'The data has been uploaded.');
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'The data could not be uploaded.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size={'large'} />;

  return (
    <View>
      <Image style={{width: 120, height: 120}} source={{uri: imageUri}} />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
};

export default UploadScreen;

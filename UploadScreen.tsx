import React, {useState} from 'react';
import {
  View,
  Image,
  Button,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import {RouteProp} from '@react-navigation/native'; // Import RouteProp from @react-navigation/native
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App'; // Import RootStackParamList from App.tsx

type UploadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UploadScreen'
>;
type UploadScreenRouteProp = RouteProp<RootStackParamList, 'UploadScreen'>;

type UploadScreenProps = {
  navigation: UploadScreenNavigationProp;
  route: UploadScreenRouteProp;
};

const UploadScreen: React.FC<UploadScreenProps> = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const imageUri = route.params.uri;

  const handleUpload = async () => {
    setLoading(true);
    try {
      const fileContent = await RNFS.readFile(imageUri, 'base64');
      const fileType = 'image/jpg';
      const fileName = 'upload.jpg';

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
        'https://webhook.site/67e8d38f-3dae-48bc-ac11-b1fd949a87b5', // Replace with your actual upload URL
        options,
      );

      if (response.ok) {
        setUploadStatus('Upload Successful: The data has been uploaded.');
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      setUploadStatus('Upload Failed: The data could not be uploaded.');
      console.error(error);
    } finally {
      setLoading(false);
      setUploadComplete(true);
      setModalVisible(true);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    if (uploadComplete) {
      navigation.navigate('Home');
    }
  };

  if (loading) {
    return <ActivityIndicator size={'large'} />;
  }

  return (
    <View style={styles.container}>
      {!uploadComplete && (
        <View>
          <Image style={styles.image} source={{uri: imageUri}} />
          <Button title="Upload" onPress={handleUpload} />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{uploadStatus}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default UploadScreen;

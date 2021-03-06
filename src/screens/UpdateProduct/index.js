import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {URL} from '../../../environment';
import {useSelector} from 'react-redux';
import {getSelectedProduct} from '../../redux/selectors';
import axios from 'axios';
import {useFetchProducts} from '../../api/UseFetchProducts';

export default function UpdateProductScreen({navigation, route}) {
  const {getProductById} = useFetchProducts();
  const product = useSelector(getSelectedProduct);
  const [name, setName] = useState(product.name);
  const [image, setImage] = useState(product.image);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [disabled, setDisabled] = useState('true');
  const {id} = route.params;

  console.log(id);
  useEffect(() => {
    getProductById(id);
    if (
      name === product.name &&
      image === product.image &&
      description === product.description &&
      price == product.price
    ) {
      setDisabled('true');
      console.log('disabled', disabled);
    } else {
      setDisabled('false');
      console.log('disabled', disabled);
    }
  }, [name, price, image, disabled]);
  const putProduct = async () => {
    try {
      const response = await axios.put(URL + '/products/' + id, {
        name: name,
        image: image,
        price: price,
        user_id: 1,
      });
    } catch (e) {
      console.error('Error', e);
    }
  };

  function save() {
    putProduct();
    navigation.navigate('Home');
  }
  function cancel() {
    navigation.navigate('Home');
  }

  const openCamera = () => {
    let options = {
      path: 'images',
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Cancel upload image');
      } else if (response.errorCode === 'permission') {
        console.log('Not permission');
        Alert.alert("vous n'avez pas la permission");
      } else if (response.errorCode === 'other') {
        console.log('other error');
        Alert.alert('erreur inconnue');
      } else if (response.assets[0].fileSize > 8000000) {
        console.log('max 8MB', response.assets[0].fileSize);
        Alert.alert("l'image est trop grande. MAX:8MG");
      } else {
        setImage(
          'data:' +
            response.assets[0].type +
            ';base64,' +
            response.assets[0].base64,
        );
      }
    });
  };

  const chooseImage = () => {
    let options = {
      path: 'images',
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Cancel upload image');
      } else if (response.errorCode === 'permission') {
        console.log('Not permission');
        Alert.alert("vous n'avez pas la permission");
      } else if (response.errorCode === 'other') {
        console.log('other error');
        Alert.alert('erreur inconnue');
      } else if (response.assets[0].fileSize > 8000000) {
        console.log('max 8MB', response.assets[0].fileSize);
      } else {
        setImage(
          'data:' +
            response.assets[0].type +
            ';base64,' +
            response.assets[0].base64,
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={name => setName(name)}
        style={styles.inputText}
        value={name}
      />
      <TextInput
        onChangeText={description => setDescription(description)}
        style={styles.inputText}
        value={description}
      />
      <TextInput
        onChangeText={price => setPrice(price)}
        keyboardType="numeric"
        style={styles.inputText}
        value={price.toString()}
      />

      <Image source={{uri: image}} style={{height: '40%', width: '90%'}} />

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginLeft: 0,
        }}>
        <TouchableOpacity
          onPress={() => {
            openCamera();
          }}
          style={[
            styles.inputText,
            {backgroundColor: '#2bce90', width: '48%'},
          ]}>
          <Text>Prendre une photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            chooseImage();
          }}
          style={[
            styles.inputText,
            {backgroundColor: '#2bce90', width: '48%'},
          ]}>
          <Text>Rechercher dans la galerie</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginLeft: 0,
        }}>
        <TouchableOpacity
          onPress={() => cancel()}
          style={[
            styles.inputText,
            {backgroundColor: '#c40e0e', width: '48%'},
          ]}>
          <Text style={{color: '#fff', textAlign: 'center'}}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={disabled === 'true'}
          onPress={() => {
            save();
          }}
          style={
            disabled === 'true'
              ? [styles.disabled, {backgroundColor: '#848f98', width: '48%'}]
              : [styles.inputText, {backgroundColor: '#084572', width: '48%'}]
          }>
          <Text style={{color: '#fff', textAlign: 'center'}}>Modifier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  inputText: {
    width: '98%',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  disabled: {
    width: '98%',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
});

import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import axios from 'axios';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';

const Welcome = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.length === 0) {
      // Alert.alert('Error', 'City name is empty.');
      const errorMessage = 'City Name Is Empty';
      setErrorMessage(errorMessage);
      setShowAlert(true);
    } else {
      fetchdetails();
    }
  };
  const fetchdetails = () => {
    const apiKey = 'f44dbb69ada9accc9b19dcdd502b6721';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.cod !== '404') {
          // Alert.alert('Error fetching data');
          navigation.navigate('Weather', {
            city: city,
            weatherData: response.data,
          });
        } else {
          const errorMessage = 'City Not Found';
          setErrorMessage(errorMessage);
          setShowAlert(true);
        }
      })
      
    
      .catch(error => {
        // Alert.alert('City not found,check city name');
        const errorMessage = 'City Not Found';
        setErrorMessage(errorMessage);
        setShowAlert(true);
      });
  };
  const closeAlert = () => {
    // Function to close the alert
    setShowAlert(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <Text style={styles.heading}>Weather</Text>
        <Text style={styles.subheading}>FINDER</Text>
      </View>
      <View style={styles.middle}>
        <TextInput
          placeholder="Enter City"
          value={city.trim()}
          onChangeText={text => setCity(text)}
          style={styles.input}
          textAlign="center"
          padding={0}
        />
        <TouchableOpacity onPress={handleSearch} activeOpacity={0.1}>
          <View>
            <Text style={styles.button}> Search </Text>
          </View>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={showAlert}
        message={errorMessage}
        onClose={closeAlert}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: 5,
    color: 'black',
  },
  subheading: {
    textAlign: 'center',
    letterSpacing: 23,
    color: 'red',
  },
  input: {
    height: 50,
    width: 300,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginTop: 25,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    color: 'red',
    textTransform: 'uppercase',
    marginTop: 25,
    fontWeight: '900',
  },
  middle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  celsius: {
    fontSize: 80,
    fontWeight: '900',
    color: 'red',
    textAlign: 'center',
  },
  lower: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    fontSize: 15,
    textAlign: 'center',
  },
  city: {
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: 2,
  },
});
export default Welcome;

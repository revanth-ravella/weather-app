import {View, Text, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';
import axios from 'axios';
import {format} from 'date-fns';

const Weather = () => {
  const route = useRoute();
  const city = route.params.city;
  const weatherData = route.params.weatherData;
  const temperature = (weatherData.main.temp - 273.15).toFixed(2);
  const description = weatherData.weather[0].description;
  const sunriseDate = new Date(weatherData.sys.sunrise * 1000);
  const sunsetDate = new Date(weatherData.sys.sunset * 1000);
  const sunriseTime = sunriseDate.toLocaleTimeString();
  const sunsetTime = sunsetDate.toLocaleTimeString();
  const latitude = weatherData.coord.lat;
  const longitude = weatherData.coord.lon;
  // Graph Data fetching======================================================================================
  const screenWidth = Dimensions.get('window').width;
  const adjustedWidth = screenWidth - screenWidth * 0.05;

  const [timeList, setTimeList] = useState([
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
  ]);
  const [temperatureList, setTemperatureList] = useState([
    11.1, 10.3, 10.3, 10, 9.7,
  ]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const forecastDays = 5;
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=${forecastDays}`;

        const response = await axios.get(apiUrl);

        const interval = 24;
        const timeList = [];
        const temperatureList = [];

        for (let i = 0; i < response.data.hourly.time.length; i += interval) {
          const time = response.data.hourly.time[i];
          const temperature = response.data.hourly.temperature_2m[i];
          timeList.push(time);
          temperatureList.push(temperature);
        }

        const formatTimestamp = timestamp => {
          const date = new Date(timestamp);
          return format(date, 'MMMdo');
        };

        const formattedTimeList = timeList.map(timestamp =>
          formatTimestamp(timestamp),
        );

        setTimeList(formattedTimeList);
        setTemperatureList(temperatureList);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);
  // Graph Data===================================================================
  const data = {
    labels: timeList,
    datasets: [
      {
        data: temperatureList,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
        strokeWidth: 3, // optional
      },
    ],
    legend: ['Temperature'], // optional
  };

  return (
    <View style={styles.container}>
      <View style={styles.lower}>
        <Text numberOfLines={1} style={styles.city}>
          {city}
        </Text>
        <Text style={styles.celsius}>{temperature}°C</Text>
        <Text style={[styles.sub, styles.red]}>{description}</Text>
        <Text style={styles.sub}>
          Wind speed :{' '}
          <Text style={styles.red}> {weatherData.wind.speed} </Text>
        </Text>
        <Text style={[styles.sub1]}>Daytime Information</Text>
        <Text style={styles.sub}>
          Sunrise : <Text style={styles.red}> {sunriseTime} </Text>
        </Text>
        <Text style={styles.sub}>
          Sunset : <Text style={styles.red}> {sunsetTime} </Text>
        </Text>
      </View>
      <View style={styles.upper}>
        <Text style={styles.sub2}>5 Days Forcast</Text>
        <LineChart
          data={data}
          width={adjustedWidth}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#B70404',
            backgroundGradientFromOpacity: 10,
            backgroundGradientTo: '#B70404',
            backgroundGradientToOpacity: 10,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 3,
            barPercentage: 0.5,
          }}
          bezier
          style={{
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  lower: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  upper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  red: {
    color: 'red',
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: 5,
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
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginTop: 25,
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
  },
  middle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celsius: {
    fontSize: 80,
    fontWeight: '900',
    color: 'red',
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
    textTransform: 'capitalize',
    fontWeight: '500',
    marginTop: 10,
  },
  sub1: {
    textAlign: 'center',
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    textTransform: 'uppercase',
    fontWeight: '900',
    marginTop: 15,
    letterSpacing: 1,
  },
  sub2: {
    textAlign: 'center',
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  city: {
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: 2,
    color: 'black',
  },
  yesterday: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
  dayyesterday: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
});

export default Weather;

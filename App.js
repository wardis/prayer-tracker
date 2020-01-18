import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import { Calendar } from 'react-native-calendars';
import Pray from './components/Pray';
import moment from 'moment';

const prayList = ['Fadjr', 'Dohr', 'Asr', 'Maghreb', 'Incha'];
console.log(moment().format('YYYY-MM-DD'));

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDayPrays: prayList,
      date: moment().format('YYYY-MM-DD'),
      prays: {}
    };
  }

  componentDidMount() {
    this.loadPrays();
  }
  loadPrays = async () => {
    try {
      const value = await AsyncStorage.getItem('@PrayerTracker_PRAYS');
      if (value !== null) {
        // value previously stored
        this.setState({
          ...this.state,
          prays: JSON.parse(value)
        });
      }
    } catch (e) {
      alert('Error when loading prays');
    }
    console.log('Loaded.');
  };

  savePrays = async (newPrays) => {
      try {
        await AsyncStorage.setItem(
          '@PrayerTracker_PRAYS',
          JSON.stringify(newPrays)
        );
      } catch (e) {
        // save error
      }

      console.log('Saved.');
    };
  

  onDayPress(day) {
    const date = day.dateString;
    this.setState({
      ...this.state,
      date: date,
      prays: {
        ...this.state.prays,
        [date]:
          this.state.prays[date] === undefined ? {} : this.state.prays[date]
      }
    });
  }

  onPrayPress(prayName) {
    const name = prayName;
    const date = this.state.date;
    const status =
      this.state.prays[date] === undefined
        ? false
        : this.state.prays[date][name] === undefined
        ? false
        : this.state.prays[date][name];
    console.log(status);
    this.setState(
      {
        ...this.state,
        prays: {
          ...this.state.prays,
          [date]: {
            ...this.state.prays[date],
            [name]: !status
          }
        }
      },
      () => {
        this.savePrays(this.state.prays);
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Prayer Tracker</Text>
        </View>
        <View>
          <Calendar
            // dayComponent={CustomDay}
            onDayPress={day => this.onDayPress(day)}
            markedDates={{
              [this.state.date]: { selected: true }
            }}
          />
        </View>

        <View style={styles.list}>
          {this.state.selectedDayPrays.map(prayName => (
            <Pray
              key={prayName}
              name={prayName}
              status={
                this.state.prays[this.state.date] === undefined
                  ? false
                  : this.state.prays[this.state.date][prayName]
              }
              onPress={() => this.onPrayPress(prayName)}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: Constants.statusBarHeight
  },
  header: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: '#00adf5',
    width: '100%'
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 32,
    padding: 16
  },
  calendar: {
    marginTop: 10,
    backgroundColor: 'white'
  },
  list: {
    marginTop: 10,
    marginBottom: 6
  }
});

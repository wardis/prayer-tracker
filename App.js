import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Pray from './components/Pray';
import moment from 'moment';

let emptyPray = [
  { name: 'Fajr', status: false },
  { name: 'Dohr', status: false },
  { name: 'Asr', status: false },
  { name: 'Maghreb', status: false },
  { name: 'Incha', status: false }
];
let initialList = [
  {
    day: moment(),
    pray: [
      { name: 'Fajr', status: false },
      { name: 'Dohr', status: false },
      { name: 'Asr', status: false },
      { name: 'Maghreb', status: false },
      { name: 'Incha', status: true }
    ]
  },
  {
    day: moment().add(1, 'd'),
    pray: [
      { name: 'Fajr', status: true },
      { name: 'Dohr', status: true },
      { name: 'Asr', status: false },
      { name: 'Maghreb', status: false },
      { name: 'Incha', status: false }
    ]
  }
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: moment(),
      list: initialList,
      selectedDayPrays: emptyPray,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  onDateChange(date) {
    let prays = this.findPray(date);
    if (prays) {
      this.setState({
        ...this.state,
        selectedDay: date,
        selectedDayPrays: prays.pray
      });
    } else {
      this.setState({
        ...this.state,
        selectedDay: date,
        selectedDayPrays: emptyPray
      });
    }
  }
  findPray(date) {
    return this.state.list.find(item => item.day.isSame(date, 'day'));
  }
  _onPressButton() {
    alert('You tapped the button!');
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Prayer Tracker</Text>
        </View>
        <View style={styles.calendar}>
          <CalendarPicker
            todayTextStyle={{ fontWeight: 'bold' }}
            onDateChange={this.onDateChange}
            startFromMonday={true}
            weekdays={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
            previousTitle='<'
            nextTitle='>'
            todayBackgroundColor='transparent'
            selectedDayColor='transparent'
            selectedDayStyle={{ borderWidth: 1 }}
            customDatesStyles={[
              {
                date: moment(),
                style: { borderWidth: 1, borderColor: 'orange' }
              }
            ]}
          />
        </View>

        <View style={styles.list}>
          {this.state.selectedDayPrays.map(pray => (
            <Pray
              key={pray.name}
              name={pray.name}
              status={pray.status}
              onPress={this._onPressButton}
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
    marginTop: 23
  },
  header: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: 'green',
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

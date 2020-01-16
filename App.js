import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Pray from './components/Pray';
import moment from 'moment';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: moment(),
      prays: [
        { name: 'Fajr', status: true },
        { name: 'Dohr', status: true },
        { name: 'Asrm', status: true },
        { name: 'Maghreb', status: false },
        { name: 'Incha', status: false }
      ]
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  onDateChange(date) {
    this.setState({
      // ...this.state,
      selectedStartDate: date
    });
  }
  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
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
          {this.state.prays.map(pray => (
            // <Text key={pray.name}>{pray.name}</Text>
            <Pray key={pray.name} name={pray.name} status={pray.status} />
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

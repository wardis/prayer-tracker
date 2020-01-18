import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class Pray extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.pray}>
          <Text style={styles.text}>{this.props.name}</Text>
          <Ionicons
            style={styles.check}
            name='md-checkmark-circle'
            size={32}
            color={this.props.status == true ? '#00adf5' : 'lightgrey'}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  pray: {
    flexDirection: 'row',
    height: 60,
    // marginBottom: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  },
  check: {
    textAlign: 'center',
    width: 30,
    height: 30
  }
});

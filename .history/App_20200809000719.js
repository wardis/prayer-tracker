import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Constants from "expo-constants";
import { Calendar } from "react-native-calendars";
import Pray from "./components/Pray";
import moment from "moment";

const prayList = ["Fadjr", "Dohr", "Asr", "Maghreb", "Incha"];
const colors = [
  "rgba(0,173,245, 0)",
  "rgba(0,173,245, .07)",
  "rgba(0,173,245, .2)",
  "rgba(0,173,245, .4)",
  "rgba(0,166,236, .7)",
  "hsla(198,100%,46%, 1)",
];
const textColors = ["#000", "#000", "#000", "#000", "#fff", "#fff"];
const COLOR_COUNT = colors.length;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: moment().format("YYYY-MM-DD"),
      selectedDay: moment().format("YYYY-MM-DD"),
      selectedDayColorIndex: 0,
      prays: {},
      marks: {},
    };
  }

  componentDidMount() {
    // AsyncStorage.removeItem('@PrayerTracker_PRAYS');
    this.loadPrays();
  }
  loadPrays = async () => {
    try {
      const value = await AsyncStorage.getItem("@PrayerTracker_PRAYS");
      if (value !== null) {
        // value previously stored
        this.setState(
          {
            ...this.state,
            prays: JSON.parse(value),
          },
          () => {
            this.setState(
              {
                ...this.state,
              },
              () => {
                this.markDays();
              }
            );
          }
        );
      } else {
        this.markDays();
      }
    } catch (e) {
      alert("Error when loading prays");
    }
  };

  savePrays = async (newPrays) => {
    try {
      await AsyncStorage.setItem(
        "@PrayerTracker_PRAYS",
        JSON.stringify(this.state.prays)
      );
    } catch (e) {
      // save error
    }
  };

  onDayPress(day) {
    this.setState(
      {
        ...this.state,
        selectedDay: day.dateString,
      },
      () => {
        this.markDays();
      }
    );
  }

  raise(colorIndex) {
    return colorIndex < COLOR_COUNT ? ++colorIndex : COLOR_COUNT - 1;
  }
  lower(colorIndex) {
    return colorIndex > 0 ? --colorIndex : 0;
  }

  onPrayPress(prayName) {
    const name = prayName;
    const day = this.state.selectedDay;
    const today = moment().format("YYYY-MM-DD");
    if (day > today) {
      alert("You cannot log this Prayer at the Moment");
    } else {
      let status = false;
      if (
        undefined === this.state.prays[day] ||
        undefined === this.state.prays[day][name]
      ) {
      } else {
        status = this.state.prays[day][name];
      }

      let colorIndex = 1;
      if (
        !(
          undefined === this.state.prays[day] ||
          undefined === this.state.prays[day].colorIndex
        )
      ) {
        colorIndex = this.state.prays[day].colorIndex;
      }

      let praysOfDay = {};
      if (undefined === this.state.prays[day]) {
        praysOfDay = {
          [name]: !status,
          colorIndex: colorIndex,
        };
      } else {
        praysOfDay = {
          ...this.state.prays[day],
          [name]: !status,
          colorIndex: !status ? this.raise(colorIndex) : this.lower(colorIndex),
        };
      }

      this.setState(
        {
          ...this.state,
          prays: {
            ...this.state.prays,
            [day]: praysOfDay,
          },
          selectedDayColorIndex: praysOfDay.colorIndex,
        },
        () => {
          this.savePrays();
          this.markDays();
        }
      );
    }
  }

  markDays() {
    // TODO reduce time consumption by using existing marks!

    let selectedDayColorIndex = 0;
    if (
      undefined !== this.state.prays[this.state.selectedDay] &&
      undefined !== this.state.prays[this.state.selectedDay].colorIndex
    ) {
      selectedDayColorIndex = this.state.prays[this.state.selectedDay]
        .colorIndex;
    }

    let markedDays = {
      [this.state.day]: {
        customStyles: {
          container: {
            borderWidth: 1,
          },
        },
      },
      [this.state.selectedDay]: {
        customStyles: {
          container: {
            borderWidth: 1,
          },
        },
      },
    };

    Object.keys(this.state.prays).map((day) => {
      markedDays[day] = {
        customStyles: {
          container: {
            backgroundColor: colors[this.state.prays[day].colorIndex],
          },
          text: {
            color: textColors[this.state.prays[day].colorIndex],
          },
        },
      };
      if (day === this.state.selectedDay || day === this.state.day) {
        markedDays[day].customStyles.container.borderWidth = 1;
      }
    });

    this.setState({
      ...this.state,
      marks: markedDays,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Prayer Tracker</Text>
        </View>
        <View>
          <Calendar
            onDayPress={(day) => this.onDayPress(day)}
            markedDates={{
              ...this.state.marks,
            }}
            markingType={"custom"}
            theme={{
              todayTextColor: "#000",
            }}
          />
        </View>

        <View style={styles.list}>
          {prayList.map((prayName) => (
            <Pray
              key={prayName}
              name={prayName}
              status={
                this.state.prays[this.state.selectedDay] === undefined
                  ? false
                  : this.state.prays[this.state.selectedDay][prayName]
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
    backgroundColor: "#eee",
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flex: 1,
    justifyContent: "center",

    backgroundColor: "#00adf5",
    width: "100%",
  },
  title: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 32,
    padding: 16,
  },
  calendar: {
    marginTop: 10,
    backgroundColor: "white",
  },
  list: {
    marginTop: 10,
    marginBottom: 6,
  },
});

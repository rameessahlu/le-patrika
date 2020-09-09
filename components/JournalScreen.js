import React, {Component} from 'react';
import {StyleSheet, Text, View, ToastAndroid, AsyncStorage} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  createAppContainer,
} from '@react-navigation/stack';
import DayScreen from './DayScreen';
import _ from 'lodash';
import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
} from 'react-native-modals';

const Stack = createStackNavigator();

export default class JournalContainer extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Calender" component={JournalCalenderScreeen} />
          <Stack.Screen name="JournalDayScreen" component={DayScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

class JournalCalenderScreeen extends Component {
  // state = {
  //   today: null,
  //   markedD: null,
  // };

  constructor(props) {
    super(props);
    let initialMarkedD = this.getMarkedDates();
    let today = this.getCurrentDay();
    //this.setState({ today: today, markedD: initialMarkedD });
    this.state = {
      today: today,
      markedD: null,
      current_day_mark: initialMarkedD,
      swipeableModal: false,
    };
    console.log(initialMarkedD);
  }

  _storeData = (key, value) => {
    try {
      AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  };

  _retrieveData = (key) => {
    try {
      AsyncStorage.getItem(key).then((value) => {
        if (value) {
          // ToastAndroid.showWithGravityAndOffset(
          //   value,
          //   ToastAndroid.LONG,
          //   ToastAndroid.BOTTOM,
          //   25,
          //   50
          // );
          let parsed_obj = JSON.parse(value);
          ///if (!_.isEqual(parsed_obj, this.state.markedD)) {
          this.setState({
            markedD: {...parsed_obj},
          });
          //console.log("state changed!");
          //alert(JSON.stringify(this.state.markedD));
          //}
        }
      });
    } catch (error) {}
  };

  getCurrentDay = () => {
    let cuttent_date = moment().format();
    let today = moment().format('YYYY-MM-DD');
    console.log(today);
    return today;
  };

  getMarkedDates = () => {
    let today = this.getCurrentDay();
    let markedD = {
      '2020-07-17': {marked: true},
      '2020-07-18': {marked: true, dotColor: 'red', activeOpacity: 0},
    };
    //    "2020-07-19": { disabled: true, disableTouchEvent: true },

    AsyncStorage.getItem('markedD').then((item) => {
      if (!item) {
        this._storeData('markedD', markedD);
        console.log('not stored!');
      } else {
        console.log('already stored!');
      }
    });

    this._retrieveData('markedD');

    let initialMarkedDates = {};
    initialMarkedDates[today] = {
      selected: true,
      selectedColor: 'blue',
    };

    return initialMarkedDates;
  };

  deleteJournal = (day) => {
    this.setState({
      swipeableModal: true,
    });
  };

  deleteJournalHelper = async (day) => {
    console.log('deleting 1 journal' + day);
    try {
      await AsyncStorage.removeItem(day);
      console.log('not the problem of asyncstorage!');
      if (day in this.state.markedD) {
        console.log('kadannu');
        let updated_markd = this.state.markedD;

        delete updated_markd[day];
        this.setState({markedD: updated_markd});
        await AsyncStorage.setItem(' markedD', JSON.stringify(updated_markd));
      }
    } catch (error) {
      console.log('ayyo');
      console.log(error.message);
    }
  };

  shouldComponentUpdate() {
    this._retrieveData('markedD');
    return true;
  }

  render() {
    // ToastAndroid.showWithGravityAndOffset(
    //   JSON.stringify(this.state.markedD),
    //   ToastAndroid.LONG,
    //   ToastAndroid.BOTTOM,
    //   25,
    //   50
    // );
    const {navigation} = this.props;
    return (
      <View>
        <Modal
          onDismiss={() => {
            this.setState({swipeableModal: false});
          }}
          width={0.8}
          overlayOpacity={0.5}
          visible={this.state.swipeableModal}
          useNativeDriver={true}
          rounded
          actionsBordered
          onSwipeOut={() => {
            this.setState({swipeableModal: false});
          }}
          onTouchOutside={() => {
            this.setState({swipeableModal: false});
          }}
          modalTitle={<ModalTitle title="DELETE JOURNAL" />}
          footer={
            <ModalFooter>
              <ModalButton
                text="NO"
                bordered
                onPress={() => {
                  this.setState({swipeableModal: false});
                }}
                key="button-1"
              />
              <ModalButton
                text="YES"
                bordered
                onPress={() => {
                  this.setState({swipeableModal: false});
                  this.deleteJournalHelper;
                }}
                key="button-2"
              />
            </ModalFooter>
          }>
          <ModalContent style={{backgroundColor: '#fff', paddingTop: 24}}>
            <Text>Are you really want to delete?</Text>
          </ModalContent>
        </Modal>
        <CalendarList
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={(months) => {
            console.log('now these months are visible', months);
          }}
          current={this.state.today}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
          onDayPress={(day) => {
            console.log('selected day', day);
            navigation.navigate('JournalDayScreen', {
              selectedDay: day.dateString,
              markedD: this.state.markedD,
            });
          }}
          onDayLongPress={(day) => {
            this.deleteJournal(day.dateString);
          }}
          markedDates={{
            ...this.state.markedD,
            ...this.state.current_day_mark,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

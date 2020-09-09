import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ToastAndroid,
  SafeAreaView,
  ScrollView,
  AsyncStorage,
  BackHandler,
} from 'react-native';

import {ColorPicker} from 'react-native-status-color-picker';

export default class DayScreen extends Component {
  constructor(props) {
    super(props);

    const {route} = this.props;
    const {selectedDay, markedD} = route.params;
    this.props.navigation.setOptions({title: 'Journal-' + selectedDay});

    let _color = '#FFFFFF';

    if (selectedDay in markedD) {
      console.log('evide ethi');
      _color = markedD[selectedDay].dotColor;
    }

    this.state = {
      colors: [
        '#FFFFFF',
        '#FFFACD',
        '#FFA500',
        '#ff4c4c',
        '#90EE90',
        '#FFC0CB',
        '#86c5da',
        '#4B0082',
      ],
      selectedColor: _color,
      journal_text: 'hi!',
    };

    this.retrieveInitialData();
  }

  retrieveInitialData = () => {
    console.log('retreing initial data');
    try {
      AsyncStorage.getItem(this.props.route.params.selectedDay).then(
        (value) => {
          if (value) {
            this.setState({journal_text: value});
          }
        },
      );
    } catch (error) {
      console.log('retrieveInitialData error:' + error);
    }
  };

  saveData = (text) => {
    console.log('saving text data:' + text);
    try {
      AsyncStorage.setItem(this.props.route.params.selectedDay, text);
      //alert(JSON.stringify(cool));
      //console.log(cool);
    } catch (error) {
      console.log('error:' + error);
    }
  };

  addDot = (color) => {
    let new_dot_info = {};
    new_dot_info[this.props.route.params.selectedDay] = {
      marked: true,
      dotColor: color,
    };

    let new_markd = {
      ...this.props.route.params.markedD,
      ...new_dot_info,
    };
    try {
      AsyncStorage.setItem('markedD', JSON.stringify(new_markd)).then(() =>
        AsyncStorage.getItem('markedD').then((result) => {
          console.log('added');
          console.log(result);
        }),
      );
      console.log('here');
    } catch (error) {
      console.log('not addded' + error);
    }
  };

  onColorSelect = (color) => {
    this.setState({selectedColor: color});
    this.addDot(color);
  };

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    let {width, height} = Dimensions.get('window');
    return (
      <View>
        <SafeAreaView>
          <ScrollView>
            <ColorPicker
              colors={this.state.colors}
              selectedColor={this.state.selectedColor}
              onSelect={this.onColorSelect}
            />
            <TextInput
              style={{
                height: height,
                backgroundColor: this.state.selectedColor,
                borderWidth: 0.1,
                textAlignVertical: 'top',
                padding: 16,
                marginTop: 5,
                marginLeft: 5,
                marginRight: 5,
                fontFamily: 'sans-serif-medium',
                fontSize: 20,
              }}
              onChangeText={this.saveData}
              defaultValue={this.state.journal_text}
              multiline={true}
              underlineColorAndroid="transparent"
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

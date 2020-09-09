/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ToDoContainer from './components/ToDoGroupScreen';
import JournalContainer from './components/JournalScreen';
import SettingsScreen from './components/SettingsScreen';

export default class App extends Component {
  tabs = [
    {
      key: 'todo',
      label: 'todo',
      barColor: '#080808',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'format-list-checks',
    },
    {
      key: 'journal',
      label: 'journal',
      barColor: '#1565C0',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'format-list-checks',
    },
    {
      key: 'settings',
      label: 'settings',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'format-list-checks',
    },
  ];

  state = {
    activeTab: 'todo',
  };

  renderIcon = (icon) => ({isActive}) => (
    <Icon size={19} color="white" name={icon} />
  );

  renderTab = ({tab, isActive}) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {(() => {
            switch (this.state.activeTab) {
              case 'todo':
                return <ToDoContainer />;
              case 'journal':
                return <JournalContainer />;
              case 'settings':
                return <SettingsScreen />;
              default:
                return <ToDoScreen />;
            }
          })()}
        </View>
        <BottomNavigation
          activeTab={this.state.activeTab}
          onTabPress={(newTab) => this.setState({activeTab: newTab.key})}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

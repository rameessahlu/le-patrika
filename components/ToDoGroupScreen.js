import React, {Component} from 'react';
import {View, StyleSheet, Text, Button, TextInput} from 'react-native';
import {DraggableGrid} from 'react-native-draggable-grid';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  createAppContainer,
} from '@react-navigation/stack';
import ToDoScreen from './ToDoGroupScreen';
import {
  HeaderButtons,
  Item,
  CustomHeaderButton,
} from 'react-navigation-header-buttons';
import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
} from 'react-native-modals';
import {ColorPicker} from 'react-native-status-color-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {insertNewGroup, queryAllGroupLists} from '../scheme_n_helper/ToDoGroup';
import realm from '../scheme_n_helper/ToDoGroup';

const Stack = createStackNavigator();

export default class ToDoContainer extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Groups" component={ToDoGroupScreen} />
          <Stack.Screen name="ToDo" component={ToDoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

class ToDoGroupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupData: [
        {
          name: 'ADD',
          key: 'ADD',
          backgroundColor: 'white',
        },
      ],
      swipeableModal: false,
      newGroupName: null,
      newGroupColor: '#FFA500',
      colors: [
        '#FFA500',
        '#ff4c4c',
        '#90EE90',
        '#FFC0CB',
        '#86c5da',
        '#4B0082',
      ],
      selectedColor: '#FFA500',
      visibleCrose: false,
    };
    this.props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title={'ADD'}
            iconName={'md-search'}
            onPress={() => {
              this.addGroups();
            }}
          />
          <Item
            title={'REMOVE'}
            iconName={'other-icon-name'}
            onPress={() => {
              this.removeGroups();
            }}
          />
        </HeaderButtons>
      ),
    });
    this.reloadData();
    realm.addListener('change', () => {
      this.reloadData();
    });
  }

  reloadData = () => {
    console.log('reloadingData');
    queryAllGroupLists()
      .then((groupData) => {
        if (!groupData.isEmpty()) {
          console.log(groupData);
          this.setState({groupData: groupData});
        } else {
          console.log('empty result');
        }
      })
      .catch((error) => {
        this.setState({
          groupData: [
            {
              name: 'ADD',
              key: 'ADD',
              backgroundColor: 'white',
            },
          ],
        });
      });
  };

  removeGroups = () => {
    if (this.state.visibleCrose) this.setState({visibleCrose: false});
    else this.setState({visibleCrose: true});
  };
  addGroups = () => {
    console.log('The other header icon was pressed.');
    this.setState({
      swipeableModal: true,
    });
  };
  addGroupHelper = async () => {
    insertNewGroup({
      name: this.state.newGroupName,
      key: this.state.newGroupName,
      backgroundColor: this.state.newGroupColor,
    });
  };

  tileStyle = (color) => {
    return {
      margin: 5,
      width: 100,
      height: 100,
      borderRadius: 8,
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    };
  };

  render_item = (item) => {
    return (
      <View style={this.tileStyle(item.backgroundColor)} key={item.key}>
        {this.state.visibleCrose ? (
          <Icon
            style={{
              margin: 5,
              position: 'absolute',
              top: 0,
              right: 0,
              width: 25,
              height: 25,
              color: 'tomato',
            }}
            name="close"
            size={25}
          />
        ) : null}
        <Text style={styles.item_text}>{item.name}</Text>
      </View>
    );
  };
  saveNewGroupName = (text) => {
    this.setState({newGroupName: text});
  };
  saveNewColor = (_color) => {
    this.setState({newGroupColor: _color});
  };

  componentDidMount() {
    // insertNewGroup({
    //   name: 'two',
    //   key: 'two',
    //   backgroundColor: 'green',
    // });
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    //const {realm} = this.state;
    //if (realm !== null && !realm.isClosed) {
    //  realm.close();
    //  this.state.realm.objects('Dog').length
    //}
  }

  render() {
    return (
      <View style={styles.wrapper}>
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
          modalTitle={<ModalTitle title="CREATE GROUP" />}
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
                  if (this.state.newGroupName != null) {
                    this.setState({swipeableModal: false});
                    this.addGroupHelper();
                  }
                }}
                key="button-2"
              />
            </ModalFooter>
          }>
          <ModalContent style={{backgroundColor: '#fff', paddingTop: 24}}>
            <Text>Type the group name</Text>
            <TextInput
              style={{
                borderWidth: 0.5,
                borderColor: 'black',
                padding: 10,
                marginTop: 2,
                marginLeft: 5,
                marginRight: 5,
                fontFamily: 'sans-serif-medium',
                fontSize: 15,
              }}
              onChangeText={this.saveNewGroupName}
              defaultValue=""
              underlineColorAndroid="transparent"
              maxLength={20}
            />
            <ColorPicker
              colors={this.state.colors}
              selectedColor={this.state.selectedColor}
              onSelect={this.saveNewColor}
            />
          </ModalContent>
        </Modal>
        <DraggableGrid
          numColumns={4}
          renderItem={this.render_item}
          data={this.state.groupData}
          onDragRelease={(data) => {
            this.setState({data}); // need reset the props data sort after drag release
          }}
          onItemPress={(data) => {
            console.log(data);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 100,
    backgroundColor: 'blue',
  },
  wrapper: {
    paddingTop: 20,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  item_text: {
    fontSize: 10,
    color: '#FFFFFF',
  },
});

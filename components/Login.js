import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import {
  ListItem,
  Button,
  SearchBar,
  Icon,
  Input,
  Text,
} from 'react-native-elements';
import IconAwesome from 'react-native-vector-icons/FontAwesome';

const STORAGE_KEY = 'ASYNC_STORAGE_KINDLE_EMAIL';

export default class Login extends React.Component {
  componentDidMount() {
    var kindleEmail = AsyncStorage.getItem(STORAGE_KEY);
    if (kindleEmail) {
      console.log('kindleEmail set up already: ' + kindleEmail);
      this.props.navigation.navigate('Main');
    }
  }

  state = {
    email: '',
  };

  save = () => {
    try {
      AsyncStorage.setItem(STORAGE_KEY, this.state.email);
    } catch (e) {
      Alert.alert("Failed: " + e);
      console.error('Failed to save email.' + e);
    }
  };

  updateEmail = (email) => {
    this.setState({ email: email });
  };

  saveAndNavigate = () => {
    this.save;
    this.props.navigation.navigate('Main');
  };

  render() {
    const { email } = this.state;
    return (
      <View style={styles.container}>
        <Text style={{ color: 'grey' }}>
          Please, add <Text style={{color: 'blue'}}>kindlebookfetcher@gmail.com</Text> into your Approved Personal
          Document Email List using
          <Text
            style={{ color: 'blue' }}
            onPress={() =>
              Linking.openURL(
                'https://www.amazon.com/gp/help/customer/display.html?nodeId=GX9XLEVV8G4DB28H'
              )
            }>
            {' '}
            guide
          </Text>
        </Text>
        <Input
          placeholder="Kindle email address"
          leftIcon={{
            type: 'font-awesome',
            name: 'envelope',
            color: '#32a88e',
            margin: 5,
          }}
          onChangeText={value => this.setState({ email: value })}
          value={email}
        />
        <Button
          title="Submit"
          buttonStyle={
            {
              //backgroundColor: '#32a88e',
            }
          }
	  onPress={() => { AsyncStorage.setItem(STORAGE_KEY, this.state.email); this.props.navigation.navigate('Main'); }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 55,
    shadowOpacity: 1.0,
  },
});

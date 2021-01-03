import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Icon,
  CheckBox,
  SearchBar,
  Button,
  ListItem,
} from 'react-native-elements';
import Constants from 'expo-constants';
const STORAGE_KEY = 'ASYNC_STORAGE_KINDLE_EMAIL';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Main extends React.Component {
  componentDidMount() {
    this.load();
  }

  state = {
    search: '',
    queryResult: [],
    email: '',
    spinner: false,
    spinnerText: 'Loading...',
  };

  load = async () => {
    try {
      const email = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('email loaded: ' + email);
      if (email !== null) {
        this.setState({ email: email });
      }
    } catch (e) {
      console.error('Failed to load .');
    }
  };

  updateSearch = (search) => {
    this.setState({ search: search });
  };

  clearTxt = (search) => {
    this.setState({ queryResult: [] });
  };

  onSelectJob(query) {
    console.log('entered');
    this.label = 'Transferring to Kindle';
    this.setState({ spinner: true });
    this.setState({ spinnerText: this.label });
    //console.log('q: ' + query);
    this.show = true;
    //job.isQueryLoaded = false;
    const host = 'https://bookfetcher-a0304.appspot.com/download?';
    const fullQuery = host + query;
    console.log('fq: ' + fullQuery);
    axios
      .get(fullQuery, {})
      .then((response) => {
        console.log('response: ' + response.status);
        console.log('transfering book to kindle');
        console.log(this.label);
        this.show = false;
      })
      .catch(function (error) {
        if (error.response) {
          console.log('error.response');
          Alert.alert("Book isn't available for download");
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } /*else if (error.request) {
          console.log("error.request");
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          console.log("smth else");
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }*/
        console.log(error.config);
      })
      .finally((e) => {
        console.log('finally');
        this.setState({ spinner: false });
      });
  }

  loadQueryResult(userQuery) {
    //console.log("gmail: " + localStorage.getItem("gmail"))
    this.setState({ spinnerText: 'Loading....' });
    if (!userQuery) {
      alert('Query is empty');
      return;
    }
    this.show = true;
    this.showSearchResults = true;
    const host = 'https://bookfetcher-a0304.appspot.com/books?query=';
    const fullQuery = host + userQuery;
    axios
      .get(fullQuery, {})
      .then((response) => {
        // JSON responses are automatically parsed.
        this.queryResult = response.data;
        this.kindleAddress = this.state.email;
        for (let i = 0; i < this.queryResult.length; i++) {
          this.queryResult[i].uploadPercentage = 0;
          this.queryResult[i].isQueryLoaded = true;
        }
        console.log(this.queryResult);
        this.show = false;
        this.setState({ queryResult: this.queryResult });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((e) => {
        this.setState({ spinner: false });
      });
  }

  handleEditComplete = (search) => {
    this.setState({ spinner: true });
    var queryRes = this.loadQueryResult(this.state.search);
  };

  render() {
    const { search } = this.state;
    const shadowStyle = { shadowOpacity: 1.0 };
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={this.state.spinnerText}
          textStyle={styles.spinnerTextStyle}
        />
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          //onClear={this.setState({ queryResult : []})}
          onSubmitEditing={this.handleEditComplete}
          platform="android"
          value={search}
          onClear={this.clearTxt}
          style={this.shadowStyle}
        />
        <ScrollView>
          {this.state.queryResult.map((l, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{l.title}</ListItem.Title>
                <ListItem.Subtitle>{l.author}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon name='telegram' type='font-awesome' color='#32a88e' onPress={this.onSelectJob.bind(
                this,
                'url=' +
                  l.url +
                  '&name=' +
                  l.title.replace(/ /g, '+') +
                  '&kindleAddress=' +
                  this.kindleAddress
              )}/>
            </ListItem>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
    shadowOpacity: 1.0,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

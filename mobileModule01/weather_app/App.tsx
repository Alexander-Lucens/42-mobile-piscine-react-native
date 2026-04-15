import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { SearchBarWithLocation } from './components/SearchBarWithLocation';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

const weatherTiming = ["Currently", "Today", "Weekly"];

export default class App extends React.Component {
  state = {
    search: '',
    location: '',
    timing: 0,
  };

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  updateLocation = (location: string) => {
    this.setState({ location });
  };

  updateTiming = (timing: number) => {
    timing = timing % weatherTiming.length; 
    this.setState({ timing });
  };

  render() {
    const { search, location, timing } = this.state;

    return (
    <View style={styles.container}>
      { /* SearchBar: move as separate component in the end */ } 
      <View style={styles.searchBar} >
        <SearchBar
          placeholder="Type Here..."
          onChangeText={(text) => this.updateSearch(text)}
          value={search}
        />
        <Icon.Button name="location" onPress={() => console.log('Location pressed')} solid>
          location
        </Icon.Button>
      </View>

      { /* Main Screen: move as separate component in the end */ } 
      <View style={styles.mainScreen}>
        <Text>
          {weatherTiming[timing]}
        </Text>
        <Text>
          {location}
        </Text>

      </View>

      { /* Bottom navigation barn: move as separate component in the end */ } 
      <View style={styles.bottomNavigationBar}>
        {weatherTiming.map((ico) => (
          <Icon.Button key={ico} name="ico" onPress={() => console.log(`Button ${ico} was pressed`)} solid>
            {ico}
          </Icon.Button>
        ))}
        
  
      </View>


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
  searchBar: {
    height: '10%',
    backgroundColor: 'lightsteelblue',
  },
  mainScreen: {
    height: '80%',
    backgroundColor: 'white',
  },
  bottomNavigationBar: {
    height: '10%',
    backgroundColor: 'lightsteelblue',
  },
});

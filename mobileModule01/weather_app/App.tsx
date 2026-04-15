import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { SearchBarWithLocation } from './components/SearchBarWithLocation';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomButton from './components/CustomButton';

const weatherTiming = ["Currently", "Today", "Weekly"];
const SearchBarAny = SearchBar as any;

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

  handleClick = (input: string) => {
    console.log(`Button ${input} was pressed`);
    const update = weatherTiming.indexOf(input);
    if (update === -1) {
      return;
    }
    this.updateTiming(update);
  }; 

  render() {
    const { search, location, timing } = this.state;

    return (
    <View style={styles.container}>
      { /* SearchBar: move as separate component in the end */ } 
      <View style={styles.searchBar} >
        <View style={styles.searchBarInputWrapper}>
          <SearchBarAny
            platform="default"
            placeholder="Type Here..."
            onChange={(event: any) => this.updateSearch(event.nativeEvent.text)}
            value={search}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInput}
          />
        </View>
        <CustomButton icon={''} text={'Location'} action={() => console.log("Location")}  />
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
          <View key={ico} style={styles.bottomNavItem}>
            <Icon.Button
              name={ico}
              onPress={() => this.handleClick(ico)}
              style={styles.bottomNavButton}
            >
              {ico}
            </Icon.Button>
          </View>
        ))}
        
  
      </View>


    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    width: '100%',
    minHeight: 56,
    backgroundColor: 'lightsteelblue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30
  },
  searchBarInputWrapper: {
    width: '85%',
    padding: 10,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchBarInput: {
    backgroundColor: 'white',
  },
  mainScreen: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bottomNavigationBar: {
    flexDirection: 'row',
    minHeight: 56,
    width: '100%',
    backgroundColor: 'lightsteelblue',
  },
  bottomNavItem: {
    flex: 1,
  },
  bottomNavButton: {
    width: '100%',
    justifyContent: 'center',
  },
});

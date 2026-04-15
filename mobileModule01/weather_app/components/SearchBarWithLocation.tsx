import React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export function SearchBarWithLocation({ search }: { search: string }) {

  return (
    <View style={styles.searchBar} >
		<SearchBar
			placeholder="Type Here..."
			onChangeText={this.updateSearch}
			value={search}
		/>
		<Icon.Button name="location" onPress={} solid>
			location
		</Icon.Button>
		
    </View>
  );
}

const styles = StyleSheet.create({
  
  searchBar: {
	height: 30,
	backgroundColor: 'lightsteelblue',
  },
});
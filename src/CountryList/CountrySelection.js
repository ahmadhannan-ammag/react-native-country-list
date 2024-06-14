import React from 'react';
import {
  View, TextInput, Image, SectionList, Text, TouchableOpacity,
} from 'react-native';
import styles from './countrySelectionStyles';
import { searchIcon, countrySelectionTick, countries, CustomColors } from './Constants';
import { Country, State, City, country, } from 'country-state-city';
import SignButton from '../../../components/SignButton/SignButton';
/**
 * Item view
 * @param {*} params
 */
const ItemView = (params) => {

  let text = `${params.item.name}`;
  let selected = null;
  if (params.isCountry) {
    if (params.selected != null && params.selected.callingCode === params.item.callingCode) {
      selected = <Image source={countrySelectionTick} style={styles.selectionTick} />;
    }
  } else {
    if (params.selected != null && params.selected.name === params.item.name) {
      selected = <Image source={countrySelectionTick} style={styles.selectionTick} />;
    }
  }
  // if ( params.selected.index === params.item.index) {
  //   selected = <Image source={countrySelectionTick} style={styles.selectionTick} />;
  // }
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.itemTextContainer} onPress={() => params.action(params.item)}>
        {params.isCountry && <Image source={{ uri: params.item.flag }} style={styles.flag} />}

        <Text numberOfLines={1} style={styles.itemText}>{text}</Text>
        <View style={styles.selectionView}>
          {selected}
        </View>
      </TouchableOpacity>
      <View style={styles.itemSeparator} />
    </View>
  );
};

/**
 * Section header view
 * @param {*} params
 */
const SectionHeader = params => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionHeader}>{params.title}</Text>
  </View>
);

/**
 * Country selection screen
 */
export default class CountrySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      cities: City.getCitiesOfCountry(this.props.selectedCountry)
    };
  }

  componentWillMount() {


    if (this.props.isCountry) {

      this.generateSectionData(countries);

    } else {

      this.generateSectionData(this.state.cities);
      // console.log(this.state.cities,'cities')
    }

  }

  /**
   * Change search text action
   */
  onChangeSearchText = (text) => {

    let filtered
    if (this.props.isCountry) {

      filtered = countries?.filter(country => country.name.toLowerCase().indexOf(text.toLowerCase()) > -1);

    } else {

      filtered = this.state.cities?.filter(country => country.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    }
    this.generateSectionData(filtered);
  }

  /**
   * Generate section data from country list
   */
  generateSectionData(countryList) {
    const sections = [];
    const sectionHeaders = countryList?.map(data => data.name.charAt(0));
    const uniqueHeaders = Array.from(new Set(sectionHeaders));

    uniqueHeaders.forEach((item) => {
      const filtered = countryList?.filter(country => country.name.charAt(0) === item);
      sections.push({ title: item, data: filtered });
    });
    this.setState({ sections });
  }

  render() {
    const { selected, action } = this.props;
    const { sections } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchView}>
            <Image source={searchIcon} style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder='Search'
              placeholderTextColor="#2d2926"
              enablesReturnKeyAutomatically
              clearButtonMode="while-editing"
              onChangeText={text => this.onChangeSearchText(text)}
            />
          </View>
        </View>
        <SectionList
          renderItem={({ item, index, section }) => (
            <ItemView
              item={item}
              index={index}
              section={section}
              action={(item) => action(item)}
              selected={selected}
              isCountry={this.props.isCountry}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (<SectionHeader title={title} />)}
          sections={sections}
          keyExtractor={(item, index) => item + index}
        />
        <View style={{ width: '100%', alignItems: 'center' }}>

          <SignButton //gradientDark
            colors={[CustomColors.gradientDark, CustomColors.gradientLight]}
            onPress={() => { this.props.onClick() }} // Replace with your function
            title={'Close'}
            textStyles={{ color: CustomColors.white }}
            loading={false}
            disabled={false}
          />
        </View>

      </View>
    );
  }
}

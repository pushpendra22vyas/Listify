import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const ListScreen = ({route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const {searchString, sortType} = route.params;


  // Execute when component render initially
  useEffect(() => {
    fetchData();
  }, []);
 
  //Every time When searchString is Update. It will execute
  useEffect(() => {
    if (searchString.length > 0) {
      searchProduct();
    } else {
      fetchData();
    }
  }, [searchString]);

  //Every time When sortType is Update. It will execute
  useEffect(() => {
    if (sortType) {
      const sortedData = sortProducts(data, sortType);
      setData(sortedData);
    }
  }, [sortType]);

  // Sorting
  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case 'name':
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case 'lowToHigh':
        return [...products].sort((a, b) => a.price - b.price);
      case 'highToLow':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  };

  // Getting data from API
  const fetchData = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');
      setData(response.data.products);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  // Searching
  const searchProduct = async () => {
    try {
      const searchData = await axios.get(
        `https://dummyjson.com/products/search?q=${searchString}`,
      );
      setData(searchData.data.products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // navigating to the detailScreen
  const handleListItemView = item => {
    navigation.navigate('DetailScreen', {item});
  };

  // Getting Substring of the Product Title
  const handleProductTitle = (title) =>
    title.length > 20 ? `${title.substring(0, 18)}...` : title;


  // Getting Substring of the Product discription
  const handleProductDiscription = (discription) =>
    discription.length > 20
      ? `${discription.substring(0, 50)}...`
      : discription;

    // FlatList rander items
  const renderList = ({item}) => {
    return (
      <TouchableOpacity onPress={() => handleListItemView(item)}>
        <View style={styles.item}>
          <Image source={{uri: item.thumbnail}} style={styles.itemImage} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.title}>{handleProductTitle(item.title)}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.price}>{'$' + Math.floor(item.price)}</Text>
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Text>{ '(' }</Text>
                <Text style={styles.rating}>{ item.rating}</Text>
                <Text style={{color: '#7B8788'}}>/5 ⭐ {')'}</Text>
              </View>
            </View>
            <Text
              style={styles.discription}
              numberOfLines={2}
              ellipsizeMode="tail">
              {handleProductDiscription(item.description)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
    {isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size={'large'} color='#00CCCD' />
      </View>
    ) : data.length === 0 ? (
      <View style={styles.noData}>
        <Image source={require('./../Images/no-data.jpg')} style={styles.recordsNotFound}/>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    ) : (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderList}
      />
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF0F1',
    marginBottom: 10,
  },
  loader:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  item: {
    flex: 1,
    width: '94%',
    height: 120,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00CCCD',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: '800',
  },
  discription: {
    flex: 1,
    color: 'grey',
    width: '50%',
    paddingTop: 5,
  },
  price: {
    color: '#00CCCD',
    fontWeight: '800',
  },
  rating: {
    color: '#F4C724'
  },
  noData: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  noDataText: {
    color: '#000',
    padding:10,
    fontSize:20,
  },
  recordsNotFound: {
    width:200,
    height:200,
    borderRadius:30
  }
});

export default ListScreen;

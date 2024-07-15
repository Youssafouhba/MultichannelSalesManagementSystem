import React, { Component } from 'react'
import { Text, View,Image } from 'react-native'
import AddProductScreen from '../components/AddProductScreen'
import HomePage from './HomePage'
import tw from 'tailwind-react-native-classnames';

export default class LoginScreen extends Component {
  render() {
    return (
      <View>
        <HomePage/>
      </View>
    )
  }
}

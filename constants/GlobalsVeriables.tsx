export const API_BASE_URL = 'http://192.168.42.103:8080';
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dlkvn0fpz/image/upload`;
export const UPLOAD_PRESET = 'd1zmuabv';
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {Dimensions, TouchableOpacity} from "react-native";

export const cartItemsNumber = 0
export function plafond(value: any, significance: any) {
    if (significance === 0) return 0;
    return Math.ceil(value / significance) * significance;
  }

export  function b4calculator(value: any){
    if(((value*0.25)+1)-Math.floor((value*0.25)+1) >= 0.5)
      return Math.ceil((value*0.25)+1)
    return Math.floor((value*0.25)+1)
  }

export function b8calculator(value: any){
    if((value/0.36)-Math.floor(value/0.36) >= 0.5)
      return Math.ceil(value/0.36)
    return Math.floor(value/0.36)
  }
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
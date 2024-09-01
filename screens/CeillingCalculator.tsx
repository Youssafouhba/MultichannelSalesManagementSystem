import React, { useState } from "react";
import {  
  Image, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Pressable, 
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import tw from 'tailwind-react-native-classnames';
import { ceillingcalstyles as styles } from "../GlobalStyles";
import { plafond, b4calculator, b8calculator } from "@/constants/GlobalsVeriables";
interface CeilingCalculatorProps {
  onAddToCart: (items: { quantity: number; productIndex: number }[]) => void;
}
export default function CeilingCalculator({ onAddToCart }: CeilingCalculatorProps) {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [roomlength, setRoomLength] = useState<number>();
  const [roomwidth, setRoomWidth] = useState<number>();
  const [tilesnumber, setTilesNumber] = useState<number>();
  const [trimnumber, setTrimNumber] = useState<number>();
  const [maintee, setMainTeeNumber] = useState<number>();
  const [numberof1200 , setNumberof1200] = useState<number>();
  const [numberof600, setNumberof600] = useState<number>();
  const [isfinish,setFinish] = useState<boolean>(false)
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const material = [
    {title: 'LENGTH',value: length,setValue: setLength},
    {title: 'WIDTH',value: width,setValue: setWidth}
];

  const Results = [
        {
            title: 'ROOM LENGTH (M) :',
            value: roomlength,
            setValue: setRoomLength
        },
        {
            title: 'ROOM WIDTH (M) :',
            value: roomwidth,
            setValue: setRoomWidth
        },
        {
            title: 'NUMBER OF TRIM :',
            value: trimnumber,
            setValue: setTrimNumber
        },
        {
            title: 'NUMBER OF MAIN TEE :',
            value: maintee,
            setValue: setMainTeeNumber
        },
        {
            title: "NUMBER OF 1200 XT'S :",
            value: numberof1200,
            setValue: setNumberof1200
        },
        {
            title: "NUMBER OF 600 XT'S :",
            value: numberof600,
            setValue: setNumberof600
        }
        ,{
            title: "NUMBER OF TILES (600's):",
            value: tilesnumber,
            setValue: setTilesNumber
        }
  ]


  const submitMaterial = async () => {
    setIsCalculating(true);
    const numLength = parseFloat(length);
    const numWidth = parseFloat(width);
    if (isNaN(numLength) || isNaN(numWidth)) {
      alert('Veuillez entrer des nombres valides pour la longueur et la largeur');
      setIsCalculating(false);
      return;
    }
  
    const B1 = numLength * numWidth
    const t = Math.sqrt(B1)
    const E6 = parseFloat(t.toFixed(1));
    const E3 = parseFloat(plafond(E6, 0.6).toFixed(1));
    const F3 = parseFloat(plafond(E6, 0.6).toFixed(1));
    const B3 = Math.ceil((E3 * 2 + F3 * 2) / 3 + 1);
    const B4 = b4calculator(B1)
    const B5 = Math.ceil(((B1*1.4)+1))
    const B6 = Math.ceil(((B1*1.4)+1))
    const B7 = B1/0.72
    const B8 = b8calculator(B1)
    const B9 = (B4*3)+1
    const B10 = B9/3
    // Simulating a calculation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRoomLength(E3)
    setRoomWidth(F3)
    setTrimNumber(B3)
    setMainTeeNumber(B4)
    setNumberof1200(B5)
    setNumberof600(B6)
    setTilesNumber(B8)

    setFinish(true)
    setIsCalculating(false);
  };



  const handelAddToCart = () => {
    const itemsToAdd = Results.slice(2, 7).map((item, index) => ({
      quantity: item.value,
      productIndex: index
    }));
    onAddToCart(itemsToAdd);
   
  }

  const renderMaterial = ({ item }: { item: any }) => (
    <View>
      <Text style={styles.labelText}>{item.title}</Text>
      <TextInput
        keyboardType="numeric"
        value={item.value}
        placeholder="0.0"
        onChangeText={item.setValue}
        style={[tw`mt-1 border rounded-2xl px-3 text-lg mb-2`, styles.inputBorder]}
      />
      <Pressable style={styles.pressableWrapper} onPress={() => item.setValue('')}>
        <Image style={styles.xImage} source={require('@/assets/x2.png')} />
      </Pressable>
    </View>
  );
  
  const renderResults = ({ item }: { item: any }) => (
    <View style={tw`flex-row`}>
      <View style={tw`w-4/5`}>
        <Text style={styles.textresult} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        {item.title === 'NUMBER OF TRIM :' && (
          <Text style={tw`-mt-3 -mb-2`}>(AVERAGE AMOUNT)</Text>
        )}
      </View>
      <View style={tw`w-1/2 -right-2 -mt-1.5`}>
        <Text style={[tw`absolute`, styles.rsltvalue]}>{item.value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.matarea}>
      <Text style={styles.matCalculatorText}>Material Calculator</Text>
      <View style={[tw`mt-2`, styles.form]}>
        <FlatList
          data={material}
          renderItem={renderMaterial}
          keyExtractor={(item) => item.title}
        />
        <TouchableOpacity
          style={[
            tw`bg-blue-500 h-7 w-40 rounded-lg justify-center items-center`,
            isCalculating && tw`opacity-60`,
            (length === '' || width === '') && tw`opacity-60`
          ]}
          onPress={submitMaterial}
          disabled={isCalculating || (length === '' || width === '')}
        >
          {isCalculating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-lg font-medium`}>Calculate</Text>
          )}
        </TouchableOpacity>
      </View>
      {isfinish && (
        <View style={tw`w-full my-6 justify-center`}>
          <Text style={styles.ResultText}>Results</Text>
          <FlatList
            data={Results}
            renderItem={renderResults}
            keyExtractor={(item) => item.title}
          />
          <TouchableOpacity
            style={tw`bg-blue-500 mt-1.5 ml-20 h-7 w-40 rounded-lg justify-center items-center`}
            onPress={()=>handelAddToCart()}
          >
            <Text style={tw`text-white text-lg font-medium`}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );}

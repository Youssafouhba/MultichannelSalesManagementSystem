import { colorize } from "@cloudinary/url-gen/actions/effect";
import { StyleSheet, Text, View,Pressable,Alert,TouchableOpacity,Dimensions} from "react-native";
import {screenHeight,screenWidth} from '@/constants/GlobalsVeriables'

/* fonts */
export const FontFamily = {
  kiwiMaruRegular: "KiwiMaru-Regular",
  kleeOneRegular: "KleeOne-Regular",
  kavoonRegular: "Kavoon-Regular",
  robotoBold: "Roboto-Bold",
  inknutAntiquaRegular: "InknutAntiqua-Regular",
  germaniaOneRegular: "GermaniaOne-Regular",
  langarRegular: "Langar-Regular",
  kiteOneRegular: "KiteOne-Regular",
  robotoRegular: "Roboto-Regular",
};
/* font sizes */
export const FontSize = {
  size_3xs: 10,
  size_4xs: 9,
  size_sm: 14,
  singleLineBodyBase_size: 16,
  size_xl: 20,
  size_lg: 18,
  presetsBody2_size: 16,
};
/* Colors */
export const Color = {
  mainbackgroundcolor: '#faffff',
  colorGray: "#828282",
  colorGainsboro_100: "#e6e6e6",
  colorGainsboro_200: "#e0e0e0",
  colorMainforBg: "#fafaff",
  colorWhite: "#fff",
  colorBlack: "#000",
  colorLimegreen: "#4cc721",
  colorLimegreen_100: "blue",
  colorLimegreen_200:"green",
  colorRed: "#ed1515",
  colorFirebrick: "#af1818",
  colorGray_100: "#828282",
  colorize_gray: "#adb5bd",
  borderNeutralSecondary: "#767676",
  backgroundBrandDefault: "#2c2c2c",
  textDefaultDefault: "#1e1e1e",
  textBrandOnBrand: "#f5f5f5",
  colorWhitesmoke_100: "#eee",
  colorWhitesmoke_50: 'rgba(204,214,221,1.00)',
  colorGainsboro: "#e0e0e0",
  colorsBlue: "#007aff",
  COLORALICEBLUE: "aliceblue",
  backgroundNeutralTertiaryHover: "#cdcdcd",
};
/* Style Variables */
export const StyleVariable = {
  space200: 8,
  space300: 12,
  radius200: 8,
  radius400: 20,
};
/* Paddings */
export const Padding = {
  p_5xl: 24,
  p_2: 2,
  p_7xl: 26,
  p_xs: 12,
  p_5xs: 8,
  p_12xs: 1,
  p_base: 16,
  p_smi: 2,
};
/* border radiuses */
export const Border = {
  br_xl: 20,
  br_5xs: 8,
  br_81xl: 100,
};

export const patio = screenHeight/screenWidth
export const footer_h=screenHeight*0.063
export const productlistheight=screenHeight-264
//export const productlistheight=screenHeight-244



////ceilling calculator ///
export const ceillingcalstyles = StyleSheet.create({
  matarea: {
    backgroundColor: '#fafaff',
    height: productlistheight,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  form: {
    width: '50%',
    height: '42%',
  },
    rsltvalue: {
        //fontFamily: 'kavoonRegular',
        fontWeight: 500,
        fontSize: FontSize.size_lg,
    },
    textresult: {
        fontSize: FontSize.size_sm,
        lineHeight: 20,
        //fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
        color: Color.colorBlack,
        textAlign: "left",
        height: 30,
    },
  pressableWrapper: {
    overflow: 'hidden',
    position: 'absolute',
    top: '45%',
    right: '6%'
  },
  inputBorder: {
    borderColor: Color.colorWhitesmoke_50,
   // fontFamily: 'KleeOne-Regular',
  },
  labelText: {
    fontFamily: 'KleeOne-Regular',
  },
  matCalculatorText: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    //fontFamily: 'kavoonRegular',
    color: Color.colorBlack,
    textAlign: "left",
    height: 20,
  },
  ResultText: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    //fontFamily: 'kavoonRegular',
    color: Color.colorLimegreen,
    textAlign: "left",
    height: 24,
    marginBottom: 5,
  },
  xImage: {
    height: 18,
    width: 18,
  }
});
///// products listes ////
export const getStyles = (screenWidth: number, screenHeight: number) => {
/**
 * 
 *   // Calculez l'aspect ratio en fonction de la taille de l'écran
  const calculatedAspectRatio = screenWidth / screenHeight;
       
  // Ajustez l'aspect ratio du productWrapper en fonction de la taille de l'écran
  const productWrapperAspectRatio = calculatedAspectRatio > 0.5 ? 1.1 : 1;
  var s=screenHeight*0.21
  var ph =screenHeight/6+6
  // Calculez la maxHeight du ScrollView en pourcentage de la hauteur de l'écran
  const scrollViewMaxHeight = screenHeight * 0.70; // 73% de la hauteur de l'écran
  if(screenHeight<914){
   if(screenHeight<882){
       s=screenHeight*0.57
       if(screenHeight<=740){
        s=screenHeight*0.54
        ph =screenHeight/6
       }
   }
 }
 
 if(screenHeight>=882){
   ph=screenHeight/6+26
 }
 */
 return StyleSheet.create( 

  {
    
    container: {
      width: '100%',
      backgroundColor: Color.mainbackgroundcolor,
    },
   infosarea: {
    marginHorizontal: 2,
   },
       eleme:{
           width: '50%',
           height: '100%',
           marginVertical: 4
       },
       gridContainer:{
          //backgroundColor: Color.colorBlack,
          paddingHorizontal: 8,
          paddingVertical: 4,
          paddingBottom: 10,
       },
       product: {
           backgroundColor: 'white',
           ///height: productlistheight,
           marginHorizontal: 4,
       },


   noProductsContainer: { 
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 20,
     
   },
   noProductsText: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#333',
   },
   fullWidthProduct: {
     width: '100%',
     //marginVertical: 7,
     height: ((screenHeight*0.59)/3),//nwe
   },
   productWrapper: {
      backgroundColor: Color.mainbackgroundcolor,
      width: '50%',
      height: ((screenHeight*0.59)/2),//nwe
      marginTop: 3,
   },
   scrollView: {
    width: screenWidth,
    height: (screenHeight*0.61),
    backgroundColor: Color.mainbackgroundcolor,
 },
   productInnerContainer: {
     borderRadius: 8,
     overflow: 'hidden',
     backgroundColor: '#fff',
     padding: 2,
     height: '100%',//new
    marginHorizontal: 4
    },
   fullproductInnerContainer: {
    flexDirection: 'row',
   
  },
   productImage: {
     width: '100%',
     height: '65%',//nwe
     borderRadius: 8,
   },
   productdesc: {height: '35%',width: '100%',left: 1},
   fullproductImage: {
    height: '100%',
    width: '50%'
  },
   productInfo: {
     padding: 4,
   },
   priceStockContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 2,
   },
   priceText: {
     ///fontFamily: 'kavoonRegular',
     //fontSize: 12,
     color: Color.colorRed,
   },
   stockText: {
     //fontFamily: 'kavoonRegular',
     fontSize: 10,
   },
   productName: {
     //fontFamily: 'GermaniaOne-Regular',
     fontSize: 12,
     fontWeight: "500",
     color: 'black',
     marginLeft: 4,
   },
   newBadge: {
     height: 30,
     width: 30,
     position: "absolute",
     top: 6,
     left: 8,
   },
   fullnewBadge: {
    top: 6,
    left: 10,
  },
  
 }
 );
   
 };
///////// groupe components section ////
export const groupecomponentstyles = StyleSheet.create({
  texto: {
    fontSize: 13,
    lineHeight: 16,
    //fontFamily: 'kavoonRegular',
    textAlign: "center",
    color: Color.colorize_gray,
  },
  variantneutralStatehover: {
    borderRadius: StyleVariable.radius400,
    backgroundColor: Color.colorWhitesmoke_100,
    borderStyle: "solid",
    borderColor: Color.colorWhite,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Padding.p_2,
    overflow: "hidden",
    height: 50,
  },
  selectedButtonText: {
    color: Color.colorWhite,
  },
  selectedButton: {
    backgroundColor: Color.colorBlack,
  },
  pressed: {
    opacity: 0.7,
  },
});
///// header section ////
export const headerstyles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'relative',
    top: screenHeight*0.02,
    paddingVertical: 2,
    paddingHorizontal: 15,
    backgroundColor: Color.colorWhite,
    marginVertical: 8,
    alignItems: 'center',
    zIndex: 10000,
  },
  rectangleParent: {
    height: 30,
  },
  frameFlexBox1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
  },
  frameChild: {
    width: 50,
    height: 30,
  },
  iconmonstrMenu11: {
    width: 24,
    height: 24,
  },
  frame2: {
    width: '100%',
    marginTop: '20%',
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  searchInput: {
    borderRadius: Border.br_5xs,
    borderStyle: "solid",
    borderColor: Color.colorGainsboro,
    borderWidth: 1,
    width: '80%',
    paddingLeft: Padding.p_xs,
    paddingVertical: Padding.p_5xs,
    height: 41,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },
  label: {
    fontFamily: FontFamily.singleLineBodyBase,
    flex: 1,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 24,
    fontSize: FontSize.singleLineBodyBase_size,
    overflow: "hidden",
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
    overflow: "hidden",
  },
});
//// footer section ////////
export const styles = StyleSheet.create({
  //footer section
  notification: {
    position: 'absolute',
    top: -8,
    left: 15,
    paddingTop: 2,
    paddingLeft: 6,
    borderRadius: 50,
    backgroundColor: '#f26419',
    width: 23,
    height: 17,
    borderColor: 'white',
    borderWidth: 1,
  },
  over: {
    paddingLeft: 4,
  },
  over100: {
    paddingLeft: 2.2,
  },
  notnumber: {
    position: 'relative',
    marginHorizontal: 2,
    fontSize: 8,
    color: Color.colorWhite
  },
  footer:
   {
      position: 'absolute',
      left: 0,
      right: 0,
      top: screenHeight-45,
      width: '100%',
      height: 46,
      backgroundColor: '#fafaff',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopColor: 'white',
      borderTopWidth: 2,
    },
  iconLayout: {
      height: "100%",
      width: "100%",
    },
  touchableopacity: {
    width: '5%',
    aspectRatio:1,
    alignItems:'center',
    justifyContent:'center',
  },
});
////card sectio///
export const cardstyles = StyleSheet.create({
  backButton: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    padding: 4,
    overflow: 'hidden'
  },
  cart: 
  {
    width: '100%',
    position: 'absolute',
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginVertical: 2,
    alignItems: 'center',
    backgroundColor: Color.mainbackgroundcolor, //// new
    flex: 1,
    height: screenHeight,
    overflow: "hidden",
  },
  cartChild: {
    top: 21,
    left: 17,
    width: 50,
    height: 30,
    position: "absolute",
  },
  cartChild1: {

    width: 50,
    height: 30,
  },
 
 
  yourCart: {
    textAlign: "left",
    color: Color.colorBcolorRedlack,
    lineHeight: 24,
    fontSize: FontSize.size_xl,
    position: "absolute",
    top: screenHeight*0.14,
    left: 28,
    fontFamily: 'GermaniaOne-Regular'
  },
  icon: {  
    width: 16,
    height: 16,
  },
  CardsProduct: {
    backgroundColor: Color.mainbackgroundcolor,
    top: screenHeight*0.03,
    width: '100%',
    height: screenHeight*0.70,
    
  },
  CheckoutProduct: {
    width: screenWidth,
    height: screenHeight,
  },
  checkoutheader: {
    top: screenHeight*0.08,
    left: screenWidth*0.05,
  },
  Checkoutbody: {
    top: screenHeight*0.09,
    height: screenHeight*0.74,
  },
  frame: {
    top: screenHeight*0.05,
  },
  productImage: 
  {
    height: '100%',
    width: '30%'
  },
  CardsProductWrapper: 
  {
    borderRadius: 8,
    overflow: 'hidden',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    marginTop: ((screenHeight*0.51)/8)/8,
    backgroundColor: '#fff',
    padding: 2,
    height: (screenHeight*0.66)/4,
  },
  productText:
  {
    //fontFamily: 'KiteOne-Regular',
    color: Color.colorBlack,
    
    lineHeight: 14,
  },
  textFlexBox: {
    textAlign: "left",
    lineHeight: 11,
  },
  iconPosition: {
    marginTop: -11,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  wBlueSurface: {
    marginTop: -25,
    marginLeft: -98,
    fontFamily: FontFamily.kiteOneRegular,
    width: 127,
    height: 25,
    color: Color.colorBlack,
    fontSize: FontSize.size_3xs,
    left: "50%",
    top: "50%",
    position: "absolute",
    lineHeight: 11,
  },
  product2Child: {
    marginTop: -30,
    marginLeft: -184,
    width: 61,
  },
  text2: {
    color: Color.colorDarkblue,
  },
  text3: {
    color: Color.colorBlack,
  },
  text1: {
    fontSize: FontSize.size_mini,
  },
  text4: {
    color: Color.colorDarkblue,
    fontSize: FontSize.size_3xs,
  },
  text: {
    marginTop: 0,
    marginLeft: -104,
    fontFamily: FontFamily.langarRegular,
    width: 28,
    height: 20,
    left: "50%",
    top: "50%",
    position: "absolute",
    lineHeight: 11,
  },
  text5: {
    marginLeft: 146,
    fontFamily: FontFamily.kiwiMaruRegular,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    lineHeight: 11,
    color: Color.colorBlack,
  },
  plusIcon: {
    marginLeft: 172,
    width: 12,
    height: 12,
    overflow: "hidden",
  },
  deleteIcon: {
    marginLeft: 111,
    width: 13,
    height: 14,
  },
  product2: {
    marginTop: -162,
    marginLeft: -179.5,
    width: 368,
  },

  iconLayout: {
    height: 16,
    width: 16,
    overflow: "hidden",
  },
  button1: {
    fontSize: FontSize.singleLineBodyBase_size,
    lineHeight: 16,
    fontFamily: FontFamily.singleLineBodyBase,
    color: Color.textBrandOnBrand,
    textAlign: "left",
    marginLeft: 8,
  },
  xIcon: {
    marginLeft: 8,
  },
  button: {
    top: screenHeight*0.75,
    position: "absolute",
    borderRadius: StyleVariable.radius200,
    backgroundColor: Color.colorLimegreen_200,
    borderStyle: "solid",
    borderColor: Color.colorLimegreen_200,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: StyleVariable.space300,
    overflow: "hidden",
  },
});

// login section

export const authstyles = StyleSheet.create({
  contentContainerStyle:
  {
    flexGrow: 1,
    height: screenHeight*0.8,
  },
  register: {
    backgroundColor: Color.colorWhite,
    justifyContent:'center',
    alignItems:'center'
  },
  labelFlexBox: {
    overflow: "hidden",
    flex: 1,
  },
  contentPosition: {
    //left: "50%",
    //position: "absolute",
  },
  fieldBorder: {
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
  },
  labelTypo: {
    textAlign: "left",
    lineHeight: 20,
    fontSize: FontSize.size_sm,
  },
  field1FlexBox: {
    marginTop: 16,
    paddingHorizontal: Padding.p_base,
    flexDirection: "row",
    height: 40,
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
    alignItems: "center",
  },
  homePosition: {
    left: 0,
    position: "absolute",
  },
  completeYourProfile: {
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
  },
  copy: {
    alignItems: "center",
  },
  label: {
    color: Color.colorGray,
    overflow: "hidden",
    flex: 1,
  },
  field: {
    paddingHorizontal: Padding.p_base,
    flexDirection: "row",
    height: 40,
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    alignItems: "center",
  },
  field1: {
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    marginTop: 16,
  },
  confirme: {
    fontWeight: "500",
    color: Color.colorWhite,
  },
  button: {
    justifyContent: "center",
    backgroundColor: Color.colorBlack,
    paddingVertical: 0,
  },
  inputAndButton: {
    width: 327,
    marginTop: 24,
  },
  content: {
    top: "22%",
    marginVertical: 4,
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: 0,
    alignItems: "center",
  },
  iphone1415ProMax6Child: {
    width: 256,
    height: 52,
    marginVertical: 8,
  },
  homeIndicator1: {
    marginLeft: -67,
    bottom: 8,
    borderRadius: Border.br_81xl,
    width: 134,
    height: 5,
    backgroundColor: Color.colorBlack,
  },
  homeIndicatorChild: {
    top: 0,
    width: 301,
    height: 63,
  },
  homeIndicator: {
    top: 885,
    width: 430,
    height: 34,
  },
  iphone1415ProMax6: {
    width: "100%",
    height: productlistheight,
    backgroundColor: Color.colorWhite,
    flex: 1,
  },
});




// register section

export const registerstyles = StyleSheet.create({
  frameFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_5xs,
  },
  hereTypo: {
    fontFamily: FontFamily.robotoBold,
    fontWeight: "800",
    textAlign: "left",
  },
  labelTypo: {
    fontSize: FontSize.size_sm,
  },
  nameBorder: {
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    alignSelf: "stretch",
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhite,
  },
  secondaryLayout: {
    height: 32,
  },
  createNewAccountPosition: {
    textAlign: "center",
    color: Color.colorBlack,
  },
  signUp: {
    color: Color.colorWhite,
    textAlign: "left",
    lineHeight: 20,
    fontSize: FontSize.size_sm,
    fontWeight: "500",
  },
  frame: {
    backgroundColor: Color.colorBlack,
    width: '100%',
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    marginHorizontal: 4,
    marginVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_5xs,
  },
  label: {
    flex: 1,
    color: Color.colorGray,
    textAlign: "left",
    lineHeight: 20,
    overflow: "hidden",
  },
  email: {
    marginTop: 25,
  },
  nameParent: {
    top: 60,
    width: '100%',
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  here: {
    fontSize: FontSize.size_lg,
    lineHeight: 24,
    color: "#f04949",
    textAlign: "left",
  },
  secondaryButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_5xs,
    height: 32,

  },
  alreadyRegisteredLog: {
    lineHeight: 21,
    fontSize: FontSize.size_xl,
  },
  createNewAccount: {
    width: '50%',
    marginLeft: '25%',
    marginVertical: 8,
    fontSize: 25,
    lineHeight: 48,
    fontWeight: "500",
  },
  secondaryButtonParent: {
    marginLeft: -111.5,
    top: 198,
    width: 223,
    left: "50%",
  },
  registerpage: {
    width: 431,
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  });


  export const verifstyles = StyleSheet.create({
    childLayout: {
      height: 63,
      width: 301,
    },
    homePosition: {
      left: 0,
      position: "absolute",
    },
    iphone1415ProMax1Child: {
      top: 403,
      left: 65,
      position: "absolute",
    },
    homeIndicator1: {
      marginLeft: -67,
      bottom: 8,
      left: "50%",
      borderRadius: Border.br_81xl,
      backgroundColor: Color.colorBlack,
      width: 134,
      height: 5,
      position: "absolute",
    },
    homeIndicatorChild: {
      top: 0,
      height: 63,
      width: 301,
    },
    homeIndicator: {
      top: 898,
      width: 430,
      height: 34,
    },
    iphone1415ProMax1: {
      backgroundColor: Color.colorWhite,
      flex: 1,
      width: "100%",
      height: 932,
      overflow: "hidden",
    },
  });
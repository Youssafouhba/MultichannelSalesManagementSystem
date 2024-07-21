import { colorize } from "@cloudinary/url-gen/actions/effect";
import { StyleSheet, Text, View,Pressable,Alert,TouchableOpacity,Dimensions} from "react-native";
import {screenHeight,screenWidth} from '@/constants/GlobalsVeriables'

/* fonts */
export const FontFamily = {
  presetsBody2: "Inter-Regular",
  kiwiMaruRegular: "KiwiMaru-Regular",
  kleeOneRegular: "KleeOne-Regular",
  kavoonRegular: "Kavoon-Regular",
  robotoBold: "Roboto-Bold",
  inknutAntiquaRegular: "InknutAntiqua-Regular",
  germaniaOneRegular: "GermaniaOne-Regular",
  langarRegular: "Langar-Regular",
  kiteOneRegular: "KiteOne-Regular",
  robotoRegular: "Roboto-Regular",
  interRegular: "Inter-Regular",
  interMedium: "Inter-Medium",
  interSemiBold: "Inter-SemiBold",
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
  p_smi: 13,
};
/* border radiuses */
export const Border = {
  br_xl: 20,
  br_5xs: 8,
  br_81xl: 100,
};

export const patio = screenHeight/screenWidth
export const footer_h=screenHeight*0.063
//export const productlistheight=screenHeight-264
export const productlistheight=screenHeight-244



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
        fontFamily: 'kavoonRegular',
        fontSize: FontSize.size_lg,
    },
    textresult: {
        fontSize: FontSize.size_sm,
        lineHeight: 20,
        fontFamily: 'Roboto-Bold',
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
    fontFamily: 'KleeOne-Regular',
  },
  labelText: {
    fontFamily: 'KleeOne-Regular',
  },
  matCalculatorText: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    fontFamily: 'kavoonRegular',
    color: Color.colorBlack,
    textAlign: "left",
    height: 20,
  },
  ResultText: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    fontFamily: 'kavoonRegular',
    color: Color.colorLimegreen,
    textAlign: "left",
    height: 24,
    marginBottom: 5,
  },
  reslt: {
   
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
      backgroundColor: '#fafaff',
    },
    scrollView: {
      width: screenWidth,
      height: productlistheight,
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
           paddingHorizontal: 4,
           paddingVertical: 4,
           paddingBottom: 50,
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
     width: '100%', // Make the product take full width when in "New designs" category
   },
   productWrapper: {
      width: '50%',
      marginVertical: 4,
   },
   productInnerContainer: {
     borderRadius: 8,
     overflow: 'hidden',
     backgroundColor: '#fff',
     padding: 2,
     height: productlistheight/3-10,//new
     marginHorizontal: 4,
   },
   fullproductInnerContainer: {
    flexDirection: 'row',
    height: productlistheight/4-9,//new
  },
   productImage: {
     width: '100%',
     height: '70%',
     borderRadius: 8,
   },
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
     fontFamily: 'kavoonRegular',
     fontSize: 12,
     color: Color.colorRed,
   },
   stockText: {
     fontFamily: 'kavoonRegular',
     fontSize: 10,
   },
   productName: {
     fontFamily: 'KleeOne-Regular',
     fontSize: 11,
     fontWeight: "600",
     color: 'black',
   },
   newBadge: {
     height: 30,
     width: 30,
     position: "absolute",
     top: 8,
     right: 13,
   },
   fullnewBadge: {
    top: 6,
    left: '41%',
  }
 }
 );
   
 };
///////// groupe components section ////
export const groupecomponentstyles = StyleSheet.create({
  texto: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'kavoonRegular',
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
  suggestionsPosition: {
    left: 0,
    top: 0,
  },
  suggestions: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    fontFamily: 'kavoonRegular',
    color: Color.colorBlack,
    textAlign: "left",
    width: 115,
    height: 24,
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
    paddingVertical: 2,
    paddingHorizontal: 15,
    backgroundColor: Color.colorWhite,
    marginVertical: 4,
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
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  searchInput: {
    borderRadius: Border.br_5xs,
    borderStyle: "solid",
    borderColor: Color.colorGainsboro,
    borderWidth: 1,
    width: '90%',
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
  cart: 
  {
    width: '100%',
    position: 'absolute',
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginVertical: 2,
    alignItems: 'center',
    backgroundColor: Color.colorMainforBg, //// new
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
  cartheader: {
    width: '60%',
    alignItems: 'center',
    fontFamily: FontFamily.kavoonRegular,
    //backgroundColor: 'red', //// new
    top: screenHeight*0.08,
    left: -screenWidth*0.20 ,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartText:
  {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.kavoonRegular,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowRadius: 4,
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
    top: screenHeight*0.15,
    width: '100%',
    height: productlistheight,
    
  },
  productImage: 
  {
    height: '40%',
  },
  CardsProductWrapper: 
  {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 7,
    backgroundColor: '#fff',
    padding: 2,
  },
  productText:
  {
    fontFamily: 'KiteOne-Regular',
    color: Color.colorBlack,
    fontSize: FontSize.size_3xs,
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
    //position: "absolute",
    //marginTop: 318,
    //marginLeft: -85.5,
    top: '37%',
    //left: "50%",
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
    fontFamily: FontFamily.interSemiBold,
    color: Color.colorBlack,
    textAlign: "center",
  },
  copy: {
    alignItems: "center",
  },
  label: {
    fontFamily: FontFamily.interRegular,
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
    fontFamily: FontFamily.interMedium,
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
    fontFamily: FontFamily.interRegular,
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
    left: 0,
    position: "absolute",
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
    width: '88%',
    marginLeft: 26,
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
    width: '100%',
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  here: {
    fontSize: FontSize.size_sm,
    lineHeight: 24,
    color: "#f04949",
    textAlign: "left",
  },
  secondaryButton: {
    width: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_5xs,
    height: 32,

  },
  alreadyRegisteredLog: {
    top: 4,
    lineHeight: 21,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
  },
  createNewAccount: {
    top: -104,
    fontSize: 32,
    lineHeight: 48,
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
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
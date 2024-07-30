import { StyleSheet } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

export const styles = StyleSheet.create({
  frameFlexBox: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: Border.br_5xs,
  },
  hereTypo: {
    fontFamily: FontFamily.smallText,
    fontWeight: "500",
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
    // height: 32,
  },
  createNewAccountPosition: {
    marginBottom: "2vh",
    textAlign: "center",
    color: Color.colorBlack,
    left: 0,
  },
  signUp: {
    marginBottom: "2vh",

    color: Color.colorWhite,
    textAlign: "left",
    lineHeight: 20,
    fontSize: FontSize.size_sm,
    fontWeight: "500",
  },
  frame: {
    marginTop: 25,
    backgroundColor: Color.colorBlack,
    width: 327,
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
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
    // marginLeft: -164.5,
    width: 330,
    alignItems: "center",
    paddingLeft: 6,
    // left: "50%",
  },
  here: {
    fontSize: FontSize.smallText_size,
    color: "#f04949",
    textAlign: "left",
  },
  secondaryButton: {
    top: 0,
    left: 177,
    width: 46,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: Border.br_5xs,
    height: 32,
    backgroundColor: Color.colorWhite,
  },
  alreadyRegisteredLog: {
    // Width: 200,
    //  lineHeight: 21,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
  },
  createNewAccount: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
  },
  secondaryButtonParent: {
    marginLeft: -111.5,
    top: 198,
    // width: 223,
    left: "50%",
  },
  registerpage: {
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
});

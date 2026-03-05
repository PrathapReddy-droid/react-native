import { Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
const {width,height} = Dimensions.get('screen');

export const COLORS = {
	primary: "#47057e",
	  PrimaryGradient: ({ style, children }) => (
    <LinearGradient
      colors={['#9e4bde', '#47057e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  ),
	primaryLight: "#DFE7F4",
	secondary: "#FFE019",
	success: "#159E42",
	danger: "#FF3131",
	warning: "#ffb02c",
	dark: "#2f2f2f",
	light: "#E6E6E6",
	info: "#2B39B9",
	white: "#fff",
	label: "#8A8A8A",
	backgroundColor: "#fff",
	black: "#000",
	
	//light theme
	card : "#fff",
	background : "#F2F3F8",
	text : "#7D899D",
	title : "#000000",
	borderColor : "rgba(0,0,0,.1)",
	input : "rgba(0,0,0,.03)",
	
	//dark theme
	darkCard : "rgba(255,255,255,.05)",
	darkBackground : "rgba(0,3,3,.9)",
	darkText : "rgba(255,255,255,.6)",
	darkTitle : "#fff",
	darkBorder : "rgba(255,255,255,.2)",
	darkInput : "rgba(255,255,255,.05)",
}

export const SIZES = {
	fontLg: 16,
	font: 14,
	fontSm: 13,
	fontXs: 12,

	//radius
	radius_sm: 8,
	radius: 6,
	radius_lg: 15,

	//space
	padding: 15,
	margin: 15,

	//Font Sizes
	h1: 40,
	h2: 28,
	h3: 24,
	h4: 20,
	h5: 18,
	h6: 16,

	//App dimensions
	width,
	height,

	container: 800,
};

export const FONTS = {
	fontLg: { fontSize: SIZES.fontLg, color: COLORS.text, lineHeight: 20, fontFamily: 'Jost-Regular' },
	font: { fontSize: SIZES.font, color: COLORS.text, lineHeight: 20, fontFamily: 'Jost-Regular' },
	fontSm: { fontSize: SIZES.fontSm, color: COLORS.text, lineHeight: 18, fontFamily: 'Jost-Regular' },
	fontXs: { fontSize: SIZES.fontXs, color: COLORS.text, lineHeight: 14, fontFamily: 'Jost-Regular' },
	h1: { fontSize: SIZES.h1, color: COLORS.title, fontFamily: 'Jost-SemiBold' },
	h2: { fontSize: SIZES.h2, color: COLORS.title, fontFamily: 'Jost=SemiBold' },
	h3: { fontSize: SIZES.h3, color: COLORS.title, fontFamily: 'Jost-SemiBold' },
	h4: { fontSize: SIZES.h4, color: COLORS.title, fontFamily: 'Jost-SemiBold' },
	h5: { fontSize: SIZES.h5, color: COLORS.title, fontFamily: 'Jost-SemiBold' },
	h6: { fontSize: SIZES.h6, color: COLORS.title, fontFamily: 'Jost-SemiBold' },
	fontBold: { fontFamily: 'Jost-Bold' },
	fontMedium: { fontFamily: 'Jost-Medium' },
	fontTitle: { fontFamily: 'Jost-Medium' },
	fontRegular: { fontFamily: 'Jost-Regular' },
	fontSemiBold: { fontFamily: 'Jost-SemiBold' },
	fontJostLight: { fontFamily: 'Jost=Light' },
	fontJostExtraLight: { fontFamily: 'Jost-ExtraLight' },
	Marcellus: { fontFamily: 'Marcellus-Regular' },
	fontJostItalic: { fontFamily: 'Jost-Italic' },
	fontJostSemiBoldItalic: { fontFamily: 'Jost-SemiBoldItalic' },
	fontJostLightItalic: { fontFamily: 'Jost-LightItalic' },
	fontJostMediumItalic: { fontFamily: 'Jost-MediumItalic' },
}


const appTheme = {COLORS, SIZES, FONTS}

export default appTheme;
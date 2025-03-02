import { StyleSheet } from 'react-native';
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    justifyContent:"space-between"
  },
  content: {
    paddingVertical: 15  }, 
  sectionTitle: {
    color:"black"
  },
  row: {
    backgroundColor: "red"
  },
  lottie: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  connection: {
    color: "black",
    fontFamily: 'Montserratarm-SemiBold',
    textAlign: "center",
  },
  back: {
  
    
  },
  flatlist: {
    flex: 1,
    justifyContent: 'space-between'
  },
  button:{
    backgroundColor:"white",
    borderRadius:15,
    borderWidth:1,
    borderColor:"black",
    paddingVertical:10,
    paddingHorizontal:10,
  }

});
export default styles;
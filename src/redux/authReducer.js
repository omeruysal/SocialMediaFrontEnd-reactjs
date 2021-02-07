import * as ACTIONS from './Constants'
const defaultState = {

    isLoggedIn: false,
    username: undefined,
    displayName: undefined,
    image: undefined,
    password: undefined
  }
  
  const authReducer = (state = {...defaultState},action)=>{//son statei ve aksiyonu alarak bize guncel statei uretip donucek olan fonksiyon. Eger initial state basta tanimlanmdiysa default state gonderilir
    if(action.type=== ACTIONS.LOGOUT_SUCCESS)
    {
      return defaultState; //logout islemi sonucu buraya gelir.Artik user'a dair bir bilgi kalmaz
    } else if (action.type===ACTIONS.LOGIN_SUCCESS){
        return {
            ...action.payload, //gonderdigimiz payload objesinden json uretiriz ve fazladan isLoggedin bilgisi doneriz // Payload parametresi actioni olustururken bizim olusturdugumuz custom bir keywordten gelir
            isLoggedIn : true
        }
    } else if(action.type===ACTIONS.UPDATE_SUCCESS){
        return { //stateden gelenleri aynen aktaririz ve uzerine guncellenmis alanlari vererek sadece onlarin degismesini saglariz
            ...state,
            displayName : action.payload.displayName,
            image : action.payload.image
        }
    }
    return state;
  }
  export default authReducer;
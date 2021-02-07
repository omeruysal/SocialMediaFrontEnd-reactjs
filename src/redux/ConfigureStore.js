
import { applyMiddleware, createStore,compose } from 'redux'
import authReducer from './authReducer'
import SecureLS from 'secure-ls' //localstoragi guvenli hale getirmek icin kullaniriz
import thunk from 'redux-thunk'
import { setAuthorizationHeader } from '../api/apiCalls';
const secureLs = new SecureLS();
const getStateFromStorage = () =>{ //bu fonksiyon local storageta obje varsa onu doner yoksa default obje doner

        const auth = secureLs.get('auth')// Storagetan datayi getiririz.localStorage.getItem("auth") seklinde de getirebilirdik fakat encrypte olmazdi

    let stateInLocalStorage = { //siteye ilk girildiginde olusan default obje
        isLoggedIn: false,
        username: undefined,
        displayName: undefined,
        image: undefined,
        password: undefined
    };
    if (auth) {//eger localStorageta auth objesi varsa , o objeyi default objemiz yerine koyariz
        try {
            return auth;
        } catch (error) {
            
        }
        return stateInLocalStorage;


}}
const updateStateInStorage = newState => { //local storage i guncelleriz
    secureLs.set('auth',newState);
  
}
const configureStore = () => { //sayfayi her refresh ettigimizde buraya gelir
  

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const initialState = getStateFromStorage();
    if(initialState!==undefined){

    setAuthorizationHeader(initialState);
    }
    const store = createStore(authReducer, initialState, composeEnhancers(applyMiddleware(thunk)))
    store.subscribe(() => {//Bu fonksiyon sayesinde storedaki degisimlerden haberdar olabiliriz.Storedaki her degisiklikte arkaplanda cagirilir
       
    updateStateInStorage(store.getState())
    setAuthorizationHeader(store.getState())
    });
    return store;
};
export default configureStore;
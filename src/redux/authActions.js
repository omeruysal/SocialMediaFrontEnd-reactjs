import * as ACTIONS from './Constants'
import {login, signup } from '../api/apiCalls'

export const logoutSuccess = ()=> { //yazim kolayligi ve karisiklini onlemek icin action type ve data donduren fonskiyonlari ayri olarak tanimladik
    return {
        type: ACTIONS.LOGOUT_SUCCESS
    }
}

export const loginSuccess = (authState)=> {
    return {
        type: ACTIONS.LOGIN_SUCCESS,
        payload: authState
    }
}
export const updateSuccess = ({displayName, image}) => {
    return{
        type : ACTIONS.UPDATE_SUCCESS,
        payload : {
            displayName,
            image
        }
    }
}
export const loginHandler = credentials=> {

   return async function(dispatch) {//loginHandler icinde dispatch fonksiyonuna ulasabilmek icin; dispatch parametresi alan bir fonksiyon doneriz. Bu fonksiyon arka tarafta redux tarafindan kullaniliyor ve dipstach parametresi reduxtan geliyor
    const response = await  login(credentials);//basic auth icin post methodu gerceklestirilir ve await ile tum degerlerin gelmesini beklemesi gerektigini soyleriz.Yoksa beklemeden devam edecektir
    const authState = {
                ...response.data, //user bilgilerini responsetan alip dogrudan contexte json olarak gondeririz.Response password bilgisi bulundurmadigi icin onu alamayiz
                password : credentials.password
            }

            dispatch(loginSuccess(authState));
            return response; //cagirdigimiz yerde response'un lazim olma ihtimalini karsilik response doneriz
   };
};


export const signupHandler = (user) =>{
    return async function(dispatch){
        const response = await signup(user);
        await dispatch(loginHandler(user))
        return response;
    }

}
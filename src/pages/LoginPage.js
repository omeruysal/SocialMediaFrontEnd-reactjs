import React, { Component } from 'react'
import Input from '../components/Input'
import { login } from '../api/apiCalls'
import ButtonWithProgress from '../components/ButtonWithProgress'
import { connect } from 'react-redux'
import {loginHandler, loginSuccess} from '../redux/authActions'
import { useEffect, useState } from "react";
//import {Authentication} from '../shared/AuthenticationContext';

const LoginPage = (props) => {
    //const dispatch = useDispatch() ---->  useDispatch ile hook kullanarak connect kullanmadan da redux dispatch kullanim ornegi
    // const {isLoggedIn} =useSelector(function(store){ -----> useSelector ile hook kulanarak store'a erisim saglariz
    //     return{
    //         isLoggedIn : store.isLoggedIn
    //     }
    // })

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();//login sayfasinda tek error gosteririz.Sifre ya da username'in yanlis oldugu hakkinda bir bilgi vermeyiz tek tek

    useEffect(()=> { //username veya passwordda herhangi bir degisim oldugunda erroru nulla cekeriz
        setError(null);
    },[username,password])
  
   

    const   onClickLogin = async event => {
        event.preventDefault();
        const {history , dispatch} = props;
        const credentials = { //login methodu icin objemizi olustururuz.Bu obje username ve sifre barindirir.
            username,
            password
        }
         setError(null) //login dendigi anda error uyarisi ekrandan silinmesi icin
        
        try {
          await dispatch(loginHandler(credentials)) // loginHandler bize fonksiyon doner.Bu fonksiyonu isleyecek bir ara katman lazim. Bu yuzden thunk kutuphanesini indiririz.

        history.push("/")//Anasayfaya yonlendirme
        } catch (apiError) {
           
        setError(apiError.response.data.message)
           
        }
    }
        const {pendingApiCall} =props;
        const buttonEnabled = username && password; //username ve password bos ise butona basilmaz
        return (
            <div className="container">
                <form>
                    <h1 className="text-center">Login</h1>
                    <Input label="Username" name="username" onChange={(event)=>{setUserName(event.target.value)}} />
                    <Input label="Password" name="password" type="password" onChange={event=>{setPassword(event.target.value)}} />
                    {error ? <div className="alert alert-danger" >
                        {error}
                    </div> : ""}
                    
                    <div className="text-center">
                        <ButtonWithProgress
                        onClick={onClickLogin}
                        disabled={!buttonEnabled|| pendingApiCall}
                        pendingApiCall={pendingApiCall}
                        text={'Login'}
                        />
                    </div>
                </form>

            </div>
        )
    }


export default connect()(LoginPage);
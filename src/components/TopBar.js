import React, { Component, useState,useEffect ,useRef} from 'react'
import logo from '../assets/images.png'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutSuccess } from '../redux/authActions'
import ProfileImageWithDefault from './ProfileImageWithDefault'
//import {Authentication} from '../shared/AuthenticationContext';


const TopBar = (props) => {
    const [menuVisible , setMenuVisible] = useState(false);
    const menuArea = useRef(null);//Login oldugumuz yerin html kodu temsil edebilmek icin referans yaratiriz.(Dropdown listeden baska bir yere tikladigimizi anlayip kapatabilmek icin kullaniriz)
   
    // onClickLogout = () => {  // bu sekilde de store'a mudahele edebiliriz

    //     this.props.dispatch(logoutSuccess());
    // }

     const { isLoggedIn, username, displayName, image } = props;
    useEffect(()=>{
        document.addEventListener('click',menuClickTracker);

        return()=>{
            document.removeEventListener('click',menuClickTracker)
        }
    },[isLoggedIn])//sadece login durumunda (sadece kullanici login oldugunda nereye tikladigini inceleriz)degistiginde cagiririz, yoksa componentler icin surekli calisir, performans acisindan yanlis
   
    const menuClickTracker = (event)=>{
       if( menuArea.current ===null || !menuArea.current.contains(event.target)){//menuArea.current logout durumdayken gozukmez.Bu yuzden null olma ihtimalinide kullanmazsak hata firlatir
           setMenuVisible(false)
       }
    }



     let links = (
            <ul className="navbar-nav ml-auto" >
                <li>
                    <Link className="nav-link" to="/login">
                        Login
        </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/signup">
                        Sign Up
        </Link>
                </li>
            </ul>
        );
        if (isLoggedIn) {


            let dropDownClass = 'dropdown-menu p-0 shadow';
            if(menuVisible){ //dropdown menuye tiklandiginda menuVisible true olur. Bu kosula girer ve dropdown listesinin styleina show ekleriz
                dropDownClass += ' show';
            }


            links = (
                <ul className="navbar-nav ml-auto" ref={menuArea}>
                    <li className="nav-item dropdown">
                        <div className="d-flex" style={{cursor : 'pointer'}} onClick={()=>setMenuVisible(true)}>

                            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle m-auto" />
                            <span className="nav-link dropdown-toggle">{displayName}</span>
                        </div>
                        <div className={dropDownClass}>

                         
                                <Link className="dropdown-item d-flex p-2" to={`/user/${username}`} onClick={()=>setMenuVisible(false)}>
                                <span className="material-icons text-info mr-2">person</span>
                                    My profile
                                </Link>
                            
                            
                                
                                    <span className="dropdown-item d-flex p-2" onClick={props.onLogoutSuccess}>
                                    <span className="material-icons text-danger mr-2">power_settings_new</span>
                                      <span style={{cursor : 'pointer'}}> Logout</span>  
                                    </span>
                                
                           

                        </div>
                    </li>

                </ul>
            )
        }
        return (
            <div className="shadow-sm mb-2 ">
                <nav className="navbar navbar-light bg-light container navbar-expand">

                    <Link className="navbar-brand" to="/">
                        <img src={logo} width="60" alt="TopBar Logo" />
        TOPBAR
</Link>
                    {links}
                </nav>

            </div>
        )


    }

const mapStateToProps = (store) => { //reduxtaki state bilgisini componentimize props olarak alacagimiz fonksiyon yaziyoruz.Bu fonksiyou redux tarafi cagiriyor olucak.Parametre olan store objesi reduxtan geliyor
    return {
        username: store.username,
        isLoggedIn: store.isLoggedIn,
        displayName: store.displayName,
        image: store.image
    }
}
const mapDispatchToProps = dispatch => { //reduxtaki dispatch fonskiyonunu aliriz //bu sekilde tanimlama yaptik dispatch bizim propsumuz olmaktan cikar ve yerine asagida tanimladigimiz keywordteki fonksiyonlar gelir. ornegin onlogoutsuccess
    return {
        onLogoutSuccess: () => dispatch(logoutSuccess())//logoutSuccess fonksiyonunu authActionsda olusturduk. Bize json doner. Burada onLogoutSuccess fonksiyonunu tanimlamis oluruz.

    };
}
// const dispatch = useDispatch(); // hook ile dispatch kullanimina alternatif bir yontem
// const onLogoutSuccess=()=>{
//     dispatch(logoutSuccess())
// }
export default connect(mapStateToProps, mapDispatchToProps)(TopBar); //connect olurken reduxtan neyi alicagimizla ilgili opsiyonlar sunar
                                                                    //reduxun dispatch fonksiyonunun props olarak bu componeneti donusturulmesi diyebiliriz
import React, { Component } from 'react'
import ApiProgress from '../shared/ApiProgress'
import UserSignupPage from '../pages/UserSignupPage'
import Login from '../pages/LoginPage'
import LoginPageWithoutThunk from '../pages/LoginPageWithoutThunk'
import HomePage from '../pages/HomePage'
import UserPage from '../pages/UserPage'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import TopBar from '../components/TopBar'
import {connect} from 'react-redux';
//import {Authentication} from '../shared/AuthenticationContext';


class App extends Component {
// Functional componenetlerde useSelector ile redux store'a erisim:
// const { isLoggedIn} = useSelector(store=>({
//  isLoggedIn : store.isLoggedIn }))
  render() {
    const {isLoggedIn} = this.props;
    
    return (

      <div className="row">
        <div className="col">

          <HashRouter>{/*BrowserRouter yerine hashrouter kullandik cunku sayfalar arasinda gecis yaparken backende request atamadan gecis yapmak icin hashrouter kullanmamiz gerek*/}
            <TopBar />
            <Switch>


              <Route exact path="/" component={HomePage} />

             {!isLoggedIn && <Route path="/login" component={Login}/>} {/*eger kullanici logged in olduysa login sayfasini gormemesi icin yapilan kosul*/}
           
              <Route path="/signup" component={UserSignupPage} />
              <Route path="/user/:username" component={UserPage} />
              <Redirect to="/" />

            </Switch>
          </HashRouter>


        </div>

      </div>
    )

  }

}
const mapStateToProps = (store) => { //reduxtaki state bilgisini componentimize props olarak alacagimiz fonksiyon yaziyoruz.Bu fonksiyou redux tarafi cagiriyor olucak.Parametre olan store objesi reduxtan geliyor
  return {
     isLoggedIn : store.isLoggedIn
  }
}

export default connect(mapStateToProps)(App)
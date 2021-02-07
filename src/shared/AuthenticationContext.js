import React, { Component } from 'react'

export const Authentication = React.createContext();

class AuthenticationContext extends Component {
    state = {
        isLoggedIn: true,
        username: undefined,
        displayName: undefined,
        image: undefined,
        password: undefined
      }
      onLoginSuccess = authState => {
        this.setState({
          ... authState,//authStateteki tum fieldlar bu sekilde statelerimize gonderilir ve tek tek username: authState.username diye atamamiza gerek kalmaz
          isLoggedIn: true
        });
      };
      onLogoutSuccess = () => {
        this.setState({
          username : undefined,
          isLoggedIn: false
        });
      };
    
    render() {
        return (
                <Authentication.Provider value={{
                    state: {... this.state},
                    onLoginSuccess : this.onLoginSuccess,
                    onLogoutSuccess : this.onLogoutSuccess

                }}>
                    {this.props.children}
                </Authentication.Provider>
           
        )
    }
}
 
  export default AuthenticationContext;
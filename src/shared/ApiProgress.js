import React, { Component } from 'react'
import axios from 'axios'

export default class ApiProgress extends Component {
    state = {
        pendingApiCall : false
    };
    componentDidMount(){ //PendingApi degeri degismesi ve spin gostermesi icin // Ilk defa ekrana ciktiginda componentDidMount calisir 
        axios.interceptors.request.use( (request) =>{ //Bu fonksiyon ile requestlere mudahale edebiliriz. Targete gondermeden once degistirebiliriz
            this.setState({ pendingApiCall:true  }) //Biz sadece bir requestin(sayfada sadece login veya signup requesti oldugu icin tek bir requesti etkiler) baslama uzerinde oldugunun farkinda olup pendingApiCall true yapariz
            return request;
        })
        axios.interceptors.response.use(response=>{//Response gelince pendingApiCall false olur. Kisacasi istek gonderilmeden once true response gelince false ediyoruz kisa bir sure icinde oluyor ve o sure icinde yukleniyor spini gostermek icin
            this.setState({ pendingApiCall:false  })
            return response;
        },  apiError =>{ //bu error axios tarafindan uretilir ya  backend tarafindan alinan statusler ya da browserdan requestin cikamamasi gibi
            this.setState({ pendingApiCall:false  })
            throw apiError;
        })
    }
    render() {
        return (
            <div>
                {React.cloneElement(this.props.children,{ //ilk parametre render edilecek componenet
                    pendingApiCall:this.state.pendingApiCall //ikinci parametre properties veririz
                })}
            </div>
        )
    }
}

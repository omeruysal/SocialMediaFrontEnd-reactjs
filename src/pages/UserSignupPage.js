import React, { useState } from 'react'
import '../bootstrap-override.scss'
import Input from '../components/Input'
import ButtonWithProgress from '../components/ButtonWithProgress'
import {connect} from 'react-redux'
import { signupHandler } from '../redux/authActions'


const UserSignupPage = (props)=> {
                                    //Obje set ederken yol 1:
    const [form, setForm]= useState({//Objeler icin set kullanirken, set fonksiyonuna farkli isimde bir obje gondermemiz gerekir.Ayni isimle olursa default olani doner
                                    //Ornek olarak 1- const errorsCopy = {...errors}(kopyayi aldik) 2- errorsCopy[name] = undefined (guncellemeyi yaptik) 3-setErrors(errorsCopy) kopyasini set ettik
        username:null,
        displayName:null,
        password:null,
        passwordRepeat:null
    })
    const [errors ,setErrors] = useState({});
    
 const   onChange = event => { //bu fonksiyon hem inputa yeni deger atanmasini saglar hemde onceden kullanici hatali giris yaptiysa onun hatasini ekrandan kalkmasina yardimci olur/ onchange oldukca form objesini guncelleriz
        const {name,value} =event.target;// ornek event target => <input class="form-control" name="username" value>
       
        console.log(event.target)
        setErrors((previousErrors)=>({...previousErrors,[name] : undefined}))//Obje set ederken yol 2:
        setForm((previousForm)=>({...previousForm, [name] : value}))//useState'den aldigimiz set fonksiyonlarinin ozelligi geregi bu fonksiyonlar parametre olarak baska fonksiyon verilirse, bu fonksiyonu react ilgili state objesinin son hali ile cagirir.
    }                                                               //Ve yeni degisiklikleri kapsayacak guncel stte objesini olusturmak icin eski objeyi alip duzenlenecek alanlari veririz
    
    
  const  onClickSignUp = async event =>{
        event.preventDefault(); // parametrelerin linkte gozukmemesi icin
        const { username,displayName,password} = form; //form objemizden degiskenleri aliriz
        const {dispatch,history} =props;
        const body={//js de key value iliskisinde key ve value ayni isime sahipse sadece key yazabiliriz
            username,
            displayName,
            password
        }
        try {
            await dispatch(signupHandler(body)); 
            history.push("/");
        } catch (error) { //buradaki error axios tarafindan uretilir
            if(error.response.data.validationErrors){//sadece validation hatalari aldigimizda errors dizisinde guncelleme yapariz
        //    this.setState({errors : error.response.data.validationErrors});//burda hatalarimizi alir errors dizisine koyariz
        setErrors(error.response.data.validationErrors)
    }
        }

        // signup(body) //proxy olarak 8080 verdigimiz icin tam dizin yazmamiza gerek yok
        // .then((response)=>{ // status success ise then'e duser
        //     this.setState({pendingApiCall:false}); //requeste cevap geldigi icin butonu yeniden gorunur yapariz
        // }).catch(error=> { //failler ise catch e duser
        //     this.setState({pendingApiCall:false});
        //     //success ve fail durumlarinda da yapilan aynidir, burada aklimiza "o zaman neden bir satir olarak yazmadik" sorusu gelebilir.Bunun cevabi axios asenkron calisir, calismasinin bitmesini beklememiz gerekir.Posttan cevap gelir ve oyle islemimizi yapariz
        // });
    };
        const{pendingApiCall}=props; //parent componentten gelir
   
        const {username : usernameError,displayName : displayNameError,password:passwordError} =errors; //errors objesinden backendte gonderdigimiz hatalari onClickSignUp fonksiyonunda yakaladik return edebilmek icin atamasini sagliyoruz ve asagida kontrollerini sagliyoruz. Hata olan degerler true doner ve bu degerlerin karsiligi olan uyarilar(key value iliskisi) kullaniciya gosterilir
        let passwordRepeatError;
        if(form.password!==form.passwordRepeat){ //ek olarak passwordlarin ayni olmamasi durumunu front endte yaparak hata varsa atama yapariz
            passwordRepeatError= "Password mismatch"
        }
        return ( // yukaridaki atama ile bu atama (usernameError = errors.username) ayni anlama gelmektedir
            <div className="container">
                <form>
                    <h1 className="text-center">Sign Up</h1>

                  <Input name = "username" label="Username" error={usernameError} onChange={onChange}/> { // gerekli bilgileri props araciligiyle olusturdugumuz input componentinde gondeririz.Element ismi, label ismi, eger varsa hata yoksa undefined ve onChange methodumuz
                  }

                  <Input name = "displayName" label="Display name" error={displayNameError} onChange={onChange}/>
                
                  <Input type="password" name = "password" label="Password" error={passwordError} onChange={onChange}/>

                  <Input type="password" name = "passwordRepeat" label="Password Repeat" error={passwordRepeatError} onChange={onChange}/>

                    <div className="text-center">
                   
                    <ButtonWithProgress
                        onClick={onClickSignUp}
                        disabled={pendingApiCall||  passwordRepeatError !== undefined}
                        pendingApiCall={pendingApiCall}
                        text={'Sign Up'}
                        />
                    </div>
                </form>
            </div>
        )
    
}
export default connect()(UserSignupPage)
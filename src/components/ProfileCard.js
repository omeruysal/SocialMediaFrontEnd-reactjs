import React,{useEffect, useState}from 'react'
import { withRouter } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import Input from '../components/Input'
import {updateUser} from '../api/apiCalls'
import ButtonWithProgress from '../components/ButtonWithProgress'
import { updateSuccess } from '../redux/authActions'
//import { Authentication } from '../shared/AuthenticationContext'

const ProfileCard = (props) => {
    const [inEditMode, setInEditMode] = useState(false); //edit moda girip cikmamizi saglar
    const[validationErrors,setValidationErrors] = useState({});
    const [updatedDisplayName , setUpdatedDisplayName] = useState();
    const[editable,setEditable] = useState(false);
    const pathUsername = props.match.params.username; //profilinde oldugumuz kisinin username'ini aliriz URLdem
    const [user,setUser] =useState({});
    const [newImage,setNewImage] = useState();
    const {username : loggedInUsername} = useSelector(store=>({username : store.username}))
    const dispatch = useDispatch();
    
    useEffect(()=>{
        setEditable(pathUsername === loggedInUsername); //Userin kendi sayfasinda olup olmadigina bakariz. Buna gore editable'i guncelleriz ve sonucunda edit butonu gorunur ya da gozukmez

    },[pathUsername,loggedInUsername])//Profil linkindeki isim ya da redux storedaki usernamede degisiklik olursa editable ozelligi guncellenir

    useEffect(()=>{ //propstaki userda degisiklik oldukca bizim bu classtaki user objemizi set ederiz.Logout oldugunda undefined olur giris yaptiginda bilgiler atanir
        setUser(props.user);
    },[props.user])
    
    const {username,displayName,image} = user;


    useEffect(()=>{

        if(!inEditMode){//edit moddan ciktiginda

            setUpdatedDisplayName(undefined)//edit moddan her ciktigimizda input degerini undefined'a cekeriz.Eger cekmezsek. kullanici edit diyip vazgecip sonra tekrar edit derse, ikinci kez edite tikladigimizda input degeri ilk seferdeki degeri tutar
            setNewImage(undefined)
        }else{//edit moda girdiginde

            setUpdatedDisplayName(displayName);//edit moda her tikladigimizda input degeri displayName olur
        }

    },[inEditMode])//inEditMode degiskeninde olan her degisiklikten sonra burasi render olucak.


    useEffect(()=>{
        setValidationErrors(previousValidationErrors=>({
            ...previousValidationErrors,
            displayName:undefined
        }))
    },[updatedDisplayName]) // displayName'i editlemek istiyoruz fakat validationdan hata geldi ve input altinda hata yazdirildi.
                    //inputa (yani updatedDisplayName) yeni bir degisiklik yapildiginda hatayi ekrandan kaldir.Bu islemi asagida setUpdatedDisplayName icin onChange fonksiyonu kullandigimiz yerde de yapabilirdik
    
    useEffect(()=>{ //imagete herhangi bir degisiklik oldugunda hatayi undefineda cekeriz. Boyle hata varsa ekrandan silinir yoksa bir degisiklik olmaz
        setValidationErrors(previousValidationErrors=>({
            ...previousValidationErrors,
            image:undefined
        }))
    },[newImage])



    const onClickSave= async()=>{
        let image;
        if(newImage){ //eger newImage undefined ise bolmeye calismayiz. ProfileImageWithDefault componentine newImage(undefined) ve image(dbden ggelen) gonderilir
            image=newImage.split(',')[1] //image olarak sadece base64 ile kodlanmis kismi gondeririz. Kesmeden once "data:image/jpeg;base64," diye olusan kismi keseriz
       
        }
       const body = {
           displayName : updatedDisplayName,
           image
         }
        try {
         const response = await updateUser(username, body)
         setInEditMode(false);//update sonrasi edit mod kapatiriz
         setUser(response.data);//update sonrasi bulundugumuz componentteki useri guncelleriz
         dispatch(updateSuccess(response.data))// basarili bir sekilde update gerceklestikten sonra yeni displayName ve image reduxa yansitiriz
            console.log("response data ProfileCArd : ")
            console.log(response.data)
        } catch (error) {
            setValidationErrors(error.response.data.validationErrors);//backendden gonderdigimiz validationErrors dizini burada yakalariz
        }
    }
    
    const onChangeFile = (event) =>{
        if(event.target.files.length<1){ //bu kontrolu yapmazsak su kisimda hata cikar; kullanici edit>choose file dedi fotograf secti tekrar choose file dedi ve fotograf secmeden cancel dedi.
            return;
        }

        const file = event.target.files[0];//coklu resim olmadigimiz icin dizinin ilk elemani istedigimiz fotografi temsil eder
        
        const fileReader = new FileReader(); //resmi almak icin fileReader olusturuz
        fileReader.onloadend = () =>{
            setNewImage(fileReader.result)//resmi statimize set ederiz
        }
        fileReader.readAsDataURL(file);//base64 stringi olusur
    }
              
              return  <div className="card text-center">
                  <div className="card-header">
                  <ProfileImageWithDefault 
                  className="rounded-circle shadow" width="200" height="200"
                   alt={`${username} profile`} image={image}
                   tempimage={newImage}/>

                  </div>
                    <div className="card-body">
            {!inEditMode && 
            (   
                <> {/*soldaki tanimlama react fragment gosterimdir.Jsx sadece bir root element dondugunden dolayi bu gosterimi yapmazsak hata aliriz*/}
                <h3>
                    {username}
                  </h3>
                  <h5>
                            @{displayName}
                  </h5>
                 { editable &&  <button className="btn btn-success d-inline-flex" onClick={()=>setInEditMode(true)}>
                        <span className="material-icons">create</span>  
                        Edit
                     </button>
                     }
                 </>    
            )
            } 
            {inEditMode && (
                <div>
                    <Input label="Change display name" defaultValue={displayName} error={validationErrors.displayName}
                    onChange={(event)=>{setUpdatedDisplayName(event.target.value);}}/>
                    <Input type="file" onChange={onChangeFile} error={validationErrors.image}/>
                    <ButtonWithProgress className="btn btn-primary d-inline-flex" onClick={onClickSave}
                       text={
                           <>   <span className="material-icons">save</span>
                           Save
                           </>
                       }  
                    />
                    <ButtonWithProgress className="btn btn-light d-inline-flex ml-2" onClick={()=>setInEditMode(false)}
                        text={
                            <> 
                            <span className="material-icons">cancel</span>
                            Cancel
                            </>
                        }   
                    />
                </div>
            )

            }  
              </div>

                </div>

    // return (

    //     <Authentication.Consumer> {/*functional componenet oldugu icin static context type set edemeiyoruz.Bu yuzden Authentication.Consumer kullaniriz*/}
    //         {value => {
    //     const pathUsername = props.match.params.username;
    //     const loggedInUsername = value.state.username;
    //     let message = "We can not edit";
    //     if (pathUsername === loggedInUsername) {
    //         message = "We can edit"
    //     }
    //   return  <div>
    //         {message}
    //     </div>
    //         }}
    //     </Authentication.Consumer>



    // )
}


export default withRouter(ProfileCard);
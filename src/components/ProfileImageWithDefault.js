import React from 'react'
import { useParams } from 'react-router-dom'
import defaultPicture from '../assets/profile.png'
//Ust componentten 2tane image temsili gelir. Ornek senaryolar; image null gelir newImage(tarayicidan yuklenen gorsel) undefined gelir(yani tarayicidan gorsel yuklenmemistir) bu durumda defaultPicture kullaniriz
//Dbden image null gelir fakat newImage icin tarayicidan gorsel gonderilmistir. newImage gosterilir
//Dbden image zaten olan bir resmin ismiyle gelir newImage(tarayicidan yukleme olmamistir) null gelir ve image gosterilir
//Son senaryoda dbden resim ismiyle gelir newImage (tarayicidan gorsel yuklenmistir)  ismiyle gelir, bu durumda newImage gosterilir
const ProfileImageWithDefault =(props)=> {
    const {image,tempimage} = props;
     let imageSource =defaultPicture;
                if(image){
                    imageSource = 'images/'+image;
                }
    return (
        <img  alt={`Profile`}
         src={tempimage || imageSource}{...props}//props icinde gelen herseyi image'e paslariz
         onError={event=>{ //errora dusunce calisacak kisim. Error olusunca default picture atamasi yapariz
             event.target.src = defaultPicture;
         }}
         /> 

    )
}
export default ProfileImageWithDefault;

import {React,useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import ButtonWithProgress from '../components/ButtonWithProgress'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import Input from '../components/Input'
import {postTwit, postTwitAttachment} from '../api/apiCalls'
import AutoUploadImage from './AutoUploadImage';


export default function TwitSubmit() {
  const {image} =  useSelector((store)=>({image : store.image}));
  const [twit, setTwit] = useState('')
  const [newImage,setNewImage] = useState();
  const [tempPending,setTempPending] = useState(false);
  const [focused, setFocused] = useState(false);
  const [errors, setErrors]= useState({});//error neden obje


  useEffect(()=>{//tweet atilma alanina focustan cikinca hata ekrandan silinir tweet alanindaki deger silinir
    if(!focused){
        setTwit('')
        setErrors({})
        setNewImage(undefined)
    }
  },[focused])

  useEffect(()=>{//tweette her degisiklikten sonra hata varsa silinir
    setErrors({})
  },[twit])

  const onclickTwit = async () =>{
     
      const body = {
          content : twit
      }
    try {
        const response = await postTwit(body)
        setFocused(false)//tweet attiktan sonra tweet area kapatmak icin
    } catch (error) { //backendten aldigimiz hata ile kendi stateimizi guncelleriz
        if(error.response.data.validationErrors){
            setErrors(error.response.data.validationErrors)
        }
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
        uploadFile(file)
    }
    fileReader.readAsDataURL(file);//base64 stringi olusur
}
     
const uploadFile = async (file) =>{
   
   const attachment = new FormData();
   attachment.append('file',file); //burada 'file' field ismi backendteki fonksiyonun parametresi ile ayni olmali
    try {
        setTempPending(true)
        const response = await postTwitAttachment(attachment)
        setTempPending(false)
    } catch (error) {
        
    }
}


  let textAreaClass = 'form-control';
  if(errors.content){
      textAreaClass += ' is-invalid';
  }

    return (
        <div className="card p-1 flex-row">
            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle mr-1"/>
            <div className="flex-fill">
                    <textarea className={textAreaClass} rows={focused ? '3':'1'} onFocus={()=>setFocused(true)}
                    onChange={(event)=>setTwit(event.target.value)}
                    value={twit}/> {/*value eklemezsek text areanin degerine mudahele demeyiz.Ornk:Twit yazip cancel dedikten sonra twit silinmez eger eklemezsek*/}
                       <div className="invalid-feedback">{errors.content}</div>
                        {focused &&(
        <>
                               <Input type="file"onChange={onChangeFile}/>
                                {newImage &&  <AutoUploadImage image={newImage} uploading={tempPending}/>}
                                <div className="text-right mt-1">
                                <ButtonWithProgress className="btn btn-primary" disabled={tempPending} onClick={onclickTwit} text="Tweet at"/>
                                <ButtonWithProgress className="btn btn-light d-inline-flex ml-2"   onClick={()=>setFocused(false)}
                                        text={
                                            <> 
                                            <span className="material-icons">cancel</span>
                                            Cancel
                                            </>
                                        }   
                                    />
                                </div>
        </>
                        )}
                
            </div>
            
            
        </div>
    )
}

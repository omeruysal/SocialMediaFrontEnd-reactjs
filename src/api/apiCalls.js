
import axios from 'axios';

export const signup = (body) => {
    return axios.post('/api/1.0/users', body);
}
export const login = credentials => { //basic auth header temelde username ve password ister
    return axios.post('/api/1.0/auth', {}, { auth: credentials });
}
export const getUsers = (page = 0, size = 3) => {
    return axios.get(`/api/1.0/users?page=${page}&size=${size}`);
}


export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
   console.log("bunlar : " + username +" "+password)
    if (isLoggedIn) {
        const authorizationHeaderValue = `Basic ${btoa(username + ':' + password)}` //userlari getirirken giris yapan user haricindekileri getirebilmek icin 
        axios.defaults.headers['Authorization'] = authorizationHeaderValue      // Authorization headeri set ederiz. Backendte bu useri yakalariz

    } else {                                                            //eger headeri clear etmezsek user logout olduktan sonrada
        delete axios.defaults.headers['Authorization']                  //Authrozitaion header gondermeye devam eder

    }
}
export const getUser = username => {
    return axios.get(`/api/1.0/users/${username}`)
}

export const updateUser = (username , body )=> {
    return axios.put(`/api/1.0/users/${username}`, body)
}

export const postTwit = twit =>{
    return axios.post('/api/1.0/twites',twit)
}


export const getTwits = (username ,page=0) =>{//username varsa userin tum tweetleri icin path ekler yoksa tum tweetler icin
    const path = username ?  '/api/1.0/users/twites/'+username+'?page=' : '/api/1.0/twites?page=';
    return axios.get(path+page)
}

export const getOldTwits = (id,username) => {//username varsa o userin verilen id'den  kucuk id'li tweetleri(yani eski tweetleri), username yok ise verilen id'den kucuk idler icin
    const path = username ? `/api/1.0/users/twites/${username}/${id}` : `/api/1.0/twites/${id}`
    return axios.get(path)
}

export const getNewTwitCount = (id,username) =>{ //verilen idden buyuk tweet olup olmadigini ogrenmemizi saglar
    const path = username ? `/api/1.0/users/twites/${username}/${id}?count=true` : `/api/1.0/twites/${id}?count=true`
    
    return axios.get(path);
}

export const getNewTwits = (id,username) =>{//yeni tweetleri doner

    const path = username ? `/api/1.0/users/twites/${username}/${id}?direction=after` : `/api/1.0/twites/${id}?direction=after`
    console.log(path)
    return axios.get(path)

}
export const postTwitAttachment = attachment => {
    return axios.post('/api/1.0/twit-attachment',attachment);
}
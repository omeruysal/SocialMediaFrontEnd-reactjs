import React, { Component } from 'react'
import {getUsers} from '../api/apiCalls'
import UserListItem from '../components/UserListItem'
import { useEffect, useState, useSelector } from "react";
import {connect} from 'react-redux'

const UserList = (props)=> {
    const [page, setPage] =useState({//page objemiz bize responseta donen ile ayni yapidadir yani content size ve number barindirir response gibi
        content : [], //content icinde backend'ten objelerimiz gelir
        size: 3,
        number : 0 //number sifirsa ilk sayfadayiz demektir.
    })

    const [loadFailure, setLoadFailure] = useState(false)
    useEffect(() => {
        loadUsers();
    }, [])//useEffect sonuna bos array ekledigimizde sadece componentDidMount gibi calisir

  const  onClickNext = ()=> {
        const nextPage = page.number +1;
        loadUsers(nextPage);
    }
  const  onClickPrevious = ()=> {
        const nextPage = page.number -1;
        loadUsers(nextPage);
    }
  const  loadUsers = async page => {
      setLoadFailure(false)
      try {
       const response = await getUsers(page)   
        setPage(response.data)
      } catch (error) {
          setLoadFailure(true)
      }
    }
    const {content : users, last, first} =page;
    return (
        <div className="card">
            <h3 className="card-header text-center">USERS</h3>
            <div className="list-group-flush">
            {
               users.map((user)=>{
                    return(
                        <UserListItem className="list-group-item list-group-item-action" key={user.username} user={user}/> 
                        
                    )
               })
           }

            </div>
            <div>
                {first===false && <button className="btn btn-sm btn-light" onClick={onClickPrevious}>Previous</button>} {/*burada !last yapabilirdik fakat hic data olmadigi durumunda response icinde last gelmez ve bu durum da button !last true olucagindan gozukur */}
           
                {last===false && <button className="btn btn-sm btn-light float-right" onClick={onClickNext}>Next</button>} {/*burada !last yapabilirdik fakat hic data olmadigi durumunda response icinde last gelmez ve bu durum da button !last true olucagindan gozukur */}
            </div>
         {loadFailure && <div className="text-center text-danger">Load Failure</div>}
        </div>
    )
}
const mapStateToProps = (store) => { //reduxtaki state bilgisini componentimize props olarak alacagimiz fonksiyon yaziyoruz.Bu fonksiyou redux tarafi cagiriyor olucak.Parametre olan store objesi reduxtan geliyor
    return {
        username : store.username,
        password : store.password
    }
}
export default connect(mapStateToProps)(UserList); 
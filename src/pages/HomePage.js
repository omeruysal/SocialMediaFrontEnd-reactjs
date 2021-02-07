import React from 'react'
import { useSelector } from 'react-redux'
import TwitFeed from '../components/TwitFeed'
import TwitSubmit from '../components/TwitSubmit'
import UserList from '../components/UserList'

export default function HomePage() {
    const {isLoggedIn} = useSelector(store=>({isLoggedIn : store.isLoggedIn}))
    return (
        <div className="container">
            <br/>
            <div className="row">
                <div className="col">

                            { isLoggedIn &&
                                    <div className="mb-1"><TwitSubmit/></div>
                             } 
                            <TwitFeed/>
                </div>
              
                <div className="col"><UserList/></div>
            </div>
        </div>
    )
}

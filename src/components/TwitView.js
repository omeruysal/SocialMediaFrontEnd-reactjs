import React from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { Link } from 'react-router-dom';
import {format} from 'timeago.js'
 
export default function TwitView(props) {

    const { twit } = props; //bizim degiskenimiz ile propstaki ayni oldugu surece props.twit demeden alabiliriz.
    const { user, content,timestamp } = twit;//twitten sadece gerekli kisimlari aliriz.Mesela id  almadik suan
    const { username, displayName, image } = user;
    
    const formattedTime = format(timestamp)//instal ettigim timeago lib sayesinde kullanicaya 10 mins ago gibi zaman gosterimi yapariz
    return (
        <div className="card p-1 m-1">
            <div className="d-flex">
                <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle m-1" />

                <div className="flex-fill m-auto pl-2">
                    <Link to={`/user/${username}`} className="text-dark">
                        <h6 className="d-inline">
                            {displayName}@{username}
                        </h6>
                        </Link>
                        <span> - </span>
                        <span>
                            {formattedTime}
                        </span>
                    
                </div>
            </div>
            <div className="pl-5">
                {content}
            </div>
        </div>
    )
}

import React, { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard'
import { getUser } from '../api/apiCalls'
import { useParams } from 'react-router-dom'
import TwitFeed from '../components/TwitFeed';
//useEffect sayesinde belirledigimiz itemda bir degisiklik oldugunda calisir. Ya da componenette her degisim oldugunda. Bu bize kalmis.
function UserPage(props) {
    const [user, setUser] = useState({}); //iceriye suslu parantez koyduk cunku koymazsak ve profile card componenti yuklendiginde ilk basta(daha backend'ten user gelmeden once) user undefined olur ve propstan undefined bir objenin username'ini almaya calistigimizdan dolayi hata cikar. Parantezler sayesinde user objesi undefined olmaz icindeki filedler undefined olur
    const [notFound, setNotFound] = useState(false);
    const { username } = props.match.params  //esitligin sag tarafi yerine useParams() fonksiyonu kullanabilir. App.js teki path="/user/:username" :usernameini getirir
    useEffect(() => {

        const loadUser = async () => {
            try {
                const response = await getUser(username)
                setUser(response.data)
                setNotFound(false)
            } catch (error) {
                setNotFound(true)
            }
        }
        loadUser();
    }, [username])  //username degiskeni degistikce useEffect fonksiyonu calisacak. Buradaki username hangi userin sayfasindaysak o userin usernameidir.
    if (notFound) {
        return (
            <div className="container">
                <div className="alert alert-danger text-center">
                    <div>
                        <span className="material-icons" style={{fontSize:'48px'}}>
                            error
                        </span>
                    </div>   User not found
           </div>
            </div>
        )
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                     <ProfileCard user={user} />
                </div>
                <div className="col">
                    <TwitFeed/>
                </div>
            </div>
        </div>
    )
}
export default UserPage;
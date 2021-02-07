import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getNewTwitCount, getNewTwits, getOldTwits, getTwits } from '../api/apiCalls'
import TwitView from './TwitView'

export default function TwitFeed() {
    const [twitPage, setTwitPage] = useState({ content: [], last: true, number: 0 })//responsetaki bodyden istedigimiz ozelliklere gore yaratiriz. Last degeri son sayfada olup olmadigimizi doner number ise page number
    const { username } = useParams();//parametredeki user ismini aliriz.api methoduna veririz.Eger undefined degil ise profildeyiz demektir ve sadece o kisinin tweetleri gelir
    const [newTwitCount, setNewTwitCount] = useState(0);

    let firstTwitId = 0;
    let lastTwitId = 0;

    if (twitPage.content.length > 0) { //eger yuklenmis twit varsa
        firstTwitId = twitPage.content[0].id; //ekrandaki ilk twitin idsini aliriz

        const lastTwitIndex = twitPage.content.length - 1;// Sayfa ilk yuklendiginde son twitleri aliriz.Bu satirda ise elimizdeki twitlerin sonuncusunu buluruz
        lastTwitId = twitPage.content[lastTwitIndex].id; //sonuncunun id sini aliriz

    }


    useEffect(() => { //Load new tweets butonuna baslinca, bu useEffect sayesinde saniyede 10 yeni twit var mi diye bakariz

        const getCount = async () => {
            const response = await getNewTwitCount(firstTwitId,username);
            console.log("data count : "+response.data.count)
            setNewTwitCount(response.data.count)
        }
      let looper =  setInterval(() => { getCount(); }, 10000)

        return function cleanup(){ //burada clearInterval kullanarak setIntervalin sadece bir kere kosulmasini saglariz. Bu eklemeyi yapmazsak setInterval 2 kere kosar. Biri sayfa ilk yuklendiginde firstTwitId=0 oldugu icin digeri twitler yuklendiginde firstTwitId degistigi icin
            clearInterval(looper);
        }
    }, [firstTwitId,username])


    useEffect(() => { //Sayfa yuklenince gelen ilk userlar 
       
        const loadTwits = async (page) => {
            
            try {
                const response = await getTwits(username, page);//username varsa o userin twitleri doner yoksa tum twitler.(Anasayfa veya profile gore getirim)

                setTwitPage(previousTwitPage => ({ //previousTwitPage parametre olarak kullandik cunku eski datayi kullanmak istiyoruz
                    ...response.data, //responsetan gelen herseyi aldik ve bununla beraber last ve numberlarimizda guncellendi
                    content: [...previousTwitPage.content, ...response.data.content] //ve contenti yeniden guncelliyoruz(yeniden diyorum cunku ...response.data yaptigimizda eski tweetleri zaten almistik). once eski tweetleri yeniden koyuyoruz daha sonra responsetan gelen tweetleri ekliyoruz
                }))
            } catch (error) {

            }
        }


        loadTwits();
    }, [username])// koseli parantex verirsek sadece mount aninda calisir, hicbirsey vermezsek surekli istekte bulunur.Koseli parantez ici deger verirsek o deger degistikce guncellenir



    const loadOldTwits = async () => { //Load old twits butonuna basilinca gelen userlar burdan gelir

        const response = await getOldTwits(lastTwitId, username); // verdigimiz id den kucuk olanlar yuklenir. Yani eski tweetler yuklenir
        setTwitPage(previousTwitPage => ({
            ...response.data,
            content: [...previousTwitPage.content, ...response.data.content]
        }))

    }

    const loadNewTwites = async () => {
        
        const response = await getNewTwits(firstTwitId,username);
        setTwitPage(previousTwitPage => ({
            ...previousTwitPage,
            content: [ ...response.data, ...previousTwitPage.content]// normalde ...response.data.content kullanirken burada ...response.data kullandik cunku getNewTwits response olark list dener Page degil
        }))
    }

    if (twitPage.content.length === 0) {
        return <div className="alert alert-secondary text-center"> There are no tweets</div>
    }

    return (
        <div>
            {newTwitCount>0 &&  <div className="alert alert-secondary text-center" style={{ cursor: 'pointer' }}  onClick={() => loadNewTwites()}> Load new tweets</div>}
            {twitPage.content.map(twit => {
                return <TwitView key={twit.id} twit={twit} />
            })}
            {!twitPage.last &&
                <div className="alert alert-secondary text-center" style={{ cursor: 'pointer' }} onClick={() => loadOldTwits()}> Load old tweets</div>
            }
        </div>
    )
}

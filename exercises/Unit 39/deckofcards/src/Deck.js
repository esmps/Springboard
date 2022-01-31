import {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";
import './Deck.css'

const API_BASE_URL = 'http://deckofcardsapi.com/api/deck';

function Deck(){
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    
    useEffect(() => {
        async function getDeck(){
            const deck = await axios.get(`${API_BASE_URL}/new/shuffle`);
            setDeck(deck.data)
        }
        getDeck();
    }, [setDeck]);

    useEffect(() => {
        async function getCard(){
            const {deck_id} = deck;
            try{
                const drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);
                console.log(drawRes.data)
                if (drawRes.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error("No more cards!");
                }
                const card = drawRes.data.cards[0];
                setCards((d) => [...d, {id: card.code, name: card.suit + " " + card.value, image: card.image }]);
            }catch(err){
                alert(err);
            }
        }
        //if autoDraw is true!
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
      };
    
    const listOfCards = cards.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));
    
    return (
        <div className="Deck">
        {deck ? 
            ( <button className="Deck-btn" onClick={toggleAutoDraw}>
                {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
            </button>)
            : <p>Loading deck...</p>
        }
        <ul className="Deck-cardarea">
            { listOfCards }
        </ul>
        </div>
    )
}

export default Deck;
const baseURL = 'http://deckofcardsapi.com/api/deck/new';


// Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. 
// Once you have the card, console.log the value and the suit 
// (e.g. “5 of spades”, “queen of diamonds”).

const oneCardURL = `${baseURL}/draw/?count=1`;

async function getOneCard(){
    const res = await axios.get(oneCardURL);
    console.log(`${res.data.cards[0].value.toLowerCase()} of ${res.data.cards[0].suit.toLowerCase()}`)
};
getOneCard();

// Make a request to the deck of cards API to request a single card from a newly shuffled deck. 
// Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.

async function getTwoCard(){
    const res = await axios.get(`${baseURL}/draw/?count=2`);
    for(const card in res.data.cards){
        console.log(`${res.data.cards[card].value.toLowerCase()} of ${res.data.cards[card].suit.toLowerCase()}`);
    };
};
getTwoCard();

// Build an HTML page that lets you draw cards from a deck. 
// When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. 
// Every time you click the button, display a new card, until there are no cards left in the deck.

const $button = $("button");
const $deckArea = $("#deck-area");

async function getCards(){
    const newDeck = await axios.get(`${baseURL}/shuffle`);
    const deckID = newDeck.data.deck_id;
    $button.on('click', async function() {
        const res = await axios.get(`http://deckofcardsapi.com/api/deck/${deckID}/draw`);
        const cardImage = res.data.cards[0].image;
        const angle = Math.random() * 90 - 45;
        const randomX = Math.random() * 40 - 20;
        const randomY = Math.random() * 40 - 20;
        $deckArea.append(
            $('<img>', {
                src: cardImage,
                css: {
                    transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
                }
            })
        );
        if (res.data.remaining === 0){
            $button.remove();
        };
    });
};
getCards();
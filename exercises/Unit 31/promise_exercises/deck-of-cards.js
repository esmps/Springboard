const baseURL = 'http://deckofcardsapi.com/api/deck/new';


// Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. 
// Once you have the card, console.log the value and the suit 
// (e.g. “5 of spades”, “queen of diamonds”).

const oneCardURL = `${baseURL}/draw/?count=1`;

const getOneCard = axios.get(oneCardURL);

getOneCard.then(data => {
    console.log(`${data.data.cards[0].value.toLowerCase()} of ${data.data.cards[0].suit.toLowerCase()}`);
});

// Make a request to the deck of cards API to request a single card from a newly shuffled deck. 
// Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.

const getTwoCard = axios.get(`${baseURL}/draw/?count=2`);

getTwoCard.then(data => {
    for(let card of data.data.cards){
        console.log(`${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);
    };
});


// Build an HTML page that lets you draw cards from a deck. 
// When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. 
// Every time you click the button, display a new card, until there are no cards left in the deck.

const getNewDeck = axios.get(`${baseURL}/shuffle`);
let deckID;
const $button = $("button")
const $deckArea = $("#deck-area")

getNewDeck.then(data => {
    deckID = data.data.deck_id;
});

$button.on('click', function(){
    axios.get(`http://deckofcardsapi.com/api/deck/${deckID}/draw`).then(data => {
        card = data.data.cards[0];
        let cardImage = card.image;
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
        if (data.data.remaining === 0){
            $button.remove();
        };
    })
})
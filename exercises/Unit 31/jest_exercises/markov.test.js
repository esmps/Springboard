const { MarkovMachine } = require('./markov')

describe("Markov Class", function (){

    let mm;
    const text = "I do not like them in a house. I do not like them with a mouse.";

    beforeEach(() => {
        mm = new MarkovMachine(text);
    });

    test('Make Chains', function(){
        const words = text.split(" ");
        expect(words).toEqual(mm.words);
        console.log(mm.chains);
        expect(mm.chains.get('a')).toEqual(['house.', 'mouse.']);
        expect(mm.chains.get('I')).toEqual(['do', 'do']);
        expect(mm.chains.get('like')).toEqual(['them', 'them']);
        expect(mm.chains.get('mouse.')).toEqual([null]);
    });

    test('Generate Text', function(){
        const genText = mm.makeText(8);
        const wordArr = genText.split(" ");
        expect(wordArr.length).toBeGreaterThan(0);
        expect(wordArr.length).toBeLessThanOrEqual(8);
    });
})
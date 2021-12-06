/** Textual markov chain generator */
class MarkovMachine {

  /** build markov machine; read in text.*/
  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  };

  /** set markov chains:*/
  makeChains() {
    let chains = new Map();

    for (let i = 0; i < this.words.length; i++){
      const word = this.words[i];
      const nextWord = this.words[i + 1] || null;

      if (chains.has(word)){
        chains.get(word).push(nextWord);
      }
      else{
        chains.set(word, [nextWord]);
      }
    }
    this.chains = chains;
    console.log(this.chains);
  };

  static randomKey(arr){
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  };

  /** return random text from chains */
  makeText(numWords = 100) {
    const keys = Array.from(this.chains.keys());
    let key = MarkovMachine.randomKey(keys);
    let output = [];
    while (key && output.length < numWords){
      output.push(key);
      key = MarkovMachine.randomKey(this.chains.get(key));
    }
    return output.join(" ");
  };
};

module.exports = {MarkovMachine};
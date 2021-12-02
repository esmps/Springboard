class BoggleGame {
    constructor(boardId, seconds = 60){
        this.seconds = seconds;

        this.words = new Set();
        this.score = 0;
        this.board = $("#" + boardId)

        this.timer = setInterval(this.countdown.bind(this), 1000)

        $("#play-again", this.board).hide()
        $("#check-word", this.board).on("submit", this.handleSubmitWord.bind(this));
    }

    showMessage(msg, cls) {
        $(".msg", this.board).text(msg).removeClass().addClass(`msg ${cls}`);
      }
    
    showScore() {
        $(".score", this.board).text(this.score);
      }

    showWord(word) {
        $(".guesses", this.board).append($("<li>", { text: word }));
      }

    async handleSubmitWord(evt){
        evt.preventDefault();

        const $word = $(".guess", this.board);

        let word = $word.val();

        if (!word) return
        else if (this.words.has(word)){
            this.showMessage(`Already has ${word}. Try again!`, "err")
            return;
        }
        const res = await axios.get("/check-word", { params: {guess: word } });

        if (res.data.result === 'not-a-word'){
            this.showMessage(`"${word}" is not a word. Try again!`, "err")
        }
        else if (res.data.result === 'not-on-board'){
            this.showMessage(`"${word}" is not on the board. Try again!`, "err")
        }
        else{
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: "${word}"`, "ok")
        }
        $word.val("").focus();
    }

    showTimer() {
        $("#timer", this.board).text(this.seconds);
    }

    async countdown(){
        this.seconds -= 1;
        this.showTimer();

        if (this.seconds === 0){
            clearInterval(this.timer);
            await this.endGame();
        }
    }

    async endGame(){
        $("#check-word", this.board).hide();
        const res = await axios.post("/end-game", { score: this.score });

        if (res.data.brokeRecord){
            this.showMessage(`New Record: ${this.score}`, "ok");
        }
        else{
            this.showMessage(`Final Score: ${this.score}`, "ok");
        }
        $("#play-again", this.board).show()
    }

}

let game = new BoggleGame("boggle", 60);

const cards = document.querySelectorAll(".card");
const modal = document.querySelector("modal");
const newGame = modal.querySelector(".new-game");

let turnedCard = false;
let blockBoard = false;
let timerGame = null;
let time = null;
let firstCard, secondCard;


function flipCard() {
    if(!timerGame) startGame();
    if(blockBoard) return; //blocca l'esecuzione della funzione
    if (this === firstCard) return; //per impedire che venga cliccata 2 volte la stessa carta
    
    this.classList.add('flip');

    if (!turnedCard) {
        turnedCard = true;
        firstCard = this; // = prima carta cliccata
        return; //blocca l'esecuzione della funzione
    } else {
        secondCard = this;
        turnedCard = false;
        checkEquality();
    }
}



//verifica se le carte girate hanno stesso data-person
function checkEquality() {
    let equality = firstCard.dataset.person === secondCard.dataset.person;
    equality ? disableCard() : turnCards();
}

//se c'è corrispondenza lascia le carte girate con l'immagine
function disableCard() {
    //elimina l'evento
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    allCardsTurned();
}

//rigira carte se non c'è corrispondenza
function turnCards() {
    blockBoard = true;
    setTimeout(()=>{
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    },1500)
}

function resetBoard() {
    //reset dei valori con il destructuring degli array
    [turnedCard, blockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function allCardsTurned() {
    const flippedCards = document.querySelectorAll(".flip").length;
    if (flippedCards === 12) {
        const body = document.body;
        const party = new JSConfetti({body});
        party.addConfetti();
        modal.removeAttribute('hidden');
        body.classList.add('win');
        clearInterval(timerGame); //ferma il timer
        saveGame();
    }
}

//Impostazioni timer di gioco
function startGame() {
    const secondsHtml = document.querySelector('.timer__secondi');
    const minutesHtml = document.querySelector('.timer__minuti');
    const startTime = Date.now();
    
    timerGame = setInterval(()=> {
        const now = Date.now();
        const pastTime = now - startTime;
        time = new Date(pastTime);
        secondsHtml.innerText = 
            `${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}`;
        minutesHtml.innerText = 
            `${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    }, 1000);

}

function saveGame() {
    const username = prompt('Inserisci il nome del giocatore');
    const classifica = JSON.parse(localStorage.getItem('classifica')) || [];
    classifica.push({username:username, tempo: new Intl.DateTimeFormat('it', {
        minute: 'numeric', second:'numeric'
    }).format(time)});
    //Traformiamo array classifica in stringa
    localStorage.setItem('classifica', JSON.stringify(classifica))
}


(function shuffleCards() {
    cards.forEach(card => {
        const position = Math.floor(Math.random() * 12);
        card.style.order = position;
    })
})();



cards.forEach(card => card.addEventListener("click", flipCard));

//click sul bottone nuova partita ricarica la pagina e si attiva shuffleCards()
newGame.addEventListener('click', () => location.reload());


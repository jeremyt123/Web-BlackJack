var playerHand = [];
var playerCardSum = 0;
var compHand = [];
var compCardSum = 0;
var money = 100;
var betAmount = 0;

function hit() {
    var path = newCard(1);
    var cardPic = document.createElement("img");
    cardPic.src = path;
    cardPic.className = "playerCard"
    document.body.append(cardPic);
    bustCheck();
}

//used to draw a new card 
//returns the link to the cards image
//param hand for specifing what hand to put card in 1 == player
function newCard(hand) {
    var path = "Cards/card";
    var card = "";

    //sets suit based on random 1-4 number
    var suit = Math.floor(Math.random() * 4) + 1;
    switch(suit) {
        case 1:
            path += "Clubs";
            break;
        case 2:
            path += "Hearts";
            break;
        case 3:
            path += "Diamonds";
            break;
        case 4:
            path += "Spades";
            break;
        default:
            break;
    }

    //sets number of card based on random number
    var number = Math.floor(Math.random() * 13) + 1;
    switch(number) {
        case 1:
            path += "A";
            card += "A";
            break;
        case 11:
            path += "J";
            card = "10";
            break;
        case 12:
            path += "Q";
            card = "10";
            break;
        case 13:
            path += "K";
            card = "10";
            break;
        default:
            path += number;
            card = number;
            break;
    }
    path += ".png";

    //adds card to either player or computer hand
    if (hand == 1) {
        playerHand.push(card);
    } else {
        compHand.push(card);
    } 
    return path;
}
//checks if the player has blackjack or has busted
function bustCheck() {
    playerCardSum = 0;
    //this sort fixes a problem with Aces being counted as 11 when they should be 1s (sends them to the end of the array)
    playerHand.sort();
    for (var i = 0; i < playerHand.length; i++) {
        if (playerHand[i] == "A" && (playerCardSum + 11) > 21) {
            playerCardSum += 1;
        } else if (playerHand[i] == "A") {
            playerCardSum += 11;
        } else {
            playerCardSum += parseInt(playerHand[i]);
        }
    }
    //removes hit button if bust
    if (playerCardSum >= 21) {
        document.getElementById("hitButton").disabled = true;
    }
}

//resets player and computer hands
function reset() {
    playerHand = [];
    compHand = [];
    playerCardSum = 0;
    compCardSum = 0;

    var playersCards = document.getElementsByClassName("playerCard");
    while (playersCards.length > 0) {
        playersCards[0].parentNode.removeChild(playersCards[0]);
    }

    var computersCards = document.getElementsByClassName("compCard");
    while (computersCards.length > 0) {
        computersCards[0].parentNode.removeChild(computersCards[0]);
    }

    var remove = document.getElementsByClassName("remove");
    while (remove.length > 0) {
       remove[0].parentNode.removeChild(remove[0]); 
    }

    var blank = document.getElementsByClassName("blankCard");
    while (blank.length > 0) {
        blank[0].parentNode.removeChild(blank[0]);
    }

    
    document.getElementById("hitButton").disabled = false;
}

//starts a new game and gets the computers first card
function newGame(){
    reset();
    //used for settings players sum for first 2 cards and for instant blackjack
    bustCheck();

    var header = document.createElement("h1");
    header.innerText = "Computers Hand";
    header.className = "remove"
    document.body.append(header);

    var path = newCard(0);

    var cardPic = document.createElement("img");
    cardPic.src = path;
    cardPic.className = "compCard"
    cardPic.id = "compCard"
    document.body.append(cardPic);
    
    var blankCard = document.createElement("img");
    blankCard.src = "Cards/cardBack_blue2.png";
    blankCard.className = "blankCard";
    document.body.append(blankCard);

    var header = document.createElement("h1");
    header.innerText = "Players Hand";
    header.className = "remove"
    document.body.append(header);
    hit();
    hit();

    document.getElementById("standButton").disabled = false;
    document.getElementById("newGameButton").disabled = true;
    document.getElementById("betButton").disabled = true;
}

//player stands, computer finishes turn and winner is chosen
function stand() {
    var compDone = false;
    var compHandLocation = document.getElementById("compCard");
 
    if (compHand[0] != "A") {
        compCardSum += parseInt(compHand[0]);
    } else {
        compCardSum += 11;
    }
    

    while (!compDone) {
                    
        if (compCardSum < 16) {
            var cardPic = document.createElement("img");
            cardPic.src = newCard(0);
            cardPic.className = "compCard"
            //puts the cards after the last one
            compHandLocation.parentNode.insertBefore(cardPic, compHandLocation.nextSibling);
            compHandLocation = cardPic;

            var blank = document.getElementsByClassName("blankCard");
            while (blank.length > 0) {
                blank[0].parentNode.removeChild(blank[0]);
            }

            if (compHand[compHand.length - 1] == "A" && (compCardSum + 11) > 21) {
                compCardSum += 1;
            } else if (compHand[compHand.length - 1] == "A") {
                compCardSum += 11;
            } else {
                compCardSum += parseInt(compHand[compHand.length - 1]);
            }

        } else {
            //fixes problem of aces being counted as 11 when they should be 1
            compHand.sort();
            var compHandCheck = 0;
            for (var i = 0; i < compHand.length; i++) {
                if (compHand[i] == "A" && (compHandCheck + 11) > 21) {
                    compHandCheck += 1;
                } else if (compHand[i] == "A") {
                    compHandCheck += 11;
                } else {
                    compHandCheck += parseInt(compHand[i]);
                }
                
            }
            if (compHandCheck >= 16) {
                compDone = true;
            }
        }
    }

    document.getElementById("standButton").disabled = true;
    document.getElementById("hitButton").disabled = true;

    var pResult = document.createElement("h4");
    pResult.innerText = "Players Hand = " + playerCardSum;
    pResult.className = "remove"
    document.body.append(pResult);

    var cResult = document.createElement("h4");
    cResult.innerText = "Computers Hand = " + compCardSum;
    cResult.className = "remove"
    document.body.append(cResult);

    var winner = document.createElement("h4");
    winner.innerText = "Winner: " + checkWinner();
    winner.className = "remove"
    document.body.append(winner);

    if (checkWinner() == "Player" && betAmount > 0) {
        money += parseInt(betAmount * 2);
    } else if (checkWinner() == "Tie" && betAmount > 0) {
        money += parseInt(betAmount * 1);
    }
    document.getElementById("money").innerHTML = "Money: " + money; 

    betAmount = 0;
    document.getElementById("bet").innerHTML = "Current Bet: " + betAmount;

    document.getElementById("betButton").disabled = false;
    document.getElementById("newGameButton").disabled = false;

}

function checkWinner() {
    if (playerCardSum > 21 && compCardSum > 21) {
        return "Tie";
    } else if (playerCardSum > 21 && compCardSum <= 21) {
        return "Computer";
    } else if (playerCardSum <= 21 && compCardSum > 21) {
        return "Player";
    }

    if (playerCardSum > compCardSum) {
        return "Player";
    } else if (compCardSum > playerCardSum) {
        return "Computer";
    } else {
        return "Tie";
    }
}

//function for betting money
function bet() {
    betAmount = document.getElementById("betBox").value;
    
    //checks to make sure bet is valid
    if (isNaN(betAmount)) {
        alert("please enter a number");
        return;
    } else if (betAmount > money) {
        alert("not enough money for bet");
        return;
    } else if (betAmount < 1) {
        alert("bet must be above 0");
        return;
    } else if (betAmount % 1 != 0) {
        alert("bet must be a whole number");
        return;
    }

    document.getElementById("betBox").value = "";

    money -= betAmount;
    document.getElementById("money").innerHTML = "Money: " + money;
    document.getElementById("bet").innerHTML = "Current Bet: " + betAmount;
    document.getElementById("betButton").disabled = true;
}
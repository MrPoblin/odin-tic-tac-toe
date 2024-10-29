const GameBoard = (function(){
    let cells;
    resetCells = () =>{
        cells = [
            '', '', '',
            '', '', '',
            '', '', ''
        ];
    };
    checkWinner = () => {
        if(
            (cells[0] === cells[1] &&  cells[0] === cells[2]) ||
            (cells[0] === cells[4] &&  cells[0] === cells[8]) ||
            (cells[0] === cells[3] &&  cells[0] === cells[6])
        ){
            return cells[0];
        }
        else if(
            (cells[4] === cells[1] &&  cells[4] === cells[7]) ||
            (cells[4] === cells[3] &&  cells[4] === cells[5])
        ){
            return cells[4];
        }
        else if(
            (cells[8] === cells[5] &&  cells[8] === cells[2]) ||
            (cells[8] === cells[7] &&  cells[8] === cells[6])
        ){
            return cells[8];
        }
        else if(cells[2] === cells[4] &&  cells[2] === cells[6]){
            return cells[2];
        }
        return null;
    };
    getCell = (location) =>{
        return cells[location];
    };
    setCell = (location, symbol) =>{
        cells[location] = symbol;
    };
    isFull = ()=>{
        return cells.every(value => value != '');
    };
    return{resetCells, checkWinner, getCell, setCell, isFull};
})();

const Game = (function(){
    let turn = true;
    let isOn = false;
    let round = 0;
    const placeSymbol = (location)=>{
        if (isOn){
            if(!GameBoard.getCell(location)){
                if(turn){
                    DisplayController.displaySymbol(player1.symbol, location);
                    GameBoard.setCell(location, player1.symbol);
                }
                else{
                    DisplayController.displaySymbol(player2.symbol, location);
                    GameBoard.setCell(location, player2.symbol);
                }
                turn = !turn;
                let winner = GameBoard.checkWinner();
                if(winner){
                    if(player1.symbol == winner){
                        player1.win();
                        isOn = false;
                        DisplayController.displayWinner(player1.name);
                    }
                    else if(player2.symbol == winner){
                        player2.win();
                        isOn = false;
                        DisplayController.displayWinner(player2.name);
                    }
                }
                else if (GameBoard.isFull()){
                    DisplayController.displayWinner(null);
                }
            }
        }
    };
    startGame = ()=>{
        GameBoard.resetCells();
        DisplayController.clearCells();
        player1.name = InputManager.getPlayerName(0);
        player2.name = InputManager.getPlayerName(1);
        if(round){
            DisplayController.showScores(player1, player2);
        }
        DisplayController.clearWinner();
        isOn = true;
        turn = true;
        round++;
    };
    return {placeSymbol, isOn, startGame};
})();

const InputManager = (function(){
    const player1Field = document.querySelector(".player1");
    const player2Field = document.querySelector(".player2");
    const getPlayerName = (player)=>{
        if(player){
            return player2Field.value;
        }
        else{
            return player1Field.value;
        }
    };
    const start = document.querySelector(".start");
    start.addEventListener("click", Game.startGame);
    const gameButtons = document.querySelectorAll(".game-button").forEach((button) =>{
        button.addEventListener("click", (e) => {
            Game.placeSymbol(e.srcElement.dataset.button);
        })
    });
    return {getPlayerName};
})();

const DisplayController = (function(){
    const gameButtons = document.querySelectorAll(".game-button");
    const clearCells = ()=>{gameButtons.forEach((button)=>{
        button.textContent = "";
    })};
    const displaySymbol = (symbol, location)=>{
        gameButtons[location].textContent = symbol;
    };
    const winnerDiv = document.querySelector(".winner")
    const winnerText = document.createElement("h3");
    displayWinner = (winner)=>{
        if(winner){
            winnerText.textContent = `${winner} won!`;
            winnerDiv.appendChild(winnerText);
        }  
        else{
            winnerText.textContent = `A tie!`;
            winnerDiv.appendChild(winnerText);
        }
    };
    clearWinner = ()=>{
        if(winnerDiv.hasChildNodes()){
            winnerDiv.removeChild(winnerDiv.firstChild);
        }
    }
    showScores = (p1, p2)=>{
        const scoreDiv = document.querySelector(".scores");
        while(scoreDiv.hasChildNodes()){
            scoreDiv.removeChild(scoreDiv.firstChild);
        }
        const p1Score = document.createElement("p");
        p1Score.textContent = `${p1.name} score: ${p1.getScore()}`;
        scoreDiv.appendChild(p1Score);
        const p2Score = document.createElement("p");
        p2Score.textContent = `${p2.name} score: ${p2.getScore()}`;
        scoreDiv.appendChild(p2Score);
    }
    return {clearCells, displaySymbol, displayWinner, clearWinner, showScores};
})();

function createPlayer(name, symbol){
    let score = 0;
    getScore = ()=>{return score};
    win = ()=>{return score++};
    return {name, symbol, getScore, win};
}

const player1 = createPlayer("", "X");
const player2 = createPlayer("", "O");







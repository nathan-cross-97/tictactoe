

// Gameboard, represents the state of the board

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //create a 2d array
    //for this 2d array, row 0 with represent top row, column 0 will respresent left most column

    for (let i = 0; i < rows; i++){
        board[i] = []
        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeXorO = (row, columns, player) => {
        // check value at board position, if its 1 or 2 return as it is not valid, if it is 0, you can place
        const available = board[row][columns].getValue();

        if(available) return;
        board[row][columns].addToken(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    return { getBoard, placeXorO, printBoard } 
}


//Cell is one square, can be empty 0, have an X, 1, or have an O 2

function Cell() {
    let value = 0;
    
    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {addToken, getValue}

}


// Game contorller, responsible for controlling the game

function GameController(playerOneName = "Player One", playerTwoName = "Player Two"){
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'X' // X 
        },
        {
            name: playerTwoName,
            token: 'O' // 0
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(`Place X from ${getActivePlayer().name} into row ${row} and ${column}...`);
        board.placeXorO(row, column, getActivePlayer().token);

        
        switchPlayerTurn();
        printNewRound();
    }
    return { playRound, getActivePlayer, getBoard: board.getBoard }

}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        //clear board
        boardDiv.textContent = "";

        //get newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        //
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, index_row) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.column = index;
                cellButton.dataset.row = index_row;
                if(!(cell.getValue() === 0)){
                    cellButton.textContent = cell.getValue();
                }
                boardDiv.appendChild(cellButton);
            })
        })
    }


    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        //make sure you click on a row/column
        if(!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);


    updateScreen();
}


ScreenController();



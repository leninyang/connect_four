console.log('connect four js file connected!');


//======================================
 // Event Listeners -- within window onload
//======================================
$(function() {
//======================================
  // Grab Elements
//======================================
var $resetButton = $('#resetButton');

$resetButton.on('click', UI.clearBoard) // Event listener for the reset button.

Game.start();
UI.generateBoard();
}); // end window onload



//======================================
 // Data and app Logic
//======================================
var Game = {
  player1: 1,
  player2: 2,
  score1: 0, // Player 1 score
  score2: 0, // Player 1 score
  hasWon: false,
  totalChipsPlayed: 0, // Keeps count of total chips in play.
  whosTurn: 'Player 1',
  boardArray: [[],[],[],[],[],[],[]], // Array that holds players values
  start: function() {
    $('#yellowContainer').css('border-bottom', '0'); // Remove line from yellow player
    $('#redContainer').css('border-bottom', '4px solid white'); // Remove line from yellow player
    Game.score1 = 0;
    Game.score2 = 0;
    Game.hasWon = false;
    Game.totalChipsPlayed = 0;
    UI.updateScore();
    Game.whosTurn = 'Player 1';
    Game.boardArray = [[],[],[],[],[],[],[]]; // resets the boardArray
  },
  playerTurn: function() { // Function that determines player turn
    if (Game.whosTurn === 'Player 1') {
      Game.whosTurn = 'Player 2'
      $('#redContainer').css('border-bottom', '0') // Removes line from red player
      $('#yellowContainer').css('border-bottom', '4px solid white') // Add line to yellow player
      // $('#redPlayer').css('border-bottom', 'white')
    } else if (Game.whosTurn === 'Player 2') {
      Game.whosTurn = 'Player 1'
      $('#yellowContainer').css('border-bottom', '0') // Removes line from yellow player
      $('#redContainer').css('border-bottom', '4px solid white') // Add line to red player
    }
  },
  checkForWinner: function($col, $row, hVector, vVector, numberOfWinningChips, whichPlayer) { //vector - direction where check is coming from.
    if(numberOfWinningChips === 5 && !Game.hasWon) { // Bcuz starting at 1
      if (whichPlayer === Game.player1) {
        $('#displayBoard').text('Player 1 has won!')
        Game.score1++ // Each time Red wins add 1
        UI.updateScore(); // Calls update score method
        // UI.nextRound(); // Play next round
        setTimeout(function() {
          UI.nextRound()
          $('#displayBoard').text('Click on any column to drop your chip!')
        },2500);
        Game.playerTurn();

      } else {
        $('#displayBoard').text('Player 2 has won!')
        Game.score2++
        setTimeout(function() {
          UI.nextRound()
          $('#displayBoard').text('Click on any column to drop your chip!')
        },2500);
        Game.playerTurn();
      }
      Game.hasWon = true;
      return;
    };
    if ($col >= 0 && $row >= 0 && $col <= 6 && $row <= 5) { //Make sure the column and row index are within the Game.boardArray
      if (Game.boardArray[$col][$row] === whichPlayer) {
        if (numberOfWinningChips === 1) {
          // 1) Checking for all possible directions
          Game.checkForWinner($col+1, $row, 1, 0, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col-1, $row, -1, 0, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col+1, $row+1, 1, 1, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col-1, $row+1, -1, 1, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col+1, $row-1, 1, -1, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col-1, $row-1, -1, -1, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col, $row+1, 0, 1, numberOfWinningChips+1, whichPlayer);
          Game.checkForWinner($col, $row-1, 0, -1, numberOfWinningChips+1, whichPlayer);
        } else {
          // Depending on current number of winning chips, check only the specific vector direction defined by hVector and vVector. | Checking for next chip in continual direction
          Game.checkForWinner($col+hVector, $row+vVector, hVector, vVector, numberOfWinningChips+1, whichPlayer);
          // Because a four in a row might not be sequential i.e 1, 2, 3. Need to check along the opposite direction.
          //This can be done by multiplying the negative chip count value with the vector value.
          Game.checkForWinner($col-numberOfWinningChips*hVector, $row-numberOfWinningChips*vVector, hVector, vVector, numberOfWinningChips+1, whichPlayer);

        };
        if (Game.totalChipsPlayed === 42) { // Checks if all spaces have been filled
          $('#displayBoard').text("You've ended with a tie!")
          setTimeout(function() {
            UI.nextRound()
            $('#displayBoard').text('Click on any column to drop your chip!')
          },2500);
        }
      }
    }
  }
};

//======================================
 // Function that affect the DOM
//======================================
var UI = {
  generateBoard: function() { // Method that Generates the board
    var colNum = 7; // var with # of columns
    // var rowNum = 6; // var with # of rows
    var rowNum = 0;
    var $column = $('<div>')
    for (var i = 0; i < colNum ; i++) { // Loop that generates 7 Columns and 6 Rows
      var $column = $('<div>').addClass('Columns').attr('id', 'Column '+[i]);
      $('#boardContainer').append($column);
      // for (var j = 0; j < rowNum; j++) {
      for (var j = 5; j >= 0; j--) {
        var $squares = $('<div>').addClass('emptySquares').attr('id', "C" + [i] + 'Row' + [j]);
        $squares.attr('col', i); // Adding Col[i] into div ID
        $squares.attr('row', j); // Adding Row[j] into div ID
        $column.append($squares); // Appends squares to the column
        $squares.on('click', UI.addChip) // Event listener for each square being clicked

      }
    }
  },
  updateScore: function() {
    $('#scoreBoard').html(Game.score1 + "-" + Game.score2) // Adds new score value to DOM
  },
  addChip: function() {
    var $col = parseInt($(this).attr('col')); // Grabbing and converting column[i] into a integer
    // console.log($col);
    var discColor; // Variable to change disc color
    var whichPlayer; // var to determine which player to check to win | A parameter for checkForWinner()
    var $row = Game.boardArray[$col].length; // Determine next lowest row inside column through the boardArray
    var $colRow = $('#C'+$col+'Row'+$row); // Grabbing Column and row ID through concatination.
    if (Game.whosTurn === 'Player 1' && $(this).attr("class") === "emptySquares" && Game.hasWon === false) { // Checks for Player 1's turn & empty squares & if game has been won
      var $square = $colRow.attr('class','filledSquares');
      var $disc = $('<div>').addClass('disc'); // Creating chip div and assining disc class.
      discColor = 'redDisc'; // Change disc color to red
      Game.boardArray[$col].push(Game.player1); // Push value of 1 into boardArray
      whichPlayer = Game.player1;  // parameter to pass to checkForWinner
      $disc.attr('class', discColor); // Add discColor class to div
      $square.html($disc); // Adds disc div inside squares
      Game.totalChipsPlayed++ // Adds 1 each time a chip is added
      Game.playerTurn(); // Switch players turn
    } else if (Game.whosTurn === 'Player 2' && $(this).attr("class") === "emptySquares" && Game.hasWon === false) { // Checks for Player 2's turn & empty squares & if game has been won
      var $square = $colRow.attr('class','filledSquares');
      var $disc = $('<div>').addClass('disc'); // Creating chip div and assigning class of disc.
      discColor = 'yellowDisc'; // Change disc color to yellow
      Game.boardArray[$col].push(Game.player2); // Pushes value of 2 into boardArray
      whichPlayer = Game.player2; // parameter to pass to checkForWinner
      $disc.attr('class', discColor); // Add discColor class to div
      $square.html($disc); // Adds disc div inside squares
      Game.totalChipsPlayed++ // Chip Counter | Adds 1 each time a chip is added
      Game.playerTurn(); // Switch players turn
    }
    Game.checkForWinner($col, $row, 0, 0, 1, whichPlayer); // Passing col and row parameters
    //
    // console.log(Game.boardArray);
    // console.log(Game.totalChipsPlayed);
  },
  nextRound: function() { // Method that clears the board.
    var $squares = $('.filledSquares')
    $squares.empty(); // Empties content of squares
    $squares.attr('class', 'emptySquares') // Adds emptySquares class back
    Game.boardArray = [[],[],[],[],[],[],[]]; // Resets board array
    Game.hasWon = false; // reset boolean after game has been won
    Game.whosTurn = "Player 1"
    Game.totalChipsPlayed = 0;
  },
  clearBoard: function() { // Method that resets the game.
    var $squares = $('.filledSquares')
    $squares.empty(); // Empties content of squares
    $squares.attr('class', 'emptySquares') // Adds emptySquares class back
    Game.start();
  }
};

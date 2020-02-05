var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER2_IMG = '<img src"img/gamer-purple.png" />';
var GLUE_IMG = '<img src="img/glue.jpg" />';
var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gGameIsStop = false;
var gIsGameOver = false;
var gInterval;
var gBoard;
var gGamerPos;
var gScoreCnt = 0;
var gCreatedBall = 2;
var gHTwo = document.querySelector('h2');
var gElScore = document.querySelector('p');
var gCreateGlue;


function createGlue() {
	var i = getRndInteger(0, gBoard.length - 1);
	var j = getRndInteger(0, gBoard[0].length - 1);
	gBoard[i][j].gameElement = GLUE;
	renderCell({ i, j }, GLUE_IMG);
	var removeGlue = setTimeout(function () {
		gBoard[i][j].gameElement = null;
		renderCell({ i, j }, '');
	}, 3000);
}



function initGame() {
	gIsGameOver = false;
	gScoreCnt = 0;
	gCreatedBall = 2;
	gHTwo.innerText = '';
	gElScore.innerText = '';

	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gInterval = setInterval(createNewBallRnd, 2000);
	gCreateGlue = setInterval(createGlue, 5000);

}


function buildBoard() {
	// Create the Matrix
	// var board = createMat(10, 12)
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			if (i === 4 && j === 0 || i === 0 && j === 5 || i === 4 && j === 11 || i === 9 && j === 5) {
				cell.type = FLOOR;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To ES6 template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to short if statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gGameIsStop === true) return;
	

	if (i === 4 && j === -1) {
		i = 4;
		j = 11;
		renderMove(i, j);
	}
	if (i === -1 && j === 5) {
		i = 9;
		j = 5;
		renderMove(i, j);

	}
	if (i === 4 && j === 12) {
		i = 4;
		j = 0;
		renderMove(i, j);

	}
	if (i === 10 && j === 5) {
		i = 0;
		j = 5;
		renderMove(i, j);

	}

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;
	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			var sound = new Audio("/coin.mp3");
			sound.play();
			gScoreCnt++;
			gElScore.innerText = `Score: ${gScoreCnt}`;
			console.log('Collecting!');

		}
		
	if (targetCell.gameElement === GLUE) {
		gGameIsStop = true;
		// gBoard[i][j].gameElement = null;
		renderCell({ i, j }, GAMER2_IMG);
		setTimeout(function(){gGameIsStop=false},3000);
	}

		renderMove(i, j);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}
function renderMove(i, j) {
	// MOVING from current position
	// Model:
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	// Dom:
	renderCell(gGamerPos, '');

	// MOVING to selected position
	// Model:
	gGamerPos.i = i;
	gGamerPos.j = j;
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	// DOM:
	renderCell(gGamerPos, GAMER_IMG);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	if (!gIsGameOver || gGameIsStop) {
		switch (event.key) {
			case 'ArrowLeft':
				moveTo(i, j - 1);
				break;
			case 'ArrowRight':
				moveTo(i, j + 1);
				break;
			case 'ArrowUp':
				moveTo(i - 1, j);
				break;
			case 'ArrowDown':
				moveTo(i + 1, j);
				break;

		}
	}
}






// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}




function createNewBallRnd() {
	if (gScoreCnt === gCreatedBall) {
		gIsGameOver = true;
		clearInterval(gInterval);
		gHTwo.innerText = `You Win!!!`;
	}
	if (gCreatedBall >= 100) {
		gIsGameOver = true;
		clearInterval(gInterval);
		gHTwo.innerText = `You Lose!!!`;
	}



	var i = getRndInteger(0, gBoard.length - 1);
	var j = getRndInteger(0, gBoard[0].length - 1);
	while (gBoard[i][j].type !== FLOOR) {
		i = getRndInteger(0, gBoard.length - 1);
		j = getRndInteger(0, gBoard[0].length - 1);
	}

	gBoard[i][j].gameElement = BALL;
	renderCell({ i, j }, BALL_IMG);
	gCreatedBall++;

}




function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.tetris-grid');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-button');
    const nextBlockGrid = document.querySelector('.next-block-grid');
    const width = 10;
    const height = 20;
    let squares = [];
    let timerId;
    let score = 0;
    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * 7);
    let nextRandom = 0;

    // Create grid cells
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        gridContainer.appendChild(square);
        squares.push(square);
    }
    // Create the floor
    for (let i = 0; i < width; i++) {
        const square = document.createElement('div');
        square.classList.add('taken');
        gridContainer.appendChild(square);
        squares.push(square);
    }
    
    // Create next block grid
    let nextSquares = [];
    for (let i = 0; i < 16; i++) {
        const square = document.createElement('div');
        nextBlockGrid.appendChild(square);
        nextSquares.push(square);
    }


    // The Tetrominoes and their rotations
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];
    
    const jTetromino = [
        [0, 1, width + 1, width * 2 + 1],
        [width, width + 1, width + 2, width * 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [2, width, width + 1, width + 2]
    ];

    const sTetromino = [
        [width, width + 1, 1, 2],
        [0, width, width + 1, width * 2 + 1],
        [width, width + 1, 1, 2],
        [0, width, width + 1, width * 2 + 1]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino, sTetromino];
    const tetrominoClasses = ['L', 'Z', 'T', 'O', 'I', 'J', 'S'];

    let current = theTetrominoes[random][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add(tetrominoClasses[random]);
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove(tetrominoClasses[random]);
        });
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            newTetromino();
        }
    }
    
    function newTetromino() {
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        const originalRotation = currentRotation;
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        
        // Check for collision after rotation
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (isAtLeftEdge && isAtRightEdge) {
             // This check helps prevent some complex rotation bugs near edges
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentRotation = originalRotation; // Revert rotation if it collides
            current = theTetrominoes[random][currentRotation];
        }
        draw();
    }

    function control(e) {
        if (!timerId) return;
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keydown', control);

    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
        [0, 1, displayWidth + 1, displayWidth * 2 + 1], // jTetromino
        [width, width + 1, 1, 2] // sTetromino - this one is tricky to display
    ];

    function displayShape() {
        nextSquares.forEach(square => {
            square.className = '';
        });
        const nextTetromino = upNextTetrominoes[nextRandom] || upNextTetrominoes[0]; // Fallback for sTetromino
        nextTetromino.forEach(index => {
            nextSquares[displayIndex + index].classList.add(tetrominoClasses[nextRandom]);
        });
    }

    function addScore() {
        for (let i = 0; i < height * width; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].className = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => gridContainer.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over';
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener('keydown', control);
        }
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            startBtn.innerHTML = "Resume";
        } else {
            startBtn.innerHTML = "Pause";
            draw();
            timerId = setInterval(moveDown, 1000);
            if(nextRandom === 0) {
               nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            }
            displayShape();
            document.addEventListener('keydown', control);
        }
    });
});
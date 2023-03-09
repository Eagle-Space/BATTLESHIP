const BOARD_SIZE = 6;
const board = document.getElementById("board");
const cells = [];

let ships = [];
let numShipsSunk = 0;

function createBoard() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-x", i);
      cell.setAttribute("data-y", j);
      cell.addEventListener("click", handleCellClick);
      cells.push(cell);
      board.appendChild(cell);
    }
  }
}

function placeShips() {
    fetch("http://localhost:8080/ships.json")
    .then((response) => response.json())
    .then((json) => {
      ships = json.map((shipData) => {
        const ship = createShip(shipData.size, shipData.orientation);
        shipData.cells.forEach((cellData) => {
          const cell = getCell(cellData.x, cellData.y);
          cell.classList.add("ship");
          cell.ship = ship;
          ship.cells.push(cell);
        });
        return ship;
      });
    });
}

function createShip(size, orientation) {
  return {
    size,
    orientation,
    cells: [],
    hits: Array(size).fill(false),
  };
}

function getCell(x, y) {
  return cells.find((cell) => cell.getAttribute("data-x") == x && cell.getAttribute("data-y") == y);
}

let numGuesses = 0;

function handleCellClick(event) {
  const cell = event.target;
  if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
    return;
  }
  if (cell.ship) {
    cell.classList.add("hit");
    cell.ship.hits[getCellIndex(cell.ship, cell)] = true;
    if (isShipSunk(cell.ship)) {
      numShipsSunk++;
      if (numShipsSunk === ships.length) {
        alert("You won!");
      } else {
        alert("You sank a ship!");
      }
    } else {
      alert("Hit!");
    }
  } else {
    cell.classList.add("miss");
    alert("Miss!");
  }
  numGuesses++;
  if (numGuesses === 20) {
    alert("You have used up all your guesses!");
    cells.forEach(cell => cell.removeEventListener("click", handleCellClick));
  }
}

  
  

  function revealShips() {
    ships.forEach((ship) => {
      ship.cells.forEach((cell) => {
        if (!cell.classList.contains("sunk")) {
          cell.classList.add("ship");
        }
      });
    });
  }
  
  function resetBoard() {
    ships.forEach((ship) => {
      ship.cells.forEach((cell) => {
        cell.classList.remove("ship", "hit", "miss", "sunk");
        cell.ship = null;
      });
      ship.hits.fill(false);
    });
  
    ships = [];
    numShipsSunk = 0;
    remainingGuesses = 20;
  
    message.textContent = "";
    remainingGuessesText.textContent = remainingGuesses;
  }
  
  

function isShipSunk(ship) {
  return ship.hits.every((hit) => hit);
}

function getCellIndex(ship, cell) {
  return ship.orientation === "horizontal" ? cell.getAttribute("data-x") - ship.cells[0].getAttribute("data-x") : cell.getAttribute("data-y") - ship.cells[0].getAttribute("data-y");
}



createBoard();
placeShips();

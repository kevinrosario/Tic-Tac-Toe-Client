'use strict'

const store = require('./store.js')

const checkSquare = (position) => {
  if (store.game.cells[position] === '' && !(store.game.cells[position] === 'X' || store.game.cells[position] === 'O')) {
    store.game.cells[position] = store.xTurn ? 'X' : 'O'
    return store.game.cells[position]
  }
}

const checkWinning = () => {
  let horizontal = false
  let vertical = false
  let diagonal = false
  for (let i = 0; i < 3; i++) {
    if (store.game.cells[i] !== '' && (store.game.cells[i] === store.game.cells[i + 3] && store.game.cells[i] === store.game.cells[i + 6])) {
      vertical = true
    }
  }

  for (let i = 0; i < 9; i += 3) {
    if (store.game.cells[i] !== '' && (store.game.cells[i] === store.game.cells[i + 1] && store.game.cells[i] === store.game.cells[i + 2])) {
      horizontal = true
    }
  }
  if (store.game.cells[4] !== '' && ((store.game.cells[0] === store.game.cells[4] && store.game.cells[0] === store.game.cells[8]) ||
    (store.game.cells[6] === store.game.cells[4] && store.game.cells[6] === store.game.cells[2]))) {
    diagonal = true
  }
  return [horizontal, vertical, diagonal].indexOf(true)
}

const checkTie = () => {
  return store.game.cells.every((element) => !!element)
}

const computerChoice = () => {
  const random = () => {
    const num = Math.floor(Math.random() * (8 - 0 + 1)) + 0
    return num
  }
  let ran = random()

  while (store.game.cells[ran]) {
    ran = random()
  }
  return ran
}

const checkForOponent = (responseData) => {
  return responseData.game.player_o !== null
}

const checkForMove = (responseData) => {
  for (let i = 0; i < store.game.cells.length; i++) {
    if (responseData.game.cells[i] !== store.game.cells[i]) {
      return [i, responseData.game.cells[i]]
    }
  }
}
module.exports = {
  checkSquare,
  checkWinning,
  checkTie,
  computerChoice,
  checkForMove,
  checkForOponent
}

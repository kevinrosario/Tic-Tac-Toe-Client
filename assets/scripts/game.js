'use strict'

const store = require('./store.js')

const checkSquare = (dataId) => {
  if (!store.game.cells[dataId]) {
    store.xTurn = !store.xTurn
    store.game.cells[dataId] = store.xTurn ? 'X' : 'O'
    return store.xTurn ? 'X' : 'O'
  }
}

const checkWinning = () => {
  let horizontal = false
  let vertical = false
  let diagonal = false
  const arr = store.game.cells
  for (let i = 0; i < 3; i++) {
    if (arr[i] !== '' && (arr[i] === arr[i + 3] && arr[i] === arr[i + 6])) {
      vertical = true
    }
  }

  for (let i = 0; i < 9; i += 3) {
    if (arr[i] !== '' && (arr[i] === arr[i + 1] && arr[i] === arr[i + 2])) {
      horizontal = true
    }
  }
  if (arr[4] !== '' && ((arr[0] === arr[4] && arr[0] === arr[8]) ||
    (arr[6] === arr[4] && arr[6] === arr[2]))) {
    diagonal = true
  }
  return [horizontal, vertical, diagonal].indexOf(true)
}

const checkTie = () => {
  return store.game.cells.every((element) => !!element)
}

module.exports = {
  checkSquare,
  checkWinning,
  checkTie
}

'use strict'

const getFormFields = require('./../../lib/get-form-fields')
const api = require('./api.js')
const ui = require('./ui.js')
const game = require('./game.js')
const store = require('./store.js')

const onSignIn = (event) => {
  event.preventDefault()
  const formData = getFormFields(event.target)

  api.signIn(formData)
    .then((responseData) => {
      ui.onSignInSuccess(responseData)
      onCreateGame()
    })
    .catch(ui.onSignInFailure)
}

const onSignInAfterSignUp = (emailPassed, passwordPassed) => {
  const passedData = {
    credentials: {
      email: emailPassed,
      password: passwordPassed
    }
  }

  api.signIn(passedData)
    .then((responseData) => {
      ui.onSignUpSuccess(responseData)
      onCreateGame()
    })
    .catch(ui.onSignUpFailure)
}

const onSignUp = (event) => {
  event.preventDefault()
  const formData = getFormFields(event.target)

  api.signUp(formData)
    .then((responseData) => onSignInAfterSignUp(formData.credentials.email, formData.credentials.password))
    .catch(ui.onSignUpFailure)
}

const onLogOut = () => {
  store.xWons = 0
  store.oWons = 0
  store.ties = 0

  api.logOut()
    .then(ui.onLogOutSuccess)
    .catch(ui.onLogOutFailure)
}

const onChangePassword = (event) => {
  event.preventDefault()

  const data = getFormFields(event.target)
  api.changePassword(data)
    .then(ui.onChangePasswordSuccess)
    .catch(ui.onChangePasswordFailure)
}

const onCreateGame = () => {
  api.create()
    .then((responseData) => {
      store.isOver = false
      store.isOnline = false
      store.isMyTurn = true
      store.xTurn = true
      store.gameStarted = false
      store.game = responseData.game
    })
    .catch(() => {
      onLogOut()
    })
}

const onRestart = () => {
  onCreateGame()
  ui.restartBoard()
  ui.showMultiplayer()
  ui.removeErrorSignal()
  ui.restartForms()
}

const onSquareClicked = (event) => {
  if (!store.isOver && store.isMyTurn) {
    const index = +$(event.target).attr('data-id')
    const letter = game.checkSquare(index)
    if (letter !== undefined) {
      addLetterToSquare(index, letter)
    } else {
      return
    }
  }

  if (store.isOnline && store.isMyTurn) {
    store.isMyTurn = false
    waitForMove(store.game.id)
  }

  if (store.singlePlayer && !store.isOver) {
    const computerIndex = game.computerChoice()
    const computerLetter = game.checkSquare(computerIndex)
    setTimeout(() => {
      store.game.cells[computerIndex] = computerLetter
      addLetterToSquare(computerIndex, computerLetter)
    }, 250)
  }
}

const addLetterToSquare = (index, letter) => {
  ui.addXorO($(`div[data-id=${index}]`), letter)
  store.xTurn = !store.xTurn
  if (game.checkWinning() !== -1) {
    store.isOver = true
    ui.updateScore(letter)
    api.update(index, letter, true)
      .then((responseData) => {
        store.game = responseData.game
      })
      .catch(() => {
        onLogOut()
      })
  } else if (game.checkTie()) {
    store.isOver = true
    ui.updateTie()
    api.update(index, letter, true)
      .then((responseData) => {
        store.game = responseData.game
      })
      .catch(() => {
        onLogOut()
      })
  } else {
    store.gameStarted = true
    api.update(index, letter, false)
      .then((responseData) => {
        store.game = responseData.game
        ui.hideMultiplayer()
      })
      .catch(() => {
        onLogOut()
      })
  }
}

const onSinglePlayer = (event) => {
  if (!store.gameStarted) {
    store.singlePlayer = true
    ui.singlePlayer(event)
  } else {
    onRestart()
    store.singlePlayer = true
    ui.singlePlayer(event)
  }
}

const onDoublePlayer = (event) => {
  if (!store.gameStarted) {
    store.singlePlayer = false
    ui.doublePlayer(event)
  } else {
    onRestart()
    store.singlePlayer = false
    ui.doublePlayer(event)
  }
}

const onGetGames = () => {
  api.getGames()
    .then(ui.onGetGamesSuccess)
    .catch(ui.onGetGamesFailure)

  api.getFinishedGames()
    .then(ui.onGetFinishedGamesSuccess)
    .catch(ui.onGetFinishedGamesFailure)
}

const onClearModal = () => {
  ui.clearModal()
}

const onHost = (event) => {
  event.preventDefault()
  ui.onShowHost()
  store.endRequests = false
  store.isMyTurn = false
  store.singlePlayer = false
  waitForOponent(store.game.id)
}

const onGuest = (event) => {
  event.preventDefault()
  store.singlePlayer = false
  ui.onShowGuest()
}

const onCancel = () => {
  event.preventDefault()
  onRestart()
  ui.onCancelMultiplayer()
  store.endRequests = true
}

const onExit = () => {
  event.preventDefault()
  onRestart()
  ui.onExitMultiplayer()
  ui.showOnePlayer()
  store.endRequests = true
  store.isMyTurn = true
  store.isOnline = false
}

const onAgainHost = (event) => {
  event.preventDefault()
  waitForOponent(store.game.id)
}

const onJoinGame = (event) => {
  event.preventDefault()
  const formData = getFormFields(event.target)

  api.joinGame(formData)
    .then((responseData) => {
      ui.hideOnePlayer()
      store.isOnline = true
      store.isMyTurn = false
      store.game = responseData.game
      ui.onJoinGameSuccess()
      waitForMove(store.game.id)
    })
    .catch(() => {
      ui.onJoinGameFailure()
    })
}

const waitForOponent = (id) => {
  let second = 0
  const interval = setInterval(() => {
    second += 200
    if (second % 500 === 0) {
      ui.setTimer(10 - (second / 1000))
    }
    api.getGame(id)
      .then((responseData) => {
        if (game.checkForOponent(responseData)) {
          store.isMyTurn = true
          store.game = responseData.game
          clearInterval(interval)
          clearInterval(clear)
          ui.onHostSuccess()
          ui.hideOnePlayer()
          store.isOnline = true
          ui.setTimer(0)
        }

        if (store.endRequests) {
          clearInterval(interval)
          clearInterval(clear)
        }
      })
      .catch(() => {
        onRestart()
      })
  }, 200)
  const clear = setTimeout(() => {
    clearInterval(interval)
  }, 10000)
}

const waitForMove = (id) => {
  let second = 0
  const interval = setInterval(() => {
    second += 200
    if (second % 500 === 0) {
      ui.setTimer(10 - (second / 1000))
    }
    api.getGame(id)
      .then((responseData) => {
        const move = game.checkForMove(responseData)
        if (move) {
          clearInterval(interval)
          clearInterval(clear)
          store.game = responseData.game
          addLetterToSquare(move[0], move[1])
          store.isMyTurn = true
          ui.setTimer(0)
        }

        if (store.isOver) {
          clearInterval(interval)
          clearInterval(clear)
        }
      })
      .catch(() => {
        onRestart()
        ui.errorSignal()
      })
  }, 200)
  const clear = setTimeout(() => {
    clearInterval(interval)
  }, 10000)
}

module.exports = {
  onSignIn,
  onSignUp,
  onLogOut,
  onChangePassword,
  onSquareClicked,
  onRestart,
  onSinglePlayer,
  onDoublePlayer,
  onGetGames,
  onClearModal,
  onJoinGame,
  onHost,
  onGuest,
  onAgainHost,
  onCancel,
  onExit
}

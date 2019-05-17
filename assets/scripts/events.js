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

const onLogOut = (event) => {
  event.preventDefault()

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
      store.game = responseData.game
    })
    .catch(() => console.log('Failed'))
}

const onSquareClicked = (event) => {
  const index = $(event.target).attr('data-id')
  const isEmpty = game.checkSquare(index)
  if (isEmpty && !store.game.over) {
    ui.addXorO($(event.target), isEmpty)
    if (game.checkWinning() !== -1) {
      ui.updateScore(isEmpty)
      api.update(index, isEmpty, true)
        .then((responseData) => {
          store.game = responseData.game
        })
        .catch(() => {
          console.log('Update Failed')
        })
    } else if (game.checkTie()) {
      api.update(index, isEmpty, true)
        .then((responseData) => {
          store.game = responseData.game
          ui.updateTie()
          console.log(store.game)
        })
        .catch(() => {
          console.log('Update Failed')
        })
    } else {
      store.gameStarted = true
      api.update(index, isEmpty, false)
        .then((responseData) => {
          store.game = responseData.game
          console.log('Updated')
        })
        .catch(() => {
          console.log('Update Failed')
        })
    }
  }
}

const onRestart = () => {
  onCreateGame()
  ui.restartBoard()
  store.xTurn = false
}

const onSinglePlayer = (event) => {
  if (!store.gameStarted) {
    store.singlePlayer = true
    $('#double-player').removeClass('active')
    $(event.target).addClass('active')
    $('#players-button').text('1P')
  } else {
    onRestart()
    store.singlePlayer = true
    $('#double-player').removeClass('active')
    $(event.target).addClass('active')
    $('#players-button').text('1P')
  }
  console.log(store.singlePlayer)
}

const onDoublePlayer = (event) => {
  if (!store.gameStarted) {
    store.singlePlayer = false
    $('#single-player').removeClass('active')
    $(event.target).addClass('active')
    $('#players-button').text('2P')
  } else {
    onRestart()
    store.singlePlayer = false
    $('#single-player').removeClass('active')
    $(event.target).addClass('active')
    $('#players-button').text('2P')
  }
  console.log(store.singlePlayer)
}

const onGetGames = () => {
  api.getGames()
    .then(ui.onGetGamesSuccess)
    .catch(ui.onGetGamesFailure)

  api.getFinishedGames()
    .then(ui.onGetFinishedGamesSuccess)
    .catch(ui.onGetFinishedGamesFailure)
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
  onGetGames
}

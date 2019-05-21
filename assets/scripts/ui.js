'use strict'

const store = require('./store.js')

const onSignInSuccess = (responseData) => {
  $('#main-page').hide()
  $('.logged-in').show()
  $('.score ').text(0)
  restartForms()
  store.user = responseData.user
}

const onSignInFailure = (responseData) => {
  restartForms()
  addInvalid('#sign-in-email')
  addInvalid('#sign-in-password')
}

const onSignUpSuccess = (responseData) => {
  $('#signUpModal').modal('toggle').hide()
  $('#main-page').hide()
  $('.logged-in').show()
  $('.score ').text(0)
  restartForms()
  store.user = responseData.user
}

const onSignUpFailure = (responseData) => {
  restartForms()
  addInvalid('#sign-up-email')
  addInvalid('#sign-up-password')
  addInvalid('#sign-up-password-confirmation')
}

const onLogOutSuccess = () => {
  $('.collapse').collapse('hide')
  $('#main-page').show()
  $('.logged-in').hide()
  restartBoard()

  store.user = {}
  store.game = {}

  removeInvalid('#sign-in-email')
  removeInvalid('#sign-in-password')
  removeInvalid('#sign-up-email')
  removeInvalid('#sign-up-password')
  removeInvalid('#sign-up-password-confirmation')
}

const onLogOutFailure = () => {
  restartForms()
}

const onChangePasswordSuccess = () => {
  restartForms()
  removeInvalid('#old-password')
  removeInvalid('#new-password')
  addSuccess('#old-password')
  addSuccess('#new-password')
}

const onChangePasswordFailure = () => {
  addInvalid('#old-password')
  addInvalid('#new-password')
  restartForms()
}

const clearModal = () => {
  removeSuccess('#old-password')
  removeSuccess('#new-password')
  removeInvalid('#old-password')
  removeInvalid('#new-password')
}

const onShowWin = (addWinHorizontal, addWinVertical, removeWinHorizontal, removeWinVertical) => {
  let repeat = true
  const seconds = setInterval(() => {
    if (repeat) {
      repeat = !repeat
      addWinHorizontal()
      addWinVertical()
    } else {
      repeat = !repeat
      removeWinHorizontal()
      removeWinVertical()
    }
  }, 300)
  setTimeout(() => {
    clearInterval(seconds)
  }, 3000)
  removeWinHorizontal()
  removeWinVertical()
}

const flashScore = (element, color) => {
  let repeat = true
  const seconds = setInterval(() => {
    if (repeat) {
      repeat = !repeat
      $(`.${element}`).addClass(color)
    } else {
      repeat = !repeat
      $(`.${element}`).removeClass(color)
    }
  }, 300)
  setTimeout(() => {
    clearInterval(seconds)
  }, 3000)
  $(`.${element}`).removeClass(color)
}

const addXorO = (target, text) => {
  target.text(text)
}

const restartBoard = () => {
  $('.square').text('')
  setGameNumber()
}

const restartForms = () => {
  $('.form').trigger('reset')
}

const onGetGamesSuccess = (responseData) => {
  $('#games-started').text(responseData.games.length)
}

const onGetGamesFailure = (responseData) => {
  errorSignal()
}

const onGetFinishedGamesSuccess = (responseData) => {
  $('#games-finished').text(responseData.games.length)
}

const onGetFinishedGamesFailure = (responseData) => {
  errorSignal()
}

const singlePlayer = (event) => {
  $(event.target).addClass('active')
  $('#double-player').removeClass('active')
  $('#players-button').text('1P')
}

const doublePlayer = (event) => {
  $(event.target).addClass('active')
  $('#single-player').removeClass('active')
  $('#players-button').text('2P')
}

const updateScore = (letter) => {
  if (letter === 'X') {
    store.xWons += 1
    $('#x-score').text(store.xWons)
    flashScore('player-x', 'on-x-won')
    onShowWin(xWinHorizontal, xWinVertical, removeXWinHorizontal, removeXWinVertical)
  } else {
    store.oWons += 1
    $('#o-score').text(store.oWons)
    flashScore('player-o', 'on-o-won')
    onShowWin(oWinHorizontal, oWinVertical, removeOWinHorizontal, removeOWinVertical)
  }
}

const updateTie = () => {
  store.ties += 1
  $('#ties').text(store.ties)
  flashScore('player-ties', 'on-tie')
  onShowWin(tieHorizontal, tieVertical, removeTieHorizontal, removeTieVertical)
}

const addSuccess = (target) => {
  $(target).addClass('is-valid')
}

const removeSuccess = (target) => {
  if ($(target).hasClass('is-valid')) {
    $(target).removeClass('is-valid')
  }
}

const addInvalid = (target) => {
  $(target).addClass('is-invalid')
}

const removeInvalid = (target) => {
  if ($(target).hasClass('is-invalid')) {
    $(target).removeClass('is-invalid')
  }
}

const xWinHorizontal = () => {
  $('.upper').addClass('x-win-horizontal')
  $('.middle').addClass('x-win-horizontal')
}

const xWinVertical = () => {
  $('.first').addClass('x-win-vertical')
  $('.second').addClass('x-win-vertical')
}

const removeXWinHorizontal = () => {
  $('.upper').removeClass('x-win-horizontal')
  $('.middle').removeClass('x-win-horizontal')
}

const removeXWinVertical = () => {
  $('.first').removeClass('x-win-vertical')
  $('.second').removeClass('x-win-vertical')
}

const oWinHorizontal = () => {
  $('.upper').addClass('o-win-horizontal')
  $('.middle').addClass('o-win-horizontal')
}

const oWinVertical = () => {
  $('.first').addClass('o-win-vertical')
  $('.second').addClass('o-win-vertical')
}

const removeOWinHorizontal = () => {
  $('.upper').removeClass('o-win-horizontal')
  $('.middle').removeClass('o-win-horizontal')
}

const removeOWinVertical = () => {
  $('.first').removeClass('o-win-vertical')
  $('.second').removeClass('o-win-vertical')
}

const tieHorizontal = () => {
  $('.upper').addClass('tie-horizontal')
  $('.middle').addClass('tie-horizontal')
}

const tieVertical = () => {
  $('.first').addClass('tie-vertical')
  $('.second').addClass('tie-vertical')
}

const removeTieHorizontal = () => {
  $('.upper').removeClass('tie-horizontal')
  $('.middle').removeClass('tie-horizontal')
}

const removeTieVertical = () => {
  $('.first').removeClass('tie-vertical')
  $('.second').removeClass('tie-vertical')
}

const setGameNumber = () => {
  $('.game-number').text(store.game.id)
}

const onShowHost = () => {
  $('#main-multiplayer').addClass('hide')
  $('#host-multiplayer').removeClass('hide')
  setGameNumber()
}

const onShowGuest = () => {
  $('#main-multiplayer').addClass('hide')
  $('#guest-multiplayer').removeClass('hide')
}

const onJoinGameSuccess = () => {
  $('#guest-multiplayer').addClass('hide')
  $('#joined-multiplayer').removeClass('hide')
  $('#join-failed').addClass('hide')
  $('#oponent').text(store.game.player_x.email)
  setGameNumber()
}

const onJoinGameFailure = () => {
  $('#join-failed').removeClass('hide')
}

const onHostSuccess = () => {
  $('#host-multiplayer').addClass('hide')
  $('#joined-multiplayer').removeClass('hide')
  $('#oponent').text(store.game.player_o.email)
  setGameNumber()
}

const onCancelMultiplayer = () => {
  $('.second-screen').addClass('hide')
  $('#join-failed').addClass('hide')
  $('#main-multiplayer').removeClass('hide')
}

const onExitMultiplayer = () => {
  $('#joined-multiplayer').addClass('hide')
  $('#main-multiplayer').removeClass('hide')
}

const hideOnePlayer = () => {
  $('.one-player').addClass('hide')
}

const showOnePlayer = () => {
  $('.one-player').removeClass('hide')
}

const hideMultiplayer = () => {
  $('#main-multiplayer').addClass('hide')
}

const showMultiplayer = () => {
  $('#main-multiplayer').removeClass('hide')
}

const setTimer = (time) => {
  $('.time-remaining').text(time)
}

const errorSignal = () => {
  $('#error').removeClass('hide')
}

const removeErrorSignal = () => {
  $('#error').addClass('hide')
}
module.exports = {
  onSignInSuccess,
  onSignInFailure,
  onSignUpSuccess,
  onSignUpFailure,
  onLogOutSuccess,
  onLogOutFailure,
  onChangePasswordSuccess,
  onChangePasswordFailure,
  addXorO,
  restartBoard,
  onGetGamesSuccess,
  onGetGamesFailure,
  onGetFinishedGamesSuccess,
  onGetFinishedGamesFailure,
  updateScore,
  updateTie,
  clearModal,
  onShowWin,
  setGameNumber,
  onShowHost,
  onShowGuest,
  onJoinGameSuccess,
  onHostSuccess,
  onCancelMultiplayer,
  onExitMultiplayer,
  singlePlayer,
  doublePlayer,
  hideOnePlayer,
  showOnePlayer,
  hideMultiplayer,
  showMultiplayer,
  setTimer,
  onJoinGameFailure,
  errorSignal,
  removeErrorSignal,
  restartForms
}

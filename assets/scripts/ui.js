'use strict'

const store = require('./store.js')

const onSignInSuccess = (responseData) => {
  $('#main-page').hide()
  $('.logged-in').show()
  restartForms()
  store.user = responseData.user
}

const onSignInFailure = (responseData) => {
  restartForms()
  console.log('Sign-In failure')
}

const onSignUpSuccess = (responseData) => {
  $('#signUpModal').modal('toggle').hide()
  $('#main-page').hide()
  $('.logged-in').show()
  restartForms()
  store.user = responseData.user
}

const onSignUpFailure = (responseData) => {
  restartForms()
  console.log('Sign-Up failure')
}

const onLogOutSuccess = () => {
  $('#main-page').show()
  $('.logged-in').hide()
  restartBoard()

  store.user = {}
  store.game = {}
}

const onLogOutFailure = () => {
  restartForms()
  console.log('Log-Out failure')
}

const onChangePasswordSuccess = () => {
  console.log('Change Password success')
  restartForms()
}

const onChangePasswordFailure = () => {
  console.log('Change Password failure')
  restartForms()
}

const addXorO = (target, text) => {
  target.text(text)
}

const restartBoard = () => {
  $('.square').text('')
}

const restartForms = () => {
  $('.form').trigger('reset')
}

const onGetGamesSuccess = (responseData) => {
  $('#games-started').text(responseData.games.length)
}

const onGetGamesFailure = (responseData) => {

}

const onGetFinishedGamesSuccess = (responseData) => {
  $('#games-finished').text(responseData.games.length)
}

const onGetFinishedGamesFailure = (responseData) => {

}

const updateScore = (letter) => {
  if (letter === 'X') {
    store.xWons += 1
    $('#x-score').text(store.xWons)
  } else {
    store.oWons += 1
    $('#o-score').text(store.oWons)
  }
}

const updateTie = () => {
  store.ties += 1
  $('#ties').text(store.ties)
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
  updateTie
}

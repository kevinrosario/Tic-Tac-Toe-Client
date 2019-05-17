'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const handler = require('./events.js')

$(() => {
  // your JS code goes here
  $('#sign-in').on('submit', handler.onSignIn)

  $('#sign-up').on('submit', handler.onSignUp)

  $('#log-out').on('click', handler.onLogOut)

  $('#change-password').on('submit', handler.onChangePassword)

  $('.square').click(handler.onSquareClicked)

  $('#restart-button').on('click', handler.onRestart)

  $('#single-player').on('click', handler.onSinglePlayer)

  $('#double-player').on('click', handler.onDoublePlayer)

  $('#account-modal').on('click', handler.onGetGames)
})

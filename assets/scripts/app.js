'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
const handler = require('./events.js')

$(() => {
  // your JS code goes here

  $('#change-password').on('submit', handler.onChangePassword)

  $('#sign-in').on('submit', handler.onSignIn)

  $('#sign-up').on('submit', handler.onSignUp)

  $('#log-out').on('click', handler.onLogOut)

  $('#host').on('click', handler.onHost)

  $('#guest').on('click', handler.onGuest)

  $('#again-host').on('click', handler.onAgainHost)

  $('#join').on('submit', handler.onJoinGame)

  $('.cancel').on('click', handler.onCancel)

  $('#exit').on('click', handler.onExit)

  $('.square').click(handler.onSquareClicked)

  $('#restart-button').on('click', handler.onRestart)

  $('#single-player').on('click', handler.onSinglePlayer)

  $('#double-player').on('click', handler.onDoublePlayer)

  $('#accountModal').on('shown.bs.modal', handler.onGetGames)

  $('#accountModal').on('hide.bs.modal', handler.onClearModal)
})

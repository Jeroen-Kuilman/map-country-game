export const config = Object.freeze({
  MIN_POP_SIZE: 50000,
  MAX_LIST_RESULTS: 10,
  UPDATE_ROUND_SECONDS: 1,
  PLAYER_WRONG_MAX: 10,
  PLAYER_CORRECT_MAX: 10,
  POINTS_INIT_VALUE: 0,
  DEFAULT_LAT: 39, // for centering the world map
  DEFAULT_LNG: 22,
});

export const RESULT = Object.freeze({
  CORRECT: "correct",
  WRONG: "wrong",
  WON: "won",
  LOST: "lost",
});

export const FEEDBACK_MESSAGE = Object.freeze({
  SIDEBAR_DEFAULT: `Press start to play`,
  SIDEBAR_ISPLAYING: `Let's see how many countries you know`,
  SIDEBAR_GAMEOVER_WON: `You won! Check your answers on the map or press start to play again`,
  SIDEBAR_GAMEOVER_LOST: `You lost... Check your answers on the map or press start to play again`,
});

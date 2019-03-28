import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Challenge, Symbol, Row, Attempt } from './entity'

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Challenge) {
    const symbols = [ 'x', null ]
    return board.length === 3 &&
      board.every(row =>
        row.length === 3 &&
        row.every(symbol => symbols.includes(symbol))
      )
  }
}



export const calculateWinner = function (board1, board2) {
  const string1 = JSON.stringify(board1)
  const string2 = JSON.stringify(board2)
  return string1 === string2
}
  


  // board
  //   .concat(
  //     // vertical winner
  //     [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
  //   )
  //   .concat(
  //     [
  //       // diagonal winner ltr
  //       [0, 1, 2].map(n => board[n][n]),
  //       // diagonal winner rtl
  //       [0, 1, 2].map(n => board[2-n][n])
  //     ] as Row[]
  //   )
  //   .filter(row => row[0] && row.every(symbol => symbol === row[0]))
  //   .map(row => row[0])[0] || null
    

// export const finished = (board: Challenge): boolean =>
//   board
//     .reduce((a,b) => a.concat(b) as Row)
//     .every(symbol => symbol !== null)

import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Challenge,  Attempt } from './entity'

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Challenge|Attempt) {
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
  


  
    

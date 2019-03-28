import React from 'react'
import './Board.css'

const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {
  return (
    <button
      className="board-tile"
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >{symbol}</button>
  )
}

const renderBoard = (board, squares, makeMove) => board.map((cells, rowIndex) => {
  console.log('rowIndex test:', rowIndex)
  return <div key={rowIndex}>
    {cells.map(
      (symbol, cellIndex) => {
        console.log('cellIndex test:', cellIndex)
        symbol = squares[rowIndex][cellIndex]
        console.log('symbol test:', symbol)
        return renderCel(makeMove, rowIndex, cellIndex, symbol, false)
      }
    )}
  </div>
})

export default ({boardChallenger, boardAttempter, makeMove, turn, squares}) => {
  console.log('\nRENDER BOARD')

  console.log('squares test:', squares)
  if (turn !== 'challenger') {
    console.log('BOARD OF CHALLENGER', boardChallenger)

    return renderBoard(boardAttempter, squares, makeMove)
  } else {
    console.log(('BOARD OF ATTEMPTER', boardAttempter))

    return renderBoard(boardChallenger, squares, makeMove)
  }
}

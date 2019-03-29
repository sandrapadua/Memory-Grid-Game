import React from 'react'
import './Board.css'
const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {
  console.log('rowIndex test:', rowIndex)
  console.log('cellIndex test:', cellIndex)
  console.log('symbol test:', symbol)

  const content = symbol || '-'

  return (
    <button
      className="board-tile"
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >
      {content}
    </button>
  )
}

const renderBoard = (board, squares, makeMove, showBoard) => {
  console.log('renderBoard board test:', board)
  return board.map((cells, rowIndex) => {
    console.log('renderboard row test:', cells)
    return <div key={rowIndex}>
      {cells.map(
        (symbol, cellIndex) => {
          symbol = showBoard
            ? board[rowIndex][cellIndex]
            : squares[rowIndex][cellIndex]
          return renderCel(makeMove, rowIndex, cellIndex, symbol, false)
        }
      )}
    </div>
  })
  }

const timedelay = () =>{
  setTimeout(() => {
    this.setState({ gameState: 'memorize' }, () => {
        setTimeout(() => this.setState({ gameState: 'recall' }), 2000);
   });
}, 2000);
}

export default ({boardChallenger, boardAttempter, makeMove, turn, squares, showBoard}) => {
  console.log('squares test:', squares)

  if (turn === 'challenger') {
    console.log('render challenger board:', boardChallenger)

    return renderBoard(boardChallenger, squares, makeMove, showBoard)
  } else {
    console.log('rendering attempter board:', boardAttempter)

    return renderBoard(boardAttempter, squares, makeMove, showBoard)
  }
}

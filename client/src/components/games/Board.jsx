import React from 'react'
import './Board.css'

const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {
  return (
    <button
      className="board-tile"
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    ></button>
  )
}

export default ({boardChallenger, boardAttempter,makeMove, turn}) => {
  console.log(('BOARD OF CHALLENGER', boardChallenger));
  
if(turn !== 'challenger'){
  return boardAttempter.map((cells, rowIndex) =>
  <div key={rowIndex}>
    {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex,symbol,false))}
  </div>
)

}else{
  console.log(('BOARD OF ATTEMPTER', boardAttempter));

  return boardChallenger.map((cells, rowIndex) =>
    <div key={rowIndex}>
      {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex,symbol,false))}
    </div>
  )
}
}

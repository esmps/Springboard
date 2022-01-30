import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0 ; i < nrows ; i++){
      let row = [];
      for (let j = 0; j < ncols ; j++){
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    return board.every(row => row.every(c => !c));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [x, y] = coord.split("-").map(Number);

      const flipCell = (x, y, newBoard) => {
        // if this coord is actually on board, flip it
        if (y >= 0 && y < ncols && x >= 0 && x < nrows) {
          newBoard[x][y] = !newBoard[x][y];
        }
      };

      const newBoard = oldBoard.map(row => [...row]);
      flipCell(x, y, newBoard);
      flipCell(x - 1, y, newBoard);
      flipCell(x + 1, y, newBoard);
      flipCell(x, y - 1, newBoard);
      flipCell(x, y + 1, newBoard);

      return newBoard;
    });
  }

  if (hasWon()){
    return <div>YOU WON!!!</div>;
  }

  let gameBoard = [];
  for (let x = 0 ; x < nrows ; x++){
    let row = [];
    for (let y = 0; y < ncols ; y++){
      let coordinate = `${x}-${y}`;
      row.push(
        <Cell key={coordinate} isLit={board[x][y]} flipCellsAroundMe={() => flipCellsAround(coordinate)} />
      );
    };
    gameBoard.push(<tr key={x}>{row}</tr>);
  };
  return (
    <table className="Board">
      <tbody>{gameBoard}</tbody>
    </table>
  );
}

export default Board;

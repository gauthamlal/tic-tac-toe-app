import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
  ];
  for (var i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
};

const Square = (props) => {
  console.log(props.styleName, 'square');
  return (
    <button
      className="square"
      style={props.styleName}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, squareStyle) {
    console.log(squareStyle, i);
    return (
      <Square
        key={i}
        styleName={squareStyle}
        value={this.props.squares[i]}
        onClick={ () => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let completeBoard = [];
    let squareStyle = {};
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        if (this.props.winner && this.props.winner.includes(j + i * 3)) {
          squareStyle = {color: "red"};
        } else {
          squareStyle = {};
        }
        row.push(this.renderSquare(j + i * 3, squareStyle));
      }
      completeBoard.push(<div key={i} className="board-row">{row}</div>);
    }
    return completeBoard;
  }

  render() {
    return (
      <div>{this.createBoard()}</div>
    );
  }
  // using Array.Map
  /*<div>
    {
      [0, 1, 2].map( i1 => {
        return (
          <div key={i1} className="board-row">
            {
              [0, 1, 2].map( i2 => this.renderSquare(i2 + i1 * 3))
            }
          </div>
        );
      })
    }
  </div>*/
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      cellHistory: [],
      ascendToggle: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let cells = this.state.cellHistory.slice(0, this.state.stepNumber);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    cells.push(i);
    this.setState({
      history: history.concat({
        squares: squares
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      cellHistory: cells
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 === 0)
    });
  }

  changeOrder() {
    this.setState({
      ascendToggle: !this.state.ascendToggle
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, index) => {
      let move;
      if (this.state.ascendToggle) {
        move = index;
      } else {
        move = history.length - 1 - index;
      }
      let rowNum;
      let cellNum;
      if (move > 0) {
        const lastMove = this.state.cellHistory[move - 1];
        rowNum = lastMove || lastMove === 0 ? Math.floor(lastMove / 3) + 1 : 0;
        cellNum = lastMove || lastMove === 0 ? lastMove % 3 + 1 : 0;
      }

      const description = move ?
        'Go to Move #' + move + ' Cell: (' + rowNum + ', ' + cellNum + ')'  :
        'Go to Game start';
      const styleClass = this.state.stepNumber === move ? 'active-button' : 'inactive-button';

      return (
        <li key={move}>
          <button className={styleClass} onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      );
    });

    let status;
    if(winner) {
      status = 'Winner is: ' + current.squares[winner[0]];
    } else if (!winner && moves.length === 10) {
      status = 'It is a draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board winner={winner} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.changeOrder()}>Toggle</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

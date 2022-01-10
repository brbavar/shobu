import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './style.css'
const _ = require('lodash')

var whiteIsNext = true

function Piece(props) {
  const [thisPicked, setPicked] = useState(false)
  var outlineColor

  const togglePicked = () => {
    outlineColor = whiteIsNext ? 'black' : 'white'
    var pieces = document.getElementsByClassName('piece')
    for(const piece of pieces)
      if(piece.style.stroke === outlineColor) {
        if(!thisPicked)
          return
        break
      }
    
    if(props.color !== outlineColor)
      setPicked(!thisPicked)
  }

  return (
    <svg onClick={togglePicked} className={props.className} viewBox='0 0 100 100' width='90%' height='90%' fill={props.color} strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
      <circle className={`piece x${props.xCoord} y${props.yCoord}`} style={{transition: 'all .1s ease-in-out', stroke: thisPicked ? (whiteIsNext ? 'black' : 'white') : '', strokeWidth: thisPicked ? 8 : 0}} cx='50%' cy='50%' r='40%' />
    </svg>
  )
}

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function Board(props) {
  const movePiece = (x, y) => {
    var className = props.className
    var squares, map
    for(var i = 1; i < 5; i++)
      if(className === 'board' + i) {
        squares = props.getAllSquares()[i - 1]
        map = props.getAllMaps()[i - 1]
      }

    var x0 = -1, y0 = -1
    const outlineColor = whiteIsNext ? 'black' : 'white'
    var pieces = document.getElementsByClassName('piece')
    for(const piece of pieces)
      if(piece.style.stroke === outlineColor) {
        x0 = parseInt(piece.classList[1].replace('x', ''))
        y0 = parseInt(piece.classList[2].replace('y', ''))
        break
      }
    // Prevent moving piece when no piece picked or destination is current location
    if(x0 === -1 || y0 === -1 || (x0 === x && y0 === y))
      return

    var passive = props.getPassive()
    var xDisp = x0 - x
    var yDisp = y0 - y
    if(!passive) {
      if(xDisp !== props.getDisp()[0] || yDisp !== props.getDisp()[1])
        return
    }

    var xDist = Math.abs(xDisp)
    var yDist = Math.abs(yDisp)
    var xSign = 0, ySign = 0
    var stim = 'move'
    if(yDisp < 0) {
      stim += 'South'
      ySign = -1
    }
    if(yDisp > 0) {
      stim += 'North'
      ySign = 1
    }
    if(xDisp > 0) {
      stim += 'West'
      xSign = 1
    }
    if(xDisp < 0) {
      stim += 'East'
      xSign = -1
    }
    var resp = stim
    stim += (xDist === 2 || yDist === 2) ? 'Two' : 'One'

    if(xDist > 2 || yDist > 2 || !(xDist === yDist || xDist === 0 || yDist === 0))
      return
    
    var x1 = x0 - xSign, y1 = y0 - ySign, x2 = x - xSign, y2 = y - ySign

    // Prevent move if final two spaces in path are full
    if(squares[y1][x1] && squares[y][x] && !(x1 === x && y1 === y))
      return

    // Prevent move if final space in path and space past path are full
    if(y2 < squares.length && x2 < squares[0].length && y2 > -1 && x2 > -1 && 
      squares[y][x] && squares[y2][x2] && !(x === x2 && y === y2))
      return

    // Prevent passive move along path containing other pieces
    if(passive && (squares[y1][x1] || squares[y][x]))
      return

    var color
    if(squares[y0][x0])
      color = map.get(squares[y0][x0]).props.color

    var n = 1, allSquares = document.getElementsByClassName('square'), boardPicked = ''
    for(const square of allSquares) {
      var piecesInSquare = square.getElementsByClassName('piece')
      if(piecesInSquare.length && piecesInSquare[0].style.stroke === outlineColor) {
        if(n < 17)
          boardPicked = 'board1'
        if(n > 16 && n < 33)
          boardPicked = 'board2'
        if(n > 32 && n < 49)
          boardPicked = 'board3'
        if(n > 48 && n < 65)
          boardPicked = 'board4'
      }
      n++
    }

    // Prevent moving selected piece to space on another board,
    // or moving when no piece selected
    if(boardPicked !== className)
      return

    var thisBoardColor = '', boardColorPicked = props.getBoardColor()
    if(className === 'board1' || className === 'board4')
      thisBoardColor = 'light'
    else
      thisBoardColor = 'dark'
    
    // Prevent aggressive move on board of same color as passive move
    if(!passive && boardColorPicked === thisBoardColor)
      return

    props.setBoardColor(thisBoardColor)

    // If opponent's piece is in next space, push it out
    if(squares[y1][x1] && map.get(squares[y1][x1]).props.color !== color) {
      resp += (xDist === 2 || yDist === 2) ? 'Two' : 'One'
      if(y2 < squares.length && x2 < squares[0].length && y2 > -1 && x2 > -1) {
        squares[y2][x2] = (x2 % 4) + (y2 * 4) + 1
        map.set(squares[y2][x2], <Piece xCoord={x2} yCoord={y2} className={resp} color={map.get(squares[y1][x1]).props.color} />)
      }
      squares[y1][x1] = 0
    }
    
    // If destination is not next space, and it contains opponent's piece, push piece out
    if(!( (x1 === x && y1 === y) || (x === x2 && y === y2) ) && 
      squares[y][x] && map.get(squares[y][x]).props.color !== color)
      if(y2 < squares.length && x2 < squares[0].length && y2 > -1 && x2 > -1) {
        resp += 'One'
        squares[y2][x2] = (x2 % 4) + (y2 * 4) + 1
        map.set(squares[y2][x2], <Piece xCoord={x2} yCoord={y2} className={resp} color={map.get(squares[y][x]).props.color} />)
      }

    squares[y][x] = (x % 4) + (y * 4) + 1
    map.set(squares[y][x], <Piece xCoord={x} yCoord={y} className={stim} color={color} />)

    squares[y0][x0] = 0
    
    props.setMap(className, map)
    props.setSquares(className, squares)
    props.setDisp(xDisp, yDisp)
    if(!passive)
      whiteIsNext = !whiteIsNext
    props.setPassive()
  }

  const renderPiece = (x, y) => {
    const className = props.className
    var squares 
    for(var i = 1; i < 5; i++)
      if(className === 'board' + i)
        squares = props.getAllSquares()[i - 1]
    if(squares[y][x])
      return <Piece xCoord={x} yCoord={y} />
  }

  const renderSquare = (x, y) => {
    const className = props.className
    var squares, map
    for(var i = 1; i < 5; i++) {
      if(className === 'board' + i) {
        squares = props.getAllSquares()[i - 1]
        map = props.getAllMaps()[i - 1]
      }
    }

    return (
      <Square 
          value={squares[y][x] ? map.get(squares[y][x]) : null}
          onClick={() => movePiece(x, y)}>
          {squares[y][x] ? renderPiece(x, y) : null}
      </Square>
    )
  }

  return (
    <div className={props.className}>
      <div className='board-row'>
        {renderSquare(0, 0)}
        {renderSquare(1, 0)}
        {renderSquare(2, 0)}
        {renderSquare(3, 0)}
      </div>
      <div className='board-row'>
        {renderSquare(0, 1)}
        {renderSquare(1, 1)}
        {renderSquare(2, 1)}
        {renderSquare(3, 1)}
      </div>
      <div className='board-row'>
        {renderSquare(0, 2)}
        {renderSquare(1, 2)}
        {renderSquare(2, 2)}
        {renderSquare(3, 2)}
      </div>
      <div className='board-row'>
        {renderSquare(0, 3)}
        {renderSquare(1, 3)}
        {renderSquare(2, 3)}
        {renderSquare(3, 3)}
      </div>
    </div>
  )
}

function Game(props) {
  const [boardColor, setBoardColor] = useState('')

  const setBC = (color) => {
    setBoardColor(color)
  }

  const getBC = () => {
    return boardColor
  }

  const squareToPiece = new Map()
  const arr2D = []
  for(var i = 0; i < 4; i++) {
    arr2D[i] = []
    var j = i * 4 + 1 
    if(i === 0 || i === 3) {
      while(j < i * 4 + 5) {
        arr2D[i][4 - (i * 4 + 5 - j)] = j
        squareToPiece.set(arr2D[i][4 - (i * 4 + 5 - j)], <Piece xCoord={4 - (i * 4 + 5 - j)} yCoord={i} color={i === 0 ? 'black' : 'white'} />)
        j++
      }
      j = 0
    }
    else
      while(j < i * 4 + 5) {
        arr2D[i][4 - (i * 4 + 5 - j)] = 0
        j++
      }
  }
  squareToPiece.set(0, <Piece xCoord={-1} yCoord={-1} className='' color='' />)

  const [map1, setMap1] = useState(squareToPiece)
  const [map2, setMap2] = useState(_.cloneDeep(squareToPiece))
  const [map3, setMap3] = useState(_.cloneDeep(squareToPiece))
  const [map4, setMap4] = useState(_.cloneDeep(squareToPiece))
  const [squares1, setSquares1] = useState(arr2D)
  const [squares2, setSquares2] = useState(_.cloneDeep(arr2D))
  const [squares3, setSquares3] = useState(_.cloneDeep(arr2D))
  const [squares4, setSquares4] = useState(_.cloneDeep(arr2D))
  const [passive, setPassive] = useState(true)
  const [disp, setDisp] = useState([0, 0])

  const setM = (className, map) => {
    if(className === 'board1')
      setMap1(map)
    if(className === 'board2')
      setMap2(map)
    if(className === 'board3')
      setMap3(map)
    if(className === 'board4')
      setMap4(map)
  }

  const getAllM = () => {
    return [map1, map2, map3, map4]
  }

  const setS = (className, squares) => {
    if(className === 'board1')
      setSquares1(squares)
    if(className === 'board2')
      setSquares2(squares)
    if(className === 'board3')
      setSquares3(squares)
    if(className === 'board4')
      setSquares4(squares)
  }

  const getAllS = () => {
    return [squares1, squares2, squares3, squares4]
  }

  const setP = () => {
    setPassive(!passive)
  }

  const getP = () => {
    return passive
  }

  const setD = (xDisp, yDisp) => {
    setDisp([xDisp, yDisp])
  }

  const getD = () => {
    return disp
  }

  const winner = calculateWinner(getAllS(), getAllM())

  let status
  let statusColor

  if(winner) {
    status = 'Winner: '
    statusColor = winner
  } 
  else {
    status = 'Next player: '
    statusColor = whiteIsNext ? 'white' : 'black'
  }

  return (
    <div className='game'>
      <div>
        <div className='whole'>
          <div className='inWhole'>
            <div>
              <div className='status' style={{transform: 'translateY(-40px)'}}>{status}{<svg className='statusObj' viewBox='0 0 100 100' width='10%' height='100%' fill={statusColor} strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
                      <circle cx='50%' cy='50%' r='40%' />
                  </svg>}</div>
              <br />
              <div className='grid' style={{transform: 'translateY(-10px)'}}>
                <Board className='board1' setBoardColor={setBC} getBoardColor={getBC} setMap={setM} getAllMaps={getAllM} setSquares={setS} getAllSquares={getAllS} setPassive={setP} getPassive={getP} setDisp={setD} getDisp={getD} />
                <Board className='board2' setBoardColor={setBC} getBoardColor={getBC} setMap={setM} getAllMaps={getAllM} setSquares={setS} getAllSquares={getAllS} setPassive={setP} getPassive={getP} setDisp={setD} getDisp={getD} />
                <Board className='board3' setBoardColor={setBC} getBoardColor={getBC} setMap={setM} getAllMaps={getAllM} setSquares={setS} getAllSquares={getAllS} setPassive={setP} getPassive={getP} setDisp={setD} getDisp={getD} />
                <Board className='board4' setBoardColor={setBC} getBoardColor={getBC} setMap={setM} getAllMaps={getAllM} setSquares={setS} getAllSquares={getAllS} setPassive={setP} getPassive={getP} setDisp={setD} getDisp={getD} />
              </div>
            </div>
            <p style={{transition: 'all 1s ease-in-out', transform: 'translateY(20px)', display: (winner ? 'none' : ''), fontStyle: 'italic', fontSize: (winner ? '1.2em' : ''), backgroundColor: (passive ? 'transparent' : 'black'), color: (passive ? 'transparent' : 'white'), padding: '30px', borderRadius: '40px'}}>{passive ? <div style={{height: '1.37em'}}>Move {disp[0] <= 0 ? 'right ' : 'left '} {Math.abs(disp[0])} {Math.abs(disp[0]) !== 1 ? ' spaces' : ' space'}, and {disp[1] >= 0 ? 'up ' : 'down '} {Math.abs(disp[1])} {Math.abs(disp[1]) !== 1 ? ' spaces' : ' space'}.</div> : 'Move ' + (disp[0] <= 0 ? 'right ' : 'left ') + Math.abs(disp[0]) + (Math.abs(disp[0]) !== 1 ? ' spaces' : ' space') + ', and ' + (disp[1] >= 0 ? 'up ' : 'down ') + Math.abs(disp[1]) + (Math.abs(disp[1]) !== 1 ? ' spaces.' : ' space.')}</p>
            <p style={{transition: 'all 1s ease-in', transform: 'translateY(20px)', display: (winner ? '' : 'none'), color: (winner ? 'white' : 'transparent'), backgroundColor: (winner ? 'red' : 'transparent'), padding: '30px', borderRadius: '40px'}}>Refresh the page to start a new game!</p>
          </div>
        </div>
      </div>
      <div className='game-info'>
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  )
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

function calculateWinner(allSquares, allMaps) {
  var res = null

  for(let i = 0; i < allSquares.length; i++) {
    res = iterateOverSquares(allSquares[i], allMaps[i], i)
    if(res === 'white' || res === 'black')
      break
  }

  return res
}

function iterateOverSquares(squares, map, i) {
  var whitePresent = 0, blackPresent = 0

  for(var x = 0; x < 4; x++)
    for(var y = 0; y < 4 && (!whitePresent || !blackPresent); y++) {
      if(squares[y][x]) {
        if(map.get(squares[y][x]).props.color === '')
          continue
        map.get(squares[y][x]).props.color === 'white' ? whitePresent = 1 : blackPresent = 1
      }
    }

  if(whitePresent ^ blackPresent)
    return whitePresent ? 'white' : 'black'
    
  return null
}
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from '@material-ui/core/Paper'
import Board from './Board'
import Expire from '../Expire'
import './GameDetails.css'


class GameDetails extends PureComponent {
  state = {
    squares: [
      [
        null, null, null
      ],
      [
        null, null, null
      ],
      [
        null, null, null
      ]
    ],
    showChallenge: true,
    timerStarted: false
  }


  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  makeMove = (toRow, toCell) => {
    console.log('\nMAKE MOVE')
    const {game} = this.props
    console.log('game test:', game)
   
    let clickArray = [...this.state.squares]
    clickArray[toRow][toCell] = 'x'
    console.log('clickArray test:', clickArray)
    this.setState({
      squares: clickArray
    })

    console.log('Board', this.state.squares)
    console.log("TURN" ,game.turn)

    if (game.turn ==='attempter') {
      console.log('board of attempter', this.state.squares)

      updateGame(game.id, this.state.squares)

      console.log("ATTEMPTER TURN")
    }
  }

  setTimer() {
    // clear any existing timer
    if (this._timer != null) {
      clearTimeout(this._timer)
    }

    // hide after `delay` milliseconds
    const hideChallenge = () => {
      this.setState({showChallenge: false});
      this._timer = null;
    }
    
    // Make "this" work inside of non-class method above
    hideChallenge.bind(this)

    this._timer = setTimeout(
      hideChallenge,
      5000
    );

    this.setState({ timerStarted: true })
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  onclickEvent = () =>{
    const {game, updateGame} = this.props

    console.log('ID', game.id)
    updateGame(game.id, this.state.squares)
  }

  render() {
    const {game, users, authenticated, userId} = this.props
    console.log('userId test:', userId)

    const firstSquare = this.state.squares[0][0]
    console.log('firstSquare test:', firstSquare)


    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)
    console.log('player test:', player)

    const winningPlayer = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    const winner = winningPlayer &&
      <p>Winner: {users[winner].firstName}</p>

    const turn = game.status === 'started' &&
      player && player.role === game.turn &&
      <div>It's your turn!</div>

    const join = game.status === 'pending' &&
      game.players.map(p => p.userId).indexOf(userId) === -1 &&
      <button onClick={this.joinGame}>Join Game</button>

    const challenge = <Board
      boardChallenger={game.challenge} 
      boardAttempter = {game.attempt}
      turn={'challenger'}
      makeMove={() => {}} 
      squares={this.state.squares}
      showBoard={true}
    />

    const main = <Board
      boardChallenger={game.challenge} 
      boardAttempter = {game.attempt}
      turn={game.turn}
      makeMove={this.makeMove} 
      squares={this.state.squares}
    />

    const isPlayerAttempter = player && player.role === 'attempter'

    if (isPlayerAttempter && !this.state.timerStarted) {
      this.setTimer()
    }

    const boards = game.status !== 'pending' &&
      <div>
        <h1>{game.winner}</h1>

        {/* <div>Turn: {game.turn}</div> */}

        {
          game.turn === 'challenger'
            ? main
            : isPlayerAttempter
              ? <div>
                {
                  this.state.showChallenge
                    ? challenge
                    : null
                }
                <hr />
                {main}
              </div>
              : main
        }

        

        <button id ={game.id} onClick = {this.onclickEvent}>
          Submit
        </button>
      </div>


    return (<Paper className="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>

      {turn}

      {join}

      {winner}

      <hr />

      {boards}

    </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users,
  user: state.currentUser && state.users &&
    state.users[userId(state.currentUser.jwt)]

})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)

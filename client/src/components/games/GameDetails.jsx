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
    ]
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

  onclickEvent = () =>{
    const {game, updateGame} = this.props

    console.log('ID', game.id)
    updateGame(game.id, this.state.squares)
  }

  render() {
    const {game, users, authenticated, userId} = this.props

    const firstSquare = this.state.squares[0][0]
    console.log('firstSquare test:', firstSquare)


    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

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

    const boards = game.status !== 'pending' &&
      <div>
        {game.winner}

        <div>Turn: {game.turn}</div>

        {
          game.turn === 'challenger'
            ? <Board
              boardChallenger={game.challenge} 
              boardAttempter = {game.attempt}
              turn={game.turn}
              makeMove={this.makeMove} 
              squares={this.state.squares}
            />
            : player.role === 'attempter'
              ? <div>
                <Expire delay={10000}>
                  <Board
                    boardChallenger={game.challenge} 
                    boardAttempter = {game.attempt}
                    turn={'challenger'}
                    makeMove={() => {}} 
                    squares={this.state.squares}
                    showBoard={true}
                  />

                  <hr />
                </Expire>

                <Board
                  boardChallenger={game.challenge} 
                  boardAttempter = {game.attempt}
                  turn={game.turn}
                  makeMove={this.makeMove} 
                  squares={this.state.squares}
                />
              </div>
              : <Board
                boardChallenger={game.challenge} 
                boardAttempter = {game.attempt}
                turn={game.turn}
                makeMove={this.makeMove} 
                squares={this.state.squares}
              />
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

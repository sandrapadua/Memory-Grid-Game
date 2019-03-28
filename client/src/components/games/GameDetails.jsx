import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from '@material-ui/core/Paper'
import Board from './Board'
import './GameDetails.css'


class GameDetails extends PureComponent {
  state = {
    highLightedSquares: [
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
    const {game} = this.props
    console.log('role test:' ,game.players[0].role)
    console.log(game)
    
    const playersUserId = this.props.user.id

    console.log("userid",playersUserId)
    // updateGame(game.id, board)
// if(game.players.userId === game.players[0].role)
    // use setState to change highlighted squares

let clickArray = this.state.highLightedSquares
clickArray[toRow][toCell] = 'x'
    this.setState({
      highLightedSquares : clickArray
       })

       console.log('Board', this.state.highLightedSquares)
       console.log("USER DETAILS",userId)

  }

onclickEvent = () =>{
  const {game, updateGame} = this.props

  console.log('ID', game.id)
  updateGame(game.id, this.state.highLightedSquares)
}

  render() {
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    return (<Paper className="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>

      {
        game.status === 'started' &&
        player && player.symbol === game.turn &&
        <div>It's your turn!</div>
      }

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>
      }

      {
        winner &&
        <p>Winner: {users[winner].firstName}</p>
      }

      <hr />

      {
        game.status !== 'pending' &&
        <div>
        <Board game={game.challenge} 
          makeMove={this.makeMove} 
          highLightedSquares={this.state.highLightedSquares}
        />
         {/* render a button here: submit  */}
        <button id ={game.id} onClick = {this.onclickEvent}>Submit</button>
        </div>
      }
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

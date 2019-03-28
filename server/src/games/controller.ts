import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, 
  Body, Patch 
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Challenge, Attempt } from './entity'
import Player from '../players/entity'
import {IsBoard,calculateWinner,
  //  isValidTransition,  finished
  } from './logic'
import { Validate } from 'class-validator'
import {io} from '../index'

class GameUpdate {

  @Validate(IsBoard, {
    message: 'Not a valid board'
  })
  board: Challenge | Attempt
}

@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User 
  ) {
    console.log('get enterted into loclhost/games')
    const entity = await Game.create().save()

    const player = await Player.create({
      game: entity, 
      user
    })
    
    await player.save()

    const game = await Game.findOneById(entity.id)

    if (game) {
      game.challenger = player
      await game.save()
    }

    console.log('game test:', game)

    io.emit('action', {
      type: 'ADD_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    const attemptPlayer = await Player.findOneById(gameId)
    console.log(attemptPlayer)
    console.log('MY GAME BOARD',game) // we got a game
    if (!game) throw new BadRequestError(`Game does not exist`)

    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()


    // this is broken
    const player = await Player.create({
      game, 
      user,
      role:'attempter'
    }).save()

    console.log('we will not see this***********************', player)

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOneById(game.id)
    })

    return player
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens

  @Patch('/games/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() update: GameUpdate
  ) {
    console.log('****************ENTERED INTO SERVER!!!!!*****************', update)
    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started') throw new BadRequestError(`The game is not started yet`)
    
    const isChallenger = game.turn === 'challenger'
    console.log("challenger***************", isChallenger)
    console.log("PLAYER *************",player.role)

    if (isChallenger && player.role === 'challenger') {
      game.challenge = update.board
      game.turn = 'attempter'
    } else if(game.turn === 'attempter') {
      game.attempt = update.board
      console.log('attempters turn test!')
  }
    await game.save()

   const winner  =  calculateWinner(game.challenge,game.attempt)

    console.log('WINNER OF THE GAME **************',winner)
    if (winner) {
      
      game.status = 'finished'
      game.winner = 'win the game'
        }else{
          game.winner = 'game fails'
          game.status = 'finished'
        }
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: game
    })

    await game.save()
    return game
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  getGame(
    @Param('id') id: number
  ) {
    return Game.findOneById(id)
  }

  @Authorized()
  @Get('/games')
  getGames() {
    return Game.find()
  }
}


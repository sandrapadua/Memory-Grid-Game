import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, 
  Body, Patch 
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Challenge, Attempt } from './entity'
import Player from '../players/entity'
import {IsBoard,
   // isValidTransition, calculateWinner, finished
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
    console.log('MY GAME BOARD',game) // we got a game
    if (!game) throw new BadRequestError(`Game does not exist`)

    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()

    console.log('we will see this', user)

    // this is broken
    const player = await Player.create({
      game, 
      user,
    }).save()

    console.log('we will not see this')

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
    game.challenge = update.board
    await game.save()

    // if (player.symbol !== game.turn) throw new BadRequestError(`It's not your turn`)
    // if (!isValidTransition(player.symbol, game.board, update.board)) {
    //   throw new BadRequestError(`Invalid move`)
    // }    

    // const winner = calculateWinner(update.board)
    // if (winner) {
    //   game.winner = winner
    //   game.status = 'finished'
    // }
    // else if (finished(update.board)) {
    //   game.status = 'finished'
    // }
    // else {
    //   game.turn = player.symbol === 'x' ? 'o' : 'x'
    // }
    // game.board = update.board
    // await game.save()
    
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: game
    })

    io.emit('action', {type: 'Hello_World', payload: 'hi'})

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


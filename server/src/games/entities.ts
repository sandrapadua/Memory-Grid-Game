import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = 'x' 
export type Row = [  null,  null,  null ]
// export type Board = [ Row, Row, Row ]
export type Challenge = [ Row, Row, Row ]
export type Attempt = [ Row, Row, Row ]



type Status = 'pending' | 'started' | 'finished'

const emptyRow: Row = [null, null, null]
const emptyChallenge: Challenge = [ emptyRow, emptyRow, emptyRow ]
const emptyAttempt: Attempt = [ emptyRow, emptyRow, emptyRow ]

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: emptyChallenge})
  challenge: Challenge

  @Column('json', {default: emptyAttempt})
  attempt: Attempt

  @Column('char', {length:1, default: 'x'})
  turn: Symbol

  @Column('char', {length:1, nullable: true})
  winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]
}

@Entity()
@Index(['game', 'user'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  // @Column('char', {length: 1})
  // symbol: Symbol

  @Column('integer', { name: 'user_id' })
  userId: number
}

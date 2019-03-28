import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm'
import Player from '../players/entity'

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

  @Column('text', {default: 'challenger'})
  turn: String

  @Column('text', { nullable: true})
  winner: String

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]

  @OneToOne(() => Player, {eager:true})
  @JoinColumn()
  challenger: Player
}
import User from '../users/entity'
import { Game } from '../games/entity'
import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, ManyToOne } from 'typeorm'

@Entity()
@Index(['game', 'user'], {unique:true})
export default class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column('text', { default: 'challenger' })
  role: string

  @Column('integer', { name: 'user_id' })
  userId: number
}
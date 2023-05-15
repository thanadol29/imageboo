import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
// import Thread from 'App/Models/Thread'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public comment: string

  @column()
  public image: string

  @column()
  public poster_id: string

  @column()
  public threadId: string

  @column()
  public filetype: string
  
  @column()
  public datetime: string

  // @column()
  // public thread:HasOne<typeof Thread>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

import {
  ManyToOne,
  JoinColumn,
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Users } from "./User";
import { Movie } from "./Movie";

@Entity()
@ObjectType()
export class Favouritemovies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user: Users) => user.username, { nullable: false })
  @JoinColumn({ name: "username" })
  username: Users;

  @ManyToOne(() => Movie, (movie: Movie) => movie.title, { nullable: false })
  @JoinColumn({ name: "movie" })
  movie: Movie;

  @Field()
  title: String;
  // @Field(() => Date)
  @Column({ default: new Date() })
  date: Date;
}

import {
  ManyToOne,
  JoinColumn,
  Entity,
  BaseEntity,
  Column,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Length, IsString, MinLength } from "class-validator";
import { Users } from "./User";
import { Favouritemovies } from "./FavouriteMovies";

@Entity()
@ObjectType()
export class Movie extends BaseEntity {
  @Length(5, 30)
  @Field(() => String)
  @PrimaryColumn()
  title: string;

  @Length(10, 255)
  @Field()
  @Column()
  synopsis: string;

  @ManyToOne(() => Users, (user: Users) => user.username, { nullable: false })
  @JoinColumn({ name: "username" })
  username: Users;

  @OneToMany(
    () => Favouritemovies,
    (Favouritemovies: Favouritemovies) => Favouritemovies.id
  )
  Favouritemovies: Favouritemovies[];

  @Field(() => Date)
  @Column()
  release_date: Date;

  @Field(() => Date)
  @Column({ default: new Date() })
  date: Date;
}

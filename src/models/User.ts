import { Entity, BaseEntity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Length, IsString, MinLength } from "class-validator";
import { Movie } from "./Movie";
import { Favouritemovies } from "./FavouriteMovies";

@Entity()
@ObjectType()
// export class Users extends BaseEntity {
export class Users {
  @Length(5, 15)
  @Field(() => String)
  @PrimaryColumn()
  username: string;

  @OneToMany(() => Movie, (movie: Movie) => movie.title)
  movies: Movie[];

  @OneToMany(
    () => Favouritemovies,
    (Favouritemovies: Favouritemovies) => Favouritemovies.id
  )
  Favouritemovies: Favouritemovies[];

  @IsString()
  @MinLength(7)
  // @Field(() => String)
  @Column()
  password: string;

  @Field(() => Date, { nullable: true })
  @Column({ default: new Date() })
  date: Date;
}

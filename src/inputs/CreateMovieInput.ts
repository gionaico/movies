import { InputType, Field } from "type-graphql";
import { Length, IsString, Min, Max } from "class-validator";

@InputType()
export class CreateMovieInput {
  @IsString()
  @Length(3, 15)
  @Field({ description: `Need min 3 and  max 15 caracters.` })
  title: string;

  @Length(10, 255)
  @Field({ description: `Need min 10 and  max 255 caracters.` })
  synopsis: string;

  @Field({ description: `It has to be a valid date between 1900 and now.` })
  release_date: Date;
}

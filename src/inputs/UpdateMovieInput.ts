import { InputType, Field } from "type-graphql";
import { CreateMovieInput } from "./CreateMovieInput";

@InputType()
export class UpdateMovieInput {
  @Field()
  new_entity: CreateMovieInput;

  @Field({
    description: `It has to be the title of a movie that already exists.`,
  })
  oldtitle: String;
}

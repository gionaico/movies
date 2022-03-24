import { InputType, Field } from "type-graphql";
import { Length, IsString } from "class-validator";

const text = {
  username: `Need min 3 and  max 15 caracters.`,
  password: `Need min 3 and  max 15 caracters.`,
};
@InputType()
export class CreateUserInput {
  @IsString()
  @Length(3, 15, { message: `Username. ${text.username}` })
  @Field({ description: text.username })
  username: string;

  @Length(5, 15, { message: `Password. ${text.username}` })
  @Field({ description: text.password })
  password: string;
}

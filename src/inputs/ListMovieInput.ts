import { InputType, Field } from "type-graphql";
import { Length, IsString, Min, Max } from "class-validator";

@InputType()
export class ListMovieInput {
  @IsString()
  @Length(3, 15)
  @Field({ nullable: true, description: `This field es key sentitive` })
  title: string;

  @Min(1)
  @Field({ nullable: true })
  page: number;

  @Min(1)
  @Field({ nullable: true })
  items_by_page: number;

  @Min(1)
  @Field({ nullable: true })
  order: enumOrder;
}

enum enumOrder {
  "ASC",
  "DESC",
}

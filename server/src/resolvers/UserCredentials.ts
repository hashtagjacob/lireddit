import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterCredentials {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

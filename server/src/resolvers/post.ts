import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() root: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(root.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() root: Post,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const updoot = await updootLoader.load({
      postId: root.id,
      userId: req.session.userId,
    });
    if (updoot) {
      return updoot.value;
    }
    return null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: Number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    let realValue = value > 0 ? 1 : -1;
    const exists = await Updoot.findOne({ userId: req.session.userId, postId });
    console.log("\n\nexisting:", exists);
    console.log("real val: ", realValue);

    if (exists) {
      if (exists.value !== realValue) {
        exists.value = realValue;
        await exists.save();
        //when user already voted and changes vote we need to miltiply the effect
        // ex. from 10 points to 8 points
        realValue = realValue * 2;
      } else {
        return true;
      }
    } else {
      try {
        await Updoot.insert({
          postId: postId,
          userId: req.session.userId,
          value: realValue,
        });
      } catch (err) {
        console.log(err);
        return false;
      }
    }

    const post = await Post.findOne(postId);
    console.log(post);

    if (post) {
      post.points = post.points + realValue;
      await post.save();
      return true;
    }
    return false;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();
    // console.log("posts: ", posts);

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === reaLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int!) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Ctx() { req }: MyContext,
    @Arg("input") input: PostInput
  ): Promise<Post> {
    const post = Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int!) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const post = await Post.findOne({
      where: { id: id, creatorId: req.session.userId },
    });
    if (!post) {
      return null;
    }
    post.title = title;
    post.text = text;
    post.save();
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int!) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}

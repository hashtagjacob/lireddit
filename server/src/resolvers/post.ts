import { isAuth } from '../middleware/isAuth';
import { MyContext } from 'src/types';
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
} from 'type-graphql';
import { Post } from '../entities/Post';
import { LessThan } from 'typeorm';
import { Updoot } from '../entities/Updoot';

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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: Number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const realValue = value > 0 ? 1 : -1;
    const exists = await Updoot.findOne({ userId: req.session.userId, postId });
    if (exists) {
      if (exists.value !== realValue) {
        exists.value = realValue;
        await exists.save();
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
    if (post) {
      post.points = post.points + realValue;
      post.save();
      return true;
    }
    return false;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int!) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = limit > 50 ? 50 : limit;
    const realLimitIncremented = realLimit + 1;

    let result;
    if (cursor) {
      result = await Post.find({
        where: { createdAt: LessThan(new Date(parseInt(cursor))) },
        order: { createdAt: 'DESC' },
        take: realLimitIncremented,
      });
    } else {
      result = await Post.find({
        take: realLimitIncremented,
        order: { createdAt: 'DESC' },
      });
    }

    // let params;
    // if (cursor) {
    //   params = [realLimitIncremented, cursor];
    // } else {
    //   params = [realLimitIncremented];
    // }

    // const result = await getConnection().query(
    //   `
    // select p.* from post p
    // json_build_object(
    //  'id': u.id,
    // 'username': u.username,
    //  'email': u.email
    // )
    // inner join public.user u on u.id = p."creatorId"
    // ${cursor ? `where p."createdAt < $2` : ''}
    // order by p."createdAt" DESC
    // limit $1
    // `,
    //   params
    // );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder('p')
    //   .orderBy('"createdAt"', 'DESC');

    // if (cursor) {
    //   qb.where('"createdAt"<:cursor', { cursor: new Date(parseInt(cursor)) });
    // }
    // const result = await qb.take(realLimitIncremented).getMany();

    return {
      posts: result.slice(0, realLimit),
      hasMore: result.length === realLimitIncremented,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Ctx() { req }: MyContext,
    @Arg('input') input: PostInput
  ): Promise<Post> {
    const post = Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      await post.save();
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}

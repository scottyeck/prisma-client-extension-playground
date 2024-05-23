import { PrismaClient, Prisma } from "@prisma/client";

const filterExtension = Prisma.defineExtension((client) => {
  const extension = {
    query: {
      user: {
        async findMany({ model, operation, args, query }) {
          args.where = { ...args.where, name: { not: "Alice" } };
          return query(args);
        },
      },
    },
  };
  return client.$extends(extension);
});

const kindExtension = Prisma.defineExtension((client) => {
  const filteredKeys = Object.keys(client).filter((key) => !["_", "$"].includes(key[0]));
  const result = filteredKeys.reduce((acc, key) => {
    acc[key] = {
      kind: {
        needs: {},
        compute() {
          return key;
        },
      },
    };
    return acc;
  }, {});
  const extension = { result };
  return client.$extends(extension);
});

const prisma = new PrismaClient().$extends(kindExtension).$extends(filterExtension);

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: "Benjamin",
  //     email: "benjamin@prisma.io",
  //     posts: {
  //       create: { title: "Hello World, love Benjamin" },
  //     },
  //     profile: {
  //       create: { bio: "I like cats" },
  //     },
  //   },
  // });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  const allPosts = await prisma.post.findMany();
  console.log(JSON.stringify(allUsers, null, 2));
  // console.log(allPosts);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

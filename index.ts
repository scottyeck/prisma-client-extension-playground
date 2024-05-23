import { PrismaClient, Prisma } from "@prisma/client";

const filterExtension = Prisma.defineExtension((client) => {
  const extension = {
    query: {
      async $allOperations({ args: rawArgs, query, model, operation }) {
        const result = await query(rawArgs);
        // TODO: this would need to consider one or many case, but for now
        // we'll just consider a many.
        if (result.length === 0) return result;
        return result.filter((item) => {
          if (item.kind === "user") {
            return item.name !== "Alice";
          }
          return true;
        });
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
  // const allPosts = await prisma.post.findMany();
  console.log(JSON.stringify(allUsers, null, 2));
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

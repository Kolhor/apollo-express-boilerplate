import "dotenv/config";
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import uuidv4 from "uuid/v4";
import http from "http";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
import DataLoader from "dataloader";
import loaders from "./loaders";

const app = express();

app.use(cors());

const getMe = async req => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const userLoader = new DataLoader(keys => batchUsers(keys, models));

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
        }
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
        }
      };
    }
  }
});
server.applyMiddleware({ app, path: "/graphql" });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: "Lynx",
      email: "kol@bjorn.no",
      password: "testersen",
      role: "ADMIN",

      messages: [
        {
          text: "Published the Road to learn React",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
          text: "Checking to see if database is alive",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
  await models.User.create(
    {
      username: "Kolle",
      email: "kolbjorn.horgheim@gmail.com",
      password: "testersen",
      role: "USER",
      messages: [
        {
          text: "Happy to release lots of stuffy...",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
          text: "Published a half complete project ...",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
};

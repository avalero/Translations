import { GraphQLServer } from 'graphql-yoga';
import { uuid4 } from 'uuid/v4';

interface IUser {
  id: string;
  name: string;
  mail: string;
}

interface ITranslation {
  literal: string;
  as_in?: string;
  tr: string;
  translator: string;
  lang: string;
}

const literals: string[] = ['hello', 'bye'];
const users: IUser[] = [
  {
    id: '1',
    name: 'Alberto',
    mail: 'alberto@test.com',
  },
  {
    id: '2',
    name: 'Sara',
    mail: 'sara@test.com',
  },
];
const translations: ITranslation[] = [
  {
    literal: 'hello',
    as_in: 'Hola como estas',
    tr: 'hola',
    translator: '1',
    lang: 'es',
  },
  {
    literal: 'bye',
    as_in: 'Me voy, adios',
    tr: 'adios',
    translator: '2',
    lang: 'es',
  },
  {
    literal: 'hello',
    as_in: 'Hello, how are you',
    tr: 'hello',
    translator: '1',
    lang: 'en',
  },
  {
    literal: 'bye',
    as_in: 'Bye, see you',
    tr: 'bye',
    translator: '2',
    lang: 'en',
  },
];

const typeDefs: string = `
  type Query {
    translations(lang: String): [Translation!]
    literalTranslation(literal: String!, lang: String): Translation
    literals: [String!]!
    users: [User!]
  }

  type Mutation {
    createLiteral(literal:String!): String!
    addTranslation(literal:String!, lang:String!, tr:String!, as_in:String): Translation!
    createUser(name: String!, mail: String!)
  }

  type User {
    id: ID!
    name: String!
    mail: String!
    translations: [Translation!]
  }

  type Translation{
    literal: ID!
    as_in: String
    tr: String!
    translator: User!
    lang: String!
  }
`;

const resolvers = {
  Query: {
    translations(
      parent: any,
      args: { lang?: string },
      ctx: any,
      info: any
    ): ITranslation[] {
      if (args.lang) {
        return translations.filter(tr => tr.lang === args.lang);
      }

      return translations;
    },

    literalTranslation(
      parent: any,
      args: { lang?: string; literal: string },
      ctx: any,
      info: any
    ): ITranslation {
      if (!args.literal) {
        throw new Error('No literal specified');
      }

      // default language english
      const lang: string = args.lang || 'en';
      return translations.find(
        tr => tr.literal === args.literal && tr.lang === lang
      );
    },

    literals(parent: any, args: any, ctx: any, info: any) {
      return literals;
    },
  },
  Mutation: {
    createLiteral(parent, args: { literal: string }, ctx, info): string {
      if (literals.some(lit => lit === args.literal)) {
        throw new Error('Literal already in DB');
      }

      literals.push(args.literal);
      return args.literal;
    },

    createUser(
      parent: any,
      args: { name: string; mail: string },
      ctx: any,
      info: any
    ): IUser {
      if (users.some(usr => usr.mail === args.mail)) {
        throw new Error('User mail is already in use');
      }

      const user: IUser = {
        ...args,
        id: uuid4(),
      };

      users.push(user);
      return user;
    },

    addTranslation(
      parent: any,
      args: { literal: string; lang: string; tr: string; as_in?: string },
      ctx: any,
      info: any
    ): ITranslation {
      if (!args.literal || !args.lang || !args.tr) {
        throw new Error('Missing argument');
      }

      const existingLiteral = literals.some(lit => lit === args.literal);
      if (!existingLiteral) {
        throw new Error('Literal not found');
      }

      const translation: ITranslation = translations.find(
        tr => tr.literal === args.literal && tr.lang === args.lang
      );

      if (!translation) {
        const newTr: ITranslation = {
          ...args,
          translator: '1',
        };
        translations.push(newTr);
        return newTr;
      }

      Object.assign(translation, { ...args, translator: '1' });
      return translation;
    },
  },

  User: {
    translations(parent, args, ctx, info) {
      return translations.filter(tr => tr.translator === parent.id);
    },
  },

  Translation: {
    translator(parent, args, ctx, info) {
      return users.find(usr => usr.id === parent.translator);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up');
});

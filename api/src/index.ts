import { GraphQLServer } from 'graphql-yoga';

interface ITranslation {
  literal: string;
  as_in?: string;
  tr: string;
  translator?: string;
}

interface ITranslationsObject {
  en: ITranslation[];
  es: ITranslation[];
}

const literals: string[] = ['hello', 'bye'];

const esTranslations: ITranslation[] = [
  {
    literal: 'hello',
    as_in: 'Hola como estas',
    tr: 'hola',
    translator: 'Alberto Valero',
  },
  {
    literal: 'bye',
    as_in: 'Me voy, adios',
    tr: 'adios',
    translator: 'Luis Diaz',
  },
];

const enTranslations: ITranslation[] = [
  {
    literal: 'hello',
    as_in: 'Hello, how are you',
    tr: 'hello',
    translator: 'Alberto Valero',
  },
  {
    literal: 'bye',
    as_in: 'Bye, see you',
    tr: 'bye',
    translator: 'Luis Diaz',
  },
];

const translationsObject: ITranslationsObject = {
  es: esTranslations,
  en: enTranslations,
};

const typeDefs: string = `
  type Query {
    getTranslations(lang: String): [Translation!]!
    getTranslation(lang: String, literal: String!): Translation
    getLiterals: [String!]!
  }

  type Mutation {
    createLiteral(literal:String!): String!
    addTranslation(literal:String!, lang:String!, tr:String!, as_in:String): Translation!
  }

  type Translation{
    literal: String!
    as_in: String
    tr: String!
    translator: String!
  }
`;

const resolvers = {
  Query: {
    getTranslations(
      parent: any,
      args: { lang?: string },
      ctx: any,
      info: any
    ): ITranslation[] {
      if (!args.lang) {
        throw new Error('No lang specified');
      }

      if (translationsObject[args.lang]) {
        return translationsObject[args.lang];
      }

      throw new Error(`Unknown language ${args.lang}`);
    },

    getTranslation(
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
      if (translationsObject[lang]) {
        return translationsObject[lang].find(tr => tr.literal === args.literal);
      }
    },

    getLiterals(parent: any, args: any, ctx: any, info: any) {
      return literals;
    },
  },
  Mutation: {
    createLiteral(parent, args: { literal: string }, ctx, info): string {
      if (!args.literal) {
        throw new Error('Literal required');
      }

      if (literals.some(lit => lit === args.literal)) {
        throw new Error('Literal already in DB');
      }

      literals.push(args.literal);
      return args.literal;
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

      if (!translationsObject[args.lang]) {
        throw new Error('Non existing language');
      }

      const existingLiteral = literals.some(lit => lit === args.literal);
      if (!existingLiteral) {
        throw new Error('Literal not found');
      }

      const translation: ITranslation = translationsObject[args.lang].find(
        tr => tr.literal === args.literal
      );

      if (!translation) {
        const newTr: ITranslation = {
          tr: args.tr,
          literal: args.literal,
          translator: 'Alberto Valero',
          as_in: args.as_in || '',
        };
        translationsObject[args.lang].push(newTr);
        return newTr;
      }

      translation.tr = args.tr;
      translation.as_in = args.as_in || '';
      translation.translator = 'Alberto Valero';

      return translation;
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

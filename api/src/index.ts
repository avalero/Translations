import {GraphQLServer} from 'graphql-yoga';

interface ITranslation {
  literal: string;
  as_in?: string;
  translation: string;
  translator?: string;
}

const es_translations: ITranslation[] = [
  {
    literal: "hello",
    as_in: "Hola como estas",
    translation: "hola",
    translator: "Alberto Valero"
  },
  {
    literal: "bye",
    as_in: "Me voy, adios",
    translation: "adios",
    translator: "Luis Diaz"
  }
];

const en_translations: ITranslation[] = [
  {
    literal: "hello",
    as_in: "Hello, how are you",
    translation: "hello",
    translator: "Alberto Valero"
  },
  {
    literal: "bye",
    as_in: "Bye, see you",
    translation: "bye",
    translator: "Luis Diaz"
  }
];


const translations = {
  es: es_translations,
  en: en_translations,
};


const typeDefs: string = `
  type Query {
    translations(lang: String): [Translation!]!
    translation(lang: String, literal: String): Translation
  }

  type Translation{
    literal: String!
    as_in: String
    translation: String!
    author: String!
  }
`;

const resolvers = {
  Query: {
    translations(parent: any, args:{lang?:string}, ctx: any, info: any):Array<ITranslation>{
      if(!args.lang){
        throw new Error('No lang specified');
      }
      if(args.lang === "es") return es_translations;
      if(args.lang === "en") return en_translations;
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start( () => {
  console.log("The server is up");
});
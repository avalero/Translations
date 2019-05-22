import { IUser, ITranslation, IDB } from './types';

const literals: string[] = ['hello', 'bye'];
const users: IUser[] = [
  {
    id: '1',
    name: 'Alberto',
    mail: 'alberto@test.com',
    active: true,
  },
  {
    id: '2',
    name: 'Sara',
    mail: 'sara@test.com',
    active: true,
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

export const db: IDB = {
  users,
  literals,
  translations,
};

export { db as default };

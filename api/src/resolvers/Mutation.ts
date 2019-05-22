import * as uuidv4 from 'uuid/v4';
import { IUser, ITranslation, IDB, IContext } from '../types';

// tslint:disable-next-line:variable-name
const Mutation = {
  createLiteral(parent, args: { literal: string }, ctx, info): string {
    const literals: string[] = ctx.db.literals;
    if (literals.some(lit => lit === args.literal)) {
      throw new Error('Literal already in DB');
    }

    literals.push(args.literal);
    return args.literal;
  },

  createUser(
    parent: any,
    args: { data: { name: string; mail: string } },
    ctx: IContext,
    info: any
  ): IUser {
    const users: IUser[] = ctx.db.users;
    if (users.some(usr => usr.mail === args.data.mail)) {
      throw new Error('User mail is already in use');
    }

    const user: IUser = {
      ...args.data,
      active: true,
      id: uuidv4(),
    };

    users.push(user);
    return user;
  },

  deactivateUser(
    parent: any,
    args: { id: string },
    ctx: IContext,
    info: any
  ): IUser {
    const users: IUser[] = ctx.db.users;
    const userIndex = users.findIndex(user => user.id === args.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].active = false;
    return users[userIndex];
  },

  addTranslation(
    parent: any,
    args: {
      data: { literal: string; lang: string; tr: string; as_in?: string };
    },
    ctx: IContext,
    info: any
  ): ITranslation {
    const { literals, translations } = ctx.db;
    const existingLiteral = literals.some(lit => lit === args.data.literal);
    if (!existingLiteral) {
      throw new Error('Literal not found');
    }

    const translation: ITranslation = translations.find(
      tr => tr.literal === args.data.literal && tr.lang === args.data.lang
    );

    if (!translation) {
      const newTr: ITranslation = {
        ...args.data,
        translator: '1',
      };
      translations.push(newTr);
      return newTr;
    }

    Object.assign(translation, { ...args, translator: '1' });
    return translation;
  },
};

export { Mutation as default };

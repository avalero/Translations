import { IUser, ITranslation, IDB, IContext } from '../types';

// tslint:disable-next-line:variable-name
const Query = {
  translations(
    parent: any,
    args: { lang?: string },
    ctx: IContext,
    info: any
  ): ITranslation[] {
    const translations: ITranslation[] = ctx.db.translations;
    if (args.lang) {
      return translations.filter(tr => tr.lang === args.lang);
    }

    return translations;
  },

  users(parent: any, args: any, ctx: IContext, info: any): IUser[] {
    return ctx.db.users;
  },

  literalTranslation(
    parent: any,
    args: { lang?: string; literal: string },
    ctx: IContext,
    info: any
  ): ITranslation {
    if (!args.literal) {
      throw new Error('No literal specified');
    }

    // default language english
    const lang: string = args.lang || 'en';
    const translations: ITranslation[] = ctx.db.translations;
    return translations.find(
      tr => tr.literal === args.literal && tr.lang === lang
    );
  },

  literals(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.literals;
  },
};

export { Query as default };

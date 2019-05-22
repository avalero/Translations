import { IContext } from '../types';

// tslint:disable-next-line:variable-name
const User = {
  translations(parent, args, ctx: IContext, info) {
    return ctx.db.translations.filter(tr => tr.translator === parent.id);
  },
};

export { User as default };

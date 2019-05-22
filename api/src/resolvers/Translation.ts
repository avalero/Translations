import { IContext } from '../types';

// tslint:disable-next-line:variable-name
const Translation = {
  translator(parent, args, ctx: IContext, info) {
    return ctx.db.users.find(usr => usr.id === parent.translator);
  },
};

export { Translation as default };

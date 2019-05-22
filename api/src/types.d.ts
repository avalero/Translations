interface IUser {
  id: string;
  name: string;
  mail: string;
  active: boolean;
}

interface ITranslation {
  literal: string;
  as_in?: string;
  tr: string;
  translator: string;
  lang: string;
}

interface IDB {
  users: IUser[];
  translations: ITranslation[];
  literals: string[];
}

interface IContext {
  db: IDB;
}

export { ITranslation, IUser, IDB, IContext };

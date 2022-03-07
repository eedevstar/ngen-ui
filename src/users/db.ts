export type User = {
  id: number;
  email: string,
  fullname: string,
  role: string,
  customer_id: string,
  created: string,
  password: string
  // crew: [CrewDetails];
};

export type Db = {
  user: {
    selectedRows: Set<User['id']>;
  };
};

export type Filters = keyof Db['user'];

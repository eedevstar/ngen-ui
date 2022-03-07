import { CrewDetails } from '../../gen/ts/models'

export type Vessel = {
  id: number;
  name: string;
  callsign: string;
  registrationPort: string;
  registrationNumber: string;
  thumbnail: string;
  created: string;
  customer_id: string;
  crew: [CrewDetails];
};

export type Db = {
  vessels: {
    selectedRows: Set<Vessel['id']>;
  };
};

export type Filters = keyof Db['vessels'];

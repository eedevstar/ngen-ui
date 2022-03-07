import { FormName } from "forms/types";

export type CrewType = {
  active_crew: boolean;
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  coastal: boolean;
  locallimits: boolean;
  offshore: boolean;
  restrictedlimits: boolean;
  medicalcertno: string;
  medicalcertissued: string;
  medicalcertexpiry: string;
  firstaidno: string;
  firstaidissued: string;
  firstaidexpiry: string;
  notes: string;
  certoverdue: boolean;
  firstaidoverdue: boolean;
  customer_id: string;
  created: string;
  assigned_vessels: Array<string>;
};

export type Db = {
  forms: { [k in keyof FormName]: any };
};

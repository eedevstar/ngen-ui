// All form names we use under db.forms[formName} should be registered here
import { CrewDetails } from '../../gen/ts/models';

export const formNames = [
  'CrewAdd',
  'UserAdd',
  'VesselAdd',
  'AuditSurveyReviewForm',
  'CertDocForm',
  'CorrectiveActionForm',
  'EmergencyDrillForm',
  'MaintenanceItemForm',
  'SafetyEquipmentForm',
  'SparePartForm',
  'TrainingForm',
] as const;

export type FormFile = { name: string; type: string; file: File };

export type CrewForm = CrewDetails & {
  medicalCertImage: FormFile;
  firstAidCertImage: FormFile;
};
export type VesselForm = {};
export type UserForm = {};

export type Forms = {
  crew: CrewForm;
  vessel: VesselForm;
  user: UserForm;
};

export type FormId = keyof Forms;

export const formIds = ['crew', 'vessel', 'user'] as const;

export type FormMode = 'read' | 'create' | 'edit';

export type FormName = [FormMode, FormId];

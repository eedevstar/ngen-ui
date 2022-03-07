import { Values } from "./util";
import { routeEvent, RouteEventPayloads, routeIds } from "./routes/events";
import "./api/index";
import { vesselEvent, VesselEventPayloads } from "./vessels/events";
import "./vessels/handlers";
import { crewEvent, CrewEventPayloads } from "./crew/events";
import { FormEventPayloads, formEvt } from "./forms/events";
import { authEvent, AuthEventPayloads } from "./auth/events";
import { userEvent, UserEventPayloads } from "./users/handlers/events";
import { BaseEventPayloads, evt } from "./app/events";

export type EventPayloads = BaseEventPayloads &
  RouteEventPayloads &
  // APIEventPayloads &
  VesselEventPayloads &
  CrewEventPayloads &
  FormEventPayloads &
  UserEventPayloads &
  AuthEventPayloads;

export type Events = typeof evt &
  typeof routeEvent &
  // typeof apiEvent &
  typeof vesselEvent &
  typeof crewEvent &
  typeof formEvt &
  typeof authEvent &
  typeof userEvent &
  typeof routeIds; // last one for convenience

export type EventNames = Values<Events>;

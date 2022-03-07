/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  GridHeader,
  Icon,
  List,
  ModalCrew,
  SimpleGrid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Pagination,
} from "components";
import { theme } from "styles/theme";
import { component, createSub } from "framework-x";
import {
  getSelectedVesselDetail,
  getShowCrewListModal,
  getShowCrewAssignModal,
  getVesselShipParticular,
  getVesselStatuses,
  getTableSortBy,
  getVesselOverdueListType,
} from "../selectors";
import { routeEvent, routeIds } from "../../routes/events";
import { dispatch } from "../../store";
import { Vessel } from "../db";
import { vesselEvent } from "../events";
import { ModalAssignCrew } from "components/ModalAssignCrew";
import { getCrewList, getCrewStatuses } from "../../crew/selectors";
import * as R from "ramda";
import { getTrCssForOverDueStatus, overDueStatus } from "forms/helpers";
import { formatDate } from "../../util";
import { formEvt } from "forms/events";
import { getCurrentPageNumber, getPageSize } from "forms/selectors";
const ListItem = ({ name, url, overdueCount = 0, upcomingCount = 0 }) => {
  return (
    <Button
      size={"md"}
      leftIcon={"arrowRightLine"}
      css={{
        backgroundColor: "unset",
        borderRadius: 0,
        color: theme.colors.cyan[500],
        width: "100%",
        justifyContent: "flex-start",
        fontWeight: theme.fontWeights.medium,
        ":hover": { backgroundColor: theme.colors.blue[50] },
        position: "relative",
      }}
    >
      {name}
      {upcomingCount > 0 && (
        <Button
          size="sm"
          fontSize="13px"
          color={theme.colors.orange[300]}
          border={`solid 1px ${theme.colors.orange[300]}`}
          backgroundColor={`${theme.colors.orange[100]} !important`}
          boxShadow={"none !important"}
          cursor={"default"}
          position="absolute"
          right="5px"
          top="5px"
          padding="0"
          width="30px"
        >
          {upcomingCount}
        </Button>
      )}
      {overdueCount > 0 && (
        <Button
          size="sm"
          fontSize="13px"
          color={theme.colors.red[300]}
          border={`solid 1px ${theme.colors.red[300]}`}
          backgroundColor={`${theme.colors.red[100]} !important`}
          boxShadow={"none !important"}
          cursor={"default"}
          position="absolute"
          top="5px"
          right={upcomingCount > 0 ? "42px" : "5px"}
          padding="0"
          width="30px"
        >
          {overdueCount}
        </Button>
      )}
    </Button>
  );
};
const getOverDueCount = (type, data) =>
  R.filter((item) => item["category"] == type, R.pathOr({}, ["overdue"], data))
    .length;
const getUpcomingCount = (type, data) =>
  R.filter((item) => item["category"] == type, R.pathOr({}, ["upcoming"], data))
    .length;
const getDetailRoute = (category): string | null => {
  switch (category) {
    case "Certificate":
      return routeIds.VESSEL_CERTS_DETAIL;
    case "Audit":
      return routeIds.VESSEL_AUDITS_DETAIL;
    case "Drill":
      return routeIds.VESSEL_DRILLS_DETAIL;
    case "Review":
      return routeIds.VESSEL_REVIEWS_DETAIL;
    case "Survey":
      return routeIds.VESSEL_SURVEYS_DETAIL;
    case "Training":
      return routeIds.VESSEL_TRAINING_DETAIL;
    case "Maintenance":
      return routeIds.VESSEL_MAINT_DETAIL;
    case "HealthSafety":
      return routeIds.VESSEL_SAFETY_DETAIL;
    case "SafetyEquipment":
      return routeIds.VESSEL_EQUIP_DETAIL;
    case "Action":
      return routeIds.VESSEL_ACTIONS_DETAIL;
    case "crew details":
    case "CrewCertificate":
      return routeIds.CREW_DETAIL;
  }
  return null;
};
const getCategoryTitle = (category: string, param?: string): string | null => {
  switch (category) {
    case "Certificate":
      return "Certificate/Document";
    case "Audit":
      return "Audit";
    case "Drill":
      return "Emergency Drill";
    case "Review":
      return "Review";
    case "Survey":
      return "Survey";
    case "Training":
      return "Training";
    case "Maintenance":
      return "Maintenance";
    case "HealthSafety":
      return "Health & Safety";
    case "SafetyEquipment":
      return "Equipment";
    case "Action":
      return "Corrective Action";
    case "CrewCertificate":
      return "Crew Certifcate";
    case "crew details":
      let sub = "";
      if (param == "first_aid") sub = " First Aid";
      else if (param == "medical") sub = " Medical";
      return "Crew " + sub;
  }
  return null;
};

export default component(
  "VesselDetail",
  createSub({
    vessel: getSelectedVesselDetail,
    getShowCrewListModal,
    getShowCrewAssignModal,
    shipParticular: getVesselShipParticular,
    vesselStatuses: getVesselStatuses,
    crewStatuses: getCrewStatuses,
    getCrewList,
    sortBy: getTableSortBy("overdue_upcoming"),
    overdueTableType: getVesselOverdueListType,
    perPage: getPageSize("vessel-overdue"),
    currentPage: getCurrentPageNumber("vessel-overdue"),
  }),
  ({
    vessel,
    showCrewListModal,
    showCrewAssignModal,
    shipParticular,
    vesselStatuses,
    crewStatuses,
    crewList,
    sortBy,
    overdueTableType,
    perPage,
    currentPage,
    dispatch,
  }: {
    vessel: Vessel;
    showCrewListModal: any;
    showCrewAssignModal: any;
    shipParticular: any;
    vesselStatuses: any;
    crewList: any;
    sortBy: any;
    overdueTableType: any;
    crewStatuses: any;
    perPage: number;
    currentPage: number;
  }) => {
    if (!vessel) return null;
    const vesselStatus = R.pathOr(null, ["vessels", vessel.id], vesselStatuses);
    const overdueUpcomingList = R.concat(
      R.map((item) => {
        item["status"] = overDueStatus.OVERDUE;
        item["parentId"] = vessel.id;
        return item;
      }, R.pathOr([], ["overdue"], vesselStatus)),
      R.map((item) => {
        item["status"] = overDueStatus.BEING;
        item["parentId"] = vessel.id;
        return item;
      }, R.pathOr([], ["upcoming"], vesselStatus))
    );
    if (sortBy == null) {
      sortBy = ["dueDate", "desc"];
    }
    const sortedOverdueUpcomingList = R.sort((a, b) => {
      if (sortBy[0] == "dueDate") {
        return (
          (new Date(a[sortBy[0]]).getTime() -
            new Date(b[sortBy[0]]).getTime()) *
          (sortBy[1] == "asc" ? 1 : -1)
        );
      } else {
        return (
          (a[sortBy[0]].toLowerCase() < b[sortBy[0]].toLowerCase(0) ? -1 : 1) *
          (sortBy[1] == "asc" ? 1 : -1)
        );
      }
    }, R.values(overdueUpcomingList));
    const overdueUpcomingTableHeaders = [
      { key: "category", label: "Category" },
      { key: "name", label: "Name" },
      { key: "dueDate", label: "Due Date/Expiry Date" },
    ];

    const { crew } = vessel;
    const crewSize = crew.length;
    const onSelect = ({ routeId }) =>
      dispatch(routeEvent.NAV_TO, [routeId, { id: vessel.id }]);
    //CrewCerts Overdue & Upcoming
    let crewCertsOverdueUpcomings = [];
    R.forEach((item) => {
      const crewStatus = R.pathOr(null, ["crewMembers", item.id], crewStatuses);
      if (crewStatus) {
        //overdue
        R.forEach((cItem) => {
          let nItem = R.clone(cItem);
          // if (cItem["category"] == "CrewCertificate") {
          nItem["status"] = overDueStatus.OVERDUE;
          nItem["parentId"] = item.id;
          if (nItem["category"] == "crew details") {
            nItem["type"] = nItem["name"];
            nItem["name"] = `${item.firstname} ${item.lastname}`;
          }
          crewCertsOverdueUpcomings = R.append(
            nItem,
            crewCertsOverdueUpcomings
          );
          // }
        }, crewStatus.overdue);
        //upcoming
        R.forEach((cItem) => {
          // if (cItem["category"] == "CrewCertificate") {
          let nItem = R.clone(cItem);
          nItem["status"] = overDueStatus.BEING;
          nItem["parentId"] = item.id;
          if (nItem["category"] == "crew details") {
            nItem["type"] = nItem["name"];
            nItem["name"] = `${item.firstname} ${item.lastname}`;
          }
          crewCertsOverdueUpcomings = R.append(
            nItem,
            crewCertsOverdueUpcomings
          );
          // }
        }, crewStatus.upcoming);
      }
    }, crew);
    const sortedCrewCertsOverdueUpcomings = R.sort((a, b) => {
      if (sortBy[0] == "dueDate") {
        return (
          (new Date(a[sortBy[0]]).getTime() -
            new Date(b[sortBy[0]]).getTime()) *
          (sortBy[1] == "asc" ? 1 : -1)
        );
      } else {
        return (
          (a[sortBy[0]].toLowerCase() < b[sortBy[0]].toLowerCase(0) ? -1 : 1) *
          (sortBy[1] == "asc" ? 1 : -1)
        );
      }
    }, R.values(crewCertsOverdueUpcomings));

    const tableRows =
      overdueTableType == "crew"
        ? sortedCrewCertsOverdueUpcomings
        : sortedOverdueUpcomingList;

    function changePage(c) {
      dispatch(formEvt.SET_CURRENT_PAGE, { page: "vessel-overdue", num: c });
    }

    function changePageSize(c) {
      dispatch(formEvt.SET_PAGE_SIZE, { page: "vessel-overdue", count: c });
    }
    return (
      <React.Fragment>
        <ModalCrew
          crew={crew}
          vessel={vessel}
          isOpen={showCrewListModal}
          onClose={() => {
            dispatch(vesselEvent.HIDE_CREW_LIST);
          }}
        />
        <ModalAssignCrew
          allCrews={crewList}
          vessel={vessel}
          isOpen={showCrewAssignModal}
          onClose={() => {
            dispatch(vesselEvent.HIDE_CREW_ASSIGN);
          }}
        />
        <Box pt={5} pb={8}>
          <SimpleGrid columns={2} spacing={12}>
            <Flex direction={"column"}>
              <Flex
                css={{
                  border: `1px solid ${theme.colors.gray[100]}`,
                  marginBottom: 16,
                  fontSize: theme.fontSizes.sm,
                  borderRadius: 4,
                }}
              >
                <Stack
                  css={{
                    backgroundColor: theme.colors.gray[50],
                    borderRight: `1px solid ${theme.colors.gray[100]}`,
                    color: theme.colors.gray[400],
                    paddingTop: 16,
                    paddingLeft: 16,
                    paddingRight: 32,
                    paddingBottom: 20,
                    "& > *": {
                      fontFamily: theme.fonts.heading + " !important",
                    },
                  }}
                >
                  <Text>Name</Text>
                  <Text>Radio Callsign</Text>
                  <Text>Port of Registry</Text>
                  <Text>IMO/Official number</Text>
                  <Text>Assigned Crew</Text>
                </Stack>
                <Stack
                  css={{
                    paddingLeft: 20,
                    paddingTop: 16,
                  }}
                >
                  <Text>{vessel.name}</Text>
                  <Text>{vessel.callsign}</Text>
                  <Text>{vessel.registrationPort}</Text>
                  <Text>{vessel.registrationNumber}</Text>
                  <Text>{crewSize}</Text>
                </Stack>
              </Flex>
              <SimpleGrid columns={3} spacing={4}>
                <Button
                  bg={"cyan.500"}
                  _hover={{ backgroundColor: "cyan.400" }}
                  disabled={!shipParticular}
                  onClick={() =>
                    dispatch(vesselEvent.DOWNLOAD_DOCUMENT, {
                      id: shipParticular.id,
                    })
                  }
                >
                  Download
                </Button>
                <Button
                  bg={"cyan.500"}
                  _hover={{ backgroundColor: "cyan.400" }}
                  onClick={() => dispatch(vesselEvent.SHOW_CREW_LIST)}
                >
                  Crew
                </Button>
                <Button
                  bg={"cyan.500"}
                  _hover={{ backgroundColor: "cyan.400" }}
                  onClick={() =>
                    dispatch(routeEvent.NAV_TO, [
                      routeIds.VESSEL_EDIT,
                      { id: vessel.id },
                    ])
                  }
                >
                  Edit
                </Button>
              </SimpleGrid>
            </Flex>
            <Box
              css={{
                backgroundImage: `url('data:image/png;base64,${vessel.thumbnail}')`,
                borderRadius: 4,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </SimpleGrid>
          <Divider marginBottom={8} marginTop={8} />
          <SimpleGrid minChildWidth={264} spacing={4} marginBottom={12}>
            <List
              key={"vessel-sub1"}
              onSelect={onSelect}
              ListItem={ListItem}
              header={"Documents"}
              items={[
                {
                  name: "Certificates & Documents",
                  routeId: routeIds.VESSEL_CERTS,
                  key: "vessel-cert",
                  overdueCount: getOverDueCount("Certificate", vesselStatus),
                  upcomingCount: getUpcomingCount("Certificate", vesselStatus),
                },
                {
                  name: "Audits",
                  routeId: routeIds.VESSEL_AUDITS,
                  key: "vessel-audit",
                  overdueCount: getOverDueCount("Audit", vesselStatus),
                  upcomingCount: getUpcomingCount("Audit", vesselStatus),
                },
                {
                  name: "Surveys",
                  routeId: routeIds.VESSEL_SURVEYS,
                  key: "vessel-survey",
                  overdueCount: getOverDueCount("Survey", vesselStatus),
                  upcomingCount: getUpcomingCount("Survey", vesselStatus),
                },
                {
                  name: "Reviews",
                  routeId: routeIds.VESSEL_REVIEWS,
                  key: "vessel-review",
                  overdueCount: getOverDueCount("Review", vesselStatus),
                  upcomingCount: getUpcomingCount("Review", vesselStatus),
                },
              ]}
            />
            <List
              key={"vessel-sub2"}
              onSelect={onSelect}
              ListItem={ListItem}
              header={"Safety"}
              items={[
                {
                  name: "Emergency Drills",
                  routeId: routeIds.VESSEL_DRILLS,
                  key: "vessel-drill",
                  overdueCount: getOverDueCount("Drill", vesselStatus),
                  upcomingCount: getUpcomingCount("Drill", vesselStatus),
                },
                {
                  name: "Training",
                  routeId: routeIds.VESSEL_TRAINING,
                  key: "vessel-training",
                  overdueCount: getOverDueCount("Training", vesselStatus),
                  upcomingCount: getUpcomingCount("Training", vesselStatus),
                },
                {
                  name: "Equipment",
                  routeId: routeIds.VESSEL_EQUIP,
                  key: "vessel-equipment",
                  overdueCount: getOverDueCount(
                    "SafetyEquipment",
                    vesselStatus
                  ),
                  upcomingCount: getUpcomingCount(
                    "SafetyEquipment",
                    vesselStatus
                  ),
                },
                {
                  name: "Health & Safety",
                  routeId: routeIds.VESSEL_SAFETY,
                  key: "vessel-health",
                  overdueCount: getOverDueCount("HealthSafety", vesselStatus),
                  upcomingCount: getUpcomingCount("HealthSafety", vesselStatus),
                },
              ]}
            />
            <List
              key={"vessel-sub3"}
              onSelect={onSelect}
              ListItem={ListItem}
              header={"Vessel"}
              items={[
                {
                  name: "Maintenance",
                  routeId: routeIds.VESSEL_MAINT,
                  key: "vessel-maintenance",
                  overdueCount: getOverDueCount("Maintenance", vesselStatus),
                  upcomingCount: getUpcomingCount("Maintenance", vesselStatus),
                },
                {
                  name: "Spare Parts",
                  routeId: routeIds.VESSEL_PARTS,
                  key: "vessel-part",
                },
                {
                  name: "Corrective Actions",
                  routeId: routeIds.VESSEL_ACTIONS,
                  key: "vessel-actions",
                  // TODO: Need to implement this on the backend.:
                  overdueCount: getOverDueCount("Action", vesselStatus),
                  upcomingCount: getUpcomingCount("Action", vesselStatus),
                },
                {
                  name: "Repair Request",
                  routeId: routeIds.VESSEL_REPAIRS,
                  key: "vessel-repairs",
                  overdueCount: getOverDueCount("Repair", vesselStatus),
                  upcomingCount: getUpcomingCount("Repair", vesselStatus),
                },
              ]}
            />
          </SimpleGrid>
          {vesselStatus && (
            <Box>
              <Stack
                direction={"row"}
                alignItems={"baseline"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} alignItems={"baseline"}>
                  <Text
                    css={{
                      fontFamily: theme.fonts.heading,
                      fontSize: theme.fontSizes.md,
                      color: theme.colors.blue[900],
                    }}
                  >
                    {"Overdue and Upcoming Tasks"}
                  </Text>
                  <Text
                    css={{
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.gray[400],
                    }}
                  >
                    {R.length(vesselStatus.overdue) +
                      R.length(vesselStatus.upcoming) +
                      R.length(crewCertsOverdueUpcomings)}{" "}
                    total (
                    {R.length(vesselStatus.overdue) +
                      R.length(vesselStatus.upcoming)}{" "}
                    Vessel, {R.length(crewCertsOverdueUpcomings)} Crew)
                  </Text>
                </Stack>
                <ButtonGroup>
                  <Button
                    size={"sm"}
                    variant={overdueTableType != "crew" ? "solid" : "outline"}
                    color={
                      overdueTableType != "crew"
                        ? "white"
                        : theme.colors.cyan[500]
                    }
                    variantColor={"cyan"}
                    onClick={() => [
                      changePage(1),
                      dispatch(vesselEvent.SWITCH_OVERDUE_TABLE, {
                        type: "vessel",
                      }),
                    ]}
                  >
                    Vessel
                  </Button>
                  <Button
                    size={"sm"}
                    variant={overdueTableType == "crew" ? "solid" : "outline"}
                    color={
                      overdueTableType == "crew"
                        ? "white"
                        : theme.colors.cyan[500]
                    }
                    outline={"0"}
                    variantColor={"cyan"}
                    onClick={() => [
                      changePage(1),
                      dispatch(vesselEvent.SWITCH_OVERDUE_TABLE, {
                        type: "crew",
                      }),
                    ]}
                  >
                    Crew
                  </Button>
                </ButtonGroup>
              </Stack>
              <Divider marginBottom={3} />
              <Stack direction={"column"} alignItems={"end"}>
                <Pagination
                  total={R.length(tableRows)}
                  perPage={perPage}
                  currentPage={currentPage}
                  changePageCallback={changePage}
                  changePageSizeCallback={changePageSize}
                />
              </Stack>
              <Table marginTop={2}>
                <TableHead>
                  <TableRow>
                    {overdueUpcomingTableHeaders.map((row, index) => (
                      <TableHeader
                        cursor="pointer"
                        onClick={() =>
                          dispatch(vesselEvent.SORT_TABLE, {
                            table: "overdue_upcoming",
                            key: row.key,
                            dir:
                              sortBy[0] != row.key
                                ? "asc"
                                : sortBy[1] == "desc"
                                ? "asc"
                                : "desc",
                          })
                        }
                        textAlign={index == 2 ? "right" : "left"}
                      >
                        {row.label}
                        {sortBy[0] == row.key ? (
                          <Icon
                            name={`chevron-${
                              sortBy[1] == "desc" ? "down" : "up"
                            }`}
                            size="16px"
                          />
                        ) : (
                          <Icon name={`chevron-up`} size="16px" opacity="0" />
                        )}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {R.slice(
                    (currentPage - 1) * perPage,
                    currentPage * perPage,
                    tableRows
                  ).map((row) => (
                    <TableRow
                      fontSize="sm"
                      {...getTrCssForOverDueStatus(row, row.status)}
                      onClick={() => {
                        dispatch(formEvt.SET_BACK_PAGE_TYPE, {
                          type: "vessel",
                        });
                        dispatch(routeEvent.NAV_TO, [
                          getDetailRoute(row.category),
                          { id: row.parentId, childId: row.id },
                        ]);
                      }}
                    >
                      <TableCell>
                        <Text>{getCategoryTitle(row.category, row?.type)}</Text>
                      </TableCell>
                      <TableCell>
                        <Text>{row.name}</Text>
                      </TableCell>
                      <TableCell textAlign="right">
                        <Text>{formatDate(row.dueDate)}</Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </React.Fragment>
    );
  }
);

/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  GridHeader,
  Icon,
  IconButton,
  List,
  SimpleGrid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  Text,
} from "components";
import { component, createSub } from "framework-x";
import {
  getCrewCertsById,
  getCrewCertsList,
  getSelectedCrewDetail,
} from "../selectors";
import { CrewType } from "../db";
import { routeEvent, routeIds } from "../../routes/events";
import { formatDate } from "../../util";
import { overDueStatus, getTrCssForOverDueStatus } from "forms/helpers";
import { theme } from "styles/theme";
import { StatusIcon } from "components/StatusIcon";
import { Skeleton } from "@chakra-ui/core";
import * as R from "ramda";
import { formEvt } from "forms/events";
import { getCurrentPageNumber, getPageSize } from "forms/selectors";
import { getTableSortBy } from "vessels/selectors";
import { vesselEvent } from "vessels/events";

const certHeaders = [
  { label: "Qualification", name: "qualification" },
  { label: "Certificate Number", name: "certNumber" },
  { label: "Issued", name: "issueDate" },
  { label: "Expires", name: "expiryDate" },
];
const guessFormatColumn = (fieldName, value) => {
  if (value == null) return "";
  return fieldName.toLowerCase().includes("date")
    ? formatDate(value)
    : value.toString();
};
const Entitlements = ({ name, checked }) => (
  <Box fontSize={"sm"} fontWeight={"regular"} px={3} py={2}>
    <Icon
      name={checked ? "check" : "close"}
      color={checked ? "green.400" : "red.400"}
      marginRight={2}
    />
    {name}
  </Box>
);

const MedicalFirstAid = ({ value, icon, label, status }) => (
  <Flex
    px={3}
    py={2}
    alignItems={"flex-start"}
    bg={"white"}
    position="relative"
  >
    <Icon my={1} name={icon} color={"gray.500"} marginRight={2} />
    <Stack spacing={0}>
      <Text fontFamily={"heading"} fontSize={"sm"} color={"gray.500"}>
        {label}
      </Text>
      <Text fontSize={"sm"} fontWeight={"regular"} color={"black"}>
        {value}
      </Text>
    </Stack>
    <StatusIcon status={status} />
  </Flex>
);

export default component(
  "CrewDetail",
  createSub({
    crew: getSelectedCrewDetail,
    certs: getCrewCertsById,
    perPage: getPageSize("crew-certs"),
    currentPage: getCurrentPageNumber("crew-certs"),
    sortBy: getTableSortBy("crew-certs"),
  }),
  ({
    crew,
    certs,
    perPage,
    currentPage,
    sortBy,
    dispatch,
  }: {
    crew: CrewType;
    certs: any;
    dispatch?: any;
  }) => {
    if (!crew) return null; //todo: loading
    const {
      id,
      firstname,
      lastname,
      active_crew,
      role,
      coastal,
      locallimits,
      offshore,
      restrictedlimits,
      medicalcertno,
      medicalcertissued,
      medicalcertexpiry,
      firstaidno,
      firstaidissued,
      firstaidexpiry,
      notes,
      certoverdue,
      certupcoming,
      firstaidoverdue,
      firstaidupcoming,
      customer_id,
      created,
      assigned_vessels,
    } = crew;

    const entitlements = [
      { name: "Coastal", checked: coastal },
      { name: "Local Limits", checked: locallimits },
      { name: "Restricted Limits", checked: restrictedlimits },
      { name: "Off shore", checked: offshore },
    ];

    const medical = [
      { label: "Certificate Number", value: medicalcertno, icon: "document" },
      {
        label: "Issued",
        value: formatDate(medicalcertissued),
        icon: "documentIssued",
        status: overDueStatus.NORMAL,
      },
      {
        label: "Expires",
        value: formatDate(medicalcertexpiry),
        icon: "documentExpires",
        status: certoverdue
          ? overDueStatus.OVERDUE
          : certupcoming
          ? overDueStatus.BEING
          : overDueStatus.NORMAL,
      },
    ];

    const firstAid = [
      { label: "Certificate Number", value: firstaidno, icon: "document" },
      {
        label: "Issued",
        value: formatDate(firstaidissued),
        icon: "documentIssued",
        status: overDueStatus.NORMAL,
      },
      {
        label: "Expires",
        value: formatDate(firstaidexpiry),
        icon: "documentExpires",
        status: firstaidoverdue
          ? overDueStatus.OVERDUE
          : firstaidupcoming
          ? overDueStatus.BEING
          : overDueStatus.NORMAL,
      },
    ];

    function changePage(c) {
      dispatch(formEvt.SET_CURRENT_PAGE, { page: "crew-certs", num: c });
    }
    function changePageSize(c) {
      dispatch(formEvt.SET_PAGE_SIZE, { page: "crew-certs", count: c });
    }

    let crewCerts = R.filter(R.propEq("crewId", id))(R.values(certs));

    if (!sortBy) {
      sortBy = ["expiryDate", "desc"];
    }
    crewCerts = R.sort((a, b) => {
      if (R.indexOf(sortBy[0], ["expiryDate", "issueDate"]) > -1) {
        return (
          (new Date(a[sortBy[0]]).getTime() -
            new Date(b[sortBy[0]]).getTime()) *
          (sortBy[1] == "asc" ? 1 : -1)
        );
      } else {
        return (
          (R.toLower(a[sortBy[0]] === null ? "" : a[sortBy[0]]) <
          R.toLower(b[sortBy[0]] === null ? "" : b[sortBy[0]])
            ? -1
            : 1) * (sortBy[1] == "asc" ? 1 : -1)
        );
      }
    }, R.values(crewCerts));
    return (
      <Box pt={5} pb={8}>
        <Flex direction={"row"} h={220} justifyContent={"space-between"}>
          <Flex>
            <Avatar name={`${firstname} ${lastname}`} w={220} h={220} mr={12} />
            {/*<Box*/}
            {/*  marginRight={12}*/}
            {/*  css={{*/}
            {/*    backgroundImage: `url('${imageSrc}')`,*/}
            {/*    width: 220,*/}
            {/*    backgroundPosition: 'center',*/}
            {/*    backgroundSize: 'cover',*/}
            {/*    borderRadius: '100%',*/}
            {/*  }}*/}
            {/*/>*/}
            <Box>
              <Box marginBottom={3}>
                <Text fontFamily={"heading"} fontSize={"2xl"}>
                  {`${firstname} ${lastname}`}
                </Text>
                <Text fontSize={"sm"} color={"gray.600"}>
                  {role}
                </Text>
              </Box>
              <Box marginBottom={5}>
                <SimpleGrid columns={2} spacing={4}>
                  <Text
                    fontFamily={"heading"}
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    color={"gray.500"}
                  >
                    Status:
                  </Text>
                  <Text fontSize={"sm"} color={"gray.400"}>
                    {active_crew ? "Active" : "Inactive"}
                  </Text>
                </SimpleGrid>
              </Box>
              <Box>
                <Text
                  fontFamily={"heading"}
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  color={"gray.500"}
                >
                  Notes
                </Text>
                <Text fontSize={"sm"} color={"gray.400"}>
                  {notes ? notes : "No notes to display"}
                </Text>
              </Box>
            </Box>
          </Flex>
          <Button
            w={128}
            bg={"cyan.500"}
            _hover={{ backgroundColor: "cyan.400" }}
            onClick={() =>
              dispatch(routeEvent.NAV_TO, [routeIds.CREW_EDIT, { id: id }])
            }
          >
            Edit
          </Button>
        </Flex>
        <Divider marginBottom={8} marginTop={8} />
        <SimpleGrid minChildWidth={264} spacing={4} marginBottom={12}>
          <List
            ListItem={Entitlements}
            header={"Entitlements"}
            items={entitlements}
          />
          <List ListItem={MedicalFirstAid} header={"Medical"} items={medical} />
          <List
            ListItem={MedicalFirstAid}
            header={"First Aid"}
            items={firstAid}
          />
        </SimpleGrid>
        <Box>
          <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems="center">
              <GridHeader
                entityName={"Certifications"}
                entities={crewCerts}
                showTotal={false}
              />
              <Stack direction={"row"}>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  variantColor={"cyan"}
                  marginLeft="1rem"
                  leftIcon={"addCircle"}
                  onClick={() => {
                    dispatch(routeEvent.NAV_TO, [
                      routeIds.CREW_CERTS_ADD,
                      { id: id },
                    ]);
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Stack>
            <Pagination
              total={R.length(crewCerts)}
              perPage={perPage}
              currentPage={currentPage}
              changePageCallback={changePage}
              changePageSizeCallback={changePageSize}
            />
          </Flex>
          <Divider marginBottom={8} />
          {certs == undefined ? (
            <Stack spacing="1px">
              <Skeleton height="37px" />
              <Skeleton height="37px" />
              <Skeleton height="37px" />
            </Stack>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {certHeaders.map((c) => (
                    <TableHeader
                      cursor="pointer"
                      onClick={() =>
                        dispatch(vesselEvent.SORT_TABLE, {
                          table: "crew-certs",
                          key: c.name,
                          dir:
                            sortBy[0] != c.name
                              ? "asc"
                              : sortBy[1] == "desc"
                              ? "asc"
                              : "desc",
                        })
                      }
                    >
                      {c.label}
                      {sortBy && sortBy[0] == c.name && (
                        <Icon
                          name={`chevron-${
                            sortBy[1] == "desc" ? "down" : "up"
                          }`}
                          size="16px"
                        />
                      )}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {crewCerts &&
                  R.slice(
                    (currentPage - 1) * perPage,
                    currentPage * perPage,
                    crewCerts
                  ).map((row) => (
                    <TableRow
                      fontSize="sm"
                      {...getTrCssForOverDueStatus(row)}
                      onClick={() => {
                        dispatch(routeEvent.NAV_TO, [
                          routeIds.CREW_CERTS_DETAIL,
                          { id: crew.id, childId: row.id },
                        ]);
                      }}
                    >
                      {certHeaders.map((c) => (
                        <TableCell>
                          <Text>{guessFormatColumn(c.name, row[c.name])}</Text>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    );
  }
);

/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Box, Button, PseudoBox } from "components/standalone";
import { BoxProps } from "@chakra-ui/core";
import { component, createSub } from "framework-x";
import { getRouteId } from "../../../routes/selectors";
import {
  GridHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Icon,
  Pagination,
  CategoryFilter,
} from "../../../components";
import { theme } from "styles/theme";
import {
  getSelectedVesselId,
  getVesselSubColumnNames,
  getVesselSubEntityList,
  getVesselSubEntityName,
  getVesselSubEntityLabel,
  getTableSortBy,
  getVesselSubPageSize,
  getVesselSubCurrentPage,
  getVesselSubTableSortBy,
  getVesselSubEntityTags,
  getVesselSubCurrentTag,
} from "../../selectors";
import * as R from "ramda";
import { Divider, Flex, Stack } from "../../../components/standalone";
import { routeEvent } from "../../../routes/events";
import { formatDate } from "../../../util";
import { getOverDueStatus, getTrCssForOverDueStatus } from "forms/helpers";
import { formEvt } from "forms/events";
import { vesselEvent } from "vessels/events";
import { fx } from "store";

const thLabels = {
  name: "Name",
  notes: "Notes",
  cert_type: "Type",
  due_date: "Due",
  completed_date: "Completed",
  overdue: "Overdue",
  document_number: "Doc ID",
  issue_date: "Issued",
  expiry_date: "Expires",
  drill: "Drill",
  survey_required: "Survey",
  created: "Created",
  tag: "Tag",
  doc_no: "Doc No",
  date_issued: "Issued",
  survey: "Survey",
  reminder_frq: "Reminder Frequency",
  complete: "Complete",
  upcoming: "Upcoming",
  maintenance_complete: "Completed",
  action: "Title",
  date_completed: "Completed",
  fix_by_date: "Fix by date",
  date_added: "Added",
  location: "Location",
  quantity: "Quantity",
  category: "Category",
  description: "Description",
  reported_date: "Reported",
  reported_by: "Reporter",
  priority: "Priority",
  required_action: "Required Action",
  signed_off_by: "Signed off",
};

const guessFormatColumn = (fieldName, value) => {
  if (value == null) return "";
  if (fieldName == "maintenance_complete") {
    return !value ? "No" : "Yes";
  }
  return fieldName.includes("date") || fieldName == "created"
    ? formatDate(value)
    : value.toString();
};
const getColumLabel = (name) => {
  return !thLabels[name] ? name : thLabels[name];
};
export const GenericVesselSubList = component(
  "GenericVesselSubList",
  createSub({
    getSelectedVesselId,
    routeId: getRouteId,
    entityLabel: getVesselSubEntityLabel,
    entityName: getVesselSubEntityName,
    entities: getVesselSubEntityList,
    columns: getVesselSubColumnNames,
    perPage: getVesselSubPageSize,
    currentPage: getVesselSubCurrentPage,
    sortBy: getVesselSubTableSortBy,
    // categories: getVesselSubEntityTags,
    currentCategory: getVesselSubCurrentTag,
  }),
  ({
    selectedVesselId,
    routeId,
    entityName,
    entityLabel,
    entities,
    columns,
    perPage,
    currentPage,
    sortBy,
    dispatch,
    // categories,
    currentCategory,
  }) => {
    let categories = R.uniq(
      R.map(
        (item) => (entityName == "vesselcert" ? item.cert_type : item.tag),
        entities
      )
    );

    if (
      (R.indexOf("tag", columns) > -1 ||
        R.indexOf("cert_type", columns) > -1) &&
      currentCategory != "All"
    ) {
      entities = R.filter((item) => {
        if (entityName == "vesselcert") {
          return item.cert_type == currentCategory;
        } else {
          return item.tag == currentCategory;
        }
      }, entities);
    }

    if (sortBy == null) {
      switch (entityName) {
        case "vesselcert":
        case "safetyequipment":
          sortBy = ["expiry_date", "desc"];
          break;
        case "audit":
        case "survey":
        case "review":
        case "training":
        case "drill":
        case "health":
        case "maintenance":
        case "requests":
          sortBy = ["due_date", "desc"];
          break;
        case "part":
          sortBy = ["date_added", "desc"];
          break;
        case "action":
          sortBy = ["date_issued", "desc"];
          break;
      }
    }

    entities = R.sort((a, b) => {
      if (
        R.indexOf(sortBy[0], [
          "expiry_date",
          "due_date",
          "date_added",
          "date_issued",
          "date_completed",
          "completed_date",
          "issue_date",
        ]) > -1
      ) {
        return (
          (new Date(a[sortBy[0]]).getTime() -
            new Date(b[sortBy[0]]).getTime()) *
          (sortBy[1] == "asc" ? 1 : -1)
        );
      } else if (
        R.indexOf(sortBy[0], ["survey_required", "maintenance_complete"]) > -1
      ) {
        return a[sortBy[0]] === b[sortBy[0]]
          ? 0
          : (a[sortBy[0]] ? 1 : -1) * (sortBy[1] == "asc" ? 1 : -1);
      } else if (R.indexOf(sortBy[0], ["priority"]) > -1) {
        return (a[sortBy[0]] - b[sortBy[0]]) * (sortBy[1] == "asc" ? 1 : -1);
      } else {
        return (
          (R.toLower(a[sortBy[0]] === null ? "" : a[sortBy[0]]) <
          R.toLower(b[sortBy[0]] === null ? "" : b[sortBy[0]])
            ? -1
            : 1) * (sortBy[1] == "asc" ? 1 : -1)
        );
      }
    }, entities);

    function changePage(c) {
      dispatch(formEvt.SET_CURRENT_PAGE, { page: entityName, num: c });
    }
    function changePageSize(c) {
      dispatch(formEvt.SET_PAGE_SIZE, { page: entityName, count: c });
    }
    function changeCategory(c) {
      dispatch(formEvt.SET_CATEGORY_FILTER, { page: entityName, category: c });
    }
    return (
      <Box pt={5}>
        <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
          <Stack direction={"row"} alignItems="center">
            <GridHeader
              entities={entities}
              entityName={entityLabel}
              showTotal={false}
            />

            <Stack direction={"row"}>
              case 'add': return (
              <Button
                size={"sm"}
                variant={"outline"}
                variantColor={"cyan"}
                leftIcon={"addCircle"}
                marginLeft="1rem"
                onClick={() => {
                  dispatch(routeEvent.NAV_TO, [routeId + "/add"]);
                }}
              >
                Add
              </Button>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems="center">
            <Pagination
              total={R.length(entities)}
              perPage={perPage}
              currentPage={currentPage}
              changePageCallback={changePage}
              changePageSizeCallback={changePageSize}
            />
            {(R.indexOf("tag", columns) > -1 ||
              R.indexOf("cert_type", columns) > -1) && (
              <CategoryFilter
                categories={categories}
                selected={currentCategory}
                changeCategoryCallback={changeCategory}
              />
            )}
          </Stack>
        </Flex>
        <Divider marginBottom={8} />
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableHeader
                  key={c}
                  cursor="pointer"
                  onClick={() =>
                    dispatch(vesselEvent.SORT_TABLE, {
                      table: entityName,
                      key: c,
                      dir:
                        sortBy[0] != c
                          ? "asc"
                          : sortBy[1] == "desc"
                          ? "asc"
                          : "desc",
                    })
                  }
                >
                  {getColumLabel(c == "tag" ? "category" : c)}
                  {sortBy && sortBy[0] == c && (
                    <Icon
                      name={`chevron-${sortBy[1] == "desc" ? "down" : "up"}`}
                      size="16px"
                    />
                  )}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {R.slice(
              (currentPage - 1) * perPage,
              currentPage * perPage,
              entities
            ).map((row) => (
              <TableRow
                key={row.id}
                fontSize="sm"
                flag={row.flag}
                {...getTrCssForOverDueStatus(row)}
                onClick={() => {
                  dispatch(formEvt.SET_BACK_PAGE_TYPE, { type: "list" });
                  dispatch(routeEvent.NAV_TO, [
                    routeId + `/detail`,
                    { id: selectedVesselId, childId: row.id },
                  ]);
                }}
              >
                {columns.map((c) => (
                  <TableCell key={c}>
                    <Text>{guessFormatColumn(c, row[c])}</Text>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  }
);
export default GenericVesselSubList;

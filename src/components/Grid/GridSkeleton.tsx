/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Box, Divider, Flex } from "components/standalone";
import { Grid as ChakraGrid, Skeleton } from "@chakra-ui/core";
import { GridHeader } from "./GridHeader";

export function GridSkeleton({ entityName }: { entityName?: string }) {
  return (
    <Box>
      <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
        <GridHeader entities={null} entityName={entityName} />
      </Flex>
      <Divider marginBottom={8} />
      <ChakraGrid templateColumns="repeat(4, 1fr)" gap={6}>
        <Skeleton height="150px" />
        <Skeleton height="150px" />
        <Skeleton height="150px" />
        <Skeleton height="150px" />
      </ChakraGrid>
    </Box>
  );
}

import type { GetServerSidePropsContext } from "next";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "../../server/db";
import type { Property, PropertyUpdates } from "@prisma/client";
import {
  Box,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  IconButton,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import ReactEcharts from "echarts-for-react";
import Image from "next/image";
import { formatAsCurrency } from "~/helpers/currency";
import { DateTime } from "luxon";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "~/utils/api";

type ExtendedProperty = Property & { PropertyUpdates: PropertyUpdates[] };

interface Props {
  property: ExtendedProperty;
}

const PropertyDetails = ({ property }: Props) => {
  const toast = useToast();
  const [propertyArchived, setPropertyArchived] = React.useState(
    property.archived
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dates: string[] =
    property.PropertyUpdates?.map((update) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      DateTime.fromISO(update.createdAt.toString()).toLocaleString(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        DateTime.DATE_SHORT
      )
    ) || [];
  const values = property.PropertyUpdates?.map((update) => update.price) || [];
  const option = {
    xAxis: {
      type: "category",
      data: [...dates],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [...values],
        type: "line",
      },
    ],
  };

  const { mutate, isLoading } = api.rightMove.archive.useMutation({
    onSuccess: () => {
      toast({
        title: "Property archived",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setPropertyArchived(true);
    },
    onError: (err) => {
      toast({
        title: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  const handleArchive = () => {
    mutate({ id: property.id });
  };

  return (
    <Container maxW="container.lg">
      {property.image && (
        <Box position="relative" w="full" h={72}>
          <Stack
            position="absolute"
            zIndex={3}
            bottom={0}
            left={0}
            p={4}
            w="full"
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Stack>
              <Heading>{property.name}</Heading>
              <Text>{formatAsCurrency({ value: property.price })}</Text>
              <Box>
                {propertyArchived && (
                  <Badge colorScheme="red" p={1}>
                    Archived
                  </Badge>
                )}
                {property.sold && (
                  <Badge colorScheme="teal" p={1}>
                    Sold
                  </Badge>
                )}
              </Box>
            </Stack>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={!isLoading ? <ChevronDownIcon /> : <Spinner />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<DeleteIcon />} onClick={handleArchive}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
          <Box
            zIndex={2}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            w="full"
            h="full"
            position="absolute"
          />
          <Image
            src={property.image}
            alt={property.name || "Property Image"}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      )}

      <ReactEcharts option={option} />
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };

  if (!context?.params?.id)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const property = await prisma.property.findUnique({
    where: {
      id: context.params.id as string,
    },
    include: {
      PropertyUpdates: {
        take: 10,
      },
    },
  });

  return {
    props: {
      session,
      property: {
        ...property,
        createdAt: property?.createdAt?.toISOString(),
        updatedAt: property?.updatedAt?.toISOString(),
        PropertyUpdates: property?.PropertyUpdates.map((update) => ({
          ...update,
          createdAt: update.createdAt?.toISOString(),
        })),
      },
    },
  };
}

PropertyDetails.defaultProps = {
  hasHeader: true,
};

export default PropertyDetails;

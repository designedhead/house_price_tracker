import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Heading,
  Box,
  Image,
  Text,
  Stack,
  useColorModeValue,
  Flex,
  Badge,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import type { Property, PropertyUpdates } from "@prisma/client";
import Link from "next/link";
import { formatAsCurrency } from "~/helpers/currency";
import { motion } from "framer-motion";

interface FullProperty extends Property {
  PropertyUpdates: PropertyUpdates[];
}
interface Props {
  details: FullProperty;
  index: number;
}

const PropertyTile = ({ details, index }: Props) => {
  const lastUpdate = details.PropertyUpdates[0];
  const discounted = lastUpdate && lastUpdate?.price !== details.price;
  return (
    <motion.div
      key={details.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 0.2 + index * 1,
        },
      }}
    >
      <Link href={`/property/${details.id}`}>
        <Box
          w="full"
          h="full"
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="2xl"
          rounded="md"
          overflow="hidden"
          position="relative"
        >
          <Link
            href={details.url}
            legacyBehavior
            target="_blank"
            style={{ zIndex: 20 }}
          >
            <IconButton
              icon={<ExternalLinkIcon />}
              aria-label="enternal Link"
              position="absolute"
              top={2}
              right={2}
              zIndex={4}
              colorScheme="gray"
              onClick={(e) => e.stopPropagation()}
            />
          </Link>

          <Image
            alt={details.name || "Property Image"}
            h="220px"
            w="full"
            src={
              details.image ||
              "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            }
            objectFit="cover"
          />

          <Flex p={6} mb={4} justify="center">
            <Stack spacing={1} align="center">
              <Heading
                fontSize="2xl"
                fontWeight={500}
                fontFamily="body"
                textAlign="center"
              >
                {details.name}
              </Heading>
              <VStack spacing={0}>
                {!!lastUpdate && discounted && (
                  <Text
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    color={useColorModeValue("black", "white")}
                    fontWeight="bold"
                  >
                    {formatAsCurrency({ value: lastUpdate.price })}
                  </Text>
                )}
                <Text
                  color="gray.500"
                  textDecor={discounted ? "line-through" : "unset"}
                >
                  {formatAsCurrency({ value: details.price })}
                </Text>
              </VStack>
              {!!details.sold && (
                <Badge colorScheme="teal" p={1}>
                  Sold
                </Badge>
              )}
            </Stack>

            {/* <Stack direction="row" justify="center" spacing={6}>
            <Stack spacing={0} align="center">
              <Text fontWeight={600}>23k</Text>
              <Text fontSize="sm" color="gray.500">
                Followers
              </Text>
            </Stack>
            <Stack spacing={0} align="center">
              <Text fontWeight={600}>23k</Text>
              <Text fontSize="sm" color="gray.500">
                Followers
              </Text>
            </Stack>
          </Stack> */}
          </Flex>
        </Box>
      </Link>
    </motion.div>
  );
};

export default PropertyTile;

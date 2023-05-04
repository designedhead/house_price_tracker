import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const PLACEHOLDER = "https://avatars.dicebear.com/api/male/username.svg";

type Link = {
  label: string;
  href: string;
};

const links: Link[] = [
  // { label: "Dashboard", href: "/" }
];

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={0}
      zIndex={5}
      borderTop="6px solid"
      borderTopColor="teal"
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="container.lg"
        mx={{ base: 4, md: "auto" }}
      >
        <Link href="/" passHref>
          <Box cursor="pointer">Right Move Tracker</Box>
        </Link>

        <HStack spacing={4}>
          {links.map((link) => {
            const isSelected = router.pathname === link.href;
            return (
              <Link href={link.href} key={link.label} passHref>
                <Button
                  w="full"
                  variant="ghost"
                  size="sm"
                  color={isSelected ? "teal" : "gray.600"}
                  fontWeight="medium"
                >
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </HStack>

        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            {session ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar size="sm" src={session.user?.image || PLACEHOLDER} />
                </MenuButton>
                <MenuList alignItems="center">
                  <br />
                  <Center>
                    <Avatar
                      size="2xl"
                      src={session.user?.image || PLACEHOLDER}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{session.user?.name}</p>
                  </Center>
                  <Center>
                    <Text fontSize="small" color="blackAlpha.500">
                      {session.user?.email}
                    </Text>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={() => void signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button onClick={() => void signIn()}>Login</Button>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Nav;

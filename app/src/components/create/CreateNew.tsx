import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { api } from "~/utils/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNew = ({ isOpen, onClose }: Props) => {
  const toast = useToast();
  const handleClose = () => {
    onClose();
    setInput("");
  };
  const [input, setInput] = React.useState<string>("");
  const isValid = input.includes("rightmove.co.uk");
  const { data, isLoading } = api.rightMove.getDetails.useQuery(
    {
      input,
    },
    {
      enabled: isValid && !!input.length,
    }
  );
  const { mutate, isLoading: createLoading } = api.rightMove.addNew.useMutation(
    {
      onSuccess: () => {
        handleClose();
        toast({
          title: "Property created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast({
          title: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );

  const handleCreate = () => {
    mutate({ input });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!isValid && !!input.length}>
            <FormLabel>URL</FormLabel>
            <InputGroup size="md">
              {/* <InputLeftAddon>https://</InputLeftAddon> */}
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="mysite"
              />
            </InputGroup>

            <FormErrorMessage>
              {`Make sure it's a valid rightmove url.`}
            </FormErrorMessage>
          </FormControl>
          {isValid && isLoading && (
            <Center mt={4}>
              <Spinner />
            </Center>
          )}
          {!!data && (
            <Box mt={8}>
              <Box
                position="relative"
                h="150px"
                w="full"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image
                  src={data.image}
                  alt={data.title || "Preview Image"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>

              <Text fontSize="lg" mt={2} fontWeight="bold">
                {data.title}
              </Text>
              <Text fontSize="md">{data.price}</Text>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            ml={3}
            isDisabled={isLoading || !isValid || !input.length}
            isLoading={createLoading}
            onClick={handleCreate}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNew;

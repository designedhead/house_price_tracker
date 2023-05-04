import {
  Button,
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
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

import React from "react";
import { api } from "~/utils/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNew = ({ isOpen, onClose }: Props) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const handleClose = () => {
    onClose();
    setInput("");
  };
  const [input, setInput] = React.useState<string>("");
  const isValid = input.includes("rightmove.co.uk");

  const { mutate, isLoading: createLoading } = api.rightMove.addNew.useMutation(
    {
      onSuccess: async () => {
        handleClose();
        toast({
          title: "Property created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        await queryClient.refetchQueries({
          queryKey: [
            ["rightMove", "getAll"],
            {
              type: "query",
            },
          ],
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

  const handleCreate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isValid) {
      mutate({ input });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleCreate}>
            <FormControl isInvalid={!isValid && !!input.length}>
              <FormLabel>URL</FormLabel>
              <InputGroup size="md">
                <Input
                  value={input}
                  autoFocus
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="rightmove.co.uk/properties/..."
                />
              </InputGroup>

              <FormErrorMessage>
                {`Make sure it's a valid rightmove url.`}
              </FormErrorMessage>
            </FormControl>
            {/* {isValid && isLoading && (
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
          )} */}
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            ml={3}
            isDisabled={!isValid || !input.length}
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

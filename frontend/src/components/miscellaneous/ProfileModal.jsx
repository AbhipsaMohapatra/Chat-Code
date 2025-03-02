import React from "react";
import { useDisclosure, IconButton, Button } from "@chakra-ui/react";
import { Image ,Text} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          onClick={onOpen}
          display={"flex"}
          justifyContent={"center"}
          aria-label="Search database"
          icon={<ViewIcon />}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={"410px"}>
          <ModalHeader
            fontSize={"30px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"space-between"}>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              alignContent={"center"}
            />
            <Text fontSize={"2xl"} p={"4px"}>Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

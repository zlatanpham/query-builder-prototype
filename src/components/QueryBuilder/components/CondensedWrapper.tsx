import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  Flex,
  Box,
  Icon,
} from '@sajari-ui/core';

import { QueryBuilderProps } from '..';

interface Props extends QueryBuilderProps {
  children: React.ReactNode;
}

export const CondensedWrapper = (props: Props) => {
  const { children, value } = props;
  const { open, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex
        borderWidth="border"
        borderColor="border-gray-200"
        borderRadius="rounded-md"
        textColor="text-gray-500"
        padding={['pl-2', 'pr-1', 'py-1']}
        height="h-10"
        justifyContent="justify-between"
        alignItems="items-center"
        onClick={onOpen}
      >
        <Box truncate="truncate" padding="pr-2">
          {value}
        </Box>
        <Flex
          width="w-8"
          height="h-8"
          alignItems="items-center"
          justifyContent="justify-center"
        >
          <Icon name="pencil" />
        </Flex>
      </Flex>
      <Modal
        blockScrollOnMount={false}
        open={open}
        onClose={onClose}
        size="lg:max-w-4xl"
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit filter</ModalTitle>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} appearance="primary">
              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

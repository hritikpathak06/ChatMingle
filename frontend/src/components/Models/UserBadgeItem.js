import { Badge } from "@chakra-ui/react";
import React from "react";
import { MdCancel } from "react-icons/md";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <>
      <Badge
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        colorScheme="purple"
        cursor="pointer"
        display={"flex"}
        alignItems={"center"}
        gap={"5px"}
        onClick={handleFunction}
      >
        {user.name}
        {admin === user._id && <span> (Admin)</span>}
        <MdCancel pl={1} />
      </Badge>
    </>
  );
};

export default UserBadgeItem;

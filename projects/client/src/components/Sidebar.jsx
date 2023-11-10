import React from "react";
import { Icon, Flex, Image, Box, useColorModeValue, MenuButton, Avatar, Portal, MenuList, MenuItem, Menu, Text } from "@chakra-ui/react";
import { FiSettings, FiHome, FiTrendingUp } from "react-icons/fi";
import { BiMessageSquareAdd, BiSolidFoodMenu } from "react-icons/bi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { logout } from "../slices/accountSlices";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import api from "../api";
import { updatePhotoProfile } from "../slices/accountSlices";
import rains from "../assets/rains.png";

const Sidebar = ({ activeItem }) => {
  const navigate = useNavigate();
  return (

    <Box bg={"gray.900"} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={"16vw"} pos="fixed" h="100vh">
      {/* Sidebar Header */}
      <Flex direction="column" alignItems="center" mx="8" mt={8} justifyContent="space-between">
        <Flex alignItems="center" justifyContent="center" mb={4}>
          <Image src={rains} w={"60%"} />
        </Flex>
      </Flex>
      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={BiSolidFoodMenu} name="Menu" isActive={activeItem === "menu"} onClick={() => navigate("/menu")} />
        <NavItem icon={FaFileInvoiceDollar} name="Transaction" isActive={activeItem === "transaction"} onClick={() => navigate("/transaction")} />
      </Flex>

    </Box>
  );
};

const NavItem = ({ icon, name, isActive, onClick }) => {
  const activeColor = useColorModeValue("white");
  const activeBgColor = "red.700";
  const fontWeight = isActive ? "bold" : "normal"; // Set the font-weight conditionally

  return (
    <Flex
      align="center"
      mx="2"
      h="40px"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      mb={2}
      _hover={{
        bg: "white",
        color: "gray.900",
      }}
      backgroundColor={isActive ? activeBgColor : ""}
      color={isActive ? activeColor : "white"}
      fontWeight={fontWeight} // Apply font-weight conditionally
      onClick={onClick}
    >
      {icon && (
        <Icon
          mr="8"
          ml={2}
          fontSize="26"
          _groupHover={{
            color: "black",
          }}
          as={icon}
          color="white"
        />
      )}
      <Text>
        {name}
      </Text>
    </Flex>
  );
};
export default Sidebar;

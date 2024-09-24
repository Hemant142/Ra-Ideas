import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import {
  Box,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchBasket } from "../Redux/basketReducer/action";
import BasketCard from "../Components/BasketCard";
import { Link } from "react-router-dom";


export default function Dashboard() {
  let token = Cookies.get("login_token_ra");
  console.log(token,"token")
  let { baskets } = useSelector((store) => store.basketReducer);
  const [filter, setFilter] = useState("");
  const [filterData, setFilterData] = useState([]);
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBasket(token));
  }, [dispatch, token]);

  useEffect(() => {
    const currentDate = new Date();

    if (filter === "EXPIRED") {
      const expiredData = baskets.filter((ele) => {
        return isExpired(ele); // Use isExpired here
      });
      setFilterData(expiredData);
    } else if (filter !== "") {
      const filteredData = baskets.filter((ele) => {
        const expiryDate = new Date(ele.expiryDate);
        const isActiveAndNotExpired = ele.isActive && expiryDate >= currentDate;
        return ele.rahStatus === filter && isActiveAndNotExpired;
      });
      setFilterData(filteredData);
    } else {
      setFilterData(baskets);
    }
  }, [filter, baskets]);

  // Define isExpired function before getStatusStyles
  const isExpired = (basket) => {
    const currentDate = new Date();
    const expiryDate = new Date(basket.expiryDate + "T15:30:00");

    if (
      expiryDate < currentDate ||
      (expiryDate.toDateString() === currentDate.toDateString() &&
        currentDate.getHours() >= 15 &&
        currentDate.getMinutes() >= 30)
    ) {
      return true;
    }

    return false;
  };

  const getStatusStyles = (basket) => {
    // Now isExpired is accessible here
    if (isExpired(basket)) {
      return {
        borderColor: "purple.500",
        boxShadow: "0 0 10px 2px purple",
      };
    }

    switch (basket.rahStatus) {
      case "APPROVED":
        return {
          borderColor: "green.500",
          boxShadow: "0 0 10px 2px green",
        };
      case "REJECTED":
        return {
          borderColor: "red.500",
          boxShadow: "0 0 10px 2px red",
        };
      case "PENDING":
      default:
        return {
          borderColor: "gray.500",
          boxShadow: "0 0 10px 2px gray",
        };
    }
  };

  return (
    <Box>
      <Navbar />
      <Tabs
        position="relative"
        variant="soft-rounded"
        colorScheme="blue"
        isFitted
        onChange={(index) => {
          const statusMap = ["", "PENDING", "APPROVED", "REJECTED", "EXPIRED"];
          setFilter(statusMap[index]);
        }}
      >
        <TabList
          bg="gray.50"
          borderRadius="md"
          boxShadow="lg"
          maxW="xl"
          mx="auto"
          mt={8}
          p={4}
        >
          <Tab
           as={Link}
            to="/dashboard"
          >Ideas</Tab>
          <Tab  as={Link}
            to="/create-basket">Create Idea</Tab>
         
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {filterData.map((basket) => (
                <BasketCard
                  key={basket._id}
                  basket={basket}
                  getStatusStyles={getStatusStyles}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Other tab panels */}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

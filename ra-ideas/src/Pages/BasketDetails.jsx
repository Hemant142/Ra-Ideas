import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Heading,
  Tag,
  Stack,
  Divider,
  useDisclosure,
  Tab,
  Button,
  Icon,
  Collapse,
  useBreakpointValue,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  FaMoneyBill,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChartLine,
  FaPercentage,
  FaTag,
  FaArrowUp,
  FaArrowDown,
  FaTimesCircle,
} from "react-icons/fa";
import Navbar from "../Components/Navbar";

const BasketDetails = () => {
  const { id } = useParams();
  const baskets = useSelector((state) => state.basketReducer.baskets || []);
  const [data, setData] = useState(null);
  const [killSwitch, setKillSwitch] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [showMore, setShowMore] = useState(true);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = () => {
    const basket = baskets.find((basket) => basket._id === id);
    setData(basket || {});
    if (basket) {
      setKillSwitch(basket.killSwitch || false);
      setStatus(basket.status || "PENDING");
    }
  };

  if (!data) {
    return (
      <Box>
        <Navbar />
        <Text>Loading....</Text>
      </Box>
    );
  }

  // Extract data and ensure arrays for cash, future, and options
  const cashData = data.dataTypes?.cash || [];
  const futureData = data.dataTypes?.future || [];
  const optionsData = data.dataTypes?.options || [];

  console.log(optionsData, "optionsData");

  return (
    <Box bg="gray.50" minH="100vh" py={6}>
      <Navbar />
      <Box
        p={{ base: 4, md: 6 }}
        maxW="1200px"
        mx="auto"
        bg="white"
        boxShadow="xl"
        borderRadius="lg"
        mt={6}
      >
        <Flex alignItems="center" mb={6}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go Back"
            size="lg"
            variant="outline"
            mr={4}
            colorScheme="blue"
            _hover={{ bg: "blue.100" }}
          />
          <Heading
            size="lg"
            textAlign={{ base: "center", md: "left" }}
            color="blue.600"
          >
            {data.title}
          </Heading>
        </Flex>

        <Box mb={6}>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
            Description: {data.description}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
            Created by: {data.createdBy} | Start Date: {data.startDate} | Expiry
            Date: {data.expiryDate}
          </Text>
          <Tag colorScheme="blue" mt={2}>
            {data.exchangeType}
          </Tag>
        </Box>

        {/* Tabs for Cash, Future, and Options */}
        <Tabs colorScheme="blue"  position='relative' variant='unstyled' isLazy>
          <TabList
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="white"
            display="flex"
            justifyContent="space-around"
            p={2}
            boxShadow="sm"
          >
            <Tab
              fontSize="md"
              fontWeight="medium"
              px={4}
              py={2}
              borderRadius="md"
              _selected={{
                color: "blue.500",
                borderBottom: "2px solid",
                borderColor: "blue.500",
                fontWeight: "bold",
                bg: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
              _hover={{ color: "blue.400" }}
              transition="all 0.2s ease-in-out"
              display="flex"
              alignItems="center"
            >
              <Icon as={FaMoneyBill} mr={2}  />
              Cash
            </Tab>
            <Tab
              fontSize="md"
              fontWeight="medium"
              px={4}
              py={2}
              borderRadius="md"
              _selected={{
                color: "blue.500",
                borderBottom: "2px solid",
                borderColor: "blue.500",
                fontWeight: "bold",
                bg: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
              _hover={{ color: "blue.400" }}
              transition="all 0.2s ease-in-out"
              display="flex"
              alignItems="center"
            >
              <Icon as={FaChartLine} mr={2}  />
              Futures
            </Tab>
            <Tab
              fontSize="md"
              fontWeight="medium"
              px={4}
              py={2}
              borderRadius="md"
              _selected={{
                color: "blue.500",
                borderBottom: "2px solid",
                borderColor: "blue.500",
                fontWeight: "bold",
                bg: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
              _hover={{ color: "blue.400" }}
              transition="all 0.2s ease-in-out"
              display="flex"
              alignItems="center"
            >
              <Icon as={FaPercentage} mr={2}  />
              Options
            </Tab>
          </TabList>

          <TabPanels>
            {/* Cash Data */}
            <TabPanel>
              <Heading size="md" mb={4} color="blue.600">
                Cash Instruments
              </Heading>
              <Stack spacing={6}>
                {cashData.map((cash, index) => (
                  <Box
                    key={index}
                    p={6}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.300"
                    bgGradient="linear(to-r, blue.50, white)"
                    boxShadow="lg"
                    _hover={{
                      boxShadow: "2xl",
                      transform: "scale(1.02)",
                      bg: "blue.50",
                    }}
                    transition="all 0.3s ease-in-out"
                    w="100%"
                    maxW="3xl"
                    mx="auto"
                  >
                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                      gap={6}
                    >
                      {/* Stock Name and Symbol */}
                      <GridItem colSpan={2}>
                        <Text fontSize="xl" fontWeight="bold" color="blue.700">
                          {cash.name} ({cash.symbol}){" "}
                          <Icon as={FaTag} ml={2} color="blue.500" />
                        </Text>
                      </GridItem>

                      {/* Quantity */}
                      <GridItem>
                        <Flex align="center">
                          <Icon as={FaMoneyBill} mr={2} color="green.500" />
                          <Text
                            fontWeight="bold"
                            fontSize="md"
                            color="gray.700"
                          >
                            Quantity:
                          </Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Text fontSize="md" color="gray.800">
                          {cash.quantity}
                        </Text>
                      </GridItem>

                      {/* High Range */}
                      <GridItem>
                        <Flex align="center">
                          <Icon as={FaArrowUp} mr={2} color="orange.500" />
                          <Text
                            fontWeight="bold"
                            fontSize="md"
                            color="gray.700"
                          >
                            High Range:
                          </Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Text fontSize="md" color="gray.800">
                          {cash.enterHighRange}
                        </Text>
                      </GridItem>

                      {/* Low Range */}
                      <GridItem>
                        <Flex align="center">
                          <Icon as={FaArrowDown} mr={2} color="orange.500" />
                          <Text
                            fontWeight="bold"
                            fontSize="md"
                            color="gray.700"
                          >
                            Low Range:
                          </Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Text fontSize="md" color="gray.800">
                          {cash.enterLowRange}
                        </Text>
                      </GridItem>

                      {/* Stop Loss */}
                      <GridItem>
                        <Flex align="center">
                          <Icon
                            as={FaExclamationTriangle}
                            mr={2}
                            color="red.500"
                          />
                          <Text
                            fontWeight="bold"
                            fontSize="md"
                            color="gray.700"
                          >
                            Stop Loss:
                          </Text>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Text fontSize="md" color="gray.800">
                          {cash.stopLoss}
                        </Text>
                      </GridItem>

                      {/* Take Profits */}
                      {cash.takeProfits.map((tp, tpIndex) => (
                        <React.Fragment key={tpIndex}>
                          <GridItem>
                            <Text
                              fontWeight="bold"
                              fontSize="md"
                              color="blue.700"
                            >
                              Take Profit {tpIndex + 1}:
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="md" color="gray.800">
                              {tp.takeProfit}, Qty: {tp.takeProfitQuantity}
                            </Text>
                          </GridItem>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </TabPanel>

            {/* Future Data */}
            <TabPanel>
    <Heading size="md" mb={4} color="blue.600">
      Future Instruments
    </Heading>
    <Stack spacing={6}>
      {futureData.map((future, index) => (
        <Box
          key={index}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.300"
          bgGradient="linear(to-r, blue.50, white)"
          boxShadow="lg"
          _hover={{
            boxShadow: "2xl",
            transform: "scale(1.02)",
            bg: "blue.50",
          }}
          transition="all 0.3s ease-in-out"
          w="100%"
          maxW="3xl"
          mx="auto"
        >
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
          >
            {/* Stock Name */}
            <GridItem colSpan={2}>
              <Text fontSize="xl" fontWeight="bold" color="blue.700">
                {future.name} 
                <Icon as={FaTag} ml={2} color="blue.500" />
              </Text>
            </GridItem>

            {/* Expiry Date */}
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Expiry Date:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {future.expiryDate}
              </Text>
            </GridItem>

            {/* Quantile */}
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Quantile:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {future.quantile}
              </Text>
            </GridItem>

            {/* LOT */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaMoneyBill} mr={2} color="green.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  LOT:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {future.lot}
              </Text>
            </GridItem>

            {/* High Range */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaArrowUp} mr={2} color="orange.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  High Range:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {future.enterHighRange}
              </Text>
            </GridItem>

            {/* Low Range */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaArrowDown} mr={2} color="orange.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Low Range:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {future.enterLowRange}
              </Text>
            </GridItem>

            {/* Stop Loss */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaExclamationTriangle} mr={2} color="red.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Stop Loss:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {future.stopLoss}
              </Text>
            </GridItem>

            {/* Take Profits */}
            {future.takeProfits.map((tp, tpIndex) => (
              <React.Fragment key={tpIndex}>
                <GridItem>
                  <Text fontWeight="bold" fontSize="md" color="blue.700">
                    Take Profit {tpIndex + 1}:
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="md" color="gray.800">
                    {tp.takeProfit}, Qty: {tp.takeProfitLot}
                  </Text>
                </GridItem>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      ))}
    </Stack>
  </TabPanel>

            {/* Options Data */}
            <TabPanel>
    <Heading size="md" mb={4} color="blue.600">
      Options Instruments
    </Heading>
    <Stack spacing={6}>
      {optionsData.map((option, index) => (
        <Box
          key={index}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.300"
          bgGradient="linear(to-r, blue.50, white)"
          boxShadow="lg"
          _hover={{
            boxShadow: "2xl",
            transform: "scale(1.02)",
            bg: "blue.50",
          }}
          transition="all 0.3s ease-in-out"
          w="100%"
          maxW="3xl"
          mx="auto"
        >
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
          >
            {/* Option Name */}
            <GridItem colSpan={2}>
              <Text fontSize="xl" fontWeight="bold" color="blue.700">
                {option.name} 
                <Icon as={FaTag} ml={2} color="blue.500" />
              </Text>
            </GridItem>

            {/* Expiry Date */}
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Expiry Date:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.expiryDate}
              </Text>
            </GridItem>

            {/* Quantile */}
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Quantile:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.quantile}
              </Text>
            </GridItem>

            {/* Strike */}
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Strike:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.strike}
              </Text>
            </GridItem>

            {/* LOT */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaMoneyBill} mr={2} color="green.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  LOT:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.lot}
              </Text>
            </GridItem>

            {/* Option Type */}
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Option Type:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.optionType}
              </Text>
            </GridItem>

            {/* High Range */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaArrowUp} mr={2} color="orange.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  High Range:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.enterHighRange}
              </Text>
            </GridItem>

            {/* Low Range */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaArrowDown} mr={2} color="orange.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Low Range:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.enterLowRange}
              </Text>
            </GridItem>

            {/* Stop Loss */}
            <GridItem>
              <Flex align="center">
                <Icon as={FaExclamationTriangle} mr={2} color="red.500" />
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  Stop Loss:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="md" color="gray.800">
                {option.stopLoss}
              </Text>
            </GridItem>

            {/* Take Profits */}
            {option.takeProfits.map((tp, tpIndex) => (
              <React.Fragment key={tpIndex}>
                <GridItem>
                  <Text fontWeight="bold" fontSize="md" color="blue.700">
                    Take Profit {tpIndex + 1}:
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="md" color="gray.800">
                    {tp.takeProfit}, Qty: {tp.takeProfitLot}
                  </Text>
                </GridItem>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      ))}
    </Stack>
  </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default BasketDetails;

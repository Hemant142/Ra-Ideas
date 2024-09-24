import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaMoneyBill, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaTag } from 'react-icons/fa';

const OptionsInstrumentCard = ({ option }) =>
{


    (
        <Box
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.300"
          bg="white"
          boxShadow="md"
          _hover={{
            boxShadow: "xl",
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
            gap={4}
          >
            <GridItem colSpan={2}>
              <Text fontSize="xl" fontWeight="bold" color="blue.700">
                {option.name}
                <Icon as={FaTag} ml={2} color="blue.500" />
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  Expiry Date:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.expiryDate}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  Quantile:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.quantile}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  Strike:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.strike}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Icon as={FaMoneyBill} mr={2} color="green.500" />
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  LOT:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.lot}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  Option Type:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.optionType}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Icon as={FaArrowUp} mr={2} color="orange.500" />
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  High Range:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.enterHighRange}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Icon as={FaArrowDown} mr={2} color="orange.500" />
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  Low Range:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.enterLowRange}
              </Text>
            </GridItem>
      
            <GridItem>
              <Flex align="center">
                <Icon as={FaExclamationTriangle} mr={2} color="red.500" />
                <Text fontWeight="bold" fontSize="sm" color="gray.700">
                  Stop Loss:
                </Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.800">
                {option.stopLoss}
              </Text>
            </GridItem>
      
            {option.takeProfits.map((tp, tpIndex) => (
              <React.Fragment key={tpIndex}>
                <GridItem colSpan={2}>
                  <Text fontWeight="bold" fontSize="sm" color="blue.700">
                    Take Profit {tpIndex + 1}:
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {tp.takeProfit}, Qty: {tp.takeProfitLot}
                  </Text>
                </GridItem>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      );
}
    
 

export default OptionsInstrumentCard;

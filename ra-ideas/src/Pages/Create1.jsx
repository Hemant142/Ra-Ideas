import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  Select,
  RadioGroup,
  Stack,
  Radio,
  useToast,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { MdArrowDropDown } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FormControl,
  FormLabel,
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Navbar from "../Components/Navbar";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchOptionFuture, fetchSymbols } from "../Redux/symbolReducer/action";
import { useDispatch, useSelector } from "react-redux";
import { postBasketData } from "../Redux/basketReducer/action";

export default function CreateBasket() {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.symbolsReducer.symbols);
  const future = useSelector((store) => store.symbolsReducer.future);
  const options = useSelector((store) => store.symbolsReducer.options);
  let token = Cookies.get("login_token_ra");
  console.log(options, "options")
  const initialData = {
    basket_name: "",
    basket_description: "",
    basket_rational: "",
    expiry_date: "",
    fund_required: "",
    annual_returns: "",
    cagr: "",
    success_rate: "",
    average_rate: "",
    symbols_info: [],
    future_info: [],
    options_info: [],
  };

  const [basketData, setBasketData] = useState(initialData);
  const [numRows, setNumRows] = useState(initialData.symbols_info.length);
  const [futureRows, setFutureRows] = useState(initialData.future_info.length);
  const [optionsRows, setOptionsRows] = useState(
    initialData.options_info.length
  );
  const [tableRows, setTableRows] = useState(initialData.symbols_info);
  const [futureTableRows, setFutureTableRows] = useState(
    initialData.future_info
  );
  const [optionsTableRows, setOptionsTableRows] = useState(
    initialData.options_info
  );
  const [isLoading, setIsLoading] = useState(false);
  const [riskLevel, setriskLevel] = useState("");
  const [ideaType, setIdeaType] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [futureSymbol, setFutureSymbol] = useState([]);
  const [optionSymbol, setOptionSymbol] = useState([]);
  const [filter, setFilter] = useState("");

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [wait, setWait] = useState(false);
  const [index, setIndex] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownRefs = useRef([]);

  const [searchTerms, setSearchTerms] = useState([]);
  const [showOptions, setShowOptions] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const userName = Cookies.get("username_ra");
  const currentDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5))
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    dispatch(fetchSymbols());
    dispatch(fetchOptionFuture());
  }, []);

  useEffect(() => {
    setSymbols(data);
    setFutureSymbol(future);
    setOptionSymbol(options);
  }, [data, future, options]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          const newShowOptions = [...showOptions];
          newShowOptions[index] = false;
          setShowOptions(newShowOptions);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);


  const handleSelectChange = (index, value) => {
    const selectedSymbol = symbols.find(symbol => symbol.symbol === value);
    if (selectedSymbol) {
      setTableRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index] = {
          ...updatedRows[index], // Keep other fields unchanged
          name: selectedSymbol.name, // Update only `name`
          symbol: selectedSymbol.symbol // Update only `symbol`
        };
        return updatedRows;
      });

      const newShowOptions = [...showOptions];
      newShowOptions[index] = false;
      setShowOptions(newShowOptions);
    }
  };



  const handleSearchChange = (index, value) => {
    setIndex(index);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);

    const newShowOptions = new Array(tableRows.length).fill(false); // Close all dropdowns
    newShowOptions[index] = true; // Open only the current dropdown

    setShowOptions(newShowOptions);
  };

  const filteredSymbols = symbols.filter((item) => {
    const searchTerm = searchTerms[index] || "";

    return item.name.toLowerCase().includes(searchTerm.toLowerCase())
  }
  
  );
  console.log(index, "index")
  console.log(filteredSymbols, "filteredSymbols", symbols)

  const handleRowChange = (index, key, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][key] = value;
    console.log(key, value, index)

    if (
      key === "stopLoss" &&
      parseFloat(value) >= parseFloat(updatedRows[index].takeProfit)
    ) {
      updatedRows[index].takeProfit = (parseFloat(value) + 1).toString();
    }

    if (
      key === "takeProfit" &&
      parseFloat(value) <= parseFloat(updatedRows[index].stopLoss)
    ) {
      updatedRows[index].stopLoss = (parseFloat(value) - 1).toString();
    }
    setTableRows(updatedRows);
  };

  const handleInputChange = (e) => {
    setBasketData({
      ...basketData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFutureRowChange = (index, key, value) => {
    const updatedRows = [...futureTableRows];
    updatedRows[index][key] = value;
    if (
      key === "stopLoss" &&
      parseFloat(value) >= parseFloat(updatedRows[index].takeProfit)
    ) {
      updatedRows[index].takeProfit = (parseFloat(value) + 1).toString();
    }

    if (
      key === "takeProfit" &&
      parseFloat(value) <= parseFloat(updatedRows[index].stopLoss)
    ) {
      updatedRows[index].stopLoss = (parseFloat(value) - 1).toString();
    }
    setFutureTableRows(updatedRows);
  };


  const handleOptionsRowChange = (
    index,
    key,
    value,
    additionalKey,
    additionalValue
  ) => {
    const updatedRows = [...optionsTableRows];
    updatedRows[index][key] = value;
    if (additionalKey && additionalValue !== undefined) {
      updatedRows[index][additionalKey] = additionalValue;
    }

    if (
      key === "stopLoss" &&
      parseFloat(value) >= parseFloat(updatedRows[index].takeProfit)
    ) {
      updatedRows[index].takeProfit = (parseFloat(value) + 1).toString();
    }

    if (
      key === "takeProfit" &&
      parseFloat(value) <= parseFloat(updatedRows[index].stopLoss)
    ) {
      updatedRows[index].stopLoss = (parseFloat(value) - 1).toString();
    }

    setOptionsTableRows(updatedRows);
  };

  const handleNumRowsChange = (e) => {
    const value = parseInt(e.target.value);
    setNumRows(value);
  };

  const handleFutureRowsChange = (e) => {
    const value = parseInt(e.target.value);
    setFutureRows(value);
  };

  const handleOptionRowsChange = (e) => {
    const value = parseInt(e.target.value);
    setOptionsRows(value);
  };

  const generateRows = () => {
    const newRows = Array.from({ length: numRows }, () => ({
      name: "",
      symbol: "",
      quantity: "",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfit: "",
    }));
    setTableRows(newRows);
  };

  const generateFutureRows = () => {
    const newRows = Array.from({ length: futureRows }, () => ({
      name: "",
      expiryDate: "",
      longShort: "",
      lot: "",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfit: "",
    }));
    setFutureTableRows(newRows);
  };

  const generateOptionRows = () => {
    const newRows = Array.from({ length: optionsRows }, () => ({
      name: "",
      expiryDate: "",
      strike: "",
      longShort: "",
      lot: "",
      optionType: "",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfit: "",
    }));
    setOptionsTableRows(newRows);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let quantityFlag = true;
    let symbolFlag = false;
    let inputfield = false;

    let correctDate = true;
    let underlineIndex = true;
    let sum = 0;

    // Check if expiry date is in the future
    let selectedDate = new Date(basketData.expiry_date);
    let currentDate = new Date();
    if (selectedDate < currentDate) {
      alert("You cannot select a past date.");
      correctDate = false;
      return;
    }

    // Calculate sum of quantities
    tableRows.forEach((row) => {
      sum += parseFloat(row.quantity); // Parse quantity as float
    });

    // Check if underlying index is selected
    if (!ideaType) {
      underlineIndex = false;
      alert("Please select one riskLevel option");
      return;
    }

    // Check for duplicate names in tableRows
    let names = new Set();
    for (let row of tableRows) {
      if (names.has(row.name)) {
        alert(`Duplicate name found: ${row.name}`);
        return; // Exit early if duplicate name is found
      } else {
        symbolFlag = true;
        names.add(row.name); // Add name to Set if not duplicate
      }
    }

    // Check if any table field is empty
    let isTableFieldEmpty = tableRows.filter(
      (ele) => ele.stopLoss !== "" && ele.takeProfit !== ""
    );

    if (isTableFieldEmpty.length !== tableRows.length) {
      alert("One or more table fields are empty. Please fill them.");
      return;
    }

    // Proceed if all validations pass
    try {
      setIsLoading(true);

      // Prepare data to send
      const dataToSend = {
        title: basketData.basket_name.trim(),
        description: basketData.basket_description,
        rational: basketData.basket_rational,
        expiryDate: basketData.expiry_date,
        creationDate: getCurrentDate(),
        createdBy: userName,
        exchangeType: "NSE_EQ",

        riskLevel: riskLevel,
        ideaType: ideaType,
      };

      // Add the appropriate list based on ideaType
      if (ideaType === "Cash") {
        dataToSend.cashList = tableRows.reduce((acc, item, index) => {
          const key = `c${index + 1}`;
          acc[key] = {
            quantity: item.quantity,
            name: item.symbol,
            entryHighRange: item.enterHighRange,
            entryLowRange: item.enterLowRange,
            stopLoss: item.stopLoss,
            takeProfit: item.takeProfit,
          };
          return acc;
        }, {});
      } else if (ideaType === "Futures") {
        dataToSend.futureList = futureTableRows.reduce((acc, item, index) => {
          const key = `c${index + 1}`;
          acc[key] = {
            name: item.name,
            expiryDate: item.expiryDate,
            lot: item.lot,
            longShort: item.longShort,
            entryHighRange: item.enterHighRange,
            entryLowRange: item.enterLowRange,
            stopLoss: item.stopLoss,
            takeProfit: item.takeProfit,
          };
          return acc;
        }, {});
      } else if (ideaType === "Options") {
        dataToSend.optionList = optionsTableRows.reduce((acc, item, index) => {
          const key = `c${index + 1}`;
          acc[key] = {
            name: item.name,
            expiryDate: item.expiryDate,
            lot: item.lot,
            optionType: item.optionType,
            longShort: item.longShort,
            entryHighRange: item.enterHighRange,
            entryLowRange: item.enterLowRange,
            stopLoss: item.stopLoss,
            strike: item.strike,
            takeProfit: item.takeProfit,
          };
          return acc;
        }, {});
      }

      // Log data to be sent
      console.log(dataToSend, "dataToSend");

      // Uncomment and integrate your dispatch logic here
      // setWait(true);
      // dispatch(postBasketData(dataToSend, token)).then((res) => {
      //   if (res.status === "success") {
      //     setWait(false);
      //     toast({
      //       title: `Basket successfully created`,
      //       position: "bottom",
      //       status: `${res.status}`,
      //       duration: 2000,
      //       isClosable: true,
      //     });

      //     setFourMonthReturns(["", "", "", ""]);
      //     setNumRows([]);
      //     setTableRows([]);
      //     setIsquantityValid(false);
      //     setBasketData(initialData);
      //     setriskLevel("");
      //     setIdeaType("");

      //   } else {
      //     setWait(false);
      //     if (res.message === "You do not Have permission to access the data") {
      //       Cookies.set("login_token_ra", "");
      //       Cookies.set("username_ra", "");
      //       navigate("/");
      //     }
      //     toast({
      //       title: `${res.message}`,
      //       position: "bottom",
      //       status: `${res.status}`,
      //       duration: 2000,
      //       isClosable: true,
      //     });
      //   }
      // });

      setIsLoading(false);
    } catch (error) {
      console.error("Error creating basket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExpiryDatesForFutureSymbol = (symbol) => {
 
    return [
      ...new Set(
        futureSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.exp)
      ),
    ];
  };

  const getExpiryDatesForOptionSymbol = (symbol) => {
    return [
      ...new Set(
        optionSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.exp)
      ),
    ];
  };

  const getStrikeForOptionSymbol = (symbol) => {
   
   let x=   [...new Set(
        optionSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.strike)
      )].map((strike) => {
        // Remove exactly one trailing zero
        return strike.endsWith('0') ? strike.slice(0, -2) : strike;
      });
 
      console.log(x,"X")
    return  [...new Set(
      optionSymbol
        .filter((item) => item.sym === symbol)
        .map((item) => item.strike)
    )].map((strike) => {
      // Remove exactly one trailing zero
      return strike.endsWith('0') ? strike.slice(0, -2) : strike;
    });
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Navbar />

      <Tabs variant="unstyled" mt="10px" borderBottomColor="gray.200">
        <TabList display="flex">
          <Tab
            as={Link}
            to="/dashboard"
            fontWeight="bold"
            color={location.pathname === "/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/dashboard" && "2px solid"}
            borderColor={location.pathname === "/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Idea List
          </Tab>
          <Tab
            as={Link}
            to="/create-basket"
            fontWeight="bold"
            color={
              location.pathname === "/create-basket" ? "#244c9c" : "gray.500"
            }
            borderBottom={location.pathname === "/create-basket" && "2px solid"}
            borderColor={location.pathname === "/create-basket" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Create Idea
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", margin: "auto" }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Heading size="lg" mb={6} textAlign="center" color="#244c9c">
                  Create a New Idea
                </Heading>

                <FormControl
                  mb={6}
                  p={6}
                  borderRadius="md"
                  boxShadow="lg"
                  bg="white"
                >
                  <FormControl mb={6}>
                    <FormLabel
                      htmlFor="basket_name"
                      fontWeight="bold"
                      fontSize="lg"
                      color="#244c9c"
                    >
                      Idea Name
                    </FormLabel>
                    <Input
                      type="text"
                      id="basket_name"
                      name="basket_name"
                      maxLength={80}
                      value={basketData.basket_name}
                      onChange={handleInputChange}
                      placeholder="Name of the Idea"
                      isRequired
                      borderColor="#244c9c"
                      _placeholder={{ color: "gray.500" }}
                      _focus={{
                        borderColor: "#244c9c",
                        boxShadow: "0 0 0 1px #244c9c",
                      }}
                    />
                  </FormControl>

                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    gap={6}
                    mb={6}
                  >
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="basket_description"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Description
                      </FormLabel>
                      <Textarea
                        type="text"
                        id="basket_description"
                        name="basket_description"
                        value={basketData.basket_description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        isRequired
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                    </FormControl>

                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="basket_rational"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Basket Rational
                      </FormLabel>
                      <Textarea
                        type="text"
                        id="basket_rational"
                        name="basket_rational"
                        value={basketData.basket_rational}
                        onChange={handleInputChange}
                        placeholder="Rational"
                        isRequired
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    gap={6}
                    mb={6}
                  >
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="expiry_date"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Expiry Date
                      </FormLabel>
                      <Input
                        type="date"
                        id="expiry_date"
                        name="expiry_date"
                        min={currentDate}
                        max={maxDate}
                        value={basketData.expiry_date}
                        onChange={handleInputChange}
                        isRequired
                        borderColor="#244c9c"
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                    </FormControl>

                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="Risk Level"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Risk Level
                      </FormLabel>
                      <Select
                        required
                        value={riskLevel}
                        onChange={(e) => setriskLevel(e.target.value)}
                        placeholder="Select Risk Level"
                        borderColor="#244c9c"
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    gap={10}
                    mb={6}
                  >
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="SelectIdeaType"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Select Idea Type
                      </FormLabel>
                      <Select
                        required
                        value={ideaType}
                        onChange={(e) => setIdeaType(e.target.value)}
                        placeholder="Select Idea Type"
                        borderColor="#244c9c"
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Futures">Futures</option>
                        <option value="Options">Options</option>
                      </Select>
                    </FormControl>
                  </Box>

                </FormControl>

                {/* <====================================If Idea Type is CASH======================================>               */}

                {ideaType === "Cash" && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <FormLabel
                      htmlFor="symbols_info"
                      fontWeight="bold"
                      fontSize="xl"
                      color="#244c9c"
                    >
                      Symbols Information
                    </FormLabel>
                    <Box
                      display="flex"
                      flexDirection={["column", "row"]}
                      alignItems="center"
                      mb={4}
                    >
                      <Input
                        type="number"
                        id="numRows"
                        name="numRows"
                        value={numRows}
                        onChange={handleNumRowsChange}
                        placeholder="Number of symbols"
                        isRequired
                        min="1"
                        width={["100%", "40%"]}
                        mr={[0, 4]}
                        mb={[4, 0]}
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                      <Button
                        onClick={generateRows}
                        bg="#244c9c"
                        color="white"
                        _hover={{ bg: "#1e3a5f" }}
                      >
                        Generate Rows
                      </Button>
                    </Box>
                    {tableRows.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        {tableRows.map((row, index) => (
                          <Box
                            key={index}
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                          >
                            <Flex
                              flexWrap="wrap"
                              justifyContent="space-between"
                            >
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Box
                                  position="relative"
                                  display="inline-block"
                                  textAlign={"left"}
                                  width="283px"
                                  ref={dropdownRef}
                                >
                                  <InputGroup>
                                    <Input
                                      value={tableRows[index].name}
                                      onClick={() =>
                                        handleSearchChange(
                                          index,
                                          searchTerms[index]
                                        )
                                      }
                                      placeholder="Select Symbol"
                                      variant="filled"
                                      bg="gray.100"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "gray.300",
                                      }}
                                      readOnly
                                      cursor="pointer"
                                    />
                                    <InputRightElement width="2.5rem">
                                      <IconButton
                                        aria-label="Dropdown icon"
                                        icon={<MdArrowDropDown />}
                                        variant="ghost"
                                        onClick={() =>
                                          handleSearchChange(
                                            index,
                                            searchTerms[index]
                                          )
                                        }
                                      />
                                    </InputRightElement>
                                  </InputGroup>
                                  {showOptions[index] && (
                                    <Box
                                      position="absolute"
                                      top="100%"
                                      left={0}
                                      right={0}
                                      bg="white"
                                      boxShadow="lg"
                                      zIndex={10}
                                      maxHeight="200px"
                                      overflowY="auto"
                                      borderRadius="md"
                                      mt={1}
                                      p={2}
                                    >
                                      <InputGroup mb={2}>
                                        <Input
                                          value={searchTerms[index]}
                                          onChange={(e) =>
                                            handleSearchChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Search Symbols"
                                          bg="gray.50"
                                          border="1px"
                                          borderColor="gray.300"
                                          _focus={{
                                            bg: "white",
                                            borderColor: "blue.500",
                                          }}
                                        />
                                        <InputRightElement width="2.5rem">
                                          <IconButton
                                            aria-label="Search database"
                                            icon={<SearchIcon color="gray.500" />}
                                            variant="ghost"
                                            onClick={() =>
                                              handleSearchChange(index, "")
                                            }
                                          />
                                        </InputRightElement>
                                      </InputGroup>

                                      <List spacing={1}>
                                        {filteredSymbols.length ? (
                                          filteredSymbols.map((item) => (
                                            <ListItem
                                              key={item.symbol}
                                              onClick={() =>
                                                handleSelectChange(index, item.symbol)
                                              }
                                              cursor="pointer"
                                              _hover={{ background: "gray.100" }}
                                              px={4}
                                              py={2}
                                              borderRadius="md"
                                              bg="gray.50"
                                              mb={1}
                                            >
                                              {item.name}
                                            </ListItem>
                                          ))


                                        ) : (
                                          <Text px={4} py={2} color="gray.500">
                                            No options found
                                          </Text>
                                        )}
                                      </List>
                                    </Box>
                                  )}
                                </Box>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Quantity</FormLabel>
                                <Input
                                  value={row.quantity}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Quantity"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry Low Range</FormLabel>
                                <Input
                                  value={row.enterLowRange}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "enterLowRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry Low Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry High Range</FormLabel>
                                <Input
                                  value={row.enterHighRange}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "enterHighRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry High Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Take Profit</FormLabel>
                                <Input
                                  value={row.takeProfit}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "takeProfit",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Take Profit"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Stop Loss</FormLabel>
                                <Input
                                  value={row.stopLoss}
                                  required
                                  min="1"
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "stopLoss",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Stop Loss"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FormControl>
                )}

                {/* <=====================================If Idea Type is Futures===================================> */}

                {ideaType === "Futures" && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <FormLabel
                      htmlFor="symbols_info"
                      fontWeight="bold"
                      fontSize="xl"
                      color="#244c9c"
                    >
                      Future Information
                    </FormLabel>
                    <Box
                      display="flex"
                      flexDirection={["column", "row"]}
                      alignItems="center"
                      mb={4}
                    >
                      <Input
                        type="number"
                        id="numRows"
                        name="numRows"
                        value={futureRows}
                        onChange={handleFutureRowsChange}
                        placeholder="Number of symbols"
                        isRequired
                        min="1"
                        width={["100%", "40%"]}
                        mr={[0, 4]}
                        mb={[4, 0]}
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                      <Button
                        onClick={generateFutureRows}
                        bg="#244c9c"
                        color="white"
                        _hover={{ bg: "#1e3a5f" }}
                      >
                        Generate Future Rows
                      </Button>
                    </Box>
                    {futureTableRows.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        {futureTableRows.map((row, index) => (
                          <Box
                            key={index}
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                          >
                            <Flex
                              flexWrap="wrap"
                              justifyContent="space-between"
                            >
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Select
                                  value={row.name}
                                  required
                                  onChange={(e) => {
                                    handleFutureRowChange(
                                      index,
                                      "name",
                                      e.target.value
                                    );
                                    handleFutureRowChange(
                                      index,
                                      "expiryDate",
                                      ""
                                    ); // Reset expiry date when symbol changes
                                  }}
                                  placeholder="Select Symbol"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {[
                                    ...new Set(
                                      futureSymbol.map((item) => item.sym)
                                    ),
                                  ].map((sym, idx) => (
                                    <option key={idx} value={sym}>
                                      {sym}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Expiry</FormLabel>
                                <Select
                                  value={row.expiryDate}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "expiryDate",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Expiry"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {getExpiryDatesForFutureSymbol(row.name).map(
                                    (exp, idx) => (
                                      <option key={idx} value={exp}>
                                        {exp}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>LOT</FormLabel>
                                <Input
                                  value={row.lot}
                                  required
                                  min={1}
                                  max={100}
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "lot",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="LOT"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Long/Short</FormLabel>
                                <Select
                                  placeholder="Select Long/Short"
                                  value={row.longShort}
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "longShort",
                                      e.target.value
                                    )
                                  }
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="Long">Long</option>
                                  <option value="Short">Short</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry Low Range</FormLabel>
                                <Input
                                  value={row.enterLowRange}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "enterLowRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry Low Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry High Range</FormLabel>
                                <Input
                                  value={row.enterHighRange}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "enterHighRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry High Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Take Profit</FormLabel>
                                <Input
                                  value={row.takeProfit}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "takeProfit",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Take Profit"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Stop Loss</FormLabel>
                                <Input
                                  value={row.stopLoss}
                                  required
                                  min="1"
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "stopLoss",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Stop Loss"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FormControl>
                )}

                {/* <=====================================If Idea Type is Options===================================> */}
                {ideaType === "Options" && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <FormLabel
                      htmlFor="symbols_info"
                      fontWeight="bold"
                      fontSize="xl"
                      color="#244c9c"
                    >
                      Options Information
                    </FormLabel>
                    <Box
                      display="flex"
                      flexDirection={["column", "row"]}
                      alignItems="center"
                      mb={4}
                    >
                      <Input
                        type="number"
                        id="numRows"
                        name="numRows"
                        value={optionsRows}
                        onChange={handleOptionRowsChange}
                        placeholder="Number of symbols"
                        isRequired
                        min="1"
                        width={["100%", "40%"]}
                        mr={[0, 4]}
                        mb={[4, 0]}
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                      <Button
                        onClick={generateOptionRows}
                        bg="#244c9c"
                        color="white"
                        _hover={{ bg: "#1e3a5f" }}
                      >
                        Generate Options Rows
                      </Button>
                    </Box>
                    {optionsTableRows.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        {optionsTableRows.map((row, index) => (
                          <Box
                            key={index}
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                          >
                            <Flex
                              flexWrap="wrap"
                              justifyContent="space-between"
                            >
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Select
                                  value={row.name}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Symbol"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="NIFTY">NIFTY</option>
                                  <option value="BANKNIFTY">BANKNIFTY</option>
                                  <option value="FINNIFTY">FINNIFTY</option>
                                  <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Expiry</FormLabel>
                                <Select
                                  value={row.expiryDate}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "expiryDate",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Expiry"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {getExpiryDatesForOptionSymbol(row.name).map(
                                    (exp, idx) => (
                                      <option key={idx} value={exp}>
                                        {exp}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Strike</FormLabel>
                                <Select
                                  value={row.strike}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "strike",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Strike"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {getStrikeForOptionSymbol(row.name).map(
                                    (strike, idx) => (
                                      <option key={idx} value={strike}>
                                        {strike}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>LOT</FormLabel>
                                <Input
                                  value={row.lot}
                                  required
                                  min={1}
                                  max={100}
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "lot",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="LOT"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Long/Short</FormLabel>
                                <Select
                                  placeholder="Select Long/Short"
                                  value={row.longShort}
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "longShort",
                                      e.target.value
                                    )
                                  }
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="Long">Long</option>
                                  <option value="Short">Short</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Option Type</FormLabel>
                                <Select
                                  placeholder="Select Option Type"
                                  value={row.optionType}
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "optionType",
                                      e.target.value
                                    )
                                  }
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="PE">PE</option>
                                  <option value="CE">CE</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry Low Range</FormLabel>
                                <Input
                                  value={row.enterLowRange}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "enterLowRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry Low Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry High Range</FormLabel>
                                <Input
                                  value={row.enterHighRange}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "enterHighRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry High Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Take Profit</FormLabel>
                                <Input
                                  value={row.takeProfit}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "takeProfit",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Take Profit"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Stop Loss</FormLabel>
                                <Input
                                  value={row.stopLoss}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "stopLoss",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Stop Loss"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FormControl>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  isLoading={wait}
                >
                  Create Basket
                </Button>
              </Box>
            </form>
          </TabPanel>

          <TabPanel>
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", margin: "auto" }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Heading size="lg" mb={6} textAlign="center" color="#244c9c">
                  Create a New Idea
                </Heading>

                <FormControl
                  mb={6}
                  p={6}
                  borderRadius="md"
                  boxShadow="lg"
                  bg="white"
                >
                  <FormControl mb={6}>
                    <FormLabel
                      htmlFor="basket_name"
                      fontWeight="bold"
                      fontSize="lg"
                      color="#244c9c"
                    >
                      Idea Name
                    </FormLabel>
                    <Input
                      type="text"
                      id="basket_name"
                      name="basket_name"
                      maxLength={80}
                      value={basketData.basket_name}
                      onChange={handleInputChange}
                      placeholder="Name of the Idea"
                      isRequired
                      borderColor="#244c9c"
                      _placeholder={{ color: "gray.500" }}
                      _focus={{
                        borderColor: "#244c9c",
                        boxShadow: "0 0 0 1px #244c9c",
                      }}
                    />
                  </FormControl>

                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    gap={6}
                    mb={6}
                  >
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="basket_description"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Description
                      </FormLabel>
                      <Textarea
                        type="text"
                        id="basket_description"
                        name="basket_description"
                        value={basketData.basket_description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        isRequired
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                    </FormControl>

                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="basket_rational"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Basket Rational
                      </FormLabel>
                      <Textarea
                        type="text"
                        id="basket_rational"
                        name="basket_rational"
                        value={basketData.basket_rational}
                        onChange={handleInputChange}
                        placeholder="Rational"
                        isRequired
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    gap={6}
                    mb={6}
                  >
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="expiry_date"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Expiry Date
                      </FormLabel>
                      <Input
                        type="date"
                        id="expiry_date"
                        name="expiry_date"
                        min={currentDate}
                        max={maxDate}
                        value={basketData.expiry_date}
                        onChange={handleInputChange}
                        isRequired
                        borderColor="#244c9c"
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                    </FormControl>

                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="Risk Level"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Risk Level
                      </FormLabel>
                      <Select
                        required
                        value={riskLevel}
                        onChange={(e) => setriskLevel(e.target.value)}
                        placeholder="Select Risk Level"
                        borderColor="#244c9c"
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    gap={10}
                    mb={6}
                  >
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="SelectIdeaType"
                        fontWeight="bold"
                        fontSize="lg"
                        color="#244c9c"
                      >
                        Select Idea Type
                      </FormLabel>
                      <Select
                        required
                        value={ideaType}
                        onChange={(e) => setIdeaType(e.target.value)}
                        placeholder="Select Idea Type"
                        borderColor="#244c9c"
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Futures">Futures</option>
                        <option value="Options">Options</option>
                      </Select>
                    </FormControl>
                  </Box>
                </FormControl>

                {/* <====================================If Idea Type is CASH======================================>               */}

                {ideaType === "Cash" && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <FormLabel
                      htmlFor="symbols_info"
                      fontWeight="bold"
                      fontSize="xl"
                      color="#244c9c"
                    >
                      Symbols Information
                    </FormLabel>
                    <Box
                      display="flex"
                      flexDirection={["column", "row"]}
                      alignItems="center"
                      mb={4}
                    >
                      <Input
                        type="number"
                        id="numRows"
                        name="numRows"
                        value={numRows}
                        onChange={handleNumRowsChange}
                        placeholder="Number of symbols"
                        isRequired
                        min="1"
                        width={["100%", "40%"]}
                        mr={[0, 4]}
                        mb={[4, 0]}
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                      <Button
                        onClick={generateRows}
                        bg="#244c9c"
                        color="white"
                        _hover={{ bg: "#1e3a5f" }}
                      >
                        Generate Rows
                      </Button>
                    </Box>
                    {tableRows.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        {tableRows.map((row, index) => (
                          <Box
                            key={index}
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                          >
                            <Flex
                              flexWrap="wrap"
                              justifyContent="space-between"
                            >
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Box
                                  position="relative"
                                  display="inline-block"
                                  textAlign={"left"}
                                  width="283px"
                                  ref={dropdownRef}
                                >
                                  <InputGroup>
                                    <Input
                                      value={tableRows[index].name}
                                      onClick={() =>
                                        handleSearchChange(
                                          index,
                                          searchTerms[index]
                                        )
                                      }
                                      placeholder="Select Symbol"
                                      variant="filled"
                                      bg="gray.100"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "gray.300",
                                      }}
                                      readOnly
                                      cursor="pointer"
                                    />
                                    <InputRightElement width="2.5rem">
                                      <IconButton
                                        aria-label="Dropdown icon"
                                        icon={<MdArrowDropDown />}
                                        variant="ghost"
                                        onClick={() =>
                                          handleSearchChange(
                                            index,
                                            searchTerms[index]
                                          )
                                        }
                                      />
                                    </InputRightElement>
                                  </InputGroup>
                                  {showOptions[index] && (
                                    <Box
                                      position="absolute"
                                      top="100%"
                                      left={0}
                                      right={0}
                                      bg="white"
                                      boxShadow="lg"
                                      zIndex={10}
                                      maxHeight="200px"
                                      overflowY="auto"
                                      borderRadius="md"
                                      mt={1}
                                      p={2}
                                    >
                                      <InputGroup mb={2}>
                                        <Input
                                          value={searchTerms[index]}
                                          onChange={(e) =>
                                            handleSearchChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Search Symbols"
                                          bg="gray.50"
                                          border="1px"
                                          borderColor="gray.300"
                                          _focus={{
                                            bg: "white",
                                            borderColor: "blue.500",
                                          }}
                                        />
                                        <InputRightElement width="2.5rem">
                                          <IconButton
                                            aria-label="Search database"
                                            icon={<SearchIcon color="gray.500" />}
                                            variant="ghost"
                                            onClick={() =>
                                              handleSearchChange(index, "")
                                            }
                                          />
                                        </InputRightElement>
                                      </InputGroup>

                                      <List spacing={1}>
                                        {filteredSymbols.length ? (
                                          filteredSymbols.map((item) => (
                                            <ListItem
                                              key={item.symbol}
                                              onClick={() =>
                                                handleSelectChange(index, item.symbol)
                                              }
                                              cursor="pointer"
                                              _hover={{ background: "gray.100" }}
                                              px={4}
                                              py={2}
                                              borderRadius="md"
                                              bg="gray.50"
                                              mb={1}
                                            >
                                              {item.name}
                                            </ListItem>
                                          ))


                                        ) : (
                                          <Text px={4} py={2} color="gray.500">
                                            No options found
                                          </Text>
                                        )}
                                      </List>
                                    </Box>
                                  )}
                                </Box>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Quantity</FormLabel>
                                <Input
                                  value={row.quantity}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Quantity"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry Low Range</FormLabel>
                                <Input
                                  value={row.enterLowRange}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "enterLowRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry Low Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry High Range</FormLabel>
                                <Input
                                  value={row.enterHighRange}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "enterHighRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry High Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Take Profit</FormLabel>
                                <Input
                                  value={row.takeProfit}
                                  required
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "takeProfit",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Take Profit"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Stop Loss</FormLabel>
                                <Input
                                  value={row.stopLoss}
                                  required
                                  min="1"
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "stopLoss",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Stop Loss"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FormControl>
                )}

                {/* <=====================================If Idea Type is Futures===================================> */}

                {ideaType === "Futures" && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <FormLabel
                      htmlFor="symbols_info"
                      fontWeight="bold"
                      fontSize="xl"
                      color="#244c9c"
                    >
                      Future Information
                    </FormLabel>
                    <Box
                      display="flex"
                      flexDirection={["column", "row"]}
                      alignItems="center"
                      mb={4}
                    >
                      <Input
                        type="number"
                        id="numRows"
                        name="numRows"
                        value={futureRows}
                        onChange={handleFutureRowsChange}
                        placeholder="Number of symbols"
                        isRequired
                        min="1"
                        width={["100%", "40%"]}
                        mr={[0, 4]}
                        mb={[4, 0]}
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                      <Button
                        onClick={generateFutureRows}
                        bg="#244c9c"
                        color="white"
                        _hover={{ bg: "#1e3a5f" }}
                      >
                        Generate Future Rows
                      </Button>
                    </Box>
                    {futureTableRows.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        {futureTableRows.map((row, index) => (
                          <Box
                            key={index}
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                          >
                            <Flex
                              flexWrap="wrap"
                              justifyContent="space-between"
                            >
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Select
                                  value={row.name}
                                  required
                                  onChange={(e) => {
                                    handleFutureRowChange(
                                      index,
                                      "name",
                                      e.target.value
                                    );
                                    handleFutureRowChange(
                                      index,
                                      "expiryDate",
                                      ""
                                    ); // Reset expiry date when symbol changes
                                  }}
                                  placeholder="Select Symbol"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {[
                                    ...new Set(
                                      futureSymbol.map((item) => item.sym)
                                    ),
                                  ].map((sym, idx) => (
                                    <option key={idx} value={sym}>
                                      {sym}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Expiry</FormLabel>
                                <Select
                                  value={row.expiryDate}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "expiryDate",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Expiry"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {getExpiryDatesForFutureSymbol(row.name).map(
                                    (exp, idx) => (
                                      <option key={idx} value={exp}>
                                        {exp}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>LOT</FormLabel>
                                <Input
                                  value={row.lot}
                                  required
                                  min={1}
                                  max={100}
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "lot",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="LOT"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Long/Short</FormLabel>
                                <Select
                                  placeholder="Select Long/Short"
                                  value={row.longShort}
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "longShort",
                                      e.target.value
                                    )
                                  }
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="Long">Long</option>
                                  <option value="Short">Short</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry Low Range</FormLabel>
                                <Input
                                  value={row.enterLowRange}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "enterLowRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry Low Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry High Range</FormLabel>
                                <Input
                                  value={row.enterHighRange}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "enterHighRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry High Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Take Profit</FormLabel>
                                <Input
                                  value={row.takeProfit}
                                  required
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "takeProfit",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Take Profit"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Stop Loss</FormLabel>
                                <Input
                                  value={row.stopLoss}
                                  required
                                  min="1"
                                  onChange={(e) =>
                                    handleFutureRowChange(
                                      index,
                                      "stopLoss",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Stop Loss"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FormControl>
                )}

                {/* <=====================================If Idea Type is Options===================================> */}
                {ideaType === "Options" && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <FormLabel
                      htmlFor="symbols_info"
                      fontWeight="bold"
                      fontSize="xl"
                      color="#244c9c"
                    >
                      Options Information
                    </FormLabel>
                    <Box
                      display="flex"
                      flexDirection={["column", "row"]}
                      alignItems="center"
                      mb={4}
                    >
                      <Input
                        type="number"
                        id="numRows"
                        name="numRows"
                        value={optionsRows}
                        onChange={handleOptionRowsChange}
                        placeholder="Number of symbols"
                        isRequired
                        min="1"
                        width={["100%", "40%"]}
                        mr={[0, 4]}
                        mb={[4, 0]}
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                      />
                      <Button
                        onClick={generateOptionRows}
                        bg="#244c9c"
                        color="white"
                        _hover={{ bg: "#1e3a5f" }}
                      >
                        Generate Options Rows
                      </Button>
                    </Box>
                    {optionsTableRows.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        {optionsTableRows.map((row, index) => (
                          <Box
                            key={index}
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                          >
                            <Flex
                              flexWrap="wrap"
                              justifyContent="space-between"
                            >
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Select
                                  value={row.name}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Symbol"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="NIFTY">NIFTY</option>
                                  <option value="BANKNIFTY">BANKNIFTY</option>
                                  <option value="FINNIFTY">FINNIFTY</option>
                                  <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Expiry</FormLabel>
                                <Select
                                  value={row.expiryDate}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "expiryDate",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Expiry"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {getExpiryDatesForOptionSymbol(row.name).map(
                                    (exp, idx) => (
                                      <option key={idx} value={exp}>
                                        {exp}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Strike</FormLabel>
                                <Select
                                  value={row.strike}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "strike",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Select Strike"
                                  variant="outline"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  {getStrikeForOptionSymbol(row.name).map(
                                    (strike, idx) => (
                                      <option key={idx} value={strike}>
                                        {strike}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>LOT</FormLabel>
                                <Input
                                  value={row.lot}
                                  required
                                  min={1}
                                  max={100}
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "lot",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="LOT"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Long/Short</FormLabel>
                                <Select
                                  placeholder="Select Long/Short"
                                  value={row.longShort}
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "longShort",
                                      e.target.value
                                    )
                                  }
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="Long">Long</option>
                                  <option value="Short">Short</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Option Type</FormLabel>
                                <Select
                                  placeholder="Select Option Type"
                                  value={row.optionType}
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "optionType",
                                      e.target.value
                                    )
                                  }
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                >
                                  <option value="PE">PE</option>
                                  <option value="CE">CE</option>
                                </Select>
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry Low Range</FormLabel>
                                <Input
                                  value={row.enterLowRange}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "enterLowRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry Low Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Entry High Range</FormLabel>
                                <Input
                                  value={row.enterHighRange}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "enterHighRange",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Entry High Range"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Take Profit</FormLabel>
                                <Input
                                  value={row.takeProfit}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "takeProfit",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Take Profit"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                              <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Stop Loss</FormLabel>
                                <Input
                                  value={row.stopLoss}
                                  required
                                  onChange={(e) =>
                                    handleOptionsRowChange(
                                      index,
                                      "stopLoss",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="Stop Loss"
                                  bg="white"
                                  _focus={{
                                    bg: "white",
                                    borderColor: "#244c9c",
                                  }}
                                />
                              </FormControl>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FormControl>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  isLoading={wait}
                >
                  Create Basket
                </Button>
              </Box>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

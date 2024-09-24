import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { userLogin } from "../Redux/authReducer/action";
import Navbar from "../Components/Navbar";
import { HiUser, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi"; // Import icons
import { USER_LOGIN_SUCCESS } from "../Redux/actionTypes";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();


    let formData = {
      username,
      password,
      userType: "admin",
    };

    dispatch(userLogin(formData))
      .then((res) => {
      
        dispatch({ type: USER_LOGIN_SUCCESS });
        if (res.data.response === 'success') {
          Cookies.set("login_token_zetaMoney", `${res.data.data.access_token}`);
          Cookies.set("username_zetaMoney", `${username}`);
          toast({
            title: "Login successful.",
            description: "You've logged in successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error, "Error Login");
        toast({
          title: "Login Failed.",
          description: "Please check your credentials and try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box>
      <Navbar />

      <Box
        minH="100vh"
        bg={useColorModeValue("gray.100", "gray.800")}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
      >
        <Box
          w="full"
          maxW="md"
          bg={useColorModeValue("white", "gray.700")}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <VStack spacing={4} align="center" mb={6}>
            <Heading
              size="lg"
              fontWeight="bold"
              color={useColorModeValue("blue.500", "blue.300")}
            >
              Welcome Back!
            </Heading>
            <Text fontSize="md" color={useColorModeValue("gray.600", "gray.300")}>
              Please login to your account
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<HiUser color={useColorModeValue("gray.500", "gray.300")} />}
                  />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    focusBorderColor="blue.500"
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<HiLockClosed color={useColorModeValue("gray.500", "gray.300")} />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"} // Toggle input type
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    focusBorderColor="blue.500"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <HiEyeOff /> : <HiEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="link"
                      size="sm"
                      color={useColorModeValue("gray.500", "gray.300")}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontWeight="bold"
                w="full"
                mt={4}
                _hover={{ bg: "blue.600" }}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

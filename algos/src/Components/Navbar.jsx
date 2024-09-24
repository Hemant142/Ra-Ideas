import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  useColorMode, 
  useColorModeValue, 
  HStack, 
  Icon, 
  Text, 
  Button 
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
import Cookies from 'cookies-js';
import { colors } from '../theme/theme';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const userName = Cookies.get('username_zetaMoney');
  const token = Cookies.get("login_token_zetaMoney");

  const bgGradient = useColorModeValue(
    'linear(to-r, white, white)',  // Change to white gradient for light mode
    `linear(to-r, ${colors.darkBlue}, ${colors.darkGray})`  // Keep dark mode gradient as is
  );
  const headingColor = useColorModeValue(colors.darkGray, "white");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const switchBg = useColorModeValue("gray.300", "gray.600");
  const switchCircleBg = useColorModeValue("white", "gray.800");
  const switchIconColor = useColorModeValue("yellow.500", "blue.500");

  const logoutButtonBgGradient = useColorModeValue(
    `linear(to-r, ${colors.secondary}, ${colors.darkBlue})`, 
    `linear(to-r, ${colors.darkGray}, ${colors.darkBlue})`
  );
  const logoutButtonHoverBgGradient = useColorModeValue(
    `linear(to-l, ${colors.secondary}, ${colors.darkGray})`, 
    `linear(to-l, ${colors.darkGray}, ${colors.darkBlue})`
  );
  const logoutButtonTextColor = useColorModeValue("white", "white");

  const handleLogout = () => {
    Cookies.expire('username_zetaMoney');
    Cookies.expire('login_token_zetaMoney');
    navigate('/');
  };

  return (
    <Box
      bgGradient={bgGradient}
      px={4}
      py={2}
      borderRadius="md"
      boxShadow={`0 4px 12px ${useColorModeValue(colors.darkGray, 'rgba(244, 236, 236, 0.98)')}`}
      mb={4}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={4}>
          <Heading as="h1" size="lg" color={headingColor}  onClick={() => navigate('/dashboard')}>
            Centrum Algos
          </Heading>
          {userName && token && (
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent={colorMode === "light" ? "flex-start" : "flex-end"}
              bg={switchBg}
              borderRadius="full"
              w={12}
              h={6}
              p={1}
              onClick={toggleColorMode}
              cursor="pointer"
              transition="background-color 0.3s ease"
              _hover={{ bg: colorMode === "light" ? "gray.400" : "gray.500" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={switchCircleBg}
                borderRadius="full"
                boxSize={4}
                transition="transform 0.3s ease"
              >
                {colorMode === "light" ? (
                  <Icon as={SunIcon} color={switchIconColor} boxSize={3} />
                ) : (
                  <Icon as={MoonIcon} color={switchIconColor} boxSize={3} />
                )}
              </Box>
            </Box>
          )}
        </HStack>

        <HStack spacing={4}>
          {userName && token ? (
            <>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                Welcome, {userName}
              </Text>
              <Button
                size="sm"
                bgGradient={logoutButtonBgGradient}
                color={logoutButtonTextColor}
                _hover={{
                  bgGradient: logoutButtonHoverBgGradient,
                }}
                onClick={handleLogout}
                fontWeight="bold"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent={colorMode === "light" ? "flex-start" : "flex-end"}
                bg={switchBg}
                borderRadius="full"
                w={12}
                h={6}
                p={1}
                onClick={toggleColorMode}
                cursor="pointer"
                transition="background-color 0.3s ease"
                _hover={{ bg: colorMode === "light" ? "gray.400" : "gray.500" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={switchCircleBg}
                  borderRadius="full"
                  boxSize={4}
                  transition="transform 0.3s ease"
                >
                  {colorMode === "light" ? (
                    <Icon as={SunIcon} color={switchIconColor} boxSize={3} />
                  ) : (
                    <Icon as={MoonIcon} color={switchIconColor} boxSize={3} />
                  )}
                </Box>
              </Box>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;

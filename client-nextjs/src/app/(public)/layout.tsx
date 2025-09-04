"use client";

import Header, { HEADER_HEIGHT } from "@/components/common/Header/Header";
import GlobalLoading from "@/components/common/Loading/GlobalLoading";
import NavigationDesktop from "@/components/common/Navigation/NavigationDesktop";
import NavigationMobile from "@/components/common/Navigation/NavigationMobile";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const NAVIGATION_WIDTH = "96px";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <GlobalLoading />

      <Box sx={{ minHeight: "100vh" }}>
        <Header />

        {/* Main content area */}
        <Box
          sx={{
            padding: "40px",
            marginLeft: isMobile ? 0 : NAVIGATION_WIDTH,
            marginBottom: isMobile ? "56px" : 0,
            minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
            overflow: "auto",
          }}
        >
          {children}
        </Box>

        {/* Navigation - fixed position */}
        <Box
          display={isMobile ? "none" : "block"}
          sx={{
            position: "fixed",
            left: 0,
            top: HEADER_HEIGHT,
            width: NAVIGATION_WIDTH,
            height: `calc(100vh - ${HEADER_HEIGHT})`,
            zIndex: 1000,
            bgcolor: "#fff",
          }}
        >
          <NavigationDesktop />
        </Box>
        <Box
          display={isMobile ? "block" : "none"}
          sx={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100%",
            zIndex: 1000,
            bgcolor: "#fff",
          }}
        >
          <NavigationMobile />
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;

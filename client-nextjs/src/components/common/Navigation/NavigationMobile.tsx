"use client";

import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";

const StyledNavLink = styled(Link)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  color: "#797979",
  fontSize: "12px",
  fontWeight: 500,
  width: 70,
  height: 70,
  borderRadius: 15,
  "&:hover": {
    backgroundColor: "#F5F5F5",
  },
}));

const NavigationMobile = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "60px",
        gap: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "16px 0",
      }}
    >
      <StyledNavLink href="/">
        {/* <HomeIcon color={isActive ? "primary" : "inherit"} sx={{ mb: 0.5 }} /> */}
        <Typography variant="caption" fontWeight={500}>
          Trang chủ
        </Typography>
      </StyledNavLink>
      <StyledNavLink href="/learning-paths">
        {/* <MapIcon color={isActive ? "primary" : "inherit"} sx={{ mb: 0.5 }} /> */}
        <Typography variant="caption" fontWeight={500}>
          Lộ trình
        </Typography>
      </StyledNavLink>
      <StyledNavLink href="/blog">
        {/* <NewspaperIcon color={isActive ? "primary" : "inherit"} sx={{ mb: 0.5 }} /> */}
        <Typography variant="caption" fontWeight={500}>
          Bài viết
        </Typography>
      </StyledNavLink>
    </Box>
  );
};

export default NavigationMobile;

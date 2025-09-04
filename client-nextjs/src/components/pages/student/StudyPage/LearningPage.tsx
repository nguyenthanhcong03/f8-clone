"use client";

import Logo from "@/assets/images/logo.png";
import { fetchCourseById } from "@/store/courseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppBar, Avatar, Box, CssBaseline, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LessonContent from "./components/LessonContent";
import LessonSidebar from "./components/LessonSidebar";
import Image from "next/image";

interface LearningPageProps {
  courseId: string;
}

const LearningPage = ({ courseId }: LearningPageProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentCourse } = useAppSelector((state) => state.courses);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(parseInt(courseId)));
      console.log("curentCourse:", currentCourse);

      if (
        !searchParams.get("lessonId") &&
        currentCourse?.sections &&
        currentCourse?.sections.length > 0 &&
        currentCourse?.sections[0].lessons &&
        currentCourse?.sections[0].lessons.length > 0
      ) {
        const params = new URLSearchParams(searchParams);
        params.set("lessonId", currentCourse?.sections[0].lessons[0].id.toString());
        console.log("Navigating to first lesson with params:", currentCourse?.sections[0].lessons[0].id.toString());

        router.push(`/${params.toString()}`);
      }
    }
  }, [dispatch, courseId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#29303B",
            color: "#fff",
            height: 50,
          }}
        >
          {/* <IconButton
            onClick={() => console.log("Back to course list")}
            component={Link}
            disableRipple
            color="inherit"
            to={`/${courseId}`}
            edge="end"
            sx={{ width: 65, height: 50, borderRadius: 0, "&:hover": { bgcolor: "#252B35" } }}
          >
            <ArrowBackIcon />
          </IconButton> */}

          {/* <Box component={Link} to={"/"} sx={{ borderRadius: 2, width: 30, height: 30, overflow: "hidden", mx: 2 }}>
            <img src={Logo} alt="Logo" width={30} height={30} />
          </Box> */}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", fontSize: 14 }}>
            {currentCourse?.title || "Khóa học"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2, cursor: "pointer" }}>
            <Avatar alt="User avatar" src="/path-to-avatar.jpg" sx={{ width: 32, height: 32 }} />
          </Box>
        </Box>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Mobile Drawer Toggle */}
        <Box
          component="nav"
          sx={{
            width: { xs: "100%", md: "40%", lg: "23%" },
            bgcolor: "#fff",
            boxShadow: mobileOpen ? 1 : 0,
            flexShrink: { sm: 0 },
            display: { xs: mobileOpen ? "block" : "none", lg: "block" },
            height: "100%",
            position: { xs: "absolute", lg: "relative" },
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1200,
          }}
        >
          <LessonSidebar searchParams={searchParams} handleDrawerToggle={handleDrawerToggle} />
        </Box>
        {/* Overlay */}
        {mobileOpen && (
          <Box
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "block", lg: "none" },
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1100,
            }}
          />
        )}

        {/* Lesson Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            overflow: "auto",
          }}
        >
          <LessonContent handleDrawerToggle={handleDrawerToggle} />
        </Box>
      </Box>
    </Box>
  );
};

export default LearningPage;

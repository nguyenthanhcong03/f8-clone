"use client";

import { fetchCourseById } from "@/store/courseSlice";
import { checkEnrollment, enrollCourse } from "@/store/enrollmentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { translateLevel } from "@/utils/courseUtils";
import DevicesIcon from "@mui/icons-material/Devices";
import SchoolIcon from "@mui/icons-material/School";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseOutline from "./components/CourseOutline";
import Loader from "@/components/common/Loading/Loader";
import { showSnackbar } from "@/store/snackbarSlice";
import { HEADER_HEIGHT } from "@/components/common/Header/Header";
export default function CourseDetailPage() {
  const courseId = useParams().courseId;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentCourse, totalSections, totalLessons } = useAppSelector((state) => state.courses);
  const { loading: getCourseLoading } = useAppSelector((state) => state.courses);
  const { loading, enrolled, checkingEnrollment } = useAppSelector((state) => state.enrollment);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleEnrollCourse = (courseId: number) => {
    dispatch(enrollCourse(courseId));
  };

  const handleNavigateToLearningPage = async (courseId: number) => {
    try {
      const result = await dispatch(checkEnrollment(courseId)).unwrap();
      const isEnrolled = result.enrolled;

      if (isEnrolled) {
        router.push(`/learning/${courseId}`);
      }
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.message || "Đã xảy ra lỗi khi kiểm tra đăng ký khóa học",
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(parseInt(courseId)));
    }

    if (courseId && isAuthenticated && user) {
      dispatch(checkEnrollment(parseInt(courseId)));
    }
  }, [dispatch, courseId, isAuthenticated, user]);

  if (getCourseLoading) {
    return <Loader />;
  }

  return (
    <Stack direction="row" spacing={2} alignItems={"flex-start"}>
      <Box sx={{ overflowY: "auto", scrollbarWidth: "none" }} flex={4}>
        <Box sx={{ height: `100vh` }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {currentCourse?.title || "Thông tin khóa học"}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {currentCourse?.description || "Không có mô tả."}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Nội dung khóa học
              </Typography>
              <Box sx={{ mt: 1, fontSize: "14px", display: "flex", gap: 1 }}>
                <Box>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    {totalSections}{" "}
                  </Box>
                  chương
                </Box>
                •
                <Box>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    {totalLessons}{" "}
                  </Box>
                  bài học
                </Box>
              </Box>
            </Box>
            <CourseOutline />
          </Box>
        </Box>
      </Box>
      <Box
        flex={2}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
          gap: 2,
          // height: '100vh',
          position: "sticky",
        }}
      >
        {/* Thumbnail with video overlay */}
        <Box
          sx={{
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={currentCourse?.thumbnail || "/path/to/default-thumbnail.jpg"}
            alt={currentCourse?.title}
            sx={{
              borderRadius: 2,

              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Price */}
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            color: "primary.main",
          }}
        >
          {currentCourse?.is_paid === true ? `${(currentCourse?.price || 0).toLocaleString("vi-VN")} ₫` : "Miễn phí"}
        </Typography>

        {enrolled ? (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: 200 }}
            loading={checkingEnrollment}
            onClick={() => courseId && handleNavigateToLearningPage(parseInt(courseId))}
          >
            VÀO HỌC
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: 200 }}
            loading={loading}
            onClick={() => courseId && handleEnrollCourse(parseInt(courseId))}
          >
            ĐĂNG KÝ HỌC
          </Button>
        )}

        {/* Course stats */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SignalCellularAltIcon sx={{ color: "#666", fontSize: 20 }} />
            <Typography variant="body2">Trình độ {translateLevel(currentCourse?.level)}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SchoolIcon sx={{ color: "#666", fontSize: 20 }} />
            <Typography variant="body2">Tổng số {totalLessons || 0} bài học</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <DevicesIcon sx={{ color: "#666", fontSize: 20 }} />
            <Typography variant="body2">Học mọi lúc, mọi nơi</Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

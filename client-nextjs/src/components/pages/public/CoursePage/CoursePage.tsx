"use client";

import Loader from "@/components/common/Loading/Loader";
import { fetchCourses } from "@/store/courseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdSlider from "./components/AdSlider";
import CourseCard from "@/components/common/CourseCard/CourseCard";

const CoursePage = () => {
  const { courses, loading, error } = useAppSelector((state: any) => state.courses);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const getCourses = async () => {
      await dispatch(fetchCourses());
    };

    getCourses();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <AdSlider />
      <Box>
        <Grid container spacing={3} mt={3}>
          {courses.map((course: any) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default CoursePage;

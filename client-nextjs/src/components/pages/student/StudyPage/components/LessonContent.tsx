import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchLessonById } from "@/store/lessonSlice";
import { saveProgress } from "@/store/progressSlice";
import { Menu } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";

const LessonArea = ({ handleDrawerToggle }: { handleDrawerToggle?: () => void }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const { currentLesson, lessonLoading } = useAppSelector((state) => state.lessons);
  const { loading: progressLoading, isCompleted } = useAppSelector((state) => state.progress);
  const { currentCourse } = useAppSelector((state) => state.courses);
  console.log("Current lesson:", currentLesson);

  const previousLessonId = currentLesson?.previousLessonId;
  const nextLessonId = currentLesson?.nextLessonId;

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(parseInt(lessonId)));
    }
  }, [dispatch, lessonId]);

  // Get section title
  const getSectionTitle = () => {
    if (!currentLesson) return "";
    const section =
      currentCourse?.sections && currentCourse.sections.find((section) => section.id === currentLesson.section_id);
    return section?.title || "";
  };

  const navigateToLesson = (lessonId: number) => {
    if (lessonId) {
      const params = new URLSearchParams(searchParams);
      params.set("lessonId", lessonId.toString());

      router.push(`/${params.toString()}`);
    }
  };

  if (!currentLesson && !lessonLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Chọn bài học từ danh sách để bắt đầu
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: "center" }}>
          Hãy chọn một bài học từ menu bên trái để xem nội dung
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Lesson header */}
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <div>
          <Typography variant="body2" color="text.secondary">
            {getSectionTitle()}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {currentLesson?.title}
          </Typography>
        </div>
        {isCompleted ? (
          <Button size="small" loading={progressLoading}>
            <FactCheckIcon fontSize="small" sx={{ mr: 1 }} />
            Đánh dấu đã học
          </Button>
        ) : (
          <Button size="small" loading={progressLoading}>
            <FactCheckIcon fontSize="small" sx={{ mr: 1 }} />
            Đánh dấu đã học
          </Button>
        )}
      </Stack>

      {/* Lesson content */}
      <Box
        sx={{
          p: 3,
          overflow: "auto",
          flex: 1,
          bgcolor: "background.default",
        }}
      >
        {currentLesson?.video_url ? (
          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%", // 16:9 Aspect Ratio
              width: "100%",
              maxWidth: "100%",
              mb: 3,
              overflow: "hidden",
              borderRadius: 1,
            }}
          >
            <ReactPlayer
              src={currentLesson.video_url}
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
              controls={true}
              onEnded={() => {
                if (currentLesson?.id) {
                  dispatch(saveProgress({ lessonId: currentLesson.id, isCompleted: true }));
                }
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%", // 16:9 Aspect Ratio
              width: "100%",
              maxWidth: "100%",
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "grey.200",
                borderRadius: 1,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <PlayCircleFilledIcon sx={{ fontSize: 60, opacity: 0.7 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Video không khả dụng
              </Typography>
            </Box>
          </Box>
        )}

        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          {currentLesson?.content ? (
            <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
          ) : (
            <Typography variant="body1">Không có nội dung cho bài học này.</Typography>
          )}
        </Paper>
      </Box>

      {/* Lesson navigation */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Mobile Drawer Toggle Button */}

        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              border: "1px solid",
            }}
          >
            <Menu fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: "bold", fontSize: 14, width: "max-content" }}>
            {currentLesson?.title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, width: "100%", justifyContent: { xs: "end", lg: "space-between" } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            disabled={!previousLessonId}
            onClick={() => navigateToLesson(previousLessonId)}
            variant="outlined"
          >
            Bài trước
          </Button>

          <Button
            endIcon={<ArrowForwardIcon />}
            disabled={!nextLessonId}
            onClick={() => navigateToLesson(nextLessonId)}
            variant="contained"
          >
            Bài tiếp theo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonArea;

import LearningPage from "@/components/pages/student/StudyPage/LearningPage";

export default function StudyPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  return <LearningPage courseId={courseId} />;
}

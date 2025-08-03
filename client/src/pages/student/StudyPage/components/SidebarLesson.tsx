import { useAppSelector } from '@/store/hook'
import { Close } from '@mui/icons-material'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'

interface Iprops {
  params: URLSearchParams
  setParams: (params: URLSearchParams) => void
  handleDrawerToggle?: () => void
}

const SidebarLesson = ({ params, setParams, handleDrawerToggle }: Iprops) => {
  const [openSections, setOpenSections] = useState<number[]>([])
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null)
  const { currentCourse } = useAppSelector((state) => state.courses)
  const { currentLesson } = useAppSelector((state) => state.lessons)

  // Set active lesson đang được chọn từ URL
  useEffect(() => {
    const lessonId = params.get('lessonId')
    if (lessonId) {
      setActiveLessonId(Number(lessonId))
    }
  }, [params])

  // Xử lý mở accordion section khi reload
  useEffect(() => {
    if (currentLesson) {
      setOpenSections((prev) => {
        // Kiểm tra xem section của bài học hiện tại đã có trong danh sách mở chưa
        if (!prev.includes(currentLesson.section_id)) {
          return [...prev, currentLesson.section_id]
        }
        return prev
      })
    }
  }, [currentLesson])

  // Xử lý mở accordion section khi click vào section
  const handleSectionClick = (sectionId: number) => {
    if (openSections.includes(sectionId)) {
      setOpenSections(openSections.filter((id) => id !== sectionId))
    } else {
      setOpenSections([...openSections, sectionId])
    }
  }

  const handleLessonClick = (lessonId: number) => {
    setActiveLessonId(lessonId)
    setParams(new URLSearchParams({ lessonId: String(lessonId) }))
  }

  return (
    <Box
      sx={{
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant='h6' fontWeight='bold'>
            Nội dung bài học
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {currentCourse?.sections && currentCourse?.sections.length} chương •{' '}
            {currentCourse?.sections &&
              currentCourse?.sections.reduce((sum, section) => {
                return sum + (section.lessons?.length || 0)
              }, 0)}{' '}
            bài học
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'block', lg: 'none' }, cursor: 'pointer' }}>
          <Close onClick={handleDrawerToggle} />
        </Box>
      </Box>

      <List component='nav' sx={{ p: 0 }}>
        {currentCourse?.sections &&
          currentCourse?.sections.map((section) => (
            <React.Fragment key={section.id}>
              <Accordion
                expanded={openSections.includes(section.id)}
                onChange={() => handleSectionClick(section.id)}
                disableGutters
                elevation={0}
                sx={{
                  '&:before': { display: 'none' },
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: openSections.includes(section.id) ? 'action.selected' : 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                    span: {
                      my: 1
                    }
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>{section.title}</Typography>
                    <Typography variant='body2' sx={{ color: '#29303b', fontSize: 13, mt: 0.5 }}>
                      {section.lessons?.length} bài học
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <List component='div' disablePadding>
                    {section?.lessons &&
                      section.lessons.map((lesson) => (
                        <ListItemButton
                          key={lesson.id}
                          selected={activeLessonId === lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          sx={{ pl: 4, py: 1, display: 'flex', alignItems: 'center', justifyItems: 'center' }}
                        >
                          <PlayCircleOutlineIcon
                            color={activeLessonId === lesson.id ? 'primary' : 'inherit'}
                            fontSize='small'
                            sx={{ mr: 1 }}
                          />
                          <ListItemText
                            primary={lesson.title}
                            primaryTypographyProps={{
                              fontSize: '0.9rem',
                              color: activeLessonId === lesson.id ? 'primary' : 'inherit',
                              fontWeight: activeLessonId === lesson.id ? 'bold' : 'normal'
                            }}
                          />

                          {/* <CheckCircle fontSize='small' color='success' /> */}
                        </ListItemButton>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          ))}
      </List>
    </Box>
  )
}

export default SidebarLesson

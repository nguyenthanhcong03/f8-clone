import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useAppSelector } from '@/store/hook'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

const CourseContent = () => {
  const { currentCourse } = useAppSelector((state) => state.courses)
  const [expanded, setExpanded] = useState(false)

  const handleChange = () => {
    setExpanded(!expanded)
  }
  return (
    <Box>
      {currentCourse?.sections && currentCourse.sections.length > 0 ? (
        currentCourse.sections.map((section) => (
          <Accordion
            expanded={expanded}
            disableGutters
            elevation={0}
            square
            onChange={handleChange}
            key={section.id}
            sx={{ mb: 1, overflow: 'hidden' }}
          >
            <AccordionSummary
              expandIcon={expanded ? <RemoveIcon color='primary' /> : <AddIcon color='primary' />}
              sx={{ borderRadius: 1, bgcolor: '#F5F5F5', border: '1px solid #E0E0E0' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 2
                }}
              >
                <Typography sx={{ fontWeight: 'medium' }}>{section.title}</Typography>
                <Typography>{section.lessons && section.lessons.length} bài học</Typography>
              </Box>
            </AccordionSummary>
            {section.lessons && section.lessons.length > 0 ? (
              <AccordionDetails sx={{ padding: 0 }}>
                {section.lessons.map((lesson) => (
                  <Box
                    key={lesson.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: '1px solid #E0E0E0'
                    }}
                  >
                    <PlayCircleIcon color='primary' fontSize='small' sx={{ marginRight: 1 }} />
                    <Typography variant='body2' sx={{ flexGrow: 1 }}>
                      {lesson.title}
                    </Typography>
                  </Box>
                ))}
              </AccordionDetails>
            ) : (
              <AccordionDetails sx={{ padding: 2 }}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Không có bài học nào trong chương này.
                </Typography>
              </AccordionDetails>
            )}
          </Accordion>
        ))
      ) : (
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Không có nội dung chương nào.
        </Typography>
      )}
    </Box>
  )
}

export default CourseContent

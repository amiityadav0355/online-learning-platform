import React, { useContext } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';

function ChapterListSidebar({ courseInfo }) {
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
    const {selectedChapterIndex, setSelectedChapterIndex} = useContext(SelectedChapterIndexContext)

  const completedChaptersFromServer = enrollCourse?.completedChapters;
  const completedChapters = Array.isArray(completedChaptersFromServer)
    ? [...completedChaptersFromServer]
    : [];
 

  return (
      <div className='w-80 bg-secondary h-screen p-5'>
        <h2 className='my-3 font-bold text-xl'>Chapters ({courseContent?.length})</h2>
      <Accordion type="single" collapsible>
{courseContent?.map((chapter, index) => {
  const chapterName = chapter?.courseData?.chapterName || chapter?.chapterName;
  const isChapterCompleted = completedChapters.includes(index + 1);

  return (
      <AccordionItem value={chapterName} key={index}
      onClick={() => setSelectedChapterIndex(index)}>
        <AccordionTrigger className={`text-lg font-medium
           ${
               isChapterCompleted ? "bg-green-100 text-green-800": "bg-white"
              }`}>{chapterName}</AccordionTrigger>
        <AccordionContent>
              <div className="space-y-2 overflow-visible">
              {chapter?.courseData?.topics?.map((topic, tIndex) => {
              const isChapterCompleted = completedChapters.includes(index + 1);

              return (
                <h2
                  key={tIndex}
                  className={`p-3 hover:bg-gray-50 text-gray-900 rounded-lg shadow-sm cursor-pointer border ${
                    isChapterCompleted ? "bg-green-100 text-green-800" : "bg-white"
                  }`}
                >
                  {topic?.topic}
                </h2>
               );
              })}

              </div>

        </AccordionContent>
      </AccordionItem>
  );
})}

</Accordion>
    </div>
  )
}

export default ChapterListSidebar

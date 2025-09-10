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
  return (
    <div className='w-80 bg-secondary h-screen p-5'>
      <h2 className='my-3 font-bold text-xl'>Chapters ({courseContent?.length})</h2>
      <Accordion type="single" collapsible>
{courseContent?.map((chapter, index) => {
  const chapterName = chapter?.courseData?.chapterName || chapter?.chapterName;

  return (
      <AccordionItem value={chapterName} key={index}
      onClick={() => setSelectedChapterIndex(index)}>
        <AccordionTrigger className={'text-lg font-medium'}>{chapterName}</AccordionTrigger>
        <AccordionContent>
              <div className="space-y-2 overflow-visible">
                {chapter?.courseData?.topics?.map((topic, index) => (
                  <h2
                    key={index}
                    className="p-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg shadow-sm cursor-pointer border"
                  >
                    {topic?.topic}
                  </h2>
                ))}
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

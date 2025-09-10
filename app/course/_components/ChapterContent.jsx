import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import React, { useContext } from 'react'
import YouTube from 'react-youtube';

function ChapterContent({ courseInfo }) {
  if (!courseInfo) {
    return <div>Loading...</div>; // or a spinner
  }

  const { courses: course, enrollCourse } = courseInfo;
  const courseContent = course?.courseContent;

  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>{courseContent?.[selectedChapterIndex]?.courseData?.chapterName}</h2>
      <h2 className='my-2 font-bold text-lg'>Related Videos🎦</h2>
      <div>
        {videoData?.map((video, index)=>(
          <div key = {index}>
            <YouTube 
            videoId={video?.videoId}
            />
      </div>
        ))}
    </div>
    </div>
  )
}

export default ChapterContent

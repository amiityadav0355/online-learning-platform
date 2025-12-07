

// import { Button } from '@/components/ui/button';
// import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
// import axios from 'axios';
// import { CheckCircle, X } from 'lucide-react';
// import { useParams } from 'next/navigation';
// import React, { useContext } from 'react'
// import YouTube from 'react-youtube';
// import { toast } from 'sonner';

// function ChapterContent({ courseInfo, refreshData}) {
//   if (!courseInfo) {
//     return <div>Loading...</div>; // or a spinner
//   }
//   const {courseId}=useParams();
//   const { courses: course, enrollCourse } = courseInfo;
//   const courseContent = course?.courseContent;

//   const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
//   const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
//   const topics = courseContent?.[selectedChapterIndex]?.courseData.topics
//   let completedChapter = enrollCourse?.completedChapter ?? [];

//   const markChapterCompleted =async() =>{
    
//       completedChapter.push(selectedChapterIndex+1);
//       const result = await axios.put('/api/enroll-course',{
//         courseId:courseId,
//         completedChapter:completedChapter
//       });

//       console.log(result);
//       refreshData()
//       toast.success('Chapter Marked As Completed!')
//     }
  

//   return (
//     <div className='p-10'>
//       <div className='flex justify-between items-center'>
//       <h2 className='font-bold text-2xl'>{courseContent?.[selectedChapterIndex]?.courseData?.chapterName}</h2>
//       {!completedChapter?.includes(selectedChapterIndex)?<Button onClick={()=>markChapterCompleted()}> <CheckCircle/> Mark as Completed</Button>:
//       <Button variant="outline" ><X/> Mark Incomplete</Button>}
//       </div>
//       <h2 className='my-2 font-bold text-lg'>Related Videos🎦</h2>
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
//         {videoData?.map((video, index) => index < 2 && (
//           <div key={index}>
//             <YouTube 
//               videoId={video?.videoId}
//               opts={{
//                 height: '250',
//                 width: '400',
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       <div className='mt-7 '>
//         {topics?.map((topic, index) => (
//           <div key={index} className=' mt-10 p-5 bg-secondary rounded-2xl'>
//             <h2 className='font-bold text-lg text-primary'>{index+1}.{topic?.topic}</h2>
//             <div dangerouslySetInnerHTML={{ __html: topic?.content}}
//               style={{
//                 lineHeight: '2.5'
               
//             }} className='prose max-w-none leading-relaxed'
//             ></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ChapterContent



import { Button } from '@/components/ui/button';
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import axios from 'axios';
import { CheckCircle, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useContext } from 'react'
import YouTube from 'react-youtube';
import { toast } from 'sonner';


function cleanAiHtml(html = "") {
  if (!html) return "";

  let cleaned = html.replace(/<style[\s\S]*?<\/style>/gi, ""); // remove styles
  cleaned = cleaned.replace(/<\/?(?:html|head|body)[^>]*>/gi, ""); // remove wrappers
  cleaned = cleaned.replace(/<meta[\s\S]*?>/gi, ""); // remove meta tags
  cleaned = cleaned.replace(/<link[\s\S]*?>/gi, ""); // remove link tags
  cleaned = cleaned.replace(/<title[\s\S]*?<\/title>/gi, ""); // remove title

  return cleaned.trim();
}


function ChapterContent({ courseInfo, refreshData}) {
  if (!courseInfo) {
    return <div>Loading...</div>;
  }
  const { courseId } = useParams();
  const { courses: course, enrollCourse } = courseInfo;
  const courseContent = course?.courseContent;

  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const completedChaptersFromServer = enrollCourse?.completedChapters;
  const completedChapters = Array.isArray(completedChaptersFromServer)
    ? [...completedChaptersFromServer]
    : [];

  const currentChapterNumber = selectedChapterIndex + 1;
  const isCompleted = completedChapters.includes(currentChapterNumber);

  const markChapterCompleted = async () => {
    try {
      const updated = Array.from(new Set([...completedChapters, currentChapterNumber]));
      const result = await axios.put('/api/enroll-course', {
        courseId,
        completedChapters: updated,
      });
      refreshData();
      toast.success('Chapter marked as completed!');
    } catch (err) {
      console.error('Failed to mark chapter completed', err);
      toast.error('Failed to mark chapter completed');
    }
  };

  const markChapterIncomplete = async () => {
    try {
      const updated = completedChapters.filter((c) => c !== currentChapterNumber);
      const result = await axios.put('/api/enroll-course', {
        courseId,
        completedChapters: updated,
      });
      refreshData();
      toast.success('Chapter marked as incomplete');
    } catch (err) {
      console.error('Failed to mark chapter incomplete', err);
      toast.error('Failed to mark chapter incomplete');
    }
  };

  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics ?? [];

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>
          {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
        </h2>

        {!isCompleted ? (
          <Button onClick={markChapterCompleted}>
            <CheckCircle /> Mark as Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={markChapterIncomplete}>
            <X /> Mark Incomplete
          </Button>
        )}
      </div>

      <h2 className='my-2 font-bold text-lg'>Related Videos🎦</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {videoData?.map((video, index) => index < 2 && (
          <div key={index}>
            <YouTube
              videoId={video?.videoId}
              opts={{ height: '250', width: '400' }}
            />
          </div>
        ))}
      </div>

      <div className='mt-7'>
        {topics.map((topic, index) => (
          <div key={index} className='mt-10 p-5 bg-secondary rounded-2xl'>
            <h2 className='font-bold text-lg text-primary'>{index + 1}.{topic?.topic}</h2>
            <div
              dangerouslySetInnerHTML={{ __html:  cleanAiHtml (topic?.content) }}
              style={{ lineHeight: '2.5' }}
              className='prose max-w-none leading-relaxed'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterContent;

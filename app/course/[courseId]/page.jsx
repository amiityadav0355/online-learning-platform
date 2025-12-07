// "use client"
// import AppHeader from '@/app/workspace/_components/AppHeader'
// import React, { useEffect, useState } from 'react'
// import ChapterListSidebar from '../_components/ChapterListSidebar'
// import ChapterContent from '../_components/ChapterContent'
// import { useParams } from 'next/navigation'
// import axios from 'axios'

// function Course() {
//   const {courseId} = useParams();
//   const [courseInfo, setCourseInfo] = useState();
//     useEffect(() => {
//       GetEnrolledCourseById();
//     }, []); // ✅ runs once on mount
  

//     const GetEnrolledCourseById = async () => {
//       try {
//         const result = await axios.get('/api/enroll-course?courseId='+ courseId);
//         console.log(result.data);
//         setCourseInfo(result.data);
//       } catch (error) {
//         console.error("Error fetching enrolled courses:", error);
//       }
//     };
  
//   return (
//     <div>
//       <AppHeader hideSidebar={true}/>
//       <div className='flex gap-10'>
//         <ChapterListSidebar courseInfo={courseInfo} />
//         <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrolledCourseById()}/>
//       </div>
//     </div>
//   )
// }

// export default Course


"use client";

import AppHeader from "@/app/workspace/_components/AppHeader";
import React, { useEffect, useState } from "react";
import ChapterListSidebar from "../_components/ChapterListSidebar";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import axios from "axios";

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    GetEnrolledCourseById();
  }, [courseId]);

  const GetEnrolledCourseById = async () => {
    try {
      const result = await axios.get("/api/enroll-course?courseId=" + courseId);
      setCourseInfo(result.data ?? null);
    } catch (error) {
      console.error("Error fetching enrolled course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader hideSidebar={true} />

      {/* MAIN FLEX LAYOUT */}
      <div className="flex gap-6 px-4 md:px-8 py-6">
        
        {/* SIDEBAR */}
        <aside className="w-80 min-h-[60vh] bg-secondary p-0 rounded-md overflow-auto">
          {/* wrapper ensures sidebar content fills full width */}
          <div className="w-full">
            <ChapterListSidebar courseInfo={courseInfo} />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <ChapterContent 
            courseInfo={courseInfo} 
            refreshData={GetEnrolledCourseById} 
          />
        </main>

      </div>
    </div>
  );
}

export default Course;

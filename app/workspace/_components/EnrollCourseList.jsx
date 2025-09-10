"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import EnrollCourseCard from './EnrollCourseCard';

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);

  useEffect(() => {
    GetEnrolledCourse();
  }, []); // ✅ runs once on mount

  const GetEnrolledCourse = async () => {
    try {
      const result = await axios.get('/api/enroll-course');
      console.log(result.data);
      setEnrolledCourseList(result.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  return (
    enrolledCourseList?.length > 0 && (
      <div className='mt-3'>
        <h2 className='font-bold text-xl'>Continue Learning Your Courses</h2>

        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'> 
          {enrolledCourseList?.map((course, index) => (
            <EnrollCourseCard 
              course={course?.courses} 
              enrollCourse={course?.enrollCourse} 
              key={index} 
            />
          ))}

        </div>
      </div>
    )
  );
}

export default EnrollCourseList;

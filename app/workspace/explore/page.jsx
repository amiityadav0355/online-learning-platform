"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";


function Explore() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) GetCourseList();
  }, [user]);

  const GetCourseList = async () => {
    const result = await axios.get("/api/courses?courseId=0");
    setCourseList(result.data);
  };

  return (
    <div>
      <h2 className="font-bold text-3xl mb-6">Explore More Courses</h2>

      <div className="flex gap-5 max-w-md mb-6">
        <Input placeholder="Search" />
        <Button>
          <Search /> Search
        </Button>
      </div>

      
    
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courseList.length>0?courseList?.map((course, index) => (
            <CourseCard course={course} key={index} refreshData={GetCourseList} />
          )):
          [0,1,2,3].map((item,index)=>(
             <Skeleton key={index} className='w-full h-[120px]'/>
          ))
        }
        </div>
      
    </div>
  );
}

export default Explore;

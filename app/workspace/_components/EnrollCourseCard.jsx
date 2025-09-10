import React from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";


function EnrollCourseCard({ course, enrollCourse }) {
  const courseJson = course?.courseJson?.course;


  const CalculatePerProgress=()=>{
    return (enrollCourse?.completedChapters?.length??0/course?.courseContent?.length)*100
  }
  return (
    <div className="border rounded-xl overflow-hidden shadow-md mt-5 w-[350px] flex flex-col">
      {/* Banner Image */}
      {course?.bannerImageUrl ? (
        <Image
          src={course.bannerImageUrl}
          alt={course?.name || "Course banner"}
          width={400}
          height={250}
          className="w-full h-[250px] rounded-t-xl object-cover"
        />
      ) : (
        <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}

      {/* Course Info */}
      <div className="p-3">
        <h3 className="font-semibold text-lg mb-2">{courseJson?.name || "Untitled Course"}</h3>
        <p className="text-gray-600 line-clamp-4">
          {courseJson?.description || course?.description || "No description available."}
        </p>
       <div className='mt-3'>
        <h2 className='flex justify-between text-sm text-primary'>Progress <span>{CalculatePerProgress()}%</span></h2>
          <Progress value={CalculatePerProgress()} />

          <Link href={'/workspace/view-course/' + course?.cid}>
              <Button className={'w-full mt-3'}><PlayCircle/>Continue Learning</Button>
          </Link>
          </div>
      </div>
    </div>
  );
}

export default EnrollCourseCard;

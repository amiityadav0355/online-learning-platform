import React from "react";
import Image from "next/image";

function EnrollCourseCard({ course }) {
  const courseJson = course?.courseJson?.course;

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

      {/* Description */}
      <div className="p-3">
        <p className="text-gray-600 line-clamp-4">
          {course?.description || courseJson?.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

export default EnrollCourseCard;

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function CourseCard({ course }) {
  const [loading, setLoading] = useState(false);

  let parsedJson = {};
  try {
    parsedJson =
      typeof course?.courseJson === "string"
        ? JSON.parse(course.courseJson)?.course
        : course?.courseJson?.course;
  } catch (err) {
    console.error("Error parsing courseJson:", err);
  }

  const hasCourseContent =
    Array.isArray(course?.courseContent) && course.courseContent.length > 0;

  // ✅ Prefer AI description, fallback to DB description
  const description =
    parsedJson?.description ||
    course?.description ||
    "No description available.";

  const onEnrollCourse = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/enroll-course", {
        courseId: course?.cid,
      });

      if (result.data.resp) {
        toast.warning("Already Enrolled!");
        setLoading(false);
        return;
      }

      toast.success("Enrolled!");
      setLoading(false);
    } catch (e) {
      toast.error("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-md mt-5 w-[350px] flex flex-col">
      {/* Banner Image */}
      <Image
        src={
          course?.bannerImageUrl && course.bannerImageUrl.trim() !== ""
            ? course.bannerImageUrl
            : "/default-course.jpg"
        }
        alt={parsedJson?.name || course?.name || "Course banner"}
        width={400}
        height={300}
        className="w-full h-[250px] rounded-t-xl object-cover"
      />

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        {/* Title + Description */}
        <div>
          <h2 className="text-lg font-semibold">
            {parsedJson?.name || course?.name}
          </h2>
          <p className="line-clamp-3 text-gray-600">{description}</p>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-center pt-4">
          {/* Chapter count */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Book size={20} className="text-indigo-500" />
            <span className="font-semibold">
              {parsedJson?.noOfChapters || course?.noOfChapters || 0} Chapters
            </span>
          </div>

          {/* Action Button */}
          {hasCourseContent ? (
            <Button
              className="flex items-center gap-2"
              onClick={onEnrollCourse}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <PlayCircle size={22} />
              )}
              Enroll Course
            </Button>
          ) : (
            <Link href={`/workspace/edit-course/${course?.cid}`}>
              <Button className="flex items-center gap-2" variant="outline">
                <Settings size={20} /> Generate Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;

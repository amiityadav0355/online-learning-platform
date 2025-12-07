// // import { NextResponse } from "next/server";
// // import { ai } from "../generate-course-layout/route";


// // const PROMPT =`Depends on Chapter name and Topic Generate content for each topic in HTML and give response in JSON format.
// // Schema:{
// // chapterName:<>,
// // {
// // topic:<>,
// // content:<>
// // }
// // }
// // : User Input:
// // `
// // export async function POST(req){
// // const { courseJson, courseTitle, courseId } = await req.json();

// //   const promises = courseJson?.chapters?.map(async(chapter)=>{
// //      const config = {
// //     thinkingConfig: {
// //       thinkingBudget: -1,
// //     },
// //   };
// //   const model = 'gemini-2.5-pro';
// //   const contents = [
// //     {
// //       role: 'user',
// //       parts: [
// //         {
// //           text: PROMPT+JSON.stringify(chapter),
// //         },
// //       ],
// //     },
// //   ];

// //   const response = await ai.models.generateContent({
// //     model,
// //     config,
// //     contents,
// //   });

// //   const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

// //     if (!text) {
// //       console.error("❌ Gemini returned an invalid or empty response:", JSON.stringify(response, null, 2));
// //       return {
// //         chapterName: chapter.chapterName,
// //         error: "AI response was empty or invalid",
// //         topics: [],
// //       };
// //     }

// // console.log("✅ Gemini Response Text:", text);
// //   const RawResp = response.candidates[0].content.parts[0].text
// //   const RawJson = RawResp.replace('```json','').replace('```','');
// //   const JSONResp = JSON.parse(RawJson);

  
// //   // GET Youtube Videos
// //   return JSONResp;
// //   })

// //   const CourseContent = await Promise.all(promises);

// //   return NextResponse.json({
// //     courseName: courseTitle,
// //     CourseContent: CourseContent
// //   })

// // }


import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";


const PROMPT = `Depends on Chapter name and Topic Generate content for each topic in HTML and give response in JSON format.
Schema:{
chapterName:<>,
{
topic:<>,
content:<>
}
}
: User Input:
`;

export async function POST(req) {
  const { courseJson, courseTitle, courseId } = await req.json();

  const promises = courseJson?.chapters?.map(async (chapter) => {
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
    };

    const model = 'gemini-2.5-pro';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: PROMPT + JSON.stringify(chapter),
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("❌ Gemini returned an invalid or empty response:", JSON.stringify(response, null, 2));
      return {
        chapterName: chapter.chapterName,
        error: "AI response was empty or invalid",
        topics: [],
      };
    }

    console.log("✅ Gemini Response Text:", text);

    const RawResp = text;
    const RawJson = RawResp.replace('```json', '').replace('```', '').trim();

    try {
      const JSONResp = JSON.parse(RawJson);

      // GET YOUTUBE VIDEOS
      const youtubeData = await GetYoutubeVideo(chapter?.chapterName);

      return {
        youtubeVideo: youtubeData,
        courseData: JSONResp
      };

    } catch (err) {
      console.error("❌ Failed to parse JSON from Gemini response:", err.message);
      return {
        chapterName: chapter.chapterName,
        error: "Invalid JSON format from Gemini",
        topics: [],
      };
    }

  });

   const CourseContent = await Promise.all(promises)
   
   ;
// Save to DATABASE
  const dbResp = db.update(coursesTable).set({
    CourseContent: CourseContent
  }).where(eq(coursesTable.cid,courseId));


   return NextResponse.json({
    courseName: courseTitle,
    CourseContent: CourseContent,
  });
 }

  const YOUTUBE_BASE_URL= 'https://www.googleapis.com/youtube/v3/search'

   const GetYoutubeVideo= async (topic)=>{
    const params={
      part:"snippet",
      q:topic,
      maxResults:4,
      type:'video',
      key: process.env.YOUTUBE_API_KEY  // YOUTUBE API KEY
    }

    const resp = await axios.get(YOUTUBE_BASE_URL,{params});
    const youtubeVideoListResp = resp.data.items;
    const youtubeVideoList = [];
    youtubeVideoListResp.forEach(item=>{
      const data={
        videoId:item.id?.videoId,
        title:item?.snippet?.title
      }
      youtubeVideoList.push(data);
    })
    console.log("youtubeVideoList",youtubeVideoList);
    return youtubeVideoList;
}




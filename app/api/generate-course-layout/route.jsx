import { coursesTable } from '@/config/schema';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from "@/config/db";
import { GoogleGenAI} from '@google/genai';
import axios from 'axios';


const PROMPT=`Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Chapter Name, Image Prompt(Create a modern, flat style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette(blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format, Topic under each chapters, Duration for each chapters etc, in JSON format only
Schema:
{
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}
User Input:`;

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req){
  const {courseId, ...formData} = await req.json();
  const user = await currentUser();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
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
          text: PROMPT + ` ${formData.name}, ${formData.noOfChapters} Chapters`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `**Developing the JSON Structure**

I'm currently working on structuring the JSON object for the React JS course. It needs a "course" field, containing "name" and "chapters" fields. The number of chapters, specifically three, will be key here. I'm focusing on ensuring this structure is correct and ready to incorporate more details. The user's input will be important for fleshing out the names and content of these chapters.


**Constructing the Course Outline**

I've been defining the structure for the React JS course's JSON object. It'll include fields like "description", "category", and "level." I'm also adding "includeVideo," "bannerImagePrompt," and "noOfChapters" to incorporate the user's details. Each chapter will have a "chapterName," "duration," and an array of "topics." I'm aiming for a robust and flexible structure.


**Formulating the Image Prompt**

I've been working on refining the image prompt for the course banner. It needs to be a modern, flat-style 2D digital illustration. I've noted the potential contradiction in the user's request regarding the 3D aspect. The best approach appears to be creating a prompt for a modern, stylized 3D illustration with a flat design, incorporating UI/UX elements and representing React JS.


**Crafting the Detailed Structure**

I'm now diving into the finer points. I'm focused on creating a suitable course name, description, and level based on my understanding. I've decided on "React JS: From Fundamentals to Modern Web Apps" for the course name, and will add a comprehensive description. The JSON schema will include the user's requested 3 chapters, with topics and duration to be defined. I've also re-evaluated the banner image prompt, concluding a modern, stylized 3D illustration is the best fit for clarity.


**Formulating the Final Prompt**

I've been working on a robust JSON structure based on the user's input. The course name will be "React JS: From Fundamentals to Modern Web Apps." My structure will have the specified three chapters. I'm focusing on crafting a banner image prompt with a modern, stylized 3D illustration approach, overcoming the potential contradiction in the user's requirements. This image will showcase React's core elements, using a vibrant color palette. I'm confident in meeting all the defined constraints.


**Defining Course Content & Structure**

I've been working on defining the core structure and content for the React course.  I've chosen the course title, description, and topics. The image prompt is nearly final: a stylized 3D scene showcasing React's core elements, resolving the 2D/3D dilemma.  I'm confident in the overall approach, which also includes defining the chapter structure.


**Assembling the Final JSON**

I'm now putting the finishing touches on the JSON object.  I've finalized the course name, description, category, level, and the all-important image prompt. I've also defined the three chapters, including their topics and estimated durations. I'm focusing on syntax accuracy and a clean, concise JSON output.


`,
        },
        {
          text: `\`\`\`json
{
  "course": {
    "name": "React JS: From Fundamentals to Modern Web Apps",
    "description": "A comprehensive course designed to take you from a beginner to a proficient React developer. Learn the core principles of React, including components, state, props, hooks, and routing, to build powerful, fast, and scalable web applications.",
    "category": "Web Development",
    "level": "Beginner to Intermediate",
    "includeVideo": true,
    "noOfChapters": 3,
    "bannerImagePrompt": "A modern, stylized 3D illustration for a 'React JS' course banner. The central element is a glowing 3D React JS logo, with orbiting abstract shapes representing components. In the background, visualize a clean, floating UI screen mockup showing a dynamic web application interface. Include symbolic elements like 3D code blocks with JSX syntax, icons for 'state' and 'props', and glowing lines connecting different UI elements to represent data flow. Use a vibrant and professional color palette of deep blues, electric purples, and pops of bright orange. The scene should feel creative, tech-savvy, and educational, with a sense of depth and polish, perfectly visualizing the concepts of a modern web development course.",
    "chapters": [
      {
        "chapterName": "Chapter 1: The Foundations of React",
        "duration": "2 Hours 30 Mins",
        "topics": [
          "Introduction to React and its ecosystem",
          "Setting up your development environment",
          "Understanding JSX (JavaScript XML)",
          "Creating Functional and Class Components",
          "Working with Props to pass data",
          "Introduction to State and Lifecycle"
        ]
      },
      {
        "chapterName": "Chapter 2: Essential React Hooks & Styling",
        "duration": "3 Hours 15 Mins",
        "topics": [
          "Mastering the useState Hook for state management",
          "Handling side effects with the useEffect Hook",
          "Understanding the Rules of Hooks",
          "Conditional Rendering and Lists",
          "Handling Events in React",
          "Styling React Components: CSS Modules, Styled-components"
        ]
      },
      {
        "chapterName": "Chapter 3: Advanced Concepts & Building a Project",
        "duration": "4 Hours",
        "topics": [
          "Client-Side Routing with React Router",
          "Global State Management with the Context API",
          "Fetching data from APIs (e.g., REST, GraphQL)",
          "Building custom reusable Hooks",
          "Project: Building a Complete To-Do List Application",
          "Preparing and Deploying a React Application"
        ]
      }
    ]
  }
}
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: PROMPT+JSON.stringify(formData),
        },
      ],
    },
  ];

  // const response = await ai.models.generateContent({
  //   model,
  //   config,
  //   contents,
  // });
  //  console.log(response.candidates[0].content.parts[0].text);
  //  const RawResp =response?.candidates[0]?.content.parts[0]?.text
  //  const RawJson = RawResp.replace('```json','').replace('```','');
  //  const JSONResp = JSON.parse(RawJson);

  const response = await ai.models.generateContent({
  model,
  config,
  contents,
});

const candidate = response?.candidates?.[0];
const part = candidate?.content?.parts?.[0];

if (!part?.text) {
  console.error("No valid response from Gemini", response);
  return NextResponse.json({ error: "AI failed to generate content" }, { status: 500 });
}

const RawResp = part.text;
const RawJson = RawResp.replace('```json','').replace('```','');
const JSONResp = JSON.parse(RawJson);

const ImagePrompt = JSONResp.course?.bannerImagePrompt;

// generate image
const bannerImageUrl= await GenerateImage(ImagePrompt)

// Save to database
  const result= await db.insert(coursesTable).values({
    ...formData,
    courseJson: JSONResp,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    cid:courseId,
    bannerImageUrl:bannerImageUrl
  });

  return NextResponse.json(JSONResp);
 
  }

const GenerateImage=async(imagePrompt)=>{
  const BASE_URL='https://aigurulab.tech';
const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: imagePrompt,
            model: 'flux',//'flux'
            aspectRatio:"16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process.env?.AI_GURU_LAB_API, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
console.log(result.data.image) //Output Result: Base 64 Image
return result.data.image;
}


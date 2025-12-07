// import { db } from "@/config/db";
// import { coursesTable, enrollCourseTable } from "@/config/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { and, eq, desc } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export async function POST(req){
//   const { courseId } = await req.json();
//   const user = await currentUser();

//   // if Course already enrolled
//   const enrollCourses = await db.select().from(enrollCourseTable).where(and(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress),eq(enrollCourseTable.cid,courseId)))

//   if(enrollCourses?.length ==0){
//     const result = await db.insert(enrollCourseTable).values({
//       cid:courseId,
//       userEmail:user.primaryEmailAddress?.emailAddress
//     }).returning(enrollCourseTable)
//     return NextResponse.json(result);
//   }
//   return NextResponse.json({'resp':'Already Enrolled'})
// }

// export async function GET(req) {

//   const user = await currentUser();
//   const {searchParams}= new URL(req.url);
//   const courseId = searchParams?.get('courseId');

//   if(courseId){
//        const result = await db.select().from(coursesTable).innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid)).where(and(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress),eq(enrollCourseTable.cid,courseId)));

//        return NextResponse.json(result[0]);
//   }
//   else{
//   const result = await db.select().from(coursesTable).innerJoin(enrollCourseTable,eq(coursesTable.cid,enrollCourseTable.cid)).where(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress)).orderBy(desc(enrollCourseTable.id));

//   return NextResponse.json(result); 
//   }
  
// }
// export async function PUT(req){
//   const {completedChapter, courseId}=await req.json();
//   const user = await currentUser();

//   const result = await db.update(enrollCourseTable).set({
//     completedChapters:completedChapter
//   }).where(and(eq(enrollCourseTable.cid,courseId),eq(enrollCourseTable.userEmail,user?.primaryEmailAddress?.emailAddress))).returning(enrollCourseTable)

//   return NextResponse.json(result);
// }



// app/api/enroll-course/route.jsx


import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId } = await req.json();
    const user = await currentUser();

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    if (!courseId) return NextResponse.json({ message: "Missing courseId" }, { status: 400 });

    // if Course already enrolled
    const enrollCourses = await db
      .select()
      .from(enrollCourseTable)
      .where(and(eq(enrollCourseTable.userEmail, userEmail), eq(enrollCourseTable.cid, courseId)));

    if (!enrollCourses || enrollCourses.length === 0) {
      const result = await db
        .insert(enrollCourseTable)
        .values({
          cid: courseId,
          userEmail: userEmail,
        })
        .returning(enrollCourseTable);
      return NextResponse.json(result, { status: 201 });
    }
    return NextResponse.json({ resp: "Already Enrolled" }, { status: 200 });
  } catch (err) {
    console.error("POST /api/enroll-course error:", err);
    return NextResponse.json({ message: "Internal server error", detail: err?.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");

    if (courseId) {
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(and(eq(enrollCourseTable.userEmail, userEmail), eq(enrollCourseTable.cid, courseId)));

      return NextResponse.json(result[0] ?? null, { status: 200 });
    } else {
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.id));

      return NextResponse.json(result, { status: 200 });
    }
  } catch (err) {
    console.error("GET /api/enroll-course error:", err);
    return NextResponse.json({ message: "Internal server error", detail: err?.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("PUT /api/enroll-course body:", body);

    // Accept both names for backward compatibility
    const completedFromClient = body.completedChapters ?? body.completedChapter;
    const courseId = body.courseId ?? body.cid;

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    if (!courseId) return NextResponse.json({ message: "Missing courseId" }, { status: 400 });

    // Validate completedChapters is an array (allow empty array)
    if (!Array.isArray(completedFromClient)) {
      return NextResponse.json(
        { message: "completedChapters must be an array (e.g. [1,2,3])" },
        { status: 400 }
      );
    }

    // Check for existing enroll record
    const enroll = await db
      .select()
      .from(enrollCourseTable)
      .where(and(eq(enrollCourseTable.cid, courseId), eq(enrollCourseTable.userEmail, userEmail)))
      .limit(1);

    let result;
    if (!enroll || enroll.length === 0) {
      // BEST OPTION: create the enroll record when missing (user-friendly)
      const created = await db
        .insert(enrollCourseTable)
        .values({
          cid: courseId,
          userEmail,
          completedChapters: completedFromClient,
        })
        .returning(enrollCourseTable);

      result = created;
      return NextResponse.json({ message: "Created", enroll: result }, { status: 201 });
    }

    // Otherwise update existing record
    result = await db
      .update(enrollCourseTable)
      .set({ completedChapters: completedFromClient })
      .where(and(eq(enrollCourseTable.cid, courseId), eq(enrollCourseTable.userEmail, userEmail)))
      .returning(enrollCourseTable);

    return NextResponse.json({ message: "Updated", enroll: result }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/enroll-course error:", err);
    return NextResponse.json({ message: "Internal server error", detail: err?.message }, { status: 500 });
  }
}

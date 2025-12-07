// app/page.jsx
"use client";

import Link from "next/link";
import Image from "next/image"; // ✅ NEW
import {
  ArrowRight,
  Brain,
  PlayCircle,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useUser();

  // Centralized CTA logic
  const primaryCtaHref = isSignedIn ? "/workspace" : "/sign-up";
  const primaryCtaLabel = isSignedIn ? "Go to your workspace" : "Get started";

  const heroPrimaryLabel = isSignedIn
    ? "Continue in workspace"
    : "Start free with AI";

  const pricingPrimaryLabel = isSignedIn
    ? "Go to your workspace"
    : "Start free trial";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAVBAR */}
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-purple-500 to-sky-400 text-primary-foreground shadow-sm">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              AI <span className="text-primary">Guru</span> Lab
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition">
              Features
            </a>
            <a href="#tracks" className="hover:text-foreground transition">
              Tracks
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground transition">
              Pricing
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="hidden rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-muted md:block"
              >
                Log in
              </Link>
            )}

            <Link
              href={primaryCtaHref}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {primaryCtaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12">
        <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          {/* Left hero content */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              AI-generated courses, tailored to every learner
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Build and learn{" "}
              <span className="text-primary">smarter courses</span> with AI — in
              minutes.
            </h1>

            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              AI Guru Lab turns your ideas into complete learning experiences:
              chapter outlines, explanations, videos, and quizzes. Launch your
              own AI-powered academy and help students learn faster.
            </p>

            {/* CTA Row */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href={primaryCtaHref}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                {heroPrimaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>

             
            </div>

            {/* Social proof */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground md:text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Trusted by 20,000+ learners and creators</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span>Average rating 4.8/5 across all courses</span>
            </div>
          </div>

          {/* ✅ Right hero: big student–teacher learning image */}
          <div className="relative">
            {/* Soft glow behind the card */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-sky-300/10 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 shadow-xl backdrop-blur">
              {/* The hero image */}
              <div className="relative h-50 md:h-100 lg:h-94">
                <Image
                  src="/indian-students1.avif" // 🔁 put your image in /public with this name
                  alt="Student learning with a teacher on an online learning platform"
                  fill
                  className="cover"
                  priority
                />
              </div>

              {/* Gradient overlay text strip at bottom */}
              <div className="relative -mt-20 rounded-t-3xl bg-gradient-to-t from-card via-card/80 to-transparent px-5 pb-5 pt-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                  Online learning platform
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Learn with teacher-style explanations, AI-powered practice, and
                  interactive courses — all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        {/* ... everything below remains exactly the same ... */}

        <section id="features" className="mt-20 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                AI at the heart of every course.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                AI Guru Lab doesn’t just host videos. It builds full learning
                journeys: outlines, lessons, examples, and assessments — all
                generated and refined with AI.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-5 w-5 text-primary" />}
              title="Adaptive learning paths"
              description="Each student gets a dynamic syllabus that adjusts to their speed, weak topics, and goals."
            />
            <FeatureCard
              icon={<Brain className="h-5 w-5 text-primary" />}
              title="AI-generated content"
              description="Instantly generate chapter content, examples, practice questions, and summaries for any topic."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="Smart assessments"
              description="Convert lessons into quizzes, flashcards, or interview questions with a single click."
            />
          </div>
        </section>

        {/* TRACKS / COURSES SECTION */}
        <section id="tracks" className="mt-20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Popular AI-powered learning tracks
            </h2>

            <Link
              href={primaryCtaHref}
              className="hidden text-sm font-medium text-primary hover:text-primary/80 md:block"
            >
              {isSignedIn ? "Go to workspace →" : "View all tracks →"}
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <CourseTrack
              label="Career track"
              title="Full-Stack Developer + AI"
              level="Beginner → Job-ready"
              description="Master React, Node, databases, and AI tools while building production-ready apps."
              duration="6 months"
              ctaHref={primaryCtaHref}
              isSignedIn={isSignedIn}
            />
            <CourseTrack
              label="Skill track"
              title="Data Science with AI Copilot"
              level="Intermediate"
              description="Real-world projects using Python, SQL, ML, and AI-assisted data analysis."
              duration="3 months"
              ctaHref={primaryCtaHref}
              isSignedIn={isSignedIn}
            />
            <CourseTrack
              label="Interview track"
              title="DSA + System Design Booster"
              level="Advanced"
              description="Daily AI-generated problems, mock interviews, and company-specific patterns."
              duration="8 weeks"
              ctaHref={primaryCtaHref}
              isSignedIn={isSignedIn}
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            How AI Guru Lab works
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <StepCard
              step="01"
              title="Describe your goal"
              description="Job switch, exam prep, or launching your own course? Tell us what you want to achieve."
            />
            <StepCard
              step="02"
              title="Generate your course or roadmap"
              description="Our AI builds a complete structure: chapters, topics, lessons, quizzes — all editable."
            />
            <StepCard
              step="03"
              title="Learn or publish with AI"
              description="Guide learners with AI explanations, Q&A, and adaptive practice powered by your content."
            />
          </div>
        </section>

        {/* PRICING STRIP */}
        <section
          id="pricing"
          className="mt-20 rounded-3xl border border-border bg-card/80 p-6 md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Start free. Upgrade when you’re ready.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Try the full AI course-building and learning experience with no
                commitment. Upgrade for unlimited AI sessions, advanced analytics,
                and certification tracks.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-foreground/90">
                <li>• 7-day free trial of Pro</li>
                <li>• Unlimited AI Q&amp;A on all free courses</li>
                <li>• Cancel or switch plans any time</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-background p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pro plan
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">$19</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Everything you need to stay consistent and job-ready.
              </p>

              <Link
                href={primaryCtaHref}
                className="mt-4 block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                {pricingPrimaryLabel}
              </Link>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                No credit card required for the first 7 days.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground md:text-sm">
          <p>© {new Date().getFullYear()} AI Guru Lab. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Small presentational components */

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background/80 px-3 py-3">
      <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground md:text-base">
        {title}
      </h3>
      <p className="mt-2 text-xs text-muted-foreground md:text-sm">
        {description}
      </p>
    </div>
  );
}

function CourseTrack({
  label,
  title,
  level,
  description,
  duration,
  ctaHref,
  isSignedIn,
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-5">
      <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <h3 className="mt-3 text-base font-semibold text-foreground md:text-lg">
        {title}
      </h3>
      <p className="mt-1 text-xs font-medium text-primary md:text-sm">
        {level}
      </p>
      <p className="mt-2 flex-1 text-xs text-muted-foreground md:text-sm">
        {description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{duration}</span>
        <Link
          href={ctaHref}
          className="text-xs font-medium text-primary hover:text-primary/80"
        >
          {isSignedIn ? "Go to workspace →" : "Explore track →"}
        </Link>
      </div>
    </div>
  );
}

function StepCard({ step, title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5">
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        Step {step}
      </span>
      <h3 className="mt-2 text-sm font-semibold text-foreground md:text-base">
        {title}
      </h3>
      <p className="mt-2 text-xs text-muted-foreground md:text-sm">
        {description}
      </p>
    </div>
  );
}

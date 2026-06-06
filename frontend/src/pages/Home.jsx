import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [showCourses, setShowCourses] = useState(false);

  const courses = [
    "Programming Fundamentals",
    "Java Programming",
    "React.js & Frontend",
    "Python",
    "Data Structures & Algorithms",
    "Web Development",
    "Machine Learning",
    "Mathematics",
    "Science",
    "English",
  ];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-slate-950 text-light-text dark:text-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-light-bg/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-light-border dark:border-surface-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl font-bold tracking-tight text-orange-400 dark:text-orange-300">CodeCat</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Features</a>
            <a href="#impact" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Impact</a>

            <div className="relative group">
              <button
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
                onClick={() => setShowCourses(!showCourses)}
              >
                Courses
              </button>

              {showCourses && (
                <div className="absolute top-10 left-0 bg-white dark:bg-surface-card border border-light-border dark:border-surface-border rounded-2xl shadow-xl w-72 py-3 z-50">
                  <div className="px-4 py-2 text-orange-500 font-semibold border-b border-light-border">
                    Our Courses
                  </div>
                  <div className="max-h-96 overflow-auto">
                    {courses.map((course, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-3 hover:bg-light-hover dark:hover:bg-surface-hover text-sm transition-colors text-light-text dark:text-white"
                      >
                        {course}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/join-teacher" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors text-light-text dark:text-white">
              Become a Teacher
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="relative w-12 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center p-1 transition-all hover:scale-105"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${isDark ? "translate-x-0" : "translate-x-6"
                  }`}
              >
                {isDark ? "🌙" : "☀️"}
              </div>
            </button>

            <Link to="/login" className="px-6 py-2.5 text-sm font-medium hover:bg-light-hover dark:hover:bg-white/10 rounded-xl transition-all">
              Login
            </Link>
            <Link to="/register" className="btn-primary px-6 py-2.5 text-sm font-semibold rounded-xl hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative pt-24 pb-24 flex flex-col items-center justify-center min-h-screen px-4 bg-light-bg dark:bg-gradient-to-br dark:from-surface dark:via-surface dark:to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_top,#4f46e520_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_right,#f9731620_0%,transparent_60%)]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-12 w-full px-6">
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tighter text-light-text dark:text-white">
              Make Learning{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Fun Again
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-light-text-secondary dark:text-slate-300 max-w-xl">
              Live interactive classes for KG–12 • Expert teachers • AI-powered practice
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-6 justify-center lg:justify-start">
              <Link to="/register" className="btn-primary px-10 py-4 rounded-2xl text-xl font-semibold">
                Start Free Trial
              </Link>
              <Link to="/login" className="px-10 py-4 rounded-2xl text-xl font-semibold border border-light-border dark:border-slate-400 hover:bg-light-hover dark:hover:bg-white/10 transition-all">
                Watch Demo
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <Player
              autoplay
              loop
              src="/assets/animations/home-animation.json"
              style={{ width: "600px", height: "600px" }}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* IMPACT SECTION */}
      <div id="impact" className="py-20 bg-white dark:bg-surface-card border-y border-light-border dark:border-surface-border">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-6xl font-bold text-orange-400">50K+</div>
              <div className="mt-3 text-light-text-secondary dark:text-slate-400">Happy Students</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-orange-400">10K+</div>
              <div className="mt-3 text-light-text-secondary dark:text-slate-400">Hours of Learning</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-orange-400">150+</div>
              <div className="mt-3 text-light-text-secondary dark:text-slate-400">Expert Teachers</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-orange-400">20+</div>
              <div className="mt-3 text-light-text-secondary dark:text-slate-400">Subjects</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div id="features" className="py-20 bg-light-bg dark:bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-4">Why CodeCat?</h2>
          <p className="text-center text-light-text-secondary dark:text-slate-400 mb-16 max-w-xl mx-auto text-lg">
            We turn fear of studies into confidence and joy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-surface-card border border-light-border dark:border-surface-border p-8 rounded-3xl hover:border-orange-400/50 hover:-translate-y-2 transition-all group text-light-text dark:text-white">
              <div className="h-40 flex items-center justify-center mb-6">
                <Player
                  autoplay
                  loop
                  src="/assets/animations/search-animation.json"
                  style={{ width: "250px", height: "250px" }}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Concept Clarity</h3>
              <p className="text-light-text-secondary dark:text-slate-400 text-center leading-relaxed">
                Build strong foundations with visual & interactive explanations
              </p>
            </div>

            <div className="bg-white dark:bg-surface-card border border-light-border dark:border-surface-border p-8 rounded-3xl hover:border-orange-400/50 hover:-translate-y-2 transition-all group text-light-text dark:text-white">
              <div className="h-40 flex items-center justify-center mb-6">
                <Player
                  autoplay
                  loop
                  src="/assets/animations/aim-animation.json"
                  style={{ width: "160px", height: "160px" }}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Personalized Pace</h3>
              <p className="text-light-text-secondary dark:text-slate-400 text-center leading-relaxed">
                Learn at your own speed with 1:1 doubt solving
              </p>
            </div>

            <div className="bg-white dark:bg-surface-card border border-light-border dark:border-surface-border p-8 rounded-3xl hover:border-orange-400/50 hover:-translate-y-2 transition-all group text-light-text dark:text-white">
              <div className="h-40 flex items-center justify-center mb-6">
                <Player
                  autoplay
                  loop
                  src="/assets/animations/game-animation.json"
                  style={{ width: "160px", height: "160px" }}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Gamified Learning</h3>
              <p className="text-light-text-secondary dark:text-slate-400 text-center leading-relaxed">
                Earn points, badges & compete on leaderboards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TEACHER CTA & FINAL CTA - same as before */}
      <div className="py-20 bg-white dark:bg-surface-card border-t border-light-border dark:border-surface-border">
        <div className="max-w-2xl mx-auto text-center px-6">
          <p className="text-light-text-secondary dark:text-slate-400 mb-4 text-lg">Are you passionate about teaching?</p>
          <Link
            to="/join-teacher"
            className="inline-flex items-center gap-3 text-2xl font-medium text-orange-400 hover:text-orange-300 group"
          >
            Join Our Teaching Community
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to transform learning?</h2>
          <p className="text-xl text-light-text-secondary dark:text-slate-400 mb-10">Join thousands of students and parents who love SkillNest</p>
          <Link
            to="/register"
            className="btn-primary inline-block px-14 py-5 rounded-2xl text-2xl font-semibold hover:scale-105 transition-all shadow-2xl shadow-orange-500/40"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
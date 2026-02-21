import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { Calendar, User, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "How AI is Reshaping Modern Education",
    excerpt:
      "Discover the profound impact artificial intelligence is having on personalized learning pathways and student engagement.",
    author: "Dr. Sarah Chen",
    date: "Feb 18, 2026",
    category: "EdTech",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "10 Study Hacks Backed by Neuroscience",
    excerpt:
      "Optimize your study sessions by understanding how your brain actually retains information.",
    author: "Marc Johnson",
    date: "Feb 12, 2026",
    category: "Study Tips",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "StudySync 2.0: What's New?",
    excerpt:
      "We've completely overhauled our question paper generation engine. Here's everything you need to know about the new update.",
    author: "Product Team",
    date: "Feb 05, 2026",
    category: "Product Updates",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Preparing for Board Exams: A 30-Day Guide",
    excerpt:
      "A comprehensive roadmap to tackle your board exams with confidence and minimal stress.",
    author: "Priya Sharma",
    date: "Jan 28, 2026",
    category: "Exam Prep",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
            The StudySync <span className="text-indigo-600">Blog</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Insights, updates, study tips, and stories from the intersection of
            education and technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {posts.map((post, idx) => (
            <article
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-indigo-600">
                  {post.category}
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-600 mb-6 line-clamp-2">
                  {post.excerpt}
                </p>

                <button className="flex items-center gap-2 text-indigo-600 font-bold group/btn">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-white border-2 border-indigo-100 text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm">
            Load More Articles
          </button>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Blog;

import React, { useState } from "react";

const LessonViewer = ({ lesson, onComplete }) => {
  const [isMarked, setIsMarked] = useState(false);

  const handleMarkComplete = () => {
    onComplete();
    setIsMarked(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Title */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
        <p className="text-gray-600">{lesson.description}</p>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="text-gray-500">⏱️ Duration: {lesson.duration} minutes</span>
          {lesson.isPreviewFree && (
            <span className="text-green-600 font-semibold">🎁 Free Preview</span>
          )}
        </div>
      </div>

      {/* Video Section */}
      {lesson.videoUrl && (
        <div className="mb-8 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video bg-black flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src={lesson.videoUrl}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Lesson Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About this lesson</h2>
            <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
          </div>

          {/* Notes Section */}
          {lesson.notesPdfUrl && (
            <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">📄 Lesson Notes</h3>
              <p className="text-gray-600 mb-4">Download the PDF notes for this lesson</p>
              <a
                href={lesson.notesPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Download PDF
              </a>
            </div>
          )}

          {/* Learning Objectives */}
          <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✅ What You'll Learn</h3>
            <ul className="space-y-2">
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Understand the key concepts of this lesson</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Apply the knowledge to real-world scenarios</span>
              </li>
              <li className="text-gray-700 flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Complete the associated assessments</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {/* Complete Button */}
          <button
            onClick={handleMarkComplete}
            disabled={isMarked}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isMarked
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isMarked ? "✅ Completed" : "Mark as Complete"}
          </button>

          {/* Lesson Info Card */}
          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-bold text-gray-800">{lesson.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="text-lg font-bold text-gray-800">Video Lesson</p>
            </div>
            {lesson.isPreviewFree && (
              <div>
                <p className="text-sm text-gray-600">Access</p>
                <p className="text-lg font-bold text-green-600">Free Preview</p>
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-bold text-gray-800 mb-3">Resources</h4>
            <div className="space-y-2">
              {lesson.notesPdfUrl && (
                <a
                  href={lesson.notesPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  📝 Lesson Notes (PDF)
                </a>
              )}
              <button className="block text-blue-600 hover:underline text-sm w-full text-left">
                ❓ Quiz Available
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;

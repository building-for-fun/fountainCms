import React, { useEffect, useState } from 'react';
import HomeLayout from '../components/Layouts/HomeLayout/HomeLayout';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

type Content = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

type ContentsType = {
  FEATURES_TEXT: string[];
  SETUP_STEPS_TEXT: string[];
  ACCENT_COLOR: string;
  GETTING_STARTED: string;
  INSTALLATION_STEPS: string[];
  API_REFERENCES: { method: string; endpoint: string; description: string }[];
};

export default function LandingPage() {
  const [contents, setContents] = useState<ContentsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        setContents(data);
        setLoading(false);
      });
  }, []);

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 px-4 sm:px-6 lg:px-8 py-12">
        <div className="px-8 py-10 sm:px-12 sm:py-12">
          <h1 className="text-5xl sm:text-6xl font-black text-indigo-600 mb-2 leading-tight">
            FountainCMS
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            A modern, API-driven content management system for JAMstack and beyond.
          </p>

          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-6 flex items-center">
              <span className="mr-3">🚀</span>
              Content
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-slate-600">Loading...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {contents?.FEATURES_TEXT.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-700 text-lg">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-sm mt-1">
                      ✓
                    </span>
                    <span className="pt-0.5">{feature}</span>
                  </li>
                ))}
                {contents?.GETTING_STARTED && (
                  <li className="flex items-start gap-3 text-slate-700 text-lg">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-sm mt-1">
                      ✓
                    </span>
                    <span className="pt-0.5">{contents.GETTING_STARTED}</span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

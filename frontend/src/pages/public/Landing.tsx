import React from 'react';
import HomeLayout from '../../components/Layouts/HomeLayout/HomeLayout';
import { FEATURES_TEXT, GETTING_STARTED } from '../../helper/constant';

export default function Landing() {
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

            <ul className="space-y-3">
              {FEATURES_TEXT.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-slate-700 text-lg">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-sm mt-1">
                    ✓
                  </span>
                  <span className="pt-0.5">{feature}</span>
                </li>
              ))}
              {GETTING_STARTED && (
                <li className="flex items-start gap-3 text-slate-700 text-lg">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-sm mt-1">
                    ✓
                  </span>
                  <span className="pt-0.5">{GETTING_STARTED}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

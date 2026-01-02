import React from 'react';
import { GETTING_STARTED, INSTALLATION_STEPS, API_REFERENCES } from './../helper/constant';
import HomeLayout from '../components/Layouts/HomeLayout/HomeLayout';

const Documentation: React.FC = () => (
  <HomeLayout>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Header gradient accent */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>

          <div className="px-8 py-10 sm:px-12 sm:py-12">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black text-indigo-600 mb-2 flex items-center">
              📚 Documentation
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mb-8"></div>

            {/* Getting Started Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-indigo-600 mb-4 flex items-center">
                <span className="w-1 h-8 bg-indigo-600 mr-3"></span>
                Getting Started
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
                {GETTING_STARTED}
              </p>
            </section>

            {/* Installation Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-indigo-600 mb-4 flex items-center">
                <span className="w-1 h-8 bg-indigo-600 mr-3"></span>
                Installation
              </h2>
              <ol className="space-y-3">
                {INSTALLATION_STEPS.map((step, idx) => (
                  <li key={idx} className="flex gap-4 text-lg text-slate-700">
                    <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* API Reference Section */}
            <section>
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 flex items-center">
                <span className="w-1 h-8 bg-indigo-600 mr-3"></span>
                API Reference
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-300">
                      <th className="text-left px-6 py-4 font-bold text-indigo-600 text-sm">
                        Method
                      </th>
                      <th className="text-left px-6 py-4 font-bold text-indigo-600 text-sm">
                        Endpoint
                      </th>
                      <th className="text-left px-6 py-4 font-bold text-indigo-600 text-sm">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {API_REFERENCES.map((api, idx) => (
                      <tr
                        key={idx}
                        className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50 transition-colors duration-200`}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-700 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              api.method === 'GET'
                                ? 'bg-blue-100 text-blue-800'
                                : api.method === 'POST'
                                  ? 'bg-green-100 text-green-800'
                                  : api.method === 'PUT'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : api.method === 'DELETE'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {api.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-mono text-sm bg-slate-100 rounded">
                          {api.endpoint}
                        </td>
                        <td className="px-6 py-4 text-slate-700 text-sm">{api.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
);

export default Documentation;

"use client"

import type React from "react"

import { useState } from "react"

export default function RiskDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setError("")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setFileName(droppedFile.name)
      setError("")
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file")
      return
    }

    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://risk-legal.onrender.com/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze the contract")
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            LegalGPT Contract Analyzer
          </span>
        </h1>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-10 border border-indigo-100">
          <form onSubmit={handleSubmit}>
            <div
              className="border-3 border-dashed border-indigo-200 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 transition-all duration-300 bg-indigo-50/50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {fileName ? (
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-indigo-700 font-medium text-lg">{fileName}</span>
                </div>
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-indigo-400 mx-auto mb-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-indigo-600 font-medium text-lg mb-2">Drag and drop your PDF contract here</p>
                  <p className="text-indigo-400 text-sm">or click to browse files</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-center font-medium">
                {error}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-md disabled:opacity-50 text-lg"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Contract...
                  </span>
                ) : (
                  "Analyze Contract"
                )}
              </button>
            </div>
          </form>
        </div>

        {analysis && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Good Clauses Column */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Good Clauses
                </h2>

                {analysis.good_clauses && analysis.good_clauses.length > 0 ? (
                  <div className="space-y-5">
                    {analysis.good_clauses.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="border border-emerald-200 bg-emerald-50 rounded-lg p-5 hover:bg-emerald-100 transition-colors duration-200"
                      >
                        <div className="font-semibold text-gray-800 mb-3 text-lg">{item.clause}</div>
                        <div className="text-gray-700">
                          <span className="font-bold text-emerald-600 inline-block mb-1">Why it's good: </span>
                          {item.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-6">No good clauses identified</p>
                )}
              </div>

              {/* Risk Clauses Column */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-rose-700 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Risk Clauses
                </h2>

                {analysis.risk_clauses && analysis.risk_clauses.length > 0 ? (
                  <div className="space-y-5">
                    {analysis.risk_clauses.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="border border-rose-200 bg-rose-50 rounded-lg p-5 hover:bg-rose-100 transition-colors duration-200"
                      >
                        <div className="font-semibold text-gray-800 mb-3 text-lg">{item.clause}</div>
                        <div className="text-gray-700">
                          <span className="font-bold text-rose-600 inline-block mb-1">Risk: </span>
                          {item.risk}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-6">No risk clauses identified</p>
                )}
              </div>
            </div>

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recommendations
                </h2>

                <div className="space-y-6">
                  {analysis.recommendations.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="border border-indigo-200 bg-indigo-50 rounded-lg p-5 hover:bg-indigo-100 transition-colors duration-200"
                    >
                      <div className="font-semibold text-gray-800 mb-3 text-lg">{item.clause}</div>
                      <div className="text-gray-700 mb-4">
                        <span className="font-bold text-indigo-600 inline-block mb-1">Reason: </span>
                        {item.reason}
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                        <span className="font-bold text-indigo-600 inline-block mb-2">Suggested rewrite: </span>
                        <p className="text-gray-800 italic">{item.suggested_rewrite}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}


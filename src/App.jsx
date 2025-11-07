import React, { useState } from "react";
import {
  Upload,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  PieChart,
  Activity,
  Download,
  Target,
  Shield,
  Zap,
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [reportFile, setReportFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file to analyze.");
    setLoading(true);
    setError(null);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setReport(data.Financial_Report || data);

      if (data.Report_Available && data.Report_Name) {
        setReportFile(data.Report_Name);
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please check your file or backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!reportFile) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/download-report/${reportFile}`
      );
      if (!res.ok) throw new Error("Failed to download PDF.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportFile;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Error downloading report. Please try again.");
    }
  };

  // Prepare chart data
  const getChartData = () => {
    if (!report?.Financial_Overview) return null;

    const income = parseFloat(report.Financial_Overview["Total Income (₹)"]) || 0;
    const expenses = parseFloat(report.Financial_Overview["Total Expenses (₹)"]) || 0;
    const savings = parseFloat(report.Financial_Overview["Savings (₹)"]) || 0;

    return {
      pieData: [
        { name: "Expenses", value: expenses, color: "#dc2626" },
        { name: "Savings", value: savings, color: "#16a34a" },
      ],
      barData: [
        { name: "Income", value: income, color: "#1e40af" },
        { name: "Expenses", value: expenses, color: "#dc2626" },
        { name: "Savings", value: savings, color: "#16a34a" },
      ],
    };
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-4 rounded-xl shadow-2xl">
              <DollarSign className="w-10 h-10 text-blue-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                AI Financial Health Doctor
              </h1>
              <p className="text-blue-200 text-base mt-1 font-medium">
                Professional financial analysis powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-10 border border-gray-200">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-3 border-dashed rounded-xl p-16 transition-all duration-300 ${
              dragActive
                ? "border-blue-600 bg-blue-50 scale-105"
                : "border-gray-300 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-400"
            }`}
          >
            <input
              type="file"
              accept=".csv,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 mb-6 shadow-2xl">
                <Upload className="w-12 h-12 text-white" />
              </div>

              {file ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold text-lg text-gray-900">{file.name}</span>
                  </div>
                  <p className="text-base text-gray-600">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-gray-900">
                    Drop your financial file here
                  </p>
                  <p className="text-lg text-gray-600">
                    or click to browse • Supports CSV and PDF files
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full mt-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg hover:shadow-2xl hover:from-blue-800 hover:to-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <Activity className="w-6 h-6 animate-spin" />
                Analyzing Your Finances...
              </>
            ) : (
              <>
                <TrendingUp className="w-6 h-6" />
                Analyze Financial Health
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-5 mb-10 flex items-start gap-4 shadow-lg">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <p className="text-red-800 font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Report Section */}
        {report && (
          <div className="space-y-8 animate-fade-in">
            {/* Financial Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Financial Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {Object.entries(report.Financial_Overview).map(([k, v]) => {
                  const isIncome = k.includes("Income");
                  const isExpense = k.includes("Expenses");
                  const isSavings = k.includes("Savings");
                  const isDebt = k.includes("Debt");
                  
                  let bgColor = "from-gray-50 to-gray-100";
                  let borderColor = "border-gray-200";
                  let textColor = "text-gray-900";
                  
                  if (isIncome) {
                    bgColor = "from-blue-50 to-blue-100";
                    borderColor = "border-blue-200";
                    textColor = "text-blue-900";
                  } else if (isExpense || isDebt) {
                    bgColor = "from-red-50 to-red-100";
                    borderColor = "border-red-200";
                    textColor = "text-red-900";
                  } else if (isSavings) {
                    bgColor = "from-green-50 to-green-100";
                    borderColor = "border-green-200";
                    textColor = "text-green-900";
                  }
                  
                  return (
                    <div
                      key={k}
                      className={`bg-gradient-to-br ${bgColor} rounded-xl p-6 border-2 ${borderColor} hover:shadow-xl hover:scale-105 transition-all duration-300`}
                    >
                      <p className="text-sm text-gray-700 font-semibold mb-2 uppercase tracking-wide">
                        {k.replaceAll("_", " ").replace("(₹)", "").replace("(%)", "")}
                      </p>
                      <p className={`text-3xl font-bold ${textColor}`}>{v}</p>
                    </div>
                  );
                })}
              </div>

              {/* Charts */}
              {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  {/* Pie Chart */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-700" />
                      Expense vs Savings Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={chartData.pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend
                          iconType="circle"
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-700" />
                      Financial Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#374151" />
                        <YAxis stroke="#374151" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]}>
                          {chartData.barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-3 rounded-xl shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  AI Financial Analysis
                </h2>
              </div>

              <div className="space-y-6">
                {Object.entries(report.AI_Financial_Analysis).map(
                  ([section, content]) => {
                    if (!content || (Array.isArray(content) && content.length === 0)) return null;
                    
                    const iconMap = {
                      Summary: Shield,
                      Strengths: CheckCircle,
                      Areas_to_Improve: AlertCircle,
                      Strategies: Target,
                      Investment_Recommendations: TrendingUp,
                      Expense_Optimization: Zap,
                    };
                    const Icon = iconMap[section] || Activity;
                    
                    const colorMap = {
                      Summary: "from-blue-50 to-indigo-50 border-blue-200",
                      Strengths: "from-green-50 to-emerald-50 border-green-200",
                      Areas_to_Improve: "from-amber-50 to-orange-50 border-amber-200",
                      Strategies: "from-purple-50 to-violet-50 border-purple-200",
                      Investment_Recommendations: "from-cyan-50 to-sky-50 border-cyan-200",
                      Expense_Optimization: "from-pink-50 to-rose-50 border-pink-200",
                    };
                    const colorClass = colorMap[section] || "from-gray-50 to-slate-50 border-gray-200";

                    return (
                      <div
                        key={section}
                        className={`bg-gradient-to-br ${colorClass} rounded-xl p-8 border-2 hover:shadow-xl transition-all duration-300`}
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                          <Icon className="w-6 h-6 text-blue-700" />
                          {section.replaceAll("_", " ")}
                        </h3>

                        {Array.isArray(content) ? (
                          <ul className="space-y-4">
                            {content.map((point, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-4 text-gray-800 leading-relaxed text-base"
                              >
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-800 leading-relaxed text-base">
                            {content}
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {reportFile && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg hover:shadow-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                  >
                    <Download className="w-6 h-6" />
                    Download Full Report (PDF)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
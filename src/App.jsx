import React, { useEffect, useState } from "react";
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
  Coins,
  FileText,
  TrendingDown,
  Lightbulb,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import FinancialChatBot from "./Components/FinancialChatBot";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [history, setHistory] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/financial-history");
      const data = await res.json();
      console.log("📈 Updated History:", data.history);
      setHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching financial history:", error);
    }
  };

  useEffect(() => {
    fetchHistory(); // initial load
  }, []);

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

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const result = data.Financial_Report || data;
      setReport(result);

      if (data.Report_Available && data.Report_Name) {
        setReportFile(data.Report_Name);
        await fetchHistory();
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

  const getChartData = () => {
    if (!report?.Financial_Overview) return null;

    const income =
      parseFloat(report.Financial_Overview["Total Income (₹)"]) || 0;
    const expenses =
      parseFloat(report.Financial_Overview["Total Expenses (₹)"]) || 0;
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

  const chartDataHistory =
    history.length === 1
      ? [...history, { ...history[0], month: "Next" }] // clone same month with new label
      : history;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with animated gradient */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center gap-5 relative z-10">
          <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 p-5 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <DollarSign className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
              AI Financial Health Doctor
            </h1>
            <p className="text-blue-100 text-lg mt-2 font-semibold">
              Professional financial analysis powered by advanced AI technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Upload Section with modern design */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-12 mb-12 border-2 border-gray-200 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Upload Your Financial Data
            </h2>
            <p className="text-gray-600 text-lg">
              Support for CSV and PDF formats
            </p>
          </div>

          <input
            type="file"
            accept=".csv,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block text-xl font-semibold text-blue-700 border-3 border-dashed border-blue-400 rounded-2xl py-8 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <Upload className="w-6 h-6" />
              <span>
                {file
                  ? `${file.name}`
                  : "Click to upload or drop your file here"}
              </span>
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-4 transform hover:scale-105 transition-all duration-300"
          >
            {loading ? (
              <>
                <Activity className="w-6 h-6 animate-spin" />
                <span>Analyzing Your Financial Data...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-6 h-6" />
                <span>Analyze Financial Health</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-600 rounded-2xl p-6 mb-12 flex items-start gap-4 shadow-xl">
            <AlertCircle className="w-7 h-7 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-900 font-bold text-xl mb-1">Error</h3>
              <p className="text-red-800 font-medium text-lg">{error}</p>
            </div>
          </div>
        )}

        {report && (
          <div className="space-y-12">
            {/* Financial Overview */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-10 border-2 border-blue-200">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-blue-200">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-gray-900">
                  Financial Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {Object.entries(report.Financial_Overview).map(([k, v]) => (
                  <div
                    key={k}
                    className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-7 rounded-2xl border-2 border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <p className="text-sm text-gray-700 font-bold mb-2 uppercase tracking-wider">
                      {k.replaceAll("_", " ")}
                    </p>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-900">
                      {v}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Expense vs Savings Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={chartData.pieData}
                          dataKey="value"
                          outerRadius={110}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          strokeWidth={2}
                        >
                          {chartData.pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Income vs Expense vs Savings
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {chartData.barData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* AI Financial Analysis */}
            {report.AI_Financial_Analysis && (
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl p-10 border-2 border-indigo-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-indigo-200">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900">
                    AI Financial Analysis
                  </h2>
                </div>

                <div className="space-y-6">
                  {Object.entries(report.AI_Financial_Analysis).map(
                    ([section, content]) => {
                      if (!content) return null;
                      const Icon =
                        section === "Summary"
                          ? Shield
                          : section === "Strengths"
                          ? CheckCircle
                          : section === "Areas_to_Improve"
                          ? AlertCircle
                          : section === "Strategies"
                          ? Target
                          : Activity;

                      const colorClasses =
                        section === "Strengths"
                          ? "from-green-100 to-emerald-100 border-green-300"
                          : section === "Areas_to_Improve"
                          ? "from-orange-100 to-red-100 border-orange-300"
                          : "from-indigo-100 to-purple-100 border-indigo-300";

                      return (
                        <div
                          key={section}
                          className={`bg-gradient-to-br ${colorClasses} p-8 rounded-2xl border-2 shadow-lg`}
                        >
                          <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-gray-900">
                            <Icon className="w-7 h-7 text-indigo-700" />
                            {section.replaceAll("_", " ")}
                          </h3>
                          {Array.isArray(content) ? (
                            <ul className="space-y-3 text-gray-800">
                              {content.map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-lg leading-relaxed">
                                    {point}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-800 text-lg leading-relaxed">
                              {content}
                            </p>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Spending Reallocation */}
            {/* {report.Spending_Reallocation && (
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl p-10 border-2 border-amber-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-amber-200">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl shadow-lg">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900">
                    Spending Reallocation & Rewards Plan
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.Spending_Reallocation.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-7 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingDown className="w-6 h-6 text-amber-700" />
                        {item.category}
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-amber-200">
                          <p className="text-sm text-gray-600 font-semibold mb-1">
                            Reduce Monthly
                          </p>
                          <p className="text-2xl font-black text-amber-700">
                            ₹{item.cut}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-green-200">
                          <p className="text-sm text-gray-600 font-semibold mb-1">
                            3-Year Potential Growth
                          </p>
                          <p className="text-2xl font-black text-green-700">
                            ₹{item.potential}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            {report.Spending_Reallocation && (
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl p-10 border-2 border-amber-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-amber-200">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl shadow-lg">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900">
                    Spending Reallocation & Rewards Plan
                  </h2>
                </div>

                {/* 💰 Spending Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.Spending_Reallocation.filter(
                    (item) => !item.insight
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-7 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingDown className="w-6 h-6 text-amber-700" />
                        {item.category}
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-amber-200">
                          <p className="text-sm text-gray-600 font-semibold mb-1">
                            Reduce Monthly
                          </p>
                          <p className="text-2xl font-black text-amber-700">
                            ₹{item.cut}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-green-200">
                          <p className="text-sm text-gray-600 font-semibold mb-1">
                            3-Year Potential Growth
                          </p>
                          <p className="text-2xl font-black text-green-700">
                            ₹{item.potential}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 💬 Single Insights Card */}
                {report.Spending_Reallocation.find((item) => item.insight) && (
                  <div className="mt-10 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-amber-700" />
                      Spending Insights
                    </h3>
                    <p className="text-gray-800 leading-relaxed text-lg font-medium">
                      {
                        report.Spending_Reallocation.find(
                          (item) => item.insight
                        )?.insight
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {Array.isArray(chartDataHistory) && chartDataHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-3 rounded-xl shadow-lg">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Monthly Progress Tracker
                  </h2>
                </div>

                {/* ✅ FIX: set height={350} instead of "100%" */}
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart
                    data={chartDataHistory}
                    margin={{ top: 30, right: 40, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorIncome"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorExpenses"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#dc2626"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#dc2626"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorSavings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#16a34a"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#16a34a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" tickMargin={10} />
                    <YAxis
                      stroke="#6b7280"
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                      }}
                      formatter={(v) => `₹${v.toLocaleString()}`}
                    />
                    <Legend verticalAlign="top" height={36} />

                    {/* Income */}
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#2563eb" }}
                      activeDot={{ r: 10, fill: "#2563eb" }}
                      fill="url(#colorIncome)"
                    />

                    {/* Expenses */}
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#dc2626" }}
                      activeDot={{ r: 10, fill: "#dc2626" }}
                      fill="url(#colorExpenses)"
                    />

                    {/* Savings */}
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#16a34a" }}
                      activeDot={{ r: 10, fill: "#16a34a" }}
                      fill="url(#colorSavings)"
                    />
                  </LineChart>
                </ResponsiveContainer>

                {chartDataHistory.length === 1 && (
                  <p className="text-center text-gray-500 italic mt-4">
                    📈 Upload next month’s report to view your financial growth
                    trend.
                  </p>
                )}
              </div>
            )}

            {/* Goal-Based Financial Planning with enhanced progress bars */}
            {report.Goal_Based_Plan && (
              <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-10 border-2 border-green-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-green-200">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900">
                    Goal-Based Financial Planning
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(report.Goal_Based_Plan).map(
                    ([goal, info]) => {
                      const progress = Math.min(
                        Math.round(
                          (info.monthly_saving / info.target) *
                            100 *
                            info.months_to_reach
                        ),
                        100
                      );

                      return (
                        <div
                          key={goal}
                          className="bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 border-2 border-green-300 rounded-2xl p-7 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                          <h3 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-green-700" />
                            {goal}
                          </h3>

                          <div className="space-y-4 mb-5">
                            <div className="bg-white p-4 rounded-xl border border-green-200">
                              <p className="text-sm text-gray-600 font-semibold mb-1">
                                🎯 Target Amount
                              </p>
                              <p className="text-2xl font-black text-green-700">
                                ₹{info.target.toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-blue-200">
                              <p className="text-sm text-gray-600 font-semibold mb-1">
                                💰 Monthly Saving
                              </p>
                              <p className="text-2xl font-black text-blue-700">
                                ₹{info.monthly_saving.toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-indigo-200">
                              <p className="text-sm text-gray-600 font-semibold mb-1">
                                ⏳ Months to Reach
                              </p>
                              <p className="text-2xl font-black text-indigo-700">
                                {info.months_to_reach} months
                              </p>
                            </div>
                          </div>

                          {/* Enhanced Progress Bar */}
                          <div className="mt-6">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-bold text-gray-700">
                                Progress to Goal
                              </span>
                              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                {progress}%
                              </span>
                            </div>
                            <div className="relative w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full h-5 overflow-hidden shadow-inner border border-gray-300">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full shadow-lg transition-all duration-1000 ease-out"
                                style={{
                                  width: `${progress}%`,
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
                              </div>
                            </div>
                            <div className="mt-2 text-center">
                              <span className="text-xs font-semibold text-gray-600">
                                {progress < 100
                                  ? `${100 - progress}% remaining`
                                  : "Goal achievable!"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Download Report */}
            {reportFile && (
              <div className="text-center mt-12">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-14 py-6 rounded-2xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-8 h-8" />
                  Download Full Report (PDF)
                </button>
              </div>
            )}
            <FinancialChatBot/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

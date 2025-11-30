"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WineForm = {
  fixed_acidity: string;
  volatile_acidity: string;
  citric_acid: string;
  residual_sugar: string;
  chlorides: string;
  free_sulfur_dioxide: string;
  total_sulfur_dioxide: string;
  density: string;
  pH: string;
  sulphates: string;
  alcohol: string;
};

export default function NaiveBayesInputPage() {
  const [form, setForm] = useState<WineForm>({
    fixed_acidity: "",
    volatile_acidity: "",
    citric_acid: "",
    residual_sugar: "",
    chlorides: "",
    free_sulfur_dioxide: "",
    total_sulfur_dioxide: "",
    density: "",
    pH: "",
    sulphates: "",
    alcohol: "",
  });

  const [result, setResult] = useState<null | {
    prediksi: number;
    kelas: string;
    akurasi_model: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-nb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ph: form.pH, // mapping pH
        }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      if (data.kode === 200) {
        setResult({
          prediksi: data.prediksi,
          kelas: data.kelas,
          akurasi_model: data.akurasi_model,
        });
      } else {
        throw new Error(data.error || "Unknown backend error");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      fixed_acidity: "",
      volatile_acidity: "",
      citric_acid: "",
      residual_sugar: "",
      chlorides: "",
      free_sulfur_dioxide: "",
      total_sulfur_dioxide: "",
      density: "",
      pH: "",
      sulphates: "",
      alcohol: "",
    });
    setResult(null);
    setError(null);
  };

  const COLORS = ["#0088FE", "#FF8042"];

  const pieData = result
    ? [
        { name: "Akurasi", value: result.akurasi_model },
        { name: "Sisa", value: 1 - result.akurasi_model },
      ]
    : [];

  return (
    <div className="bg-white min-h-screen w-full p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-black">
          Naive Bayes – Wine Quality Prediction
        </h1>
        <p className="mb-6 text-gray-600">
          Fill out the values below to predict wine quality using the Naive Bayes model.
        </p>

        <div className="bg-white shadow rounded-xl p-6 border-2 border-black">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Wine Characteristics</h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(form).map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-black capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  step="any"
                  name={field}
                  value={form[field as keyof WineForm]}
                  onChange={handleChange}
                  className="border rounded-lg p-2 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Input ${field.replace(/_/g, " ")}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={handleReset}
            >
              Draft
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </div>

        {/* Loading Animation */}
        {loading && (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg animate-pulse">
            Predicting... please wait
          </div>
        )}

        {/* Result Popup */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-30 left-1/2 -translate-x-1/2 bg-white border shadow-lg rounded-xl p-6 w-96 z-50"
            >
              <h2 className="text-lg font-bold mb-2 text-gray-800">Prediction Result</h2>
              <p className="mb-2 text-gray-600">Prediksi: {result.prediksi}</p>
              <p className="mb-2 text-gray-600">Kelas: {result.kelas}</p>
              <p className="mb-4 text-gray-600">Akurasi: {result.akurasi_model}</p>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={(entry) => `${entry.name}: ${entry.value.toFixed(2)}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => value.toFixed(4)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => setResult(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}

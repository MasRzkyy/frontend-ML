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

export default function ID3InputPage() {
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

  const [masterInput, setMasterInput] = useState("");

  const [result, setResult] = useState<null | {
    prediksi: number;
    kelas: string;
    akurasi_model: number;
    precision: string;
    recall: string;
    f1_score: string;
    status: string;
    kode: number;
  }>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================================
  // 🔥 MASTER INPUT FILLER
  // ================================
  const handleMasterFill = () => {
    const values = masterInput.split(",").map((v) => v.trim());

    if (values.length !== 11) {
      setError("Master input harus berisi 11 angka dipisahkan koma.");
      return;
    }

    const mappedForm: WineForm = {
      fixed_acidity: values[0],
      volatile_acidity: values[1],
      citric_acid: values[2],
      residual_sugar: values[3],
      chlorides: values[4],
      free_sulfur_dioxide: values[5],
      total_sulfur_dioxide: values[6],
      density: values[7],
      pH: values[8],
      sulphates: values[9],
      alcohol: values[10],
    };

    setForm(mappedForm);
    setError(null);
  };

  // ====================================
  // 🔥 PREDICT
  // ====================================
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        "https://backend-machine-learning.vercel.app/api/predict-id3",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            ph: form.pH,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal menghubungi server!");

      const data = await res.json();

      if (data.kode === 200) {
        setResult({
          prediksi: data.prediksi,
          kelas: data.kelas,
          akurasi_model: data.akurasi_model,
          precision: data.precision,
          recall: data.recall,
          f1_score: data.f1_score,
          status: data.status,
          kode: data.kode,
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

  // RESET
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
    setMasterInput("");
    setResult(null);
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
          ID3 – Wine Quality Prediction
        </h1>

        <p className="mb-6 text-gray-600">
          Masukkan 11 fitur wine, atau gunakan master input.
        </p>

        <div className="bg-white shadow rounded-xl p-6 border-2 border-black">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Wine Characteristics
          </h2>

          {/* MASTER INPUT */}
          <div className="mb-5">
            <label className="text-sm font-medium text-black">
              Master Input (11 nilai dipisahkan koma)
            </label>

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={masterInput}
                onChange={(e) => setMasterInput(e.target.value)}
                className="border rounded-lg p-2 w-full text-gray-600"
                placeholder="Contoh: 7.4, 0.7, 0.0, 1.9, 0.076, 11, ..."
              />
              <button
                onClick={handleMasterFill}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Convert
              </button>
            </div>
          </div>

          {/* FORM FIELD */}
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(form).map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-black capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  step="any"
                  name={field}
                  value={form[field as keyof WineForm]}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full text-gray-700"
                />
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleReset}
              className="px-6 py-2 border-2 text-gray-600 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* POPUP HASIL */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl border shadow-lg w-96 z-50"
            >
              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Prediction Result
              </h2>
              <p className="text-gray-700 mt-2">
                Prediksi: <b>{result.prediksi}</b>
              </p>
              <p className="text-gray-700">
                Kelas: <b>{result.kelas}</b>
              </p>

              <p className="text-gray-700 mt-2">
                Akurasi: <b>{result.akurasi_model}</b>
              </p>

              <p className="text-gray-700">Precision: <b>{result.precision}</b></p>
              <p className="text-gray-700">Recall: <b>{result.recall}</b></p>
              <p className="text-gray-700">F1 Score: <b>{result.f1_score}</b></p>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    label={(entry) =>
                      `${entry.name}: ${(entry.value * 100).toFixed(2)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    formatter={(value: number) =>
                      `${(value * 100).toFixed(2)}%`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              <button
                onClick={() => setResult(null)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

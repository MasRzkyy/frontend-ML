"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-10">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">
            Wine Quality Prediction
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Sistem prediksi kualitas wine menggunakan dua metode klasifikasi:
            <span className="font-semibold text-gray-800"> Naive Bayes</span> dan
            <span className="font-semibold text-gray-800"> ID3 Decision Tree</span>.
            Pilih metode untuk melanjutkan ke halaman input.
          </p>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Card: Naive Bayes */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href="/naive"
              className="block bg-white border border-gray-200 shadow-sm rounded-2xl p-8 hover:border-blue-500"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Naive Bayes
              </h2>
              <p className="text-gray-600">
                Metode probabilistik sederhana namun kuat
                untuk memprediksi kualitas wine berdasarkan atribut kimia.
              </p>
              <div className="mt-6">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Mulai Predict
                </button>
              </div>
            </Link>
          </motion.div>

          {/* Card: ID3 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href="/id3"
              className="block bg-white border border-gray-200 shadow-sm rounded-2xl p-8 hover:border-blue-500"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                ID3 Decision Tree
              </h2>
              <p className="text-gray-600">
                Algoritma pohon keputusan berbasis informasi gain
                untuk mengklasifikasikan kualitas wine dengan visual yang jelas.
              </p>
              <div className="mt-6">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Mulai Predict
                </button>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

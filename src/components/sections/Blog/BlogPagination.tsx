"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-10 h-10 rounded-lg font-semibold transition ${
            currentPage === i + 1
              ? "bg-yellow-500 text-black"
              : "border border-gray-200 hover:border-yellow-400 text-gray-600"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
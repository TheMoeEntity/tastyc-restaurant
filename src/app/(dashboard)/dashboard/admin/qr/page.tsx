"use client";

import { useEffect, useState } from "react";
import { QrCode, Download, Loader2, AlertCircle, Wifi } from "lucide-react";
import Image from "next/image";
import apiFetch from "@/lib/api";

//

interface QRCode {
  tableNumber: number;
  qrCodeDataUrl: string;
  tableUrl: string;
}

export default function AdminQRPage() {
  const [tableCount, setTableCount] = useState(10);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [activeSessions, setActiveSessions] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<any>(`/api/qr/active-sessions`)
      .then((r) => {
        if (r.success) setActiveSessions(r.data?.session ?? r.data.count ?? 0);
      })
      .catch(() => { });
  }, []);

  const generate = async () => {
    setGenerating(true);
    setError("");
    try {
      const r = await apiFetch<any>(`/api/qr/generate-all`, {
        method: "POST",
        data: { tableCount },
      });
      if (!r.success) throw new Error(r.message ?? "Generation failed");
      setQrCodes(r.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const downloadQR = (qr: QRCode) => {
    const a = document.createElement("a");
    a.href = qr.qrCodeDataUrl;
    a.download = `table-${qr.tableNumber}-qr.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl mb-1">QR Codes</h1>
          <p className="text-white/40 text-sm">
            Generate and manage table QR codes
          </p>
        </div>
        {activeSessions !== null && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <Wifi size={14} className="text-green-400" />
            <span className="text-green-400 text-sm font-semibold">
              {activeSessions} active session{activeSessions !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div
        className="rounded-2xl border border-white/5 p-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p className="text-white/60 text-sm font-semibold">Generate QR Codes</p>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-white/40 text-xs mb-1.5">
              Number of tables
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={tableCount}
              onChange={(e) => setTableCount(Number(e.target.value))}
              className="w-32 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-yellow-400/50"
            />
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50 mt-5"
          >
            {generating ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <QrCode size={14} /> Generate
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>

      {qrCodes.length > 0 && (
        <div>
          <p className="text-white/40 text-xs mb-4">
            {qrCodes.length} QR codes generated — click to download
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {qrCodes.map((qr) => (
              <div
                key={qr.tableNumber}
                className="rounded-2xl border border-white/5 p-4 text-center space-y-3"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
                  <img
                    src={qr.qrCodeDataUrl}
                    alt={`Table ${qr.tableNumber} QR`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-white font-semibold text-sm">
                  Table {qr.tableNumber}
                </p>
                <button
                  onClick={() => downloadQR(qr)}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white text-xs transition"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

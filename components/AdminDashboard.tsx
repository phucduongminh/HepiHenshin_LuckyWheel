import React, { useState } from "react";
import { Prize } from "../types";
import { prizeService } from "../services/prizeService";
import { imageService, UploadPath } from "@/services/imageService";

interface AdminDashboardProps {
  prizes: Prize[];
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  prizes,
  onUpdate,
}) => {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!editingPrize) return;

    try {
      setUploadingImage(true);

      const url = await imageService.uploadImage(file, UploadPath.PRIZE);

      setEditingPrize({
        ...editingPrize,
        imageUrl: url,
      });
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize) return;

    setLoading(true);
    // Tách lấy payload, loại bỏ các trường metadata nếu có
    const { id, createdAt, updatedAt, ...payload } = editingPrize as any;

    try {
      if (!id || id === "") {
        // CREATE: Nếu không có ID hoặc ID rỗng
        await prizeService.createPrize(payload);
      } else {
        // UPDATE: Nếu đã có ID
        await prizeService.updatePrize(id, payload);
      }
      setEditingPrize(null);
      onUpdate();
    } catch (error) {
      console.error("Lỗi khi lưu giải thưởng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPrize = () => {
    setEditingPrize({
      id: "",
      name: "",
      imageUrl: "",
      remainingQuantity: 10,
      winProbability: 5,
      isActive: true,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
  };

  const totalProb = prizes.reduce((acc, p) => acc + p.winProbability, 0);

  return (
    <div className="py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading">Quản lý danh sách giải thưởng</h1>
          <p className="text-slate-400 mt-1">
            Tổng cộng tỷ lệ đã phân bổ:
            <span
              className={`ml-2 font-bold ${totalProb > 100 ? "text-red-400" : "text-emerald-400"}`}
            >
              {totalProb.toFixed(2)}%
            </span>
          </p>
          {totalProb < 100 && (
            <p className="text-xs text-slate-500 italic mt-1">
              Remaining automatically assigned to "No Prize".
            </p>
          )}
        </div>
        <button
          onClick={handleNewPrize}
          className="bg-amber-500 hover:bg-amber-600 text-red-900 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Thêm Giải Thưởng</span>
        </button>
      </div>

      {/* Prize List */}
      <div className="grid grid-cols-1 gap-4">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className={`glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-white/20 transition-all gap-4 ${!prize.isActive ? "opacity-60 grayscale-[0.5]" : ""}`}
          >
            <div className="flex items-center space-x-6">
              <div className="relative shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                  {prize.imageUrl ? (
                    <img
                      src={prize.imageUrl}
                      alt={prize.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl">🎁</div>
                  )}
                </div>
                {!prize.isActive && (
                  <div className="absolute -top-2 -right-2 bg-slate-700 text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white">
                    OFF
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{prize.name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                  <span>
                    Prob:{" "}
                    <span className="text-amber-400 font-medium">
                      {prize.winProbability}%
                    </span>
                  </span>
                  <span>
                    Stock:{" "}
                    <span className="text-amber-400 font-medium">
                      {prize.remainingQuantity}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setEditingPrize(prize)}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-white/5"
              >
                Sửa
              </button>
              <button
                onClick={async () => {
                  if (
                    confirm(
                      prize.isActive
                        ? "Ngừng áp dụng giải thưởng này?"
                        : "Kích hoạt lại giải thưởng này?",
                    )
                  ) {
                    await prizeService.updatePrize(prize.id, {
                      isActive: !prize.isActive,
                    });
                    onUpdate();
                  }
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition border border-white/5 ${prize.isActive ? "bg-rose-900/20 text-rose-400 hover:bg-rose-900/40" : "bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40"}`}
              >
                {prize.isActive ? "Ngừng áp dụng" : "Kích hoạt"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {editingPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <form
            onSubmit={handleSave}
            className="glass-panel w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-amber-500/20 animate-in zoom-in duration-300"
          >
            <h2 className="text-2xl font-bold mb-6 text-amber-500 flex justify-between items-center">
              <span>
                {editingPrize.id ? "Cấu Hình Giải Thưởng" : "Thêm Giải Mới"}
              </span>
              {loading && (
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Tên giải thưởng
                </label>
                <input
                  type="text"
                  required
                  value={editingPrize.name}
                  onChange={(e) =>
                    setEditingPrize({ ...editingPrize, name: e.target.value })
                  }
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Ảnh giải thưởng
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 cursor-pointer"
                  />

                  {uploadingImage && (
                    <p className="text-xs text-amber-400 mt-2">
                      Đang upload...
                    </p>
                  )}

                  {editingPrize.imageUrl && (
                    <img
                      src={`${editingPrize.imageUrl}`}
                      className="mt-3 w-24 h-24 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Tỷ lệ (%)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={editingPrize.winProbability}
                    onChange={(e) =>
                      setEditingPrize({
                        ...editingPrize,
                        winProbability: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPrize.remainingQuantity}
                    onChange={(e) =>
                      setEditingPrize({
                        ...editingPrize,
                        remainingQuantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <label className="flex items-center justify-between bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/5 transition">
                <span className="text-sm text-slate-300">
                  Kích hoạt giải thưởng
                </span>
                <input
                  type="checkbox"
                  checked={editingPrize.isActive}
                  onChange={(e) =>
                    setEditingPrize({
                      ...editingPrize,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                type="button"
                disabled={loading}
                onClick={() => setEditingPrize(null)}
                className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition font-bold text-slate-300 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-red-900 font-black rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

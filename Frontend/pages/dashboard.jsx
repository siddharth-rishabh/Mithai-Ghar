import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/axios";
import { Search, Plus, Trash2, Edit } from "lucide-react";

export default function Dashboard() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const isAdmin = user?.role === "admin";

  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  const fetchSweets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/sweets`, { headers });
      setSweets(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const filteredSweets = sweets.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const purchaseSweet = async (id) => {
    try {
      setError("");
      await api.post(`/sweets/${id}/purchase`, {}, { headers });
      setError(""); // Clear error on success
      fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase sweet");
    }
  };

  const deleteSweet = async (id) => {
    try {
      setError("");
      await api.delete(`/sweets/${id}`, { headers });
      setError(""); // Clear error on success
      fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete sweet");
    }
  };

  const openForm = (sweet = null) => {
    setError("");
    if (sweet) {
      setEditingId(sweet._id);
      setForm({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    } else {
      setEditingId(null);
      setForm({ name: "", category: "", price: "", quantity: "" });
    }
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!form.name.trim() || !form.category.trim() || !form.price || !form.quantity) {
      setError("All fields are required and cannot be empty");
      return;
    }
    if (isNaN(form.price) || parseFloat(form.price) <= 0) {
      setError("Price must be a positive number");
      return;
    }
    if (isNaN(form.quantity) || parseInt(form.quantity) < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      if (editingId) {
        await api.put(`/sweets/${editingId}`, form, { headers });
      } else {
        await api.post(`/sweets`, form, { headers });
      }
      setError(""); // Clear error on success
      setShowForm(false);
      setForm({ name: "", category: "", price: "", quantity: "" });
      fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save sweet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Mithai Ghar</h1>

        <div className="relative max-w-md w-full mx-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Search sweets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className="text-white font-medium hover:text-orange-200 transition-colors"
          >
            Logout
          </button>

          {isAdmin && (
            <button
              onClick={() => openForm()}
              className="flex items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              <Plus size={18} /> Add Sweet
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Loading sweets...</p>
          </div>
        ) : (
          filteredSweets.map((sweet) => (
            <div key={sweet._id} className="bg-white rounded-lg shadow-md">
              <div className="p-4">
                <h3 className="text-lg font-bold">{sweet.name}</h3>
                <p className="text-sm text-gray-600">{sweet.category}</p>
                <p className="text-orange-500 font-semibold mt-2">
                  ₹{sweet.price}
                </p>
                <p className="text-sm">Stock: {sweet.quantity}</p>
              </div>

              <div className="flex gap-2 p-4">
                <button
                  disabled={sweet.quantity === 0}
                  onClick={() => purchaseSweet(sweet._id)}
                  className={`flex-1 py-2 rounded-lg font-semibold ${
                    sweet.quantity === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  Purchase
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => openForm(sweet)}
                      className="p-2 bg-gray-200 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteSweet(sweet._id)}
                      className="p-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                disabled={submitting}
                className={`px-4 py-2 rounded ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 text-white"
                }`}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

export default function AddJobModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Wishlist',
        salary: ''
    })

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-black mb-6 text-white tracking-tight">ADD NEW JOB</h2>

                <div className="space-y-4">
                    <input
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-100"
                        placeholder="Company Name"
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                    />
                    <input
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-100"
                        placeholder="Position Title"
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                    />
                    <select
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-100"
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        {["Wishlist", "Applied", "Interviewing", "Offer", "Rejected", "Accepted", "Declined"].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <input
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-100"
                        placeholder="Salary (Optional)"
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                </div>

                <div className="flex gap-4 mt-8">
                    <button type="button" onClick={onClose} className="flex-1 text-gray-400 hover:text-white font-bold transition-colors">CANCEL</button>
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-black transition-all">SAVE JOB</button>
                </div>
            </form>
        </div>
    );
}
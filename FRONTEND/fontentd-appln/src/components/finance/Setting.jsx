// src/components/finance/Setting.jsx (or admin/pages/settings/Setting.jsx)

import React, { useState } from "react";

const Setting = () => {
    const [settings, setSettings] = useState({
        enablePayroll: true,
        autoApproveLeaves: false,
        defaultTaxRate: 10,
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Settings:", settings);
        // 🔁 Send settings to backend if needed
        setMessage("Settings updated successfully!");
        setTimeout(() => setMessage(""), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            {message && (
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="enablePayroll">Enable Payroll</label>
                    <input
                        type="checkbox"
                        id="enablePayroll"
                        name="enablePayroll"
                        checked={settings.enablePayroll}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label htmlFor="autoApproveLeaves">Auto Approve Leaves</label>
                    <input
                        type="checkbox"
                        id="autoApproveLeaves"
                        name="autoApproveLeaves"
                        checked={settings.autoApproveLeaves}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="defaultTaxRate" className="block">
                        Default Tax Rate (%)
                    </label>
                    <input
                        type="number"
                        id="defaultTaxRate"
                        name="defaultTaxRate"
                        className="mt-1 block w-full border px-2 py-1 rounded"
                        value={settings.defaultTaxRate}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default Setting;

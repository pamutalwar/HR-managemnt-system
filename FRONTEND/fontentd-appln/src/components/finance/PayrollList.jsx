"use client"

import { useEffect, useState } from "react"
import {
    Plus,
    Search,
    Download,
    Trash2,
    Filter,
} from "lucide-react"

const PayrollList = () => {
    const [payrolls, setPayrolls] = useState([])
    const [filteredPayrolls, setFilteredPayrolls] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [newPayroll, setNewPayroll] = useState({
        employeeName: "",
        grossSalary: "",
        taxDeductions: "",
        netPay: "",
        date: new Date().toISOString().split("T")[0],
    })
    const [page, setPage] = useState(1)
    const [pageSize] = useState(5) // Number of records per page
    const [hasMore, setHasMore] = useState(true)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    useEffect(() => {
        fetchPayrolls(true) // Initial load, reset to first page
    }, [])

    useEffect(() => {
        const filtered = payrolls.filter((payroll) =>
            payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredPayrolls(filtered)
    }, [payrolls, searchTerm])

    // Lazy loading: fetch more payrolls as user scrolls
    const fetchPayrolls = async (reset = false) => {
        try {
            const token = localStorage.getItem("token");
            const url = reset
                ? `http://localhost:9090/api/payroll?page=1&pageSize=${pageSize}`
                : `http://localhost:9090/api/payroll?page=${page}&pageSize=${pageSize}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (reset) {
                setPayrolls(data);
                setFilteredPayrolls(data);
                setPage(2);
                setHasMore(data.length === pageSize);
            } else {
                setPayrolls((prev) => [...prev, ...data]);
                setFilteredPayrolls((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
                setHasMore(data.length === pageSize);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payrolls:", error);
            setLoading(false);
        }
    }

    // Infinite scroll handler
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
            fetchPayrolls()
        }
    }

    const handleAddPayroll = async (e) => {
        e.preventDefault()
        try {
            const grossSalary = parseFloat(newPayroll.grossSalary)
            const taxDeductions = parseFloat(newPayroll.taxDeductions)
            const netPay = grossSalary - taxDeductions

            const payrollData = {
                ...newPayroll,
                grossSalary,
                taxDeductions,
                netPay,
            }

            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:9090/api/payroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payrollData),
            })

            if (response.ok) {
                fetchPayrolls()
                setShowAddModal(false)
                setNewPayroll({
                    employeeName: "",
                    grossSalary: "",
                    taxDeductions: "",
                    netPay: "",
                    date: new Date().toISOString().split("T")[0],
                })
            }
        } catch (error) {
            console.error("Error adding payroll:", error)
        }
    }

    // Delete payroll handler
    const handleDeletePayroll = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:9090/api/payroll/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.ok) {
                fetchPayrolls()
            }
        } catch (error) {
            console.error("Error deleting payroll:", error)
        }
    }

    const downloadSalarySlip = (payroll) => {
        const slipContent = `
SALARY SLIP
===========

Employee:       ${payroll.employeeName}
Date:           ${new Date(payroll.date).toLocaleDateString()}
Gross Salary:   ₹${payroll.grossSalary.toLocaleString()}
Tax Deductions: ₹${payroll.taxDeductions.toLocaleString()}
Net Pay:        ₹${payroll.netPay.toLocaleString()}
    `.trim()

        const blob = new Blob([slipContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `salary_slip_${payroll.employeeName}_${payroll.date}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Attach scroll event to the payroll table container
    useEffect(() => {
        const container = document.getElementById("payroll-table-container");
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [hasMore, loading]);

    // Razorpay script loader
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Razorpay payment handler
    const handleRazorpayPayment = () => {
        const options = {
            key: "rzp_test_XccxtQM6yZrxmz", // Only public key here
            amount: parseInt(newPayroll.netPay * 100, 10), // Amount in paise
            currency: "INR",
            name: "HRMS Payroll Payment",
            description: `Salary payment for ${newPayroll.employeeName}`,
            handler: function (response) {
                alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                setPaymentSuccess(true);
            },
            prefill: {
                name: newPayroll.employeeName,
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage employee payroll records and generate salary slips
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payroll
                    </button>
                </div>
            </div>

            {/* Table */}
            <div id="payroll-table-container" className="bg-white rounded-lg shadow-md overflow-auto" style={{ maxHeight: 400 }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Employee Name", "Gross Salary", "Tax Deductions", "Net Pay", "Date", "Actions"].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayrolls.map((payroll) => (
                                <tr key={payroll.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">{payroll.employeeName}</td>
                                    <td className="px-6 py-4 text-gray-700">₹{payroll.grossSalary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-red-600">₹{payroll.taxDeductions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">₹{payroll.netPay.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(payroll.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => downloadSalarySlip(payroll)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Download Salary Slip"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePayroll(payroll.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payroll Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start pt-24 z-50">
                    <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Add New Payroll
                        </h3>
                        <form onSubmit={handleAddPayroll}>
                            {[
                                { label: "Employee Name", name: "employeeName", type: "text" },
                                { label: "Gross Salary", name: "grossSalary", type: "number" },
                                { label: "Tax Deductions", name: "taxDeductions", type: "number" },
                                { label: "Date", name: "date", type: "date" },
                            ].map(({ label, name, type }) => (
                                <div className="mb-4" key={name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newPayroll[name]}
                                        onChange={(e) =>
                                            setNewPayroll({ ...newPayroll, [name]: e.target.value })
                                        }
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRazorpayPayment}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Pay
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md ${paymentSuccess ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
                                    disabled={!paymentSuccess}
                                >
                                    Add Payroll
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PayrollList

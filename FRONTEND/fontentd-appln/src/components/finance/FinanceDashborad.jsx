"use client"

import { useState, useEffect } from "react"
import {
    DollarSign,
    Users,
    TrendingUp,
    FileText,
    AlertCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Header from "./components/Header"

const FinanceDashboard = () => {
    const navigate = useNavigate()
    const [dashboardData, setDashboardData] = useState({
        totalSalaryDisbursed: 0,
        pendingDeductions: 0,
        payrollCount: 0,
        employeeCount: 0,
        recentPayrolls: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:9090/api/payroll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const payrolls = await response.json()

            const totalSalary = payrolls.reduce((sum, p) => sum + p.netPay, 0)
            const totalDeductions = payrolls.reduce(
                (sum, p) => sum + p.taxDeductions,
                0
            )

            setDashboardData({
                totalSalaryDisbursed: totalSalary,
                pendingDeductions: totalDeductions,
                payrollCount: payrolls.length,
                employeeCount: new Set(payrolls.map((p) => p.employeeName)).size,
                recentPayrolls: payrolls.slice(-5).reverse(),
            })
            setLoading(false)
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            setLoading(false)
        }
    }

    const StatCard = ({ title, value, icon: Icon, color, prefix = "" }) => (
        <div
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{ borderLeftColor: color }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {prefix}
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                </div>
                <Icon className="h-8 w-8" style={{ color }} />
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            {/* <Header toggleSidebar={() => {}} onLogout={logout} />
            <div className="mb-8" /> */}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Salary Disbursed"
                    value={dashboardData.totalSalaryDisbursed}
                    icon={DollarSign}
                    color="#10B981"
                    prefix="₹"
                />
                <StatCard
                    title="Pending Deductions"
                    value={dashboardData.pendingDeductions}
                    icon={AlertCircle}
                    color="#F59E0B"
                    prefix="₹"
                />
                <StatCard
                    title="Payroll Records"
                    value={dashboardData.payrollCount}
                    icon={FileText}
                    color="#3B82F6"
                />
                <StatCard
                    title="Active Employees"
                    value={dashboardData.employeeCount}
                    icon={Users}
                    color="#8B5CF6"
                />
            </div>

            {/* Recent Payrolls Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Recent Payroll Records
                    </h2>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Gross Salary
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Tax Deductions
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Net Pay
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.recentPayrolls.map((payroll) => (
                                <tr key={payroll.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {payroll.employeeName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                        ₹{payroll.grossSalary.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-red-600">
                                        ₹{payroll.taxDeductions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-600">
                                        ₹{payroll.netPay.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {new Date(payroll.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FinanceDashboard

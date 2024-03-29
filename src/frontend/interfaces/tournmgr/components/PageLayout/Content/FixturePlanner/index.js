import React from "react";

const DropdownMenu = () => (
    <div className="dropdown">
        <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600">
            <i className="ri-more-fill"></i>
        </button>
        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
            <li><a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a></li>
            <li><a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a></li>
            <li><a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a></li>
        </ul>
    </div>
);

const StatisticBlock = ({ value, label, color, sign }) => (
    <div className="rounded-md border border-dashed border-gray-200 p-4">
        <div className="flex items-center mb-0.5">
            <div className="text-xl font-semibold">{value}</div>
            <span className={`p-1 rounded text-[12px] font-semibold ${color}/10 text-${color} leading-none ml-1`}>{sign}</span>
        </div>
        <span className="text-gray-400 text-sm">{label}</span>
    </div>
);

const TableRow = ({ earning, status }) => (
    <tr>
        <td className="py-2 px-4 border-b border-b-gray-50">
            <div className="flex items-center">
                <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
            </div>
        </td>
        <td className="py-2 px-4 border-b border-b-gray-50">
            <span className={`text-[13px] font-medium text-${earning < 0 ? 'rose' : 'emerald'}-500`}>{earning < 0 ? '-' : '+'}${Math.abs(earning)}</span>
        </td>
        <td className="py-2 px-4 border-b border-b-gray-50">
            <span className={`inline-block p-1 rounded ${status === 'Pending' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} font-medium text-[12px] leading-none`}>{status}</span>
        </td>
    </tr>
);

const FixturePlanner = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium">Order Statistics</div>
                    <DropdownMenu />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <StatisticBlock value="10" label="Active" color="bg-blue-500" sign="$80" />
                    <StatisticBlock value="50" label="Completed" color="bg-emerald-500" sign="+$469" />
                    <StatisticBlock value="4" label="Canceled" color="bg-rose-500" sign="-$130" />
                </div>
                <div>
                    <canvas id="order-chart"></canvas>
                </div>
            </div>
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium">Earnings</div>
                    <DropdownMenu />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[460px]">
                        <thead>
                            <tr>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Earning</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow earning={235} status="Pending" />
                            <TableRow earning={-235} status="Withdrawn" />
                            <TableRow earning={235} status="Pending" />
                            <TableRow earning={-235} status="Withdrawn" />
                            <TableRow earning={235} status="Pending" />
                            <TableRow earning={-235} status="Withdrawn" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FixturePlanner
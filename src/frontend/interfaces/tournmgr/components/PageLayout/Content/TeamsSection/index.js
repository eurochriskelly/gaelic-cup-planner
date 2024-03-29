import React from "react";

const thClasses = 'px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left';

const TableHeader = () => (
    
    <thead>
        <tr>
            <th className={thClasses}>Role</th>
            <th className={thClasses}>Amount</th>
            <th className={`${thClasses} min-w-140-px`}></th>
        </tr>
    </thead>
);

const ProgressBar = ({ percentage, color }) => (
    <div className="flex items-center">
        <span className="mr-2">{percentage}%</span>
        <div className="relative w-full">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${percentage}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color}`}></div>
            </div>
        </div>
    </div>
);

const TableRow = ({ role, amount, percentage, color }) => (
    <tr className="text-gray-700 dark:text-gray-100">
        <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">{role}</th>
        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{amount}</td>
        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            <ProgressBar percentage={percentage} color={color} />
        </td>
    </tr>
);

const TeamCard = ({ title, children }) => (
    <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
        <div className="rounded-t mb-0 px-0 border-0">
            <div className="flex flex-wrap items-center px-4 py-2">
                <div className="relative w-full max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">{title}</h3>
                </div>
            </div>
            {children}
        </div>
    </div>
);

const ActivitySection = ({ children }) => (
    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
        {children}
    </div>
);

const TeamsSection = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TeamCard title="Users">
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <TableHeader />
                        <tbody>
                            <TableRow role="Administrator" amount="1" percentage={70} color="bg-blue-600" />
                            <TableRow role="User" amount="6" percentage={40} color="bg-blue-500" />
                            <TableRow role="User" amount="5" percentage={45} color="bg-pink-500" />
                            <TableRow role="User" amount="4" percentage={60} color="bg-red-500" />
                        </tbody>
                    </table>
                </div>
            </TeamCard>
            <ActivitySection>
                {/* ActivitySection's content goes here */}
            </ActivitySection>
        </div>
    );
}

export default TeamsSection;
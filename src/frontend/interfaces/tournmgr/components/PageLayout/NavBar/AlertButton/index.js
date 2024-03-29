import React from "react";

const AlertButton = () => {
    return <>
        <button type="button" className="dropdown-toggle text-gray-400 mr-4 w-8 h-8 rounded flex items-center justify-center  hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="hover:bg-gray-100 rounded-full" viewBox="0 0 24 24" style={{ fill: 'gray', transform: '', msFilter: '' }}>
                <path d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z"></path>
            </svg>
        </button>
        <div className="dropdown-menu shadow-md shadow-black/5 z-30 hidden max-w-xs w-full bg-white rounded-md border border-gray-100">
            <div className="flex items-center px-4 pt-4 border-b border-b-gray-100 notification-tab">
                <button type="button" data-tab="notification" data-tab-page="notifications" className="text-gray-400 font-medium text-[13px] hover:text-gray-600 border-b-2 border-b-transparent mr-4 pb-1 active">Notifications</button>
                <button type="button" data-tab="notification" data-tab-page="messages" className="text-gray-400 font-medium text-[13px] hover:text-gray-600 border-b-2 border-b-transparent mr-4 pb-1">Messages</button>
            </div>
            <div className="my-2">
                <ul className="max-h-64 overflow-y-auto" data-tab-for="notification" data-page="notifications">
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">New order</div>
                                <div className="text-[11px] text-gray-400">from a user</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">New order</div>
                                <div className="text-[11px] text-gray-400">from a user</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">New order</div>
                                <div className="text-[11px] text-gray-400">from a user</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">New order</div>
                                <div className="text-[11px] text-gray-400">from a user</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">New order</div>
                                <div className="text-[11px] text-gray-400">from a user</div>
                            </div>
                        </a>
                    </li>
                </ul>
                <ul className="max-h-64 overflow-y-auto hidden" data-tab-for="notification" data-page="messages">
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">John Doe</div>
                                <div className="text-[11px] text-gray-400">Hello there!</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">John Doe</div>
                                <div className="text-[11px] text-gray-400">Hello there!</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">John Doe</div>
                                <div className="text-[11px] text-gray-400">Hello there!</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">John Doe</div>
                                <div className="text-[11px] text-gray-400">Hello there!</div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="py-2 px-4 flex items-center hover:bg-gray-50 group">
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded block object-cover align-middle" />
                            <div className="ml-2">
                                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">John Doe</div>
                                <div className="text-[11px] text-gray-400">Hello there!</div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </>
};

export default AlertButton;
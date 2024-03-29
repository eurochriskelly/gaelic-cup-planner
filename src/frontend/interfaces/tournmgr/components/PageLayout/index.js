import React from "react";
import SideNav from "./SideNav";
import NavBar from "./NavBar";
import Content from "./Content";

const PageLayout = () => {
    return (
        <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-200 min-h-screen transition-all main">
            <SideNav />
            <NavBar />
            <Content />
        </main>
    )
}

export default PageLayout
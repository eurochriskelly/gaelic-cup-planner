import { json } from 'body-parser';
import React from 'react';


const SideNav = ({

}) => {
    return <>
        <div className="fixed left-0 top-0 w-64 h-full bg-[#f8f4f3] p-4 z-50 sidebar-menu transition-transform">
            <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
                <h2 className="font-bold text-2xl">TOURNAMENT BUILDER</h2>
            </a>
            <ul className="mt-4">
                <SubHeading name="EVENT" />
                <SideNavLink icon="ri-home-2-line" title="Manage" />
                <SideNavLink icon="bx-user" title="Users" extraClasses="sidebar-dropdown-toggle" subitems="true" >
                    <SideNavSubItems items={['All', 'Roles']} />
                </SideNavLink>
                <SideNavLink title="Activities" icon="bx-list-ul" />
                <SubHeading name="GROUPS" />
                <SideNavLink title="Post" icon="bxl-blogger" extraClasses='sidebar-dropdown-toggle' subitems="true">
                    <SideNavSubItems items={['All', 'Categories', 'Tags']} />
                </SideNavLink>
                <SideNavLink title="Archive" icon="bx-archive" />
                <SubHeading name="FIXTURES" />
                <SideNavLink title="Post" icon="bxl-blogger" extraClasses='sidebar-dropdown-toggle' subitems="true">
                    <SideNavSubItems items={['All', 'Categories', 'Tags']} />
                </SideNavLink>
                <SideNavLink title="Archive" icon="bx-archive" />
            </ul>
        </div>
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay"></div>
    </>
}


const SubHeading = ({ name }) => {
    return <span className="text-gray-400 font-bold">{name}</span>
}

const SideNavSubItems = ({ items }) => {
    return (
        <ul className="pl-7 mt-2 hidden group-[.selected]:block">{
            items.map((item, index) => {
                return <li className="mb-4" key={index}>
                    <a href="" className="text-gray-900 text-sm flex items-center hover:text-[#f84525] before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3">{item}</a>
                </li>
            })
        }</ul>
    )
}

const SideNavLink = ({
    children,
    title,
    icon,
    subitems = false,
    extraClasses = ''
}) => {
    return (
        <li className="mb-1 group">
            <a href="" className={`flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 ${extraClasses}`}>
                <i className={`bx ${icon} mr-3 text-lg`}></i>
                <span className="text-sm">{title}</span>
                {subitems && <i className="ri-arrow-right-s-line ml-auto group-[.selected]:rotate-90"></i>}
                {children}
            </a>
        </li>
    )
}


export default SideNav;

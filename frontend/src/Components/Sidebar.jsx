import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlHandbag } from "react-icons/sl";
import { MdOutlineCategory } from "react-icons/md";
import { HomeIcon, ViewGridIcon, TagIcon, ShoppingCartIcon, UsersIcon, GiftIcon, StarIcon, ShieldCheckIcon, XIcon, ChevronRightIcon } from '@heroicons/react/outline';
import '../style/d_style.css';
import { jwtDecode } from 'jwt-decode';

const menu = [
    { name: 'Dashboard', icon: <HomeIcon className='w-6 h-6 d_icon' />, link: '' },
    {
        name: 'Category',
        icon: <ViewGridIcon className='w-6 h-6 d_icon' />,
        link: '/category',
        submenu: [
            { name: 'Add Category', link: '/category/add' },
            { name: 'Category List', link: '/category/list' }
        ]
    },
    {
        name: 'Subcategory',
        icon: <MdOutlineCategory  className='w-6 h-6 d_icon' />,
        link: '/subcategory',
        submenu: [
            { name: 'Add Subcategory', link: '/subcategory/add' },
            { name: 'Subcategory List', link: '/subcategory/list' }
        ]
    },
    {
        name: 'Product',
        icon: <SlHandbag className='w-6 h-6 d_icon' />,
        link: '/product',
        submenu: [
            { name: 'Add Product', link: '/product/add' },
            { name: 'Product Detail', link: '/product/detail' },
            { name: 'Product List', link: '/product/list' }
        ]
    },
    {
        name: 'Shop',
        icon: <TagIcon className='w-6 h-6 d_icon' />,
        link: '/shop',
        submenu: [
            { name: 'Products', link: '/shop/product' },
            { name: 'Cart', link: '/shop/cart' }
        ]
    },
    {
        name: 'Orders',
        icon: <ShoppingCartIcon className='w-6 h-6 d_icon' />,
        link: '/orders',
        submenu: [
            { name: 'Order List', link: '/orders/list' },
            { name: 'Orders I Placed', link: '/orders/placed' },
            { name: 'Orders for My Products', link: '/orders/for-my-products' }
        ]
    },
    {
        name: 'Coupons',
        icon: <GiftIcon className='w-6 h-6 d_icon' />,
        link: '/coupons',
        submenu: [
            { name: 'Add Coupon', link: '/coupons/add' },
            { name: 'Coupon List', link: '/coupons/list' }
        ]
    },
    { name: 'Privacy policy', icon: <ShieldCheckIcon className='w-6 h-6 d_icon' />, link: '/privacy_policy' },
];

const Sidebar = ({ open, setopen }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // Get user role from token
    let userRole = null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        } catch (e) {
            userRole = null;
        }
    }
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-open submenu if current route matches any submenu link
    useEffect(() => {
        const foundIdx = menu.findIndex(item =>
            item.submenu && item.submenu.some(sub => location.pathname === sub.link)
        );
        setOpenSubmenu(foundIdx !== -1 ? foundIdx : null);
    }, [location.pathname]);

    // On mobile, always expanded
    const effectiveCollapsed = isDesktop ? collapsed : false;

    return (
        <aside className={`fixed z-40 top-0 left-0 h-screen d_sidebar shadow-lg transition-transform duration-300
    ${open ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:block
    ${effectiveCollapsed ? 'w-20' : 'w-64'}
    flex flex-col
    overflow-x-hidden
    transition-all duration-300 ease-in-out
`}>
            <div className="relative flex items-center py-[20px] border-b d_border pl-4 pr-10 flex-shrink-0">
                <span className={`text-2xl font-bold tracking-widest d_logo transition-all duration-300 ${effectiveCollapsed ? 'hidden' : ''}`}>CROCKERY</span>
                {/* Close button absolutely positioned at top-right on mobile */}
                <button className="md:hidden absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition shadow-lg bg-white" onClick={() => setopen(false)}>
                    <XIcon className="w-7 h-7 text-red-500" />
                </button>
                <div className="flex items-center gap-2 ml-auto">
                    {/* Collapse/Expand button only on desktop */}
                    <button
                        className="p-1 rounded hover:bg-d_hover transition hidden md:block"
                        onClick={() => setCollapsed((prev) => !prev)}
                        aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {effectiveCollapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 d_icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 d_icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        )}
                    </button>
                </div>
            </div>
            <nav className="mt-6 flex-1 overflow-y-auto min-h-0">
                <ul className="space-y-2">
                    {menu.map((item, idx) => {
                        // Special logic for Orders menu
                        if (item.name === 'Orders') {
                            let ordersSubmenu = [];
                            if (isAdmin) {
                                ordersSubmenu = [
                                    { name: 'Order List', link: '/orders/list' },
                                    { name: 'Orders I Placed', link: '/orders/placed' },
                                    { name: 'Orders for My Products', link: '/orders/for-my-products' }
                                ];
                            } else {
                                ordersSubmenu = [
                                    { name: 'Orders I Placed', link: '/orders/placed' },
                                    { name: 'Orders for My Products', link: '/orders/for-my-products' }
                                ];
                            }
                            return (
                                <li key={item.name} className="relative group">
                                    <button
                                        type="button"
                                        className={`flex items-center w-full px-6 py-3 rounded-lg transition-all d_menu_item font-medium hover:bg-d_hover hover:shadow-lg ${location.pathname.startsWith(item.link) ? 'd_active' : 'text-dark'} ${effectiveCollapsed ? 'justify-center px-2' : ''}`}
                                        onClick={() => {
                                            if (effectiveCollapsed) {
                                                setCollapsed(false);
                                                setOpenSubmenu(idx);
                                            } else {
                                                setOpenSubmenu(openSubmenu === idx ? null : idx);
                                            }
                                        }}
                                        aria-expanded={openSubmenu === idx}
                                    >
                                        <span className={`${!effectiveCollapsed ? 'mr-4' : ''} transition-all duration-300`}>{item.icon}</span>
                                        {!effectiveCollapsed && <span>{item.name}</span>}
                                        {!effectiveCollapsed && (
                                            <svg className={`ml-auto w-4 h-4 transition-transform duration-200 ${openSubmenu === idx ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                    {/* Submenu */}
                                    {openSubmenu === idx && !effectiveCollapsed && (
                                        <ul
                                            className="ml-4 mt-1 bg-white shadow-xl border-l-4 border-[#254D70] py-2 rounded-lg transition-all duration-500 ease-in-out overflow-hidden max-h-96 opacity-100 min-w-[180px]"
                                            style={{
                                                transitionProperty: 'max-height, opacity',
                                            }}
                                        >
                                            {ordersSubmenu.map((sub) => (
                                                <li key={sub.name}>
                                                    <Link
                                                        to={sub.link}
                                                        className={`flex items-center gap-2 px-6 py-2 hover:bg-[#254D70]/20 hover:text-[#254D70] transition-colors duration-150 ${location.pathname === sub.link ? 'bg-[#254D70]/10 text-[#254D70] font-semibold' : 'text-gray-700'}`}
                                                        onClick={() => setopen(false)}
                                                    >
                                                        <ChevronRightIcon className="w-4 h-4 text-[#254D70]" />
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {/* Tooltip only on desktop and when collapsed */}
                                    {isDesktop && effectiveCollapsed && (
                                        <span
                                            className="fixed z-50 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                                            style={{
                                                left: '80px',
                                                top: `calc(${idx * 48 + 80}px)`,
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                    )}
                                </li>
                            );
                        }
                        // Hide Coupons menu for non-admins
                        if (item.name === 'Coupons' && !isAdmin) {
                            return null;
                        }
                        return (
                            <li key={item.name} className="relative group">
                                {item.submenu && item.name === 'Product' ? (
                                    <>
                                        <button
                                            type="button"
                                            className={`flex items-center w-full px-6 py-3 rounded-lg transition-all d_menu_item font-medium hover:bg-d_hover hover:shadow-lg ${location.pathname.startsWith(item.link) ? 'd_active' : 'text-dark'} ${effectiveCollapsed ? 'justify-center px-2' : ''}`}
                                            onClick={() => {
                                                if (effectiveCollapsed) {
                                                    setCollapsed(false);
                                                    setOpenSubmenu(idx);
                                                } else {
                                                    setOpenSubmenu(openSubmenu === idx ? null : idx);
                                                }
                                            }}
                                            aria-expanded={openSubmenu === idx}
                                        >
                                            <span className={`${!effectiveCollapsed ? 'mr-4' : ''} transition-all duration-300`}>{item.icon}</span>
                                            {!effectiveCollapsed && <span>{item.name}</span>}
                                            {!effectiveCollapsed && (
                                                <svg className={`ml-auto w-4 h-4 transition-transform duration-200 ${openSubmenu === idx ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </button>
                                        {/* Submenu, but hide 'Product Detail' */}
                                        {openSubmenu === idx && !effectiveCollapsed && (
                                            <ul
                                                className="ml-4 mt-1 bg-white shadow-xl border-l-4 border-[#254D70] py-2 rounded-lg transition-all duration-500 ease-in-out overflow-hidden max-h-96 opacity-100 min-w-[180px]"
                                                style={{
                                                    transitionProperty: 'max-height, opacity',
                                                }}
                                            >
                                                {item.submenu.filter(sub => sub.name !== 'Product Detail').map((sub) => (
                                                    <li key={sub.name}>
                                                        <Link
                                                            to={sub.link}
                                                            className={`flex items-center gap-2 px-6 py-2 hover:bg-[#254D70]/20 hover:text-[#254D70] transition-colors duration-150 ${location.pathname === sub.link ? 'bg-[#254D70]/10 text-[#254D70] font-semibold' : 'text-gray-700'}`}
                                                            onClick={() => setopen(false)}
                                                        >
                                                            <ChevronRightIcon className="w-4 h-4 text-[#254D70]" />
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : item.submenu ? (
                                    <>
                                        <button
                                            type="button"
                                            className={`flex items-center w-full px-6 py-3 rounded-lg transition-all d_menu_item font-medium hover:bg-d_hover hover:shadow-lg ${location.pathname.startsWith(item.link) ? 'd_active' : 'text-dark'} ${effectiveCollapsed ? 'justify-center px-2' : ''}`}
                                            onClick={() => {
                                                if (effectiveCollapsed) {
                                                    setCollapsed(false);
                                                    setOpenSubmenu(idx);
                                                } else {
                                                    setOpenSubmenu(openSubmenu === idx ? null : idx);
                                                }
                                            }}
                                            aria-expanded={openSubmenu === idx}
                                        >
                                            <span className={`${!effectiveCollapsed ? 'mr-4' : ''} transition-all duration-300`}>{item.icon}</span>
                                            {!effectiveCollapsed && <span>{item.name}</span>}
                                            {!effectiveCollapsed && (
                                                <svg className={`ml-auto w-4 h-4 transition-transform duration-200 ${openSubmenu === idx ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </button>
                                        {/* Submenu */}
                                        {openSubmenu === idx && !effectiveCollapsed && (
                                            <ul
                                                className="ml-4 mt-1 bg-white shadow-xl border-l-4 border-[#254D70] py-2 rounded-lg transition-all duration-500 ease-in-out overflow-hidden max-h-96 opacity-100 min-w-[180px]"
                                                style={{
                                                    transitionProperty: 'max-height, opacity',
                                                }}
                                            >
                                                {item.submenu.map((sub) => (
                                                    <li key={sub.name}>
                                                        <Link
                                                            to={sub.link}
                                                            className={`flex items-center gap-2 px-6 py-2 hover:bg-[#254D70]/20 hover:text-[#254D70] transition-colors duration-150 ${location.pathname === sub.link ? 'bg-[#254D70]/10 text-[#254D70] font-semibold' : 'text-gray-700'}`}
                                                            onClick={() => setopen(false)}
                                                        >
                                                            <ChevronRightIcon className="w-4 h-4 text-[#254D70]" />
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.link}
                                        className={`flex items-center px-6 py-3 rounded-lg transition-all d_menu_item font-medium hover:bg-d_hover hover:shadow-lg ${location.pathname === item.link ? 'd_active' : 'text-dark'} ${effectiveCollapsed ? 'justify-center px-2' : ''}`}
                                        onClick={() => setopen(false)}
                                        tabIndex={0}
                                        aria-label={item.name}
                                    >
                                        <span className={`${!effectiveCollapsed ? 'mr-4' : ''} transition-all duration-300`}>{item.icon}</span>
                                        {!effectiveCollapsed && <span>{item.name}</span>}
                                    </Link>
                                )}
                                {/* Tooltip only on desktop and when collapsed */}
                                {isDesktop && effectiveCollapsed && (
                                    <span
                                        className="fixed z-50 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                                        style={{
                                            left: '80px', // 20 * 4px (w-20)
                                            top: `calc(${idx * 48 + 80}px)`, // 48px per item, 80px for header, adjust as needed
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
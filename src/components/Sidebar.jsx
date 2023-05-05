import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/Layout.css';
import '../styles/Sidebar.css';
import { Box } from '@mui/material';

const sidebarNavItems = [
    {
        display: 'Outing',
        icon: <RestaurantMenuIcon />,
        to: '/outing',
        section: 'outing'
    },
    {
        display: 'Friends',
        icon: <GroupIcon />,
        to: '/friends',
        section: 'friends'
    },
    {
        display: 'Login',
        icon: <LoginIcon />,
        to: '/login',
        section: 'login'
    },
    {
        display: 'Register',
        icon: <LockOpenIcon />,
        to: '/register',
        section: 'register'
    },
    {
        display: 'Logout',
        icon: <LogoutIcon />,
        to: '/logout',
        section: 'logout'
    }
]

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();
    const indicatorRef = useRef();
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
            indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            setStepHeight(sidebarItem.clientHeight);
        }, 50);
    }, []);

    // change active index
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);

    // const handleLinkClick = (event,linkType) => {
    //     console.log('linkType : ',linkType);
    //     if( linkType==='logout' ){
    //         event.stopPropogation();
    //     }

    // }

    return <div className='sidebar'>
        <div className="sidebar__logo">
            Couple Yelp
        </div>
        <div ref={sidebarRef} className="sidebar__menu">
            <div
                ref={indicatorRef}
                className="sidebar__menu__indicator"
                style={{
                    transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                }}
            ></div>
            {
                sidebarNavItems.map((item, index) => (
                    <Link to={item.to} key={index} style={{
                        textDecoration: "none"
                    }}>
                        <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="sidebar__menu__item__icon">
                                {item.icon}
                            </div>
                            <Box className="sidebar__menu__item__text">
                                {item.display}
                            </Box>
                        </div>
                    </Link>
                ))

            }

        </div>
    </div>;
};

export default Sidebar;

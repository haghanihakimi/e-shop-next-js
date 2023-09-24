"use client";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import { getTheme } from "@/app/store/reducers/theme";
import Loading from "@/app/partials/Loading";
import Image from "next/image";
import ProfileOrdersPanel from '@/app/components/ProfileOrdersPanel/ProfileOrdersPanel'
import { RootState } from "@/app/store/store";
import ProfileSettingsPanel from "@/app/components/ProfileSettingsPanel/ProfileSettingsPanel";
import { ToastContainer } from 'react-toastify';
import { useCheckApis } from "@/app/store/actions/checkApi";
import 'react-toastify/dist/ReactToastify.css';
import { setProfile } from "@/app/store/reducers/profile";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3, pb: 3, pl: 1, pr: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `profile-tabs-${index}`,
        'aria-controls': `profile-tabs-${index}`,
    };
}


export default function Profile() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const profile = useSelector((state: RootState) => state.profile);
    const router = useRouter();
    const [screenSize, setScreenSize] = React.useState<number>(0);
    const [tabValue, setTabValue] = React.useState(0);
    const { checkUploadthingApi } = useCheckApis();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        dispatch(getTheme());
        const getScreenSize = () => {
            setScreenSize(window.innerWidth);
        }

        if (status === "authenticated") {
            getScreenSize();
            checkUploadthingApi();
            window.addEventListener('resize', getScreenSize, true)
        } else {
            router.push('/auth/login');
        }

        return () => {
            window.removeEventListener('resize', getScreenSize, true);
        }
    }, [screenSize, status])

    return (
        <main className="w-full relative h-auto pb-12">
            <Navigation />
            {
                status === "authenticated"
                    ?
                    <div className="w-full max-w-7xl flex flex-row justify-between gap-6 items-start mx-auto p-4">
                        {/* Profile summary container */}
                        {
                            screenSize > 948 ?
                                <div className="w-full max-w-[360px] sticky top-20 shrink-0 h-auto min-w-[300px] rounded bg-gray-50 p-2 border border-slate-200 shadow-md dark:border-slate-700 dark:bg-slate-800">
                                    {/* profile image container */}
                                    <div className="w-full flex items-center justify-center flex-col gap-2">
                                        {/* image box */}
                                        <div className="w-16 h-16 rounded-full mx-auto select-none">
                                            <Image
                                                src={profile?.image}
                                                width={200}
                                                height={200}
                                                className="w-full h-full rounded-full object-cover shadow-md border border-slate-200 dark:border-slate-600"
                                                alt={`${profile?.firstname} ${profile?.lastname}`} />
                                        </div>
                                        {/* fullname box */}
                                        <h2 className="text-center w-full py-2 border-b border-dashed border-slate-200 tracking-wide text-medium font-medium text-slate-700 dark:border-slate-700 dark:text-gray-200">
                                            {profile.firstname} {profile.lastname}
                                        </h2>
                                    </div>

                                    {/* Contact information summary container */}
                                    <div className="w-full p-2 tracking-wide">
                                        <h2 className="w-full text-left font-medium text-base text-slate-600 dark:text-gray-300">
                                            Contact Information
                                        </h2>
                                        <div className="w-full p-2 flex flex-col gap-4">
                                            <p className="w-full relative flex flex-col gap-0">
                                                <span className="text-base text-gray-500 dark:text-gray-400">
                                                    Email Address:
                                                </span>
                                                <span className="text-base text-gray-700 dark:text-gray-200">
                                                    {profile?.email}
                                                </span>
                                            </p>
                                            <p className="w-full relative flex flex-col gap-0">
                                                <span className="text-base text-gray-500 dark:text-gray-400">
                                                    Phone Number:
                                                </span>
                                                <span className="text-base text-gray-700 dark:text-gray-200">
                                                    {profile?.phone}
                                                </span>
                                            </p>
                                            <p className="w-full relative flex flex-col gap-0">
                                                <span className="text-base text-gray-500 dark:text-gray-400">
                                                    Residential Address:
                                                </span>
                                                <span className="text-base text-gray-700 dark:text-gray-200">
                                                    {profile?.street} {profile?.city},<br />
                                                    {profile?.state} {profile?.postcode}, {profile?.country}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }

                        {/* Activities & tabs container */}
                        <div className="w-full relative rounded">
                            {/* tabs container */}
                            <div className="w-full h-auto rounded-tl rounded-tr">
                                <Box>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: theme.theme === "dark" ? '#1e293b' : '#f3f4f6', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                                        <Tabs value={tabValue}
                                            onChange={handleTabChange}
                                            variant="scrollable"
                                            scrollButtons={false}
                                            allowScrollButtonsMobile
                                            aria-label="Profile Tabs"
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: "#3b82f6",
                                                    height: 3,
                                                    borderTopRightRadius: 720,
                                                    borderTopLeftRadius: 720,
                                                }
                                            }}>
                                            <Tab label="Orders" {...a11yProps(0)} sx={{
                                                "&.MuiButtonBase-root": {
                                                    color: theme.theme === 'light' ? '#1e293b' : '#EAEBE7',
                                                },
                                                "&.Mui-selected": {
                                                    color: "#3b82f6",
                                                },
                                                "&.MuiTabs-indicator": {
                                                    borderRadius: '720px !important',
                                                },
                                            }} />
                                            <Tab label="Settings" {...a11yProps(1)} sx={{
                                                "&.MuiButtonBase-root": {
                                                    color: theme.theme === 'light' ? '#1e293b' : '#EAEBE7',
                                                },
                                                "&.Mui-selected": {
                                                    color: "#3b82f6",
                                                },
                                                "&.MuiTabs-indicator": {
                                                    borderRadius: '720px !important',
                                                }
                                            }} />
                                        </Tabs>
                                    </Box>
                                    <CustomTabPanel value={tabValue} index={0}>
                                        <ProfileOrdersPanel />
                                    </CustomTabPanel>
                                    <CustomTabPanel value={tabValue} index={1}>
                                        <ProfileSettingsPanel theme={theme} />
                                    </CustomTabPanel>
                                </Box>
                            </div>
                        </div>
                    </div>
                    : ''
            }
            <ToastContainer
                position="bottom-left"
                autoClose={60000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme={theme.theme === "dark" ? "dark" : "light"}
                limit={6}
            />
        </main >
    )
}

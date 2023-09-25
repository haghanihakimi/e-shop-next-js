"use client";
import { RootState } from "@/app/store/store";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HiChevronRight as ArrowForwardIosSharpIcon } from "react-icons/hi2";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import "@/app/components/ProfileSettingsPanel/ProfileSettingsPanel.css";
import Loading from "@/app/partials/Loading";
import React, { useEffect } from "react";
import { useCountries } from "@/app/store/actions/countries";
import { useDispatch, useSelector } from "react-redux";
import { useProfile } from "@/app/store/actions/profile";
import { toast } from "react-toastify";
import { UploadDropzone } from "@/utils/uploadthing";
// import "@uploadthing/react/styles.css";
import { setProfile } from "@/app/store/reducers/profile";


const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface Props {
    theme: any;
}

interface ProfileData {
    firstname: any;
    lastname: any;
    email: any;
    phone: any;
    street: any;
    city: any;
    state: any;
    postcode: any;
    country: any;
    currentPassword: any;
    newPassword: any;
    confirmPassword: any;
    personalInfoSave: boolean;
    savingPersonalInfo: boolean;
    residentialInfoSave: boolean;
    savingResidentialInfo: boolean;
    passwordChangeSave: boolean;
    savingPassword: boolean;
}


export default function DropDownAttr({ theme }: Props) {
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [settingsAccordion, setSettingsAccordion] = React.useState<string | false>('panel1');
    const { getCountries } = useCountries();
    const [profileData, setProfileData] = React.useState<ProfileData>({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        personalInfoSave: false,
        savingPersonalInfo: false,
        residentialInfoSave: false,
        savingResidentialInfo: false,
        passwordChangeSave: false,
        savingPassword: false,
    });
    const countries = useSelector((state: RootState) => state.countries);
    const checkApi = useSelector((state: RootState) => state.checkApi);
    const profile = useSelector((state: RootState) => state.profile);
    const { savePersonalInfo, saveResidentialInfo, changePassword, updateImage } = useProfile();

    const profileAccordion =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setSettingsAccordion(newExpanded ? panel : false);
        };

    const checkPersonalInfo = () => {
        if ((profileData?.firstname.length > 0 && profileData?.firstname !== profile?.firstname) ||
            (profileData?.lastname.length > 0 && profileData?.lastname !== profile?.lastname) ||
            (profileData?.email.length > 0 && profileData?.email !== profile?.email) ||
            (profileData.phone && profileData?.phone.length > 0 && profileData?.phone !== profile?.phone)) {
            return true;
        } else {
            return false;
        }
    }

    const checkResidentialInfo = () => {
        if ((profileData.street && profileData?.street.length > 0 && profileData?.street !== profile?.street) ||
            (profileData.city && profileData?.city.length > 0 && profileData?.city !== profile?.city) ||
            (profileData.state && profileData?.state.length > 0 && profileData?.state !== profile?.state) ||
            (profileData.postcode && profileData?.postcode.length > 0 && profileData?.postcode !== profile?.postcode)) {
            return true;
        } else {
            return false;
        }
    }

    const checkValidPassword = () => {
        if (profileData?.currentPassword.length > 0 && profileData?.newPassword.length > 0 &&
            profileData?.confirmPassword.length > 0 && profileData?.newPassword === profileData?.confirmPassword) {
            return true;
        } else {
            return false;
        }
    }

    const updatePersonalInfo = () => {
        setProfileData((prev) => ({ ...prev, savingPersonalInfo: true }))
        savePersonalInfo({
            user: {
                firstname: profileData?.firstname,
                lastname: profileData?.lastname,
                email: profileData?.email,
                phone: profileData?.phone,
            }
        }).then(async () => {
            dispatch(setProfile({
                firstname: profileData?.firstname,
                lastname: profileData?.lastname,
                email: profileData?.email,
                phone: profileData?.phone,
            }));
            if(profileData?.email !== session?.user?.email) {
                const res = await signOut({ callbackUrl: `${pathname}` });
                toast.info("You will need to log in again!");
            }
        }).finally(() => {
            setProfileData((prev) => ({ ...prev, savingPersonalInfo: false }))
        });
    }

    const updateResidentialInfo = () => {
        setProfileData((prev) => ({
            ...prev,
            savingResidentialInfo: true
        }))
        saveResidentialInfo({
            user: {
                street: profileData?.street,
                city: profileData?.city,
                state: profileData?.state,
                postcode: profileData?.postcode,
            }
        }).then(async () => {
            dispatch(setProfile({
                street: profileData?.street,
                city: profileData?.city,
                state: profileData?.state,
                postcode: profileData?.postcode,
            }));
        }).finally(() => {
            setProfileData((prev) => ({ ...prev, savingResidentialInfo: false }))
        });
    }

    const updatePassword = () => {
        setProfileData((prev) => ({
            ...prev,
            savingPassword: true
        }))
        changePassword({
            user: {
                currentPassword: profileData?.currentPassword,
                newPassword: profileData?.confirmPassword,
            }
        }).then(() => {
            setProfileData((prev) => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        }).finally(() => {
            setProfileData((prev) => ({ ...prev, savingPassword: false }))
        });
    }

    const uploadImage = (image: string, imageKey: string) => {
        updateImage({
            user: {
                photo: image,
                imageKey: imageKey
            }
        }).then(() => {
            dispatch(setProfile({image: image}));
        });
    }

    useEffect(() => {
        getCountries()
        if (status === "authenticated") {
            setProfileData((prev) => ({
                ...prev,
                firstname: profile?.firstname,
                lastname: profile?.lastname,
                email: profile?.email,
                phone: profile?.phone,
                street: profile?.street,
                city: profile?.city,
                state: profile?.state,
                postcode: profile?.postcode,
                country: profile?.country,
            }))
        }
    }, [status, session]);

    return (
        <div className="w-full relative" id="profile_settings_accordion">
            <Accordion expanded={settingsAccordion === 'panel1'} onChange={profileAccordion('panel1')}
                sx={{ "&.MuiPaper-elevation": { backgroundColor: theme.theme === "light" ? '#f9fafb' : '#1e293b', border: `1px solid ${theme.theme === "light" ? '#cbd5e1' : '#334155'}` } }}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header"
                    sx={{ "svg": { fill: theme.theme === "light" ? '#334155' : '#d1d5db' } }}>
                    <h3 className="text-slate-700 dark:text-gray-300">
                        Name &amp; Contct Info
                    </h3>
                </AccordionSummary>
                <AccordionDetails>
                    <form className="w-full flex flex-col gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            updatePersonalInfo();
                        }
                        }>
                        {/* firstname container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="firstname"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                First Name
                            </label>
                            <input type="text"
                                id="firstname"
                                defaultValue={profileData.firstname}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, firstname: e.target.value }));
                                    checkPersonalInfo();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {/* surname container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="surname"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                Last Name
                            </label>
                            <input type="text"
                                id="surname"
                                defaultValue={profileData?.lastname}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, lastname: e.target.value }));
                                    checkPersonalInfo();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {/* email container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="email_address"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input type="text"
                                id="email_address"
                                defaultValue={profileData?.email}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, email: e.target.value }));
                                    checkPersonalInfo();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {/* Phone container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="phone_number"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <input type="text"
                                id="phone_number"
                                defaultValue={profileData?.phone}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, phone: e.target.value }));
                                    checkPersonalInfo();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {
                            checkApi.uploadthing ?
                                <div id="uploadthing" className="w-full relative flex flex-col gap-1">
                                    <label
                                        className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                        Profile Image
                                    </label>
                                    <UploadDropzone
                                        className="border-dashed border-gray-300 dark:border-slate-700"
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            uploadImage(res[0].url, res[0].key);
                                        }}
                                        onUploadError={(error: Error) => {
                                            toast.error(`ERROR! ${error.message}`);
                                        }}
                                        onUploadBegin={(name) => {
                                            toast.info(`Uploading image...`)
                                        }}
                                    />
                                </div>
                                : ''
                        }

                        {
                            checkPersonalInfo()
                                ?
                                <div className="w-full relative flex items-center justify-start animate-bounceBubbles">
                                    <button
                                        type="submit"
                                        disabled={profileData?.savingPersonalInfo}
                                        className={`px-4 py-2 flex flex-row justify-between items-center gap-1 rounded bg-blue-600 text-gray-200 ${profileData?.savingPersonalInfo ? 'opacity-50' : 'opacity-100'} transition duration-200 hover:bg-blue-700 dark:hover:bg-blue-500`}>
                                        <span>Save Changes</span>
                                        {
                                            profileData?.savingPersonalInfo
                                                ? <Loading color='text-black text-opacity-20 fill-white' width={4} height={4} />
                                                : ''
                                        }
                                    </button>
                                </div>
                                : ''
                        }
                    </form>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={settingsAccordion === 'panel2'} onChange={profileAccordion('panel2')}
                sx={{ "&.MuiPaper-elevation": { backgroundColor: theme.theme === "light" ? '#f9fafb' : '#1e293b', border: `1px solid ${theme.theme === "light" ? '#cbd5e1' : '#334155'}` } }}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header"
                    sx={{ "svg": { fill: theme.theme === "light" ? '#334155' : '#d1d5db' } }}>
                    <h3 className="text-slate-700 dark:text-gray-300">
                        Residential Address
                    </h3>
                </AccordionSummary>
                <AccordionDetails>
                    <form className="w-full flex flex-col gap-2"
                        onSubmit={e => { e.preventDefault(); updateResidentialInfo() }}>
                        {/* Street name container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="street"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                Street
                            </label>
                            <input type="text"
                                id="street"
                                defaultValue={profileData.street}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, street: e.target.value }));
                                    checkResidentialInfo();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {/* City name container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="city"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                City
                            </label>
                            <input type="text"
                                id="city"
                                defaultValue={profileData.city}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, city: e.target.value }));
                                    checkResidentialInfo();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {/* City name container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="state"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                State
                            </label>
                            <div className="w-full max-w-xs flex flex-row items-center justify-between gap-1">
                                <select
                                    id="state"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setProfileData((prev) => ({ ...prev, state: e.target.value })) }}
                                    value={profileData?.state}
                                    className="w-full max-w-[230px] cursor-pointer shrink-0 rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600">
                                    {
                                        countries.countries && countries.countries.length > 0
                                            ?
                                            countries.countries.map((country, i) => {
                                                if (country.country === 'Australia') {
                                                    return JSON.parse(country.states).map((state: any, j: any) => {
                                                        return <option value={state} key={j} defaultValue={state === session?.user?.state ? session?.user?.state : country.states[0]}>{state}</option>
                                                    })
                                                }
                                            })
                                            : ''
                                    }
                                </select>
                                <input type="text"
                                    defaultValue={profileData.postcode}
                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setProfileData((prev) => ({ ...prev, postcode: e.target.value }));
                                        checkResidentialInfo();
                                    }}
                                    className="w-full max-w-[80px] rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                            </div>
                        </div>
                        {
                            checkResidentialInfo()
                                ?
                                <div className="w-full relative flex items-center justify-start animate-bounceBubbles">
                                    <button
                                        type="submit"
                                        disabled={profileData?.savingResidentialInfo}
                                        className={`px-4 py-2 flex flex-row justify-between items-center gap-1 rounded bg-blue-600 text-gray-200 ${profileData?.savingResidentialInfo ? 'opacity-50' : 'opacity-100'} transition duration-200 hover:bg-blue-700 dark:hover:bg-blue-500`}>
                                        <span>Save Changes</span>
                                        {
                                            profileData?.savingResidentialInfo
                                                ? <Loading color='text-black text-opacity-20 fill-white' width={4} height={4} />
                                                : ''
                                        }
                                    </button>
                                </div>
                                : ''
                        }
                    </form>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={settingsAccordion === 'panel3'} onChange={profileAccordion('panel3')}
                sx={{ "&.MuiPaper-elevation": { backgroundColor: theme.theme === "light" ? '#f9fafb' : '#1e293b', border: `1px solid ${theme.theme === "light" ? '#cbd5e1' : '#334155'}` } }}>
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header"
                    sx={{ "svg": { fill: theme.theme === "light" ? '#334155' : '#d1d5db' } }}>
                    <h3 className="text-slate-700 dark:text-gray-300">
                        Password
                    </h3>
                </AccordionSummary>
                <AccordionDetails>
                    <form className="w-full flex flex-col gap-2"
                        onSubmit={e => { e.preventDefault(); updatePassword() }}>
                        {/* Current password container */}
                        <div className="w-full relative flex flex-col gap-1">
                            {/*  */}
                            <label htmlFor="current_password"
                                className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                Current Password
                            </label>
                            <input type="password"
                                id="current_password"
                                autoComplete="false"
                                defaultValue={profileData.currentPassword}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProfileData((prev) => ({ ...prev, currentPassword: e.target.value }));
                                    checkValidPassword();
                                }}
                                className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                        </div>
                        {/* New Password container */}
                        {
                            profileData?.currentPassword.length >= 3
                                ? <div className="w-full relative flex flex-col gap-1 animate-bounceBubbles">
                                    {/*  */}
                                    <label htmlFor="newPassword"
                                        className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                        New Password
                                    </label>
                                    <input type="password"
                                        id="newPassword"
                                        autoComplete="false"
                                        defaultValue={profileData.newPassword}
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setProfileData((prev) => ({ ...prev, newPassword: e.target.value }));
                                            checkValidPassword();
                                        }}
                                        className="w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600" />
                                </div>
                                : ''
                        }
                        {/* Confirm Password container */}
                        {
                            profileData?.currentPassword.length > 0 && profileData?.newPassword.length > 0
                                ? <div className="w-full relative flex flex-col gap-1 animate-bounceBubbles">
                                    {/*  */}
                                    <label htmlFor="confirmPassword"
                                        className="w-full text-md tracking-wide font-medium text-slate-700 dark:text-gray-300">
                                        Confirm Password
                                    </label>
                                    <input type="password"
                                        id="confirmPassword"
                                        autoComplete="false"
                                        defaultValue={profileData.confirmPassword}
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setProfileData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                                            checkValidPassword();
                                        }}
                                        className={`w-full max-w-xs rounded text-gray-700 bg-white border border-slate-200 shadow-md transition duration-200 ring-4 ring-transparent focus:ring-2 ${profileData?.newPassword === profileData?.confirmPassword ? 'focus:ring-blue-500' : 'focus:ring-red-500'} dark:text-gray-300 dark:bg-slate-700 dark:border-gray-600`} />
                                    {
                                        profileData?.newPassword === profileData?.confirmPassword ? ''
                                            : <strong className="text-md text-red-500 px-1 py-2">
                                                New password and confirm password do not match!
                                            </strong>
                                    }
                                </div>
                                : ''
                        }
                        {
                            checkValidPassword()
                                ?
                                <div className="w-full relative flex items-center justify-start animate-bounceBubbles">
                                    <button
                                        type="submit"
                                        disabled={profileData?.savingPassword}
                                        className={`px-4 py-2 flex flex-row justify-between items-center gap-1 rounded bg-blue-600 text-gray-200 ${profileData?.savingPassword ? 'opacity-50' : 'opacity-100'} transition duration-200 hover:bg-blue-700 dark:hover:bg-blue-500`}>
                                        <span>Save Changes</span>
                                        {
                                            profileData?.savingPassword
                                                ? <Loading color='text-black text-opacity-20 fill-white' width={4} height={4} />
                                                : ''
                                        }
                                    </button>
                                </div>
                                : ''
                        }
                    </form>
                </AccordionDetails>
            </Accordion>
        </div >
    )
}

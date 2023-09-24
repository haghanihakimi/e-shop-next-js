import React, { useRef, useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import SingleProductDescriptionTab from '@/app/components/SingleProductDescriptionTab/SingleProductDescriptionTab';
import SingleProductSpecificationsTab from "@/app/components/SingleProductSpecificationsTab/SingleProductSpecifications";

interface Props {
    singleProduct: any;
}

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
            id={`single-product-tabpanel-${index}`}
            aria-labelledby={`single-product-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3,pb: 3, pl: 1, pr: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `single-product-tab-${index}`,
        'aria-controls': `single-product-tabpanel-${index}`,
    };
}


const SingleProductTabs: React.FC<Props> = ({ singleProduct }) => {
    const theme = useSelector((state: RootState) => state.theme);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
    }, [])

    return (
        <div className="w-full relative">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="Single product tabs"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "#2563eb"
                            }
                        }}>
                        <Tab label="Description" {...a11yProps(0)} sx={{
                            "&.MuiButtonBase-root": {
                                color: theme.theme === 'light' ? '#1e293b' : '#EAEBE7',
                            },
                            "&.Mui-selected": {
                                color: "#2563eb",
                            },
                            "&.MuiTabs-indicator": {
                                borderRadius: '720px !important',
                            }
                        }} />
                        <Tab label="Specifications" {...a11yProps(1)} sx={{
                            "&.MuiButtonBase-root": {
                                color: theme.theme === 'light' ? '#1e293b' : '#EAEBE7',
                            },
                            "&.Mui-selected": {
                                color: "#2563eb",
                            },
                            "&.MuiTabs-indicator": {
                                borderRadius: '720px !important',
                            }
                        }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <SingleProductDescriptionTab singleProduct={singleProduct}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <SingleProductSpecificationsTab singleProduct={singleProduct} />
                </CustomTabPanel>
            </Box>
        </div>
    );
}

export default SingleProductTabs;
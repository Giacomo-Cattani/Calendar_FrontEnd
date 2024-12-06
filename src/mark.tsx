import React, { useEffect } from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import axios from "axios";
import { setMarks } from "./redux/markSlice";
import { SortableTable } from './table';

export function UnderlineTabs() {
    const marks = useSelector((state: RootState) => state.marks.marks);
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = React.useState("1anno");
    const data = [
        {
            label: "1° Anno",
            value: "1anno",
            markTab: Array.isArray(marks[0]?.PRI) ? marks[0].PRI : [],
        },
        {
            label: "2° Anno",
            value: "2anno",
            markTab: Array.isArray(marks[1]?.SEC) ? marks[1].SEC : [],
        },
    ];

    useEffect(() => {

        // Save email and hashed password in session storage
        const email = localStorage.getItem('email');
        const hashedPassword = localStorage.getItem('hashedPassword');

        // Fetch events from the server or any other source
        const fetchMarks = async () => {
            try {
                const response2 = await axios.post(
                    `${import.meta.env.VITE_URL}/marks`,
                    {
                        "data": {
                            user: email,
                            pwd: hashedPassword
                        }
                    },
                    {
                        headers: { 'Access-Control-Allow-Origin': '*' },
                    }
                );

                // Map response data to Event structure
                const marksData = Array.isArray(response2.data) ? response2.data : [response2.data];
                const formattedMark = marksData[0].marks;

                dispatch(setMarks([]));
                // Dispatch events to the Redux store
                dispatch(setMarks(formattedMark));
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchMarks();
    }, [dispatch]);


    return (
        <div style={{ paddingTop: '1.5rem', marginRight: '1rem', marginLeft: '1rem' }}>
            <Tabs value={activeTab}>
                <TabsHeader
                    className="bg-transparent"
                    indicatorProps={{
                        className: "bg-gray-900/15 shadow-none !text-gray-900",
                    }}
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    {data.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                            className={activeTab === value ? "text-gray-900" : ""}
                            placeholder=""
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody
                    animate={{
                        initial: { y: 250 },
                        mount: { y: 0 },
                        unmount: { y: 250 },
                    }}
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    {data.map(({ value, markTab }) => {
                        return (
                            <TabPanel key={value} value={value}>
                                <div>
                                    {/* <pre>{JSON.stringify(markTab, null, 2)}</pre> */}
                                    <SortableTable marks={markTab} />
                                </div>
                            </TabPanel>
                        );
                    })}
                </TabsBody>
            </Tabs>
        </div>
    );
}
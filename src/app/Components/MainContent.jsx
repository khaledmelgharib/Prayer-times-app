"use client";
import React from "react";
import Prayer from "../Components/Prayer"
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import { useState, useEffect } from "react";




function MainContent() {

    // states
    const[selectdCity,setSelectdCity]= useState("المنصورة")

    const[timings, setTimings] = useState({
        
        "Fajr": "02:54",
        "Dhuhr": "10:12",
        "Asr": "13:36",
        "Maghrib": "15:59",
        "Isha": "17:23",
        })

        const avilableCities =[
            {
                displayNam:"القاهرة",
                apiName:"Cairo",
            },
            {
                displayNam:"المنصوة",
                apiName:"Mansoura",
            },
            {
                displayNam:"بلقاس",
                apiName:"Belqas",
            },
        ]
        

    const getTiming = async() => {
    const response = await axios.get("https://api.aladhan.com/v1/timingsByCity/10-03-2025?city=egypt&country=EGY&state=cairo&method=3&shafaq=general&tune=5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6&timezonestring=UTC&calendarMethod=UAQ")
    setTimings(response.data.data.timings)
    }
    useEffect(() => {
        getTiming()
    }, [])

    const handleChange = (event) => {
        const cityObject = avilableCities.find((city) => {
            return(
                city.apiName == event.target.value
            )
        })
        setSelectdCity( cityObject)
    };
    return (
        <>
        {/* TOP ROW */}
            <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ textAlign:"center"}}>
                <Grid item xs={12} md={6}>
                    <div>
                        <h2 style={{fontSize:"1.2rem"}}>9 مارس 2025 |11:28</h2>
                        <h1 style={{fontSize:"2rem"}}>{selectdCity.displayNam}</h1> 
                    </div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <div>
                        <h2 style={{fontSize:"1.2rem"}}>متبقي حتي صلاه الظهر</h2>
                        <h1 style={{fontSize:"2rem"}}>1:12:35</h1>
                    </div>
                </Grid>
            </Grid>
        {/* === TOP ROW === */}

        <Divider style={{borderColor:"purple", opacity:"0.2"}}/>

        {/* PRAYERS CARDS */}
        <Stack
            style={{marginTop:"30px"}}
            justifyContent="space-around"
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
        >
            <Prayer 
            name="الفجر"
            time={timings.Fajr}
            image="https://img.pikbest.com/element_our/20230301/bg/63787f90560a3.png!sw800"/>

            <Prayer 
            name="الظهر"
            time={timings.Dhuhr}
            image="https://png.pngtree.com/png-vector/20200507/ourmid/pngtree-man-rising-his-hands-for-praying-in-the-mosque-with-desert-png-image_2199896.jpg"/>

            <Prayer 
            name="العصر"
            time={timings.Asr}
            image="https://cdn.al-ain.com/images/2021/4/08/78-103202-dubai-coronavirus-mosque-pray_700x400.jpg"/>

            <Prayer 
            name="المغرب"
            time={timings.Maghrib}
            image="https://i.pinimg.com/736x/d1/bf/48/d1bf485045fc2ba77a3c2cfb50e0ce59.jpg"/>

            <Prayer 
            name="العشاء"
            time={timings.Isha}
            image="https://png.pngtree.com/png-clipart/20200414/ourmid/pngtree-ramadan-prayer-cartoon-illustration-png-image_2183158.jpg"/>

        </Stack>
        {/* === PRAYERS CARDS === */}
        
        {/* SELECT CITY */}
        <Stack direction="row" justifyContent="center" style={{marginTop:"25px"}}>
            <FormControl  style={{width:"100%", maxWidth:"300px", border:"2px solid white", outline:"none"}}>
                <InputLabel  id="demo-simple-select-label">المدينة</InputLabel>
                <Select 
                    style={{color:"white"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleChange}
                >
                    {avilableCities.map((city) => {
                        return(
                            <MenuItem
                            key={city.apiName}
                            value={city.apiName}>
                            {city.displayNam}
                            </MenuItem>
                        )
                    }) }
                </Select>
            </FormControl>
        </Stack>
        </>
    );
}

export default MainContent;
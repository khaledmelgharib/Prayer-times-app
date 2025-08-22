"use client";
import React, { useState, useEffect } from "react";
import Prayer from "../Components/Prayer";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from "axios";

function MainContent() {
    const [selectedCity, setSelectedCity] = useState({
        displayName: "المنصورة",
        apiName: "Mansoura"
    });

    const [timings, setTimings] = useState({
        "Fajr": "02:54",
        "Dhuhr": "10:12",
        "Asr": "13:36",
        "Maghrib": "15:59",
        "Isha": "17:23",
    });

    const [currentDate, setCurrentDate] = useState(null);

    const availableCities = [
        { displayName: "القاهرة", apiName: "Cairo" },
        { displayName: "المنصورة", apiName: "Mansoura" },
        { displayName: "بلقاس", apiName: "Belqas" },
    ];

    const getTiming = async (city = selectedCity) => {
        try {
            const today = new Date();
            const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            const response = await axios.get(
                `https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${city.apiName}&country=EGY&method=3`
            );
            setTimings(response.data.data.timings);
        } catch (error) {
            console.error("Error fetching prayer times:", error);
        }
    };

    useEffect(() => {
        getTiming(selectedCity);
    }, [selectedCity]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (event) => {
        const cityObject = availableCities.find(city =>
            city.apiName === event.target.value
        );
        if (cityObject) {
            setSelectedCity(cityObject);
        }
    };

    // تحويل الأرقام العربية إلى إنجليزية
    const toEnglishNumbers = (str) => str.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

    // حساب الوقت المتبقي حتى الصلاة القادمة (مثال: الظهر)
    const calculateTimeRemaining = () => {
        if (!currentDate || !timings.Dhuhr) return "";

        // توقيت الصلاة القادمة (الظهر)
        const [hour, minute] = timings.Dhuhr.split(":").map(Number);
        const nextPrayer = new Date(currentDate);
        nextPrayer.setHours(hour, minute, 0, 0);

        // إذا فات وقت الظهر اليوم، اجعلها للغد
        if (nextPrayer < currentDate) {
            nextPrayer.setDate(nextPrayer.getDate() + 1);
        }

        const diffMs = nextPrayer - currentDate;
        const diffSec = Math.floor(diffMs / 1000);

        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;

        // عرض بالأرقام الإنجليزية
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // عرض التوقيتات بالأرقام الإنجليزية
    const timingsEnglish = Object.fromEntries(
        Object.entries(timings).map(([key, value]) => [key, toEnglishNumbers(value)])
    );

    // ترتيب الصلوات حسب اليوم
    const prayersOrder = [
        { key: "Fajr", name: "الفجر" },
        { key: "Dhuhr", name: "الظهر" },
        { key: "Asr", name: "العصر" },
        { key: "Maghrib", name: "المغرب" },
        { key: "Isha", name: "العشاء" },
    ];

    // دالة تحديد الصلاة القادمة واسمها والوقت المتبقي لها
    const getNextPrayer = () => {
        if (!currentDate) return { name: "", time: "" };

        for (let i = 0; i < prayersOrder.length; i++) {
            const { key, name } = prayersOrder[i];
            const [hour, minute] = timingsEnglish[key].split(":").map(Number);
            const prayerTime = new Date(currentDate);
            prayerTime.setHours(hour, minute, 0, 0);

            if (currentDate < prayerTime) {
                // حساب الوقت المتبقي
                const diffMs = prayerTime - currentDate;
                const diffSec = Math.floor(diffMs / 1000);
                const h = Math.floor(diffSec / 3600);
                const m = Math.floor((diffSec % 3600) / 60);
                const s = diffSec % 60;
                const timeLeft = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
                return { name, time: timeLeft };
            }
        }
        // إذا انتهت كل الصلوات اليوم، الصلاة القادمة الفجر غدًا
        const { key, name } = prayersOrder[0];
        const [hour, minute] = timingsEnglish[key].split(":").map(Number);
        const prayerTime = new Date(currentDate);
        prayerTime.setDate(prayerTime.getDate() + 1);
        prayerTime.setHours(hour, minute, 0, 0);
        const diffMs = prayerTime - currentDate;
        const diffSec = Math.floor(diffMs / 1000);
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;
        const timeLeft = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return { name, time: timeLeft };
    };

    const nextPrayer = getNextPrayer();

    return (
        <>
            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ textAlign: "center" }}>
                <Grid item xs={12} md={6}>
                    <div>
                        <h2 style={{ fontSize: "1.2rem" }}>
                            {currentDate
                                ? `${currentDate.toLocaleDateString('en-US')} | ${currentDate.toLocaleTimeString('en-US')}`
                                : ""}
                        </h2>
                        <h1 style={{ fontSize: "2rem" }}>{selectedCity.displayName}</h1>
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div>
                        <h2 style={{ fontSize: "1.2rem" }}>
                            متبقي حتى صلاة {nextPrayer.name}
                        </h2>
                        <h1 style={{ fontSize: "2rem" }}>{nextPrayer.time}</h1>
                    </div>
                </Grid>
            </Grid>
        {/* === TOP ROW === */}

            <Divider sx={{ borderColor: "purple", opacity: 0.2 }} />

            <Stack
                sx={{ marginTop: "30px" }}
                justifyContent="space-around"
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
            >
                <Prayer name="الفجر" time={timingsEnglish.Fajr} image="https://img.pikbest.com/element_our/20230301/bg/63787f90560a3.png!sw800" />
                <Prayer name="الظهر" time={timingsEnglish.Dhuhr} image="https://png.pngtree.com/png-vector/20200507/ourmid/pngtree-man-rising-his-hands-for-praying-in-the-mosque-with-desert-png-image_2199896.jpg" />
                <Prayer name="العصر" time={timingsEnglish.Asr} image="https://cdn.al-ain.com/images/2021/4/08/78-103202-dubai-coronavirus-mosque-pray_700x400.jpg" />
                <Prayer name="المغرب" time={timingsEnglish.Maghrib} image="https://i.pinimg.com/736x/d1/bf/48/d1bf485045fc2ba77a3c2cfb50e0ce59.jpg" />
                <Prayer name="العشاء" time={timingsEnglish.Isha} image="https://png.pngtree.com/png-clipart/20200414/ourmid/pngtree-ramadan-prayer-cartoon-illustration-png-image_2183158.jpg" />
            </Stack>

            <Stack direction="row" justifyContent="center" sx={{ marginTop: "25px" }}>
                <FormControl sx={{  width: "100%", maxWidth: "300px", color: "white", }}>
                    <InputLabel  id="city-select-label">المدينة</InputLabel>
                    <Select
                        sx={{ color: "white" }}
                        labelId="city-select-label"
                        id="city-select"
                        value={selectedCity.apiName}
                        onChange={handleChange}
                        label="المدينة"
                    >
                        {availableCities.map((city) => (
                            <MenuItem key={city.apiName} value={city.apiName}>
                                {city.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </>
    );
}

export default MainContent;
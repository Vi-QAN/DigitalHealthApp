import { useEffect, createContext, useState, useContext, useRef } from "react";
import { getDataRange, getLatestWearableData } from "../utils/fileHandler";

const ChartDataContext = createContext();

function useChartDataContext () {
    const sampleData = useRef(null);
    const [ bloodPressureData, setBloodPressureData ] = useState([]);
    const [ oxygenLevelData, setOxygenLevelData ] = useState([]);
    const [ heartbeatData, setHeartbeatData ] = useState([]);
    const filterMode = useRef('Daily');
    const [ onLoad, setOnLoad ] = useState(false);
    
    const subtractDays = (date, days) => {
        var result = new Date(date); 
        result.setDate(result.getDate() - days);
        return result;
    }

    const subtractMonths = (date, months) => {
        var result = new Date(date); 
        result.setMonth(result.getMonth() - months);
        return result;
    }

    const mapData = (filteredData, currentFilterMode) => {
        const bpData = filteredData.map((item, index) => { 
            const date = new Date(item.datetime);
            return {     
                label: currentFilterMode === 'Daily' ? date.toLocaleTimeString() : date.toLocaleDateString(),
                value: item.blood_pressure, 
                datetime: item.datetime }
        })
        const olData = filteredData.map((item, index) => { 
            return {  value: item.oxygen_level, datetime: item.datetime }
        })
        const hbData = filteredData.map((item, index) => {
            const date = new Date(item.datetime);
            return { 
                label: currentFilterMode === 'Daily' ? date.toLocaleTimeString() : date.toLocaleDateString(),
                value: item.oxygen_level, 
                datetime: item.datetime }
        })
        return { bpData, olData, hbData }
    }

    const handleChangeFilter = async (filter) => {
        setOnLoad(true);
        const endDate = new Date();
        let startDate;
        switch(filter){
            case 'Daily':
                startDate = subtractDays(endDate, 1);
                break;
            case 'Weekly':
                startDate = subtractDays(endDate, 7);
                break;
            case 'Monthly':
                startDate = subtractMonths(endDate, 1);
                break;
            case 'Yearly':
                startDate = subtractMonths(endDate, 12);
                break;
            default:
                break;
        }
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        const res = await getDataRange(formattedStartDate,formattedEndDate );
        const {bpData, olData, hbData } = mapData(res, filter);

        setBloodPressureData(bpData);
        setOxygenLevelData(olData);
        setHeartbeatData(hbData);
        filterMode.current = filter;
        sampleData.current = res; 
        setOnLoad(false);
    }

    const formatDate = (date) => {
        const pad = (num) => (num < 10 ? '0' : '') + num;

        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        // Format the time in "HH:MM:SS" format
        const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

        return formattedDate + ' ' + formattedTime;
    }

    const loadInitialChartData = async () => {
        setOnLoad(true);
        const endDate = new Date();
        const startDate = subtractDays(endDate, 1);
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        const res = await getDataRange(formattedStartDate,formattedEndDate );

        const {bpData, olData, hbData } = mapData(res, filterMode.current);

        setBloodPressureData(bpData);
        setOxygenLevelData(olData);
        setHeartbeatData(hbData);
        sampleData.current = res;
        setOnLoad(false);
    }

    const loadLastestChartData = async () => {
        if (onLoad) return;
        const res = await getLatestWearableData();
        const {bpData, olData, hbData} = mapData([res], filterMode.current);
        setBloodPressureData(data => [...data, ...bpData]);
        setOxygenLevelData(data => [...data, ...olData]);
        setHeartbeatData(data => [...data, ...hbData]);
        sampleData.current = [ ...sampleData.current, res];
        console.log(bpData)
    } 

    useEffect(() => {
        const intervalId = setInterval(loadLastestChartData, 60000)
        loadInitialChartData();
        return () => {
            clearInterval(intervalId);
        }
    },[])

    useEffect(() => {

    },[filterMode, sampleData, bloodPressureData, oxygenLevelData, heartbeatData])

    return {
        sampleData,
        bloodPressureData,
        oxygenLevelData,
        heartbeatData,
        filterMode,
        handleChangeFilter,
        formatDate
    }
}

function ChartDataProvider({children}) {
    const context = useChartDataContext();

    return <ChartDataContext.Provider value={context}>{children}</ChartDataContext.Provider>;
}

function ChartDataConsumer(){
    return useContext(ChartDataContext);
}

export { ChartDataProvider, ChartDataConsumer }
import { useEffect, createContext, useState, useContext } from "react";
import sampleData from '../data/sample_data.json'

const ChartDataContext = createContext();

function useChartDataContext () {
    const [ bloodPressureData, setBloodPressureData ] = useState([]);
    const [ oxygenLevelData, setOxygenLevelData ] = useState([]);
    const [ heartbeatData, setHeartbeatData ] = useState([]);
    const [ filterMode, setFilterMode ] = useState('day');

    const subtractHours = (date, hours) => {
        date.setHours(date.getHours() - hours);
        return date;
    }

    const subtractDays = (date, days) => {
        date.setDate(date.getDate() - days);
        return date;
    }

    useEffect(() => {
        const hourFilter = subtractHours(new Date(), 20);
        const dayFilter = subtractDays(new Date(), 10);
        const filteredData = filterMode === 'day' ? sampleData.filter(item => new Date(item.datetime) > dayFilter) : sampleData.filter(item => new Date(item.datetime) > hourFilter);

        const bpData = filteredData.map((item, index) => { 
            return { value: item.blood_pressure, datetime: item.datetime }
        })
        const olData = filteredData.map((item, index) => { 
            return {  value: item.oxygen_level, datetime: item.datetime }
        })
        const hbData = filteredData.map((item, index) => {
            return { value: item.oxygen_level, datetime: item.datetime }
        })
        setBloodPressureData(bpData);
        setOxygenLevelData(olData);
        setHeartbeatData(hbData);
    },[])

    return {
        bloodPressureData,
        oxygenLevelData,
        heartbeatData,
        filterMode
    }
}

function ChartDataProvider({children}) {
    const context = useChartDataContext();
  
    // React.useEffect(() => {
    //     console.log('Auth state changed:', auth.authed);
    //     return () => {
    //     console.log('AuthProvider unmounted');
    //     };
    // }, []);

    return <ChartDataContext.Provider value={context}>{children}</ChartDataContext.Provider>;
}

function ChartDataConsumer(){
    return useContext(ChartDataContext);
}

export { ChartDataProvider, ChartDataConsumer }
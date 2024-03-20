import { useEffect, createContext, useState, useContext } from "react";
import sampleData from '../data/sample_data.json'

const ChartDataContext = createContext();

function useChartDataContext () {
    const [ bloodPressureData, setBloodPressureData ] = useState([]);
    const [ oxygenLevelData, setOxygenLevelData ] = useState([]);
    const [ heartbeatData, setHeartbeatData ] = useState([]);
    const [ filterMode, setFilterMode ] = useState('Daily');

    const subtractDays = (date, days) => {
        date.setDate(date.getDate() - days);
        return date;
    }

    const subtractMonths = (date, months) => {
        date.setMonth(date.getMonth() - months);
        return date;
    }

    const filterData = (date) => {
        return sampleData.filter(item => new Date(item.datetime) > date);
    }

    const mapData = (filteredData) => {
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
    }

    const handleChangeFilter = (filter) => {
        const currentDateTime = new Date();
        let date;

        switch(filter){
            case 'Daily':
                date = subtractDays(currentDateTime, 1);
                break;
            case 'Weekly':
                date = subtractDays(currentDateTime, 7);
                break;
            case 'Monthly':
                date = subtractMonths(currentDateTime, 1);
                break;
            case 'Yearly':
                date = subtractMonths(currentDateTime, 12);
                break;
            default:
                break;
        }

        const filteredData = filterData(date);
        mapData(filteredData);
        setFilterMode(filter); 
    }

    useEffect(() => {
        handleChangeFilter(filterMode);
    },[])

    return {
        sampleData,
        bloodPressureData,
        oxygenLevelData,
        heartbeatData,
        filterMode,
        handleChangeFilter
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
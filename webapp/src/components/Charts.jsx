import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  } from "chart.js";
import Slider from "@mui/material/Slider";
  
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Container, Modal } from 'react-bootstrap';
import sampleData from '../data/sample_data.json'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

const ColorMapping = {
  'High': 'rgba(255, 99, 132, 0.2)',
  'Normal': 'rgba(75, 192, 192, 0.2)',
  'Low': 'rgba(255, 159, 64, 0.2)'
}

const BorderColorMapping = {
  'rgba(255, 99, 132, 0.2)' : 'rgba(255, 99, 132, 1)',
  'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 1)',
  'rgba(255, 159, 64, 0.2)' : 'rgba(255, 159, 64, 1)'
}

const AreaChart = ({data, labels}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart"
      }
    },
    scales: {
        x: {
            min: 0,
            max: 9
        }
    }
};


  const [opt, setOpt] = useState(options);
  const [value, setValue] = useState(0);

  const clickBar = (att) => {};
  const noOfColumnToDisplay = 10;
  const noOfColumnToScroll = 2;
  const labelsLength = labels.length;

  const noOfMaxForSlider = Math.ceil(
    (labelsLength - noOfColumnToDisplay) / noOfColumnToScroll
  );
  const clickScroll = (event, newValue) => {
  const newOpt = JSON.parse(JSON.stringify(opt));
  let minVal = opt.scales.x.min;
  let maxVal = opt.scales.x.max;
  if (value !== newValue) {
    if (labelsLength - minVal >= noOfColumnToDisplay) {
      let newMin = noOfColumnToScroll * newValue;
      newOpt.scales.x.min = newMin;
      newOpt.scales.x.max = newMin + (noOfColumnToDisplay - 1);
      setOpt(newOpt);
      setValue(newValue);
    } else if (maxVal === labelsLength) {
      console.log(maxVal, labelsLength);
      let newMin = noOfColumnToScroll * newValue;
      newOpt.scales.x.min = newMin;
      newOpt.scales.x.max = newMin + (noOfColumnToDisplay - 1);
      setOpt(newOpt);
      setValue(newValue);
    }
  }
};
  return (
    <Container>
      <Line 
        options={opt} 
        data={{
          labels: labels,
          datasets: [
            {
              fill: true,
              data: data,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
          ]
        }} />
      <Container>
          <Slider
          value={value}
          onChange={clickScroll}
          step={1}
          // marks
          min={0}
          max={noOfMaxForSlider}
          />
      </Container>
    </Container>
  )

}

const PieChart = ({data}) => {
  const [ chartData, setChartData] = useState(null)

  useEffect(() => {
    const noOfLow = data.filter(item => item.value < 90 ).length;
    const noOfHigh = data.filter(item => item.value > 100).length;
    const noOfNormal = data.length - noOfLow - noOfHigh;
    const lowDays = Math.ceil((noOfLow / data.length) * 100);
    const highDays = Math.ceil((noOfHigh / data.length) * 100);
    const normalDays = Math.ceil((noOfNormal / data.length) * 100);
    
    const bgColorList = [
      ColorMapping['Low'],
      ColorMapping['High'],
      ColorMapping['Normal']
    ]
    
    const borderColorList = bgColorList.map(item => BorderColorMapping[item])

    const customizedtData = {
      labels: ['Low Days < 90', 'High Days > 100', 'Normal'],
      datasets: [
        {
          label: '# of Votes',
          data: [noOfLow, noOfHigh, noOfNormal],
          backgroundColor: bgColorList,
          borderColor: borderColorList,
          borderWidth: 1,
        },
      ],
    };
    console.log(noOfNormal, noOfLow, noOfHigh)
    setChartData(customizedtData)
  },[])
  return chartData && (
    <Container className='d-flex justify-content-center'>
      <Doughnut data={chartData} />
    </Container>
    );
}

const BarChart = ({data, labels}) => {
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Chart.js Bar Chart"
          }
        },
        scales: {
            x: {
                min: 0,
                max: 9
            }
        }
    };

  const [opt, setOpt] = useState(options);
  const [value, setValue] = useState(0);
  const [ backgroundColors, setBackgroundColors ] = useState([]);
  const [ borderColors, setBorderColors ] = useState([]);

  const clickBar = (att) => {};
  const noOfColumnToDisplay = 10;
  const noOfColumnToScroll = 2;
  const labelsLength = labels.length;

  const noOfMaxForSlider = Math.ceil(
    (labelsLength - noOfColumnToDisplay) / noOfColumnToScroll
  );
  const clickScroll = (event, newValue) => {
    const newOpt = JSON.parse(JSON.stringify(opt));
    let minVal = opt.scales.x.min;
    let maxVal = opt.scales.x.max;
    if (value !== newValue) {
      console.log(newValue, minVal, maxVal, labelsLength);

      if (labelsLength - minVal >= noOfColumnToDisplay) {
        let newMin = noOfColumnToScroll * newValue;
        newOpt.scales.x.min = newMin;
        newOpt.scales.x.max = newMin + (noOfColumnToDisplay - 1);
        setOpt(newOpt);
        setValue(newValue);
      } else if (maxVal === labelsLength) {
        console.log(maxVal, labelsLength);
        let newMin = noOfColumnToScroll * newValue;
        newOpt.scales.x.min = newMin;
        newOpt.scales.x.max = newMin + (noOfColumnToDisplay - 1);
        setOpt(newOpt);
        setValue(newValue);
      }
    }
  };

  useEffect(() => {
    const bgColorList = data.map(item => {
      if (item < 60) return ColorMapping['Low'];
      if (item > 100) return ColorMapping['High'];
      return ColorMapping['Normal'];
    })
    
    const borderColorList = bgColorList.map(item => BorderColorMapping[item])

    setBackgroundColors(bgColorList);
    setBorderColors(borderColorList);
  },[])
    return backgroundColors && borderColors && (
        <Container>
            <Bar 
              options={opt} 
              data={{
                labels: labels,
                datasets: [{
                  label: "Beat Per Minute",
                  data: data,
                  backgroundColor: backgroundColors,
                  borderColor: borderColors,
                  borderWidth: 1,
                }]
              }} 
              onClick={() => clickBar("he")} />
            <Container>
                <Slider
                value={value}
                onChange={clickScroll}
                step={1}
                // marks
                min={0}
                max={noOfMaxForSlider}
                />
            </Container>
        </Container>
    )
}

export default function ChartComponent({ show, onHide, content }){
    const [ labels, setLabels ] = useState([]);
    const [heartRateData, setHeartRateData ] = useState(null);
    const [bloodPressureData, setBloodPressureData ] = useState(null);
    const [oxygenLevelData, setOxygenLevelData ] = useState(null);

    useEffect(() => {
        const labelList = content.map(item => item['DateTime']);

        const hrData = content.map(item => item['HeartRate']);
        const bpData = content.map(item => item['BloodPressure']);
        const olData = content.map(item => item['OxygenLevel'])
        setLabels(labelList);
        setOxygenLevelData(olData);
        setBloodPressureData(bpData);
        setHeartRateData(hrData);
    }, [])
    return (
          <Modal fullscreen={true} show={show} onHide={onHide} >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <Container fluid className='d-flex flex-column overflow' >
                { heartRateData && <BarChart data={heartRateData}  labels={labels}/>}
                { oxygenLevelData && <PieChart data={oxygenLevelData}/>}
                { bloodPressureData && <AreaChart data={bloodPressureData} labels={labels} />}
              </Container>
            </Modal.Body>
          
          </Modal>
                
    )
}
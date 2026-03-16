import { Line } from "react-chartjs-2"
import "chart.js/auto"

function ECGChart({signal}){

  const data = {
    labels: signal.map((_,i)=>i),
    datasets:[
      {
        label:"ECG",
        data:signal,
        borderColor:"red",
        borderWidth:2,
        pointRadius:0
      }
    ]
  }

  return(

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Live ECG Monitor
      </h2>

      <Line data={data}/>

    </div>

  )
}

export default ECGChart
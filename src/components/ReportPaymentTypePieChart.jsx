import React from 'react'
import ReactApexChart from 'react-apexcharts'

export default function ReportPaymentTypePieChart({paymentTypes}) {

  const options = {
    series: paymentTypes.map((v)=>Number(v.total)),
    options: {
      chart: {
        width: "100%",
        type: 'pie',
      },
      colors: ["#D3EE98", "#73EC8B", "#54C392", "#15B392", "#347928", "#A0D683", "#72BF78"],
      labels: paymentTypes.map((v)=>v.title),
      responsive: [{
        // breakpoint: 480,
        options: {
          chart: {
            width: "100%"
          },
          legend: {
            position: 'right'
          }
        }
      }]
    },
  }

  return (
    <div>
      <ReactApexChart options={options.options} series={options.series} type="pie" width="100%" />
    </div>
  )
}

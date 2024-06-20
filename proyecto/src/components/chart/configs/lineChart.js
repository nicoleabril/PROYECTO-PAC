const lineChart = {
  series: [
    {
      name: "Nº Procesos",
      data: [350, 40, 300, 220, 500, 250],
      offsetY: 0,
      
    },
  ],

  options: {
    chart: {
      width: "100%",
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
      
    },

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#FF9149'],
    stroke: {
      curve: "smooth",
    },

    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: ["#8c8c8c"],
        },
      },
    },

    xaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: [
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
          ],
        },
      },
      categories: [
        "Relaciones Públicas",
        "Unidad de Gestión Socioambiental",
        "Dirección de Ingeniería Civil",
        "Dirección Admin Financiera",
        "Dirección Planificación",
        "Dirección de Producción",
      ],
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  },
};

export default lineChart;

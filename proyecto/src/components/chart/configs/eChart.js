const eChart = {
  series: [44, 55, 13, 43, 22, 43],
  options: {
    chart: {
      width: '100%',
      type: 'pie',
    },
    labels: [
      "Relaciones Públicas",
      "Unidad de Gestión Socioambiental",
      "Dirección de Ingeniería Civil",
      "Dirección Admin Financiera",
      "Dirección Planificación",
      "Dirección de Producción",
    ],
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return `${'$'+opts.w.globals.series[opts.seriesIndex]}`;
      }
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#FF9149'], // Paleta de colores personalizada
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
};

export default eChart;


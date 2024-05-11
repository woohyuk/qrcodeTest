// 그래프 생성
function createChart(ctx, data, labels) {
    var screenWidth = window.innerWidth;
    /*
    var barThickness = screenWidth >= 1024 ? 27 : 48;
    var fontSize = screenWidth >= 1024 ? 15 : 26;
    */
    var maxTicksLimit = screenWidth >= 1024 ? 11 : 3;
    
    if (screenWidth >= 1024) {
        barThickness = 27;
        fontSize = 15;
    } else if (screenWidth <= 640) {
        barThickness = 24;
        fontSize = 13;
    } else {
        barThickness = 48;
        fontSize = 26;
    }

    //Options
    Chart.defaults.font.size = fontSize; // 차트 전체 폰트 크기
    Chart.defaults.barThickness = barThickness; // barThickness

    return new Chart(ctx, {
        type: 'bar',
        responsive: true,
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: data,
                backgroundColor: 'rgba(67, 105, 227, 1)',
                borderWidth: 0,
                borderRadius: {
                    topLeft: 0,
                    topRight: 6,
                    bottomLeft: 0,
                    bottomRight: 6
                },
            }]
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y',
            animation: {
                easing: "easeOutQuart"
            },
            scales: {
                x: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: {
                        padding: 1,
                        color: '#666666',
                        font: {
                            family: 'Pretendard',
                        },
                        stepSize: 10,
                        maxTicksLimit: maxTicksLimit // maxTicksLimit 설정 적용
                    },
                    title: {
                        display: true,
                        text: '평균',
                        padding: 6,
                        color: '#666666',
                        font: {
                            family: 'Pretendard',
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        padding: 13,
                        color: '#222222',
                        font: {
                            family: 'Pretendard',
                            weight: '500',
                        },
                    },
                    grid: {
                        display: false
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

// data, labels
var chartData1 = [35, 58, 65, 32, 41];
var labels1 = ["애착", "참여", "자녀훈육", "양육효능감", "양육스트레스"];

var chartData2 = [50];
var labels2 = ["애착"];

var chartData3 = [70];
var labels3 = ["참여"];

var chartData4 = [80];
var labels4 = ["자녀훈육"];

var chartData5 = [30];
var labels5 = ["양육효능감"];

var chartData6 = [20];
var labels6 = ["양육스트레스"];

var ctx1 = $("#parentChart")[0].getContext("2d"); // 종합
var ctx2 = $("#parentDetailChart1")[0].getContext("2d");
var ctx3 = $("#parentDetailChart2")[0].getContext("2d");
var ctx4 = $("#parentDetailChart3")[0].getContext("2d");
var ctx5 = $("#parentDetailChart4")[0].getContext("2d");
var ctx6 = $("#parentDetailChart5")[0].getContext("2d");

// 차트 생성 및 초기화
var charts = [
    createChart(ctx1, chartData1, labels1),
    createChart(ctx2, chartData2, labels2),
    createChart(ctx3, chartData3, labels3),
    createChart(ctx4, chartData4, labels4),
    createChart(ctx5, chartData5, labels5),
    createChart(ctx6, chartData6, labels6)
];

// resize 이벤트 처리
function setFontBasedOnScreenWidth() {
    var screenWidth = window.innerWidth;
    var maxTicksLimit = screenWidth >= 1024 ? 11 : (screenWidth <= 1023 ? 3 : 10);
    
    charts.forEach(function(chart) {
        chart.options.scales.x.ticks.maxTicksLimit = maxTicksLimit;
        chart.update();
    });
}

// 초기화
setFontBasedOnScreenWidth();
window.addEventListener('resize', setFontBasedOnScreenWidth);
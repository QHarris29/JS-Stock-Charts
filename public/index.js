function getColor(stock) {
  if (stock === "GME") {
    return "rgba(61, 161, 61, 0.7)";
  }
  if (stock === "MSFT") {
    return "rgba(209, 4, 25, 0.7)";
  }
  if (stock === "DIS") {
    return "rgba(18, 4, 209, 0.7)";
  }
  if (stock === "BNTX") {
    return "rgba(166, 43, 158, 0.7)";
  }
}

async function main() {
  const timeChartCanvas = document.querySelector("#time-chart");
  const highestPriceChartCanvas = document.querySelector(
    "#highest-price-chart"
  );
  const averagePriceChartCanvas = document.querySelector(
    "#average-price-chart"
  );

  try {
    const response = await fetch(
    
    'https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=56c0ee72f6a045a2a08feb13a69f8174'
    );

    const result = await response.json();
   

    console.log(result)

    if (result.status === "error") {
      return;
    }

    const { GME, MSFT, DIS, BNTX } = result;

    const stocks = [GME, MSFT, DIS, BNTX];

    stocks.forEach((stock) => {
      if (stock.values) {
        stock.values.reverse();
      }
    });

    // Time Chart
    new Chart(timeChartCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: stocks[0]?.values?.map((value) => value.datetime) || [],
        datasets: stocks.map((stock) => ({
          label: stock.meta.symbol,
          backgroundColor: getColor(stock.meta.symbol),
          borderColor: getColor(stock.meta.symbol),
          data: stock.values?.map((value) => parseFloat(value.high)) || [],
        })),
      },
    });

    // High Chart
    new Chart(highestPriceChartCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: stocks.map((stock) => stock.meta.symbol),
        datasets: [
          {
            label: "Highest",
            backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
            borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
            data: stocks.map((stock) => findHighest(stock.values)),
          },
        ],
      },
    });

    // Average Chart
    new Chart(averagePriceChartCanvas.getContext("2d"), {
      type: "pie",
      data: {
        labels: stocks.map((stock) => stock.meta.symbol),
        datasets: [
          {
            label: "Average",
            backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
            borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
            data: stocks.map((stock) => calculateAverage(stock.values)),
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

function findHighest(values) {
  let highest = 0;
  values.forEach((value) => {
    if (parseFloat(value.high) > highest) {
      highest = value.high;
    }
  });
  return highest;
}

function calculateAverage(values) {
  let total = 0;
  values.forEach((value) => {
    total += parseFloat(value.high);
  });
  return total / values.length;
}

main();



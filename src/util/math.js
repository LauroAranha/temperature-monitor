export function getAverage(v) {
  // calcula a soma das métricas
  let AverageData = {
    temp: {
      total: 0,
      qtd: 0,
    },
    humid: {
      total: 0,
      qtd: 0,
    },
  };
  for (let entry of v) {
    // atualiza o total e a quantidade de temperatura
    AverageData["temp"].total += entry.temperature;
    AverageData["temp"].qtd++;

    // atualiza o total e a quantidade de temperatura
    AverageData["humid"].total += entry.humid;
    AverageData["humid"].qtd++;
  }

  // tendo o total e a quantidade, calcula a média para cada um
  // cria um array com os valores
  AverageData = Object.values(AverageData);
  for (let m of AverageData) {
    m.media = m.total / m.qtd;
    // apaga a quantidade e o total, pois não preciso mais
    delete m["qtd"];
    delete m["total"];
  }
  console.log(AverageData);
}

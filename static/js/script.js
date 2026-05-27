// Handle UI interactions, form validation, and AJAX prediction
document.addEventListener('DOMContentLoaded', () => {
  const tv = document.getElementById('tv');
  const radio = document.getElementById('radio');
  const newspaper = document.getElementById('newspaper');
  const tvNum = document.getElementById('tv_num');
  const radioNum = document.getElementById('radio_num');
  const newspaperNum = document.getElementById('newspaper_num');
  const predictBtn = document.getElementById('predictBtn');
  const loader = document.getElementById('loader');
  const predictionEl = document.getElementById('prediction');
  const totalBudgetEl = document.getElementById('totalBudget');
  const budgetChart = document.getElementById('budgetChart');
  const scatterChart = document.getElementById('scatterChart');
  const metricsEl = document.getElementById('metrics');

  // sync range and number inputs
  function sync(a, b){
    a.addEventListener('input', ()=>{ b.value = a.value });
    b.addEventListener('change', ()=>{ a.value = b.value });
  }
  sync(tv, tvNum); sync(radio, radioNum); sync(newspaper, newspaperNum);

  function showLoader(show){ loader.classList.toggle('hidden', !show); }

  async function predict(){
    // simple validation
    const tvVal = parseFloat(tv.value);
    const radioVal = parseFloat(radio.value);
    const newspaperVal = parseFloat(newspaper.value);
    if(isNaN(tvVal) || isNaN(radioVal) || isNaN(newspaperVal)){
      alert('Please provide valid numeric budgets.');
      return;
    }

    showLoader(true);
    predictionEl.textContent = '—';

    try{
      const res = await fetch('/predict', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({tv: tvVal, radio: radioVal, newspaper: newspaperVal})
      });
      const data = await res.json();
      if(res.ok){
        predictionEl.textContent = data.prediction + ' units';
        // Display total budget in USD
        totalBudgetEl.textContent = '$' + (tvVal+radioVal+newspaperVal).toFixed(2);
        updateCharts(tvVal, radioVal, newspaperVal, data.prediction);
      } else {
        alert(data.error || 'Prediction error');
      }
    }catch(err){
      alert('Network or server error: ' + err.message);
    }finally{
      showLoader(false);
    }
  }

  predictBtn.addEventListener('click', (e)=>{ e.preventDefault(); predict(); });

  // initial charts using sample/default values
  function updateCharts(tv, radio, newspaper, prediction){
    const labels = ['TV','Radio','Newspaper'];
    const values = [tv, radio, newspaper];

    Plotly.newPlot(budgetChart, [{type:'pie', labels:labels, values:values, hole:.4}], {margin:{t:10,b:10,l:10,r:10},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)'});

    // simple scatter: budgets vs predicted sales (single point)
    const trace1 = { x: ['TV','Radio','Newspaper'], y: values, type: 'bar', marker:{color:['#6a5cff','#00d4ff','#8ef0c8']} };
    const trace2 = { x: ['Pred'], y: [prediction], type: 'scatter', mode:'markers+lines', marker:{color:'#ffd166',size:12} };
    Plotly.newPlot(scatterChart, [trace1], {margin:{t:10,b:40}});
  }

  // Load sample dataset and show evaluation metrics (from a small JSON endpoint if exists)
  fetch('/static/data/metrics.json').then(r=>r.json()).then(m=>{
    metricsEl.innerHTML = `<div class="card"><h3>MAE</h3><p>${m.mae}</p></div><div class="card"><h3>R2</h3><p>${m.r2}</p></div>`;
  }).catch(()=>{ /* metrics optional */ });

  // initialize
  updateCharts(parseFloat(tv.value), parseFloat(radio.value), parseFloat(newspaper.value), '—');
});

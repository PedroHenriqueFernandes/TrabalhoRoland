var leitorDeCSV = new FileReader()
var header, values, myChart
var first = false
var first1 = false

window.onload = function init() {
    leitorDeCSV.onload = leCSV;
}

function pegaCSV(inputFile) {
    var file = inputFile.files[0];
    leitorDeCSV.readAsText(file);
}

function leCSV(evt) {

    var fileArr = evt.target.result;
    var lines = fileArr.split('\n');
        header = lines[0].split('","');
        values = []
    for (let i = 0; i < lines.length; i++) {
        values.push([lines[i].split('","')])
    }

    for (let i = 0; i < header.length; i++) {
      let opt = document.createElement('option')
      opt.value = i
      opt.appendChild(document.createTextNode(header[i]))
      
      document.getElementById('selectColumn').appendChild(opt)
    }

    gerargrafico()
}


function gerargrafico(){

    let valorSelect = document.getElementById('selectColumn').value
    let valores = []
    let labels = []
    let data = []

    document.getElementById('Lista').style.display='none'

    switch (valorSelect) {
      case '0':
        if (first == false){
          FiltroData(values)
          first = true
        }
        break;
      case '3':
        document.getElementById('Lista').style.display='flex'
        FiltroLista(valorSelect)
       break;
      case '7':
        if (first1 == false){
          FiltroIdade(valorSelect)
          first1 = true
        }
       break;
       case '12':
         filtroPessoasMoramCasa(valorSelect)
         break;
      case '14':
        FiltroTempMoradia(valorSelect)
       break;
      case '82':
        document.getElementById('Lista').style.display='flex'
        FiltroLista(valorSelect)
       break;
    }

    for(let i = 1; i < values.length ; i++){
        let k = values[i][0][valorSelect]
        valores.push(k)
    }
    valores.sort();
  
    var current = null;
    var cnt = 0;
    for (var i = 0; i < valores.length; i++) {
        if (valores[i] != current) {
            if (cnt > 0) {
                if(current == '' || current == '"'){
                  current='Sem Resposta'
                }

                if (current != header[valorSelect]){
                  labels.push(current)
                  data.push(cnt)
                }
            }
            current = valores[i];
            cnt = 1;

        } else {
            cnt++;
        }
    }
    if(valorSelect!='82'){
      addGrafico(labels, data)
    } else if (valorSelect=='82'){
      try {
        myChart = new Chart(table, config);
      } catch (error) {
        myChart.destroy();
        myChart = new Chart(table, config);
      }
    }
}

function filtroPessoasMoramCasa(valorSelect){
  for (let i = 0; i < values.length ; i++) {
    let val = String(values[i][0][valorSelect])
    if (val == "Quatro"){
      values[i][0][valorSelect] = 4;
    }
    else if (val == "4 pessoas "){
      values[i][0][valorSelect] = 4;
    }

    else if (val == "03"){
      values[i][0][valorSelect] = 3;
    }
  }
}


function addGrafico(labels, data) { 
  
  var config = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: data
      }]
    },
    options: {
      legend: {
          display: false
      },
      tooltips: {
          enabled: false
      }
    }
  }

  var table = document.getElementById("pie-chart")

  try {
    myChart = new Chart(table, config);
  } catch (error) {
    myChart.destroy();
    myChart = new Chart(table, config);
  }
  
}

function FiltroData(values) {
  values.sort()
  for (let i = 1; i < values.length ; i++) {
    let data = (new Date(String(values[i][0][0]).replace('"','')))
    var dia = String(data.getDate()).padStart(2, '0');
    values[i][0][0] = `Dia ${dia}`
  }
}
function FiltroLista(valorSelect){
  document.getElementById('Lista').innerHTML=''
  document.getElementById('Lista').innerHTML='<h1 style="text-align: center;">Lista</h1>'
  for (let i = 2; i < values.length -2 ; i++) {
    values[i][0][valorSelect] = String(values[i][0][valorSelect]).replace('"', '')
    if (values[i][0][valorSelect] != '' || values[i][0][valorSelect] != '"' || values[i][0][valorSelect] != ""){
      document.getElementById('Lista').innerHTML+= `<tr ><td class="line">${values[i][0][valorSelect]}</td></tr>`
    }
  }
}
function FiltroIdade(valorSelect){
  values.sort()
  for (let i = 1; i < values.length -3; i++) {
    let data = (new Date(String(values[i][0][valorSelect]).replace('-','/')))
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    if (idade(ano, mes, dia) <= 20){
      values[i][0][valorSelect] = 'Menor ou Igual à 20 anos'
    } else if (idade(ano, mes, dia) <= 30) {
      values[i][0][valorSelect] = 'Menor ou Igual à 30 anos'
    } else if (idade(ano, mes, dia) <= 40) {
      values[i][0][valorSelect] = 'Menor ou Igual à 40 anos'
    } else {
      values[i][0][valorSelect] = 'Maior que 40 anos'
    }
  }
}
function FiltroTempMoradia(valorSelect){
  for (let i = 0; i < values.length ; i++) {
    let val = String(values[i][0][valorSelect])
    /*if (val.indexOf('anos') > 0){
      if (val.indexOf('mes') > 0){
        console.log('tem anos e meses')
      }else{
        values[i][0][valorSelect] = (apenasNumeros(val)*12)
      }
    }else{
      //não tem anos
    }*/

    if(val == "24 anos"){
      values[i][0][valorSelect] = 288;
    } else if (val == "14anos"){
      values[i][0][valorSelect] = 168
    } else if (val == "Desde que nasci"){
      values[i][0][valorSelect] = 216;
    } else if (val == "1 ano"){
      values[i][0][valorSelect] = 12;
    } else if (val == "12  anos"){
      values[i][0][valorSelect] = 144;
    } else if (val == "12 anos "){
      values[i][0][valorSelect] = 144;
    } else if (val == "12 anos"){
      values[i][0][valorSelect] = 144;
    } else if (val == "16 anos"){
      values[i][0][valorSelect] = 192;
    } else if (val == "17 anos"){
      values[i][0][valorSelect] = 204;
    } else if (val == "+10 anos"){
      values[i][0][valorSelect] = 121;
    } else if (val == "23 anos"){
      values[i][0][valorSelect] = 276;
    } else if (val == "8 meses"){
      values[i][0][valorSelect] = 8;
    } else if (val == "7 anos"){
      values[i][0][valorSelect] = 84;
    } else if (val == "20 anos"){
      values[i][0][valorSelect] = 240;
    } else if(val == "7 meses"){
      values[i][0][valorSelect] = 7;
    } else if (val == "15 Anos"){
      values[i][0][valorSelect] = 180;
    } else if (val == "15 anos"){
      values[i][0][valorSelect] = 180;
    } else if (val == "Dezessete anos"){
      values[i][0][valorSelect] = 204;
    } else if (val == "mais 20 anos"){
      values[i][0][valorSelect] = 241;
    } else if(val == "1 Ano"){
      values[i][0][valorSelect] = 12;
    } else if(val == "18 anos"){
      values[i][0][valorSelect] = 216;
    } else if(val == "18 anos."){
      values[i][0][valorSelect] = 216;
    } else if(val == "18 anos "){
      values[i][0][valorSelect] = 216;
    } else if(val == "6 meses"){
      values[i][0][valorSelect] = 6;
    } else if(val == "6 meses "){
      values[i][0][valorSelect] = 6;
    } else if(val == "6 anos"){
      values[i][0][valorSelect] = 72;
    } else if(val == "9 meses"){
      values[i][0][valorSelect] = 9;
    }  else if(val == "4+"){
      values[i][0][valorSelect] = 4;
    } else if(val == "10 anos"){
      values[i][0][valorSelect] = 120;
    } else if(val == "29 anos"){
      values[i][0][valorSelect] = 348;
    } else if(val == "21 anos"){
      values[i][0][valorSelect] = 252;
    } else if(val == "2 anos"){
      values[i][0][valorSelect] = 24;
    }  else if(val == "2 anos "){
      values[i][0][valorSelect] = 24;
    } else if(val == "04 anos"){
      values[i][0][valorSelect] = 48;
    } else if(val == "2 anos e 8 meses"){
      values[i][0][valorSelect] = 32;
    } else if(val == "5 anos"){
      values[i][0][valorSelect] = 60;
    } else if(val == "4 anos"){
      values[i][0][valorSelect] = 48;
    } else if(val == "1 semana"){
      values[i][0][valorSelect] = 1;
    } else if(val == "10 anos "){
      values[i][0][valorSelect] = 120;
    } else if(val == "25 anos"){
      values[i][0][valorSelect] = 300;
    }

    if (Number(values[i][0][valorSelect]) <= 12){
      values[i][0][valorSelect] = 'Menor ou igual à 12 meses'
    } else if (Number(values[i][0][valorSelect]) <= 24) {
      values[i][0][valorSelect] = 'De 13 à 24 meses'
    } else if (Number(values[i][0][valorSelect]) <= 36) {
      values[i][0][valorSelect] = 'De 25 à 36 meses'
    } else if (Number(values[i][0][valorSelect]) <= 60) {
      values[i][0][valorSelect] = 'De 37 à 60 meses'
    } else if (Number(values[i][0][valorSelect]) <= 120) {
      values[i][0][valorSelect] = 'De 61 à 120 meses'
    } else if (Number(values[i][0][valorSelect]) > 120){
      values[i][0][valorSelect] = 'Mais que 120 meses'
    }

  }
}

function apenasNumeros(string) 
{
    var numsStr = string.replace(/[^0-9]/g,'');
    return parseInt(numsStr);
}
function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
  var d = new Date,
      ano_atual = d.getFullYear(),
      mes_atual = d.getMonth() + 1,
      dia_atual = d.getDate(),

      ano_aniversario = +ano_aniversario,
      mes_aniversario = +mes_aniversario,
      dia_aniversario = +dia_aniversario,

      quantos_anos = ano_atual - ano_aniversario;

  if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
      quantos_anos--;
  }

  return quantos_anos < 0 ? 0 : quantos_anos;
}

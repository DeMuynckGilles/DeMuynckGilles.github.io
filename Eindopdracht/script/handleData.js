
const loadMeteorData = function () {
  fetch(
    'https://data.nasa.gov/resource/y77d-th95.json'
  )
    .then(r => r.json())
    .then(d => {
      processData(d);
    });
};



const processData = function (json) {

  putMarkers(json)

  graphInit(json)


}

const putMarkers = function (json) {

  for (let i = 0; i < Object.keys(json).length; i++) {
    getMarkersCoords(json, i)
  }
}

const graphInit = function (json) {
  getMeteorWeight(json)
  getMeteorYear(json)

}

const getMeteorWeight = function (jsonObj) {
  let massArray = []
  let count1Kg = 0
  let count5Kg = 0
  let count20Kg = 0
  let count100Kg = 0
  jsonObj.forEach(element => {
    if (Number(element.mass) < 1000) {
      count1Kg++
    };
    if (Number(element.mass) <= 5000 && Number(element.mass) > 1000) {
      count5Kg++
    };
    if (Number(element.mass) <= 20000 && Number(element.mass) > 5000) {
      count20Kg++
    };
    if (Number(element.mass) <= 100000 && Number(element.mass) > 20000) {
      count100Kg++
    };
  })
  massArray.push(count1Kg)
  massArray.push(count5Kg)
  massArray.push(count20Kg)
  massArray.push(count100Kg)
  drawWeightChart(massArray)
}


const getMeteorYear = function (jsonObj) {
  let yearArray = []
  let count1800 = 0
  let count1900 = 0
  let count2000 = 0
  let countRecent = 0
  jsonObj.forEach(element => {

    if (element.year) {
      let year = Number(element.year.substring(0, 4))
      if (year <= 1800) {
        count1800++
      };
      if (year <= 1900 && year > 1800) {
        count1900++
      };
      if (year <= 2000 && year > 1900) {
        count2000++
      };
      if (year > 2000) {
        countRecent++
      };
    }
  })
  yearArray.push(count1800)
  yearArray.push(count1900)
  yearArray.push(count2000)
  yearArray.push(countRecent)
  console.log(yearArray)
  drawYearChart(yearArray)
}


const drawWeightChart = function (dataJson) {
  var ctx = document.getElementById('weightChart');
  var myChart = new Chart(ctx, {
    maintainAspectRatio: true,
    type: 'bar',
    data: {
      labels: ['Less than 1kg', 'Between 1-5kg', 'Between 5-20kg', 'Between 20-100kg'], labelFontSize: 32, fontColor: '#5a3f01',
      datasets: [{
        label: 'meteors per weight category', fontSize: 32, fontColor: '#5a3f01',
        data: dataJson,
        backgroundColor: [
          'rgba(221,51,9, 0.8)',
          'rgba(225,231,5, 0.8)',
          'rgba(200,250,189, 0.8)',
          'rgba(27,54,98, 0.8)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      tooltips: {
        fontColor: '#5a3f01',
        titleFontSize: 32,
        bodyFontSize: 32
      },
      legend: {
        fontColor: '#5a3f01',
        fontSize: 32,
        labels: {
          fontColor: '#5a3f01',
          fontSize: 32
        }
      },
      scales: {
        barLabel: { fontColor: '#5a3f01', fontSize: 16 },
        yAxes: [{
          ticks: {
            fontColor: '#5a3f01',
            fontSize: 32,
            beginAtZero: true
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#5a3f01',
            fontSize: 32,
            beginAtZero: true
          }
        }]
      }
    }
  });
  ctx.style.display = "grid";
  ctx += myChart
}

const drawYearChart = function (dataJson) {
  var ctx = document.getElementById('yearChart');
  var myChart = new Chart(ctx, {
    type: 'bar',
    maintainAspectRatio: true,
    data: {
      labels: ['Before 1800', 'Between 1800-1900', 'Between 1900-2000', 'After 2000'], fontSize: 32, fontColor: '#5a3f01',
      datasets: [{
        label: 'meteors per century', fontSize: 32, fontColor: '#5a3f01',
        data: dataJson,
        backgroundColor: [
          'rgba(221,51,9, 0.8)',
          'rgba(225,231,5, 1)',
          'rgba(200,250,189, 1)',
          'rgba(27,54,98, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      tooltips: {
        fontColor: '#5a3f01',
        titleFontSize: 32,
        bodyFontSize: 32
      },
      legend: {
        fontColor: '#5a3f01',
        fontSize: 32,
        labels: {
          fontColor: '#5a3f01',
          fontSize: 32
        }
      },
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#5a3f01',
            fontSize: 32,
            beginAtZero: true
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#5a3f01',
            fontSize: 32,
            beginAtZero: true
          }
        }]
      }
    }
  });
  ctx.style.display = "grid";
  ctx += myChart
}

const getMarkersCoords = function (jsonObj, index) {
  var img = document.getElementById('c-worldMap__image');
  var imgWidth = img.getBoundingClientRect().width; //get exact width of the image
  var imgHeight = img.getBoundingClientRect().height; //get exact height of the image
  let coords = calcCoords(jsonObj[index].reclat, jsonObj[index].reclong, imgWidth, imgHeight)
  let coordX = coords.xCoord
  let coordY = coords.yCoord
  if (jsonObj[index].geolocation) {
    createMarkers(coordX, coordY)
  }
}

function put_marker(from_left, from_top) {
  var dot = document.getElementById('c-app__worldMap')
  dot.style.left = from_left + "px";
  style.top = from_top + "px";
  style.display = "block";

};

const createMarkers = function (x, y) {
  let newMarker = `<span style="height: 4px; width: 4px; background-color:#e50000; border-radius: 50%; position: absolute; left:${x}px; top: ${y}px;"></span>`
  document.querySelector('.c-app__worldMap').innerHTML += newMarker
}

const calcCoords = function (latitude, longitude, imgWidth, imgHeight) {
  // get x value
  let x = (longitude + 180) * (imgWidth / 360) + (imgWidth / 2) - (imgWidth / 40)

  // convert from degrees to radians
  let latRad = latitude * Math.PI / 180

  //let mapHeight = imgHeight*(85/100)

  // get y value
  let mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)))
  let y = (imgHeight / 2) - (imgWidth * mercN / (2 * Math.PI)) - (imgHeight / 60)

  let coordsXandY = { "xCoord": x, "yCoord": y }

  return coordsXandY
}

const getYear = function (jsonObj) {
  if (jsonObj[i].year != null) {
    let year = jsonObj[i].year.substring(0, 4)
    return toInt(year);
  }
}

function convertGeoToPixel(latitude, longitude, imgWidth, imgHeight) {
  // get x value
  let x = (longitude + 180) * (imgWidth / 360) + (imgWidth / 2) - (imgWidth)
  // convert from degrees to radians
  let latRad = latitude * Math.PI / 180

  //let mapHeight = imgHeight*(85/100)

  // get y value
  let mercN = Math.log(Math.tan((Math.PI / 4) + (latRad * 0.4)))
  let y = (imgHeight / 2) - (imgWidth * mercN / (2 * Math.PI))

  let coordsXandY = { "xCoord": x, "yCoord": y }

  return coordsXandY
}

const handlePasswordSwitcher = function () {
  var pwdInput = document.getElementById('Password')
  var pwdToggle = document.getElementById('passwordtoggle')
  pwdToggle.addEventListener('click', function () {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text'
    }
    else {
      pwdInput.type = 'password'
    }
  })
}

const saveLoginForminfo = function () {
  let button = document.querySelector('.js-save');

  button.addEventListener('click', function (e) {
    var userInfo = {
      "name": document.getElementById("name").value,
      "firstName": document.getElementById("firstName").value,
      "eMail": document.getElementById("eMail").value,
      "password": document.getElementById("passwordLabel").value
    }
    alert(`Thanks for Registering ${userInfo.firstName} ${userInfo.name}`)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded')
  loadMeteorData()
  handlePasswordSwitcher()
  saveLoginForminfo()
});

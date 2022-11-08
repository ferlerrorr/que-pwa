
// showDownloadPrompt();
window.addEventListener('load',main)
function main(){

    vaildateCacheIfOnline()
    .then(_=>{
        
    })

}
function vaildateCacheIfOnline(){

    return new Promise((resolve,reject)=>{

        fetch(`config.json?cacheBust=${new Date().getTime()}`)
        .then(response => { return response.json() })
        .then(config => {

            let installedVersion = Settings.getVersion()
            if ( installedVersion== 0) {
                Settings.setVersion(config.version)
                document.querySelector('#version').innerHTML= `version ${config.version}`;
                return resolve();
            }
            else if (installedVersion != config.version) {
                console.log('Cache Version mismatch')
                fetch(`config.json?clean-cache=true&cacheBust=${new Date().getTime()}`).then(_ => {
                    //actually cleans the cache
                    Settings.setVersion(config.version);
                    window.location.reload();
                   
                    return resolve();  // unnecessary
                });

            }else{
                // already updated
                console.log('Cache Updated')
                document.querySelector('#version').innerHTML= `version ${installedVersion}`;
                return resolve();
            }
        }).catch(err=>{
            console.log(err);
            return resolve();
            //handle offline here 
        })
    })

}


/** ##Global Variables Document Window Selector */
let dropdown = document.getElementById("stores");
let defaultOption = document.createElement("option");
let done = false;
/** ##Global Variables Document Window Selector */

/** ##Initial Load Function Executables*/
$(document).ready(function () {
  rtrn();
  storeLoc();
  console.clear();
});
/** ##Initial Load Function Executables*/

/** ##Store Dopdown Script Handler*/
function storeLoc() {
  $("#stores").empty(); //Insures no hanging options elements will remain after executed
  dropdown.length = 0; //Remove all values that remains to the dropdown list = null
  defaultOption.text = localStorage.getItem("store"); //Assign the value of store index in the local storage to dropdown
  dropdown.add(defaultOption); //Add the option of store index within option element
  dropdown.selectedIndex = 0; //Refresh the selected index to 0
}
/** ##Store Dopdown Script Handler*/

/** ##Sleep function for stopping the program
 -- ! note it can introduce a  side effect of the longer the milisecond of sleep it can bypass the excution and can be fired twice 
--  ! use less
*/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
/** ##Sleep function*/

/** ##App Datetime Script Handler
-- this script makes sures that the app is up to date and update every seconds 
 * */
var dateTime;
dateTime = setInterval(function () {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (this.dateTime = date + " " + time);
}, 1000);
/** ##App Datetime Script Handler*/

/** ##Closure`s 
 -- this script makes sure to not double fires when double clicked
*/
var rtrn = (function () {
  return function () {
    if (!done) {
      served(), serving(), queue();
    }
  };
})();

var rtrntoserving = (function () {
  return function () {
    if (!done) {
      serving(), queue();
    }
  };
})();

var rtrnbacktoqueue = (function () {
  return function () {
    if (!done) {
      queue(), serving();
    }
  };
})();

var rtrntoserved = (function () {
  return function () {
    if (!done) {
      served(), serving();
    }
  };
})();

var rtrnbacktoserving = (function () {
  return function () {
    if (!done) {
      serving(), served();
    }
  };
})();
/** ##Closure`s */

/** ##App Queue Card list Script Handler*/
/** -- App Queue Card HTTP Request Script Handler*/
function queue() {
  let storeAt = localStorage.getItem("store");
  //Active Queue
  let qbody = document.getElementById("qbody");
  $(qbody).empty();
  let headersList = {
    "X-Requested-With": "XMLHttp",
    "Content-Type": "application/json",
  };
  fetch("http://127.0.0.1:8000/api/v1/queues/" + storeAt, {
    method: "GET",
    headers: headersList,
  })
    .then((res) => res.json())
    .then((json) => {
      json.map((json) => {
        qbody.append(td_fun1(json.transaction_number, json.id));
      });
    });

  /** -- App Queue Card Populate List Script Handler*/
  function td_fun1(transaction_number, id) {
    let td = document.createElement("li");
    td.innerHTML = `<div class="list-card" onclick="nowServing('${id}')">
<div class="card-txt">
<div class="qtitle-cont" >
<h5 class="qtitle">Transaction Number :</h5></div>
<div class ="qnumb-cont">
<h5 class="qnumber">${transaction_number}</h5>
</div>
</div>
<span class="material-icons qmat-right noSelect ">
<a class="dblclick" href="javascript:void(0);"  id="dblclick" > <i class="material-icons mat-right">arrow_forward_ios</i></a>
</span>
</div>`;
    return td;
  }
}
/** ##App Queue Card list Script Handler*/

/** ##App Serving Card list Script Handler*/
/** -- App Serving Card HTTP Request Script Handler*/
function serving() {
  let storeAt = localStorage.getItem("store");
  let ubody = document.getElementById("ubody");
  $(ubody).empty();
  let headersList = {
    "X-Requested-With": "XMLHttp",
    "Content-Type": "application/json",
  };
  fetch("http://127.0.0.1:8000/api/v1/serving/" + storeAt, {
    method: "GET",
    headers: headersList,
  })
    .then((res) => res.json())
    .then((json) => {
      json.map((json) => {
        ubody.append(td_fun(json.transaction_number, json.id));
      });
    });

  /** -- App Serving Card Populate List Script Handler*/
  function td_fun(transaction_number, id) {
    let td = document.createElement("li");
    td.innerHTML = `<li> 
<div class="slist-card">
<span class="material-icons smat-back" onclick="deleteServing('${id}')">
<i class="material-icons mat-left ">arrow_back_ios</i>
</span>        
<div class="card-txt">
<h4 class="stitle">Transaction Number :</h4>
<h4 class="snumber">${transaction_number}</h4>
</div>
<span class="material-icons smat-forward" onclick="nowServed('${id}')">
<i class="material-icons mat-right">arrow_forward_ios</i>
</span>
</div>
</li>`;
    return td;
  }
}
/** ##App Serving Card list Script Handler*/

/** ##App Served Card list Script Handler*/
/** -- App Served Card HTTP Request Script Handler*/
function served() {
  let storeAt = localStorage.getItem("store");
  //Done Served
  let dbody = document.getElementById("dbody");
  $(dbody).empty();
  let headersList = {
    "X-Requested-With": "XMLHttp",
    "Content-Type": "application/json",
  };
  fetch("http://127.0.0.1:8000/api/v1/served/" + storeAt, {
    method: "GET",
    headers: headersList,
  })
    .then((res) => res.json())
    .then((json) => {
      json.map((json) => {
        dbody.append(td_fun2(json.transaction_number, json.id));
      });
    });

  /** -- App Queue Card Populate List Script Handler*/
  function td_fun2(transaction_number, id) {
    let td = document.createElement("li");
    td.innerHTML = ` <div class="list-card list-card-served" onclick="deleteServed('${id}')" >
<div class="qtitle-cont srv-ttl" >      
<span class="material-icons noSelect ">
<a class="dblclick" href="javascript:void(0);"  id="dblclick" > <i class="material-icons mat-right">arrow_back_ios</i></a>
</span>
<div class="card-txt">
<h5 class="qtitle srv-ttltx">Transaction Number :</h5>
<div>
<h5 class="qnumber srvnum">${transaction_number}</h5>
</div>
</div>
</div> 
</div>`;
    return td;
  }
}
/** ##App Served Card list Script Handler*/

/** ##App Queue Card list click event Script Handler*/
/** -- From Que - > nowServing forward Function */
function nowServing(args) {
  if (!done) {
    var url = "http://127.0.0.1:8000/api/v1/serving/" + args;
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };
    var data = `{"picked_at":"${dateTime}"}`;
    xhr.send(data);
    console.clear();
  }
  rtrntoserving();
}
/** ##App Queue Card list click event Script Handler*/

/** ##App Serving Card list click event Script Handler*/
/** -- From nowServing Back Function - > Que */
function deleteServing(args) {
  if (!done) {
    var url = "http://127.0.0.1:8000/api/v1/serving/" + args;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };
    var data = `{"picked_at":""}`;
    xhr.send(data);
    console.clear();
  }
  rtrnbacktoqueue();
}
/** ##App Serving Card list click event Script Handler*/

/** ##App Serving Card list click event Script Handler*/
/** -- From Serving - > Served forward Function */
function nowServed(args) {
  if (!done) {
    var url = "http://127.0.0.1:8000/api/v1/served/" + args;
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };
    var data = `{"served_at":"${dateTime}"}`;
    xhr.send(data);
    console.clear();
  }
  rtrntoserved();
}
/** ##App Serving Card list click event Script Handler*/

/** ##App Served Card list click event Script Handler*/
/** -- nowServing Back Function - > Que */
function deleteServed(args) {
  if (!done) {
    var url = "http://127.0.0.1:8000/api/v1/served/" + args;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };
    var data = `{"served_at":""}`;
    xhr.send(data);
    console.clear();
  }
  rtrnbacktoserving();
}
/** ##App Served Card list click event Script Handler*/

/** ##App Store/Input New Queue Script Handler */
/** -- App Store Queue HTTP Request Script Handler */
function storeQue() {
  let transVal = document.getElementsByClassName("transaction_number")[0].value;
  let store = document.getElementsByClassName("store_at")[0].value;
  var done = false;
  if (!done) {
    var url = "http://127.0.0.1:8000/api/v1/queues";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };
    var data = `{
"transaction_number":"${transVal}",
"store_at": "${store}"
}`;
    xhr.send(data);
    console.clear();
  }
  sleep(460);
  queue();
}
/** ##App Store/Input New Queue Script Handler */

/** ##App Choose Store Dropdown  Script Handler */
/** -- App Store Queue HTTP Request Script Handler */
function strdd() {
  const url = "http://localhost:8000/api/v1/stores";
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function () {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      let option;
      for (let i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.text = data[i];
        option.value = data[i];
        dropdown.add(option);
      }
    } else {
      /** -- Reached the server, but it returned an error */
    }
  };
  request.onerror = function () {
    console.error("An error occurred fetching the JSON from " + url);
  };
  request.send();

  storeLoc();
}

/** -- On change selections */
$(document).ready(function () {
  $("#stores").change(function () {
    localStorage.setItem("store", $(this).val());
  });
});
/** ##App Choose Store Dropdown  Script Handler */

/**
## Script For handling Settings Button
 */
/** -- Document/Window Element Selectors */
const setbtn = document.getElementById("setbtn");
const modal = document.querySelector(".modal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalBg = document.getElementById("modalBg");
/** -- Element Event Handler for opening the Settings modal*/
const openModal = (e) => {
  modal.style.display = "block";
};
/** -- Element Event Handler for closing the Settings modal*/
const closeModal = (e) => {
  modal.style.display = "none";
  location.reload();
};
/** -- Element Event Listener Settings modal*/
setbtn.addEventListener("click", openModal);
modalCloseBtn.addEventListener("click", closeModal);
modalBg.addEventListener("click", closeModal);
/**
## Script For handling Settings Button
*/

/**     
## Script For handling Store Button
 */
/** -- Document/Window Element Selectors */
const strbtn = document.getElementById("strbtn");
const strmodal = document.querySelector(".strmodal");
const strmodalCloseBtn = document.getElementById("strmodalCloseBtn");
const strmodalBg = document.getElementById("strmodalBg");
/** -- Element Event Handler for opening the Store Queue modal*/
const openModalstr = (e) => {
  strmodal.style.display = "block";
};
/** -- Element Event Handler for closing the Store Queue modal*/
const closeModalstr = (e) => {
  strmodal.style.display = "none";
};
/** -- Element Event Listener Store Queue modal*/
strbtn.addEventListener("click", openModalstr);
strmodalCloseBtn.addEventListener("click", closeModalstr);
strmodalBg.addEventListener("click", closeModalstr);
/**
## Script For handling Store Button
 */

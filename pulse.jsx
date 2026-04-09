

/* ===== DATA ===== */
const data = {

1:{
 "Mixing Unit":["Mixer1","Mixer2","Mixer3","Mixer4","Mixer5"],
 "Control Room":["Panel1","Panel2","Panel3","Panel4"],
 "Pre-Processing":["Crusher1","Feeder1","Feeder2"]
},

2:{
 "Reactor Zone":["Reactor1","Reactor2","Reactor3","Reactor4"],
 "Cooling Section":["Cooler1","Cooler2","Cooler3"],
 "Separation Unit":["Separator1","Filter1","Filter2"]
},

3:{
 "Storage":["Tank1","Tank2","Tank3","Tank4","Tank5"],
 "Packing":["Packer1","Packer2","Packer3","Packer4"],
 "Quality Check":["QC1","QC2","QC3"]
},

4:{
 "Maintenance":["Repair1","Repair2","Repair3"],
 "Utility":["Boiler1","Compressor1","Generator1"],
 "Water Treatment":["Pump1","Pump2","Filter3"]
},

5:{
 "Dispatch":["Loader1","Loader2","Loader3"],
 "Warehouse":["Shelf1","Shelf2","Shelf3","Shelf4"],
 "Logistics":["Scanner1","Conveyor1","Conveyor2"]
},

6:{
 "Energy Plant":["Generator1","Generator2","Transformer1"],
 "Safety Systems":["Alarm1","SensorHub","FireControl"],
 "Monitoring":["Camera1","Camera2","ServerUnit"]
}

};

const floorGrid=document.getElementById("floorGrid");

Object.keys(data).forEach(f=>{
floorGrid.innerHTML+=`<div class="card" onclick="selectFloor(${f})">Floor ${f}</div>`;
});

let currentFloor,intervalId,power=true,time=0,factoryPower=true;

/* ===== FACTORY OVERVIEW ===== */
function calculateFactoryStats(){

let total=0,active=0;

Object.values(data).forEach(floor=>{
Object.values(floor).forEach(room=>{
total+=room.length;
active+=Math.floor(Math.random()*room.length);
});
});

totalMachines.innerText=total;
activeMachines.innerText=active;
}

function startFactoryOverview(){

setInterval(()=>{

if(!factoryPower) return;

let temp=25+Math.random()*20;
let gas=Math.random()*100;

factoryTemp.innerText=temp.toFixed(1)+"°C";
factoryGas.innerText=gas.toFixed(1)+" ppm";

calculateFactoryStats();

},2000);
}

function toggleFactoryPower(){
factoryPower=!factoryPower;
document.querySelector(".power-btn").innerText=factoryPower?"ON":"OFF";
}

/* ===== NAV ===== */
function goHome(el){
document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
el.classList.add('active');

floors.classList.remove("hidden");
rooms.classList.add("hidden");
machines.classList.add("hidden");
dashboard.classList.add("hidden");
}

function toggle(hide,show){
document.getElementById(hide).classList.add("hidden");
document.getElementById(show).classList.remove("hidden");
}

/* ===== FLOW ===== */
function selectFloor(f){
currentFloor=f;
toggle("floors","rooms");
floorTitle.innerText="Floor "+f;

roomList.innerHTML="";
Object.keys(data[f]).forEach(r=>{
let total=data[f][r].length;
let active=Math.floor(Math.random()*total);

roomList.innerHTML+=`<div class="card" onclick="selectRoom('${r}')">
<b>${r}</b><br>Active: ${active}/${total}
</div>`;
});
}

function selectRoom(r){
toggle("rooms","machines");
roomTitle.innerText=r;

machineList.innerHTML="";
data[currentFloor][r].forEach(m=>{
let status=["running","stopped","warning"][Math.floor(Math.random()*3)];
machineList.innerHTML+=`
<div class="card" onclick="selectMachine('${m}')">
${m}
<div class="status ${status}">${status.toUpperCase()}</div>
</div>`;
});
}

function selectMachine(m){
toggle("machines","dashboard");
machineTitle.innerText=m;
startDashboard();
}

/* ===== MACHINE DASHBOARD ===== */
function startDashboard(){

if(intervalId) clearInterval(intervalId);

const tempChart=new Chart(document.getElementById("tempChart"),{
type:"line",
data:{labels:[],datasets:[{label:"Temp",data:[]}]}
});

const gasChart=new Chart(document.getElementById("gasChart"),{
type:"bar",
data:{labels:[],datasets:[{label:"Gas",data:[]}]}
});

intervalId=setInterval(()=>{

if(!power) return;

let temp=20+Math.random()*50;
let gas=Math.random()*100;

machineState.innerText = gas>70?"Gas Leakage":temp>60?"High Temp":"Running";

voltage.innerText=(200+Math.random()*50).toFixed(0)+"V";
vibration.innerText=(Math.random()*5).toFixed(2);
runtime.innerText=(time++)+"s";
health.innerText=(80+Math.random()*20).toFixed(0)+"%";

/* charts */
tempChart.data.labels.push("");
tempChart.data.datasets[0].data.push(temp);

gasChart.data.labels.push("");
gasChart.data.datasets[0].data.push(gas);

if(tempChart.data.labels.length>10){
tempChart.data.labels.shift();
tempChart.data.datasets[0].data.shift();
gasChart.data.labels.shift();
gasChart.data.datasets[0].data.shift();
}

tempChart.update();
gasChart.update();

},2000);
}

/* ===== POWER ===== */
function togglePower(){
power=!power;
machineState.innerText=power?"Running":"Power OFF";
}

/* ===== BACK ===== */
function backToFloors(){toggle("rooms","floors")}
function backToRooms(){toggle("machines","rooms")}
function backToMachines(){toggle("dashboard","machines");clearInterval(intervalId)}

/* START */
startFactoryOverview();

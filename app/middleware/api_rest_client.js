/**
 * Api Rest Connection
 */
const httpStatusOk = 200;

let dmd_counter = 0;

let tabCount = 1;

let deviceList = {};

let currentTabName = '';

let flagWait = true;

function getFuncName() {
	return getFuncName.caller.name
 }

function showTab(event, tabId) {
    // Hide all tab contents
    // const tabContents = document.querySelectorAll('.tab-content');
    // tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');

    // Add active class to the clicked tab button
    event.currentTarget.classList.add('active');

	currentTabName = tabId;
	document.getElementById("currentTab").innerHTML = currentTabName;
	//console.log(`document.getElementById("currentTab").innerHTML = ${currentTabName}`)
	document.getElementById("console_stdout").value = '';
}

function updateTabName(newName) {
	if ( newName !== currentTabName ) {
		document.getElementById(currentTabName).textContent = newName;
		document.getElementById(currentTabName).setAttribute('onclick', `showTab(event, '${newName}')`);
		document.getElementById(currentTabName).setAttribute('id', newName);
		document.getElementById("currentTab").innerHTML = newName;
	    Object.defineProperty(deviceList, newName,
			Object.getOwnPropertyDescriptor(deviceList, currentTabName));
		delete deviceList[currentTabName];
		currentTabName = newName;
	}
	//console.log(`document.getElementById("currentTab").innerHTML = ${currentTabName}`)
}
// device_list = {};

function addNewTab(device_list) {
	flagWait = true;
	if ( device_list.length === 0)
		return;

	document.getElementById("currentTab").innerHTML = '';
	//console.log("addNewTab(device_list=" + JSON.stringify(device_list)+')');
	const removeKeys = Object.keys(deviceList);
	//let newDevices = {}
	//let tabCount = 0;
	Object.entries(device_list).forEach(device => {
		//++tabCount;
		const [name, info] = device;

		var deviceName = name.replace('._api-dmd-device._tcp.local.','')
		if (typeof info.properties.device_name !== "undefined") {
			deviceName = info.properties.device_name;
		}

		//console.log('device name: ' + deviceName);

		if ( typeof deviceList[deviceName] === "undefined" ) {
			//newDevices[deviceName] = info;
			// Create new tab button
			const newTabButton = document.createElement('button');
			newTabButton.classList.add('tab-button');
			newTabButton.textContent = deviceName;
			newTabButton.setAttribute('onclick', `showTab(event, '${deviceName}')`);
			newTabButton.setAttribute('id', deviceName);
			document.getElementById('tab-buttons').appendChild(newTabButton);
			deviceList[deviceName] = { ...info };
			deviceList[deviceName].apiAddress = '';
			//console.log(`Calling getApiAddress()`);
			getApiAddress(info.addresses, deviceName);
		} else {
			console.log('deviceList[deviceName] exists: ' + JSON.stringify(deviceList[deviceName]));
			removeKeys = removeKeys.filter(item => item !== deviceName)
		}
	});

	removeKeys.forEach( deviceName => {
		delete deviceList[deviceName];
	});
    //const tabButtons = document.querySelectorAll('.tab-button');
    //tabButtons.forEach(button => button.classList.remove('active'));
	/*
	tabCount++;
    const newTabId = 'tab' + tabCount;

    // Create new tab button
    const newTabButton = document.createElement('button');
    newTabButton.classList.add('tab-button');
    newTabButton.textContent = 'Tab ' + tabCount;
    newTabButton.setAttribute('onclick', `showTab(event, '${newTabId}')`);
    document.getElementById('tab-buttons').appendChild(newTabButton);

    // Create new tab content
    const newTabContent = document.createElement('div');
    newTabContent.classList.add('tab-content');
    newTabContent.setAttribute('id', newTabId);
    newTabContent.innerHTML = `
        <h2>Content for Tab ${tabCount}</h2>
        <p>This is the content for tab ${tabCount}.</p>
    `;
    document.getElementById('tab-contents').appendChild(newTabContent);
	*/
	devices = Object.keys(deviceList);
	if ( devices.length && typeof deviceList[currentTabName] === "undefined" ) {
		currentTabName = Object.keys(deviceList)[0];
		document.getElementById("currentTab").innerHTML = currentTabName;
		//console.log(`document.getElementById("currentTab").innerHTML = ${currentTabName}`)
	}
	flagWait = false;
}

function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

function get_local_ip() {
	ip = myIP();
	console.log("get_local_ip() = " + ip);
}

function retrive_dmd_status(status_doc) {
	if ( "cmd" in status_doc) {
		if ( status_doc["cmd"] = "status" ) {
			// DMD Status
			
		}
	}
}

function retrive_text(net_doc_dict) {
	var display_stdout = "display_stdout";
	var console_stdout = "console_stdout";
	display_list = net_doc_dict[display_stdout];
	console_list = net_doc_dict[console_stdout];
	//console.log(`display_list=${JSON.stringify(display_list)}`);
	if ( display_list["is_changed"] == 1 || dmd_counter != net_doc_dict['counter']) {
		dmd_counter = parseInt(net_doc_dict['counter'])
		var vdmd = display_list['text']['dmd']
		//console.log("display_list['text']=" );
		//console.log(vdmd);
		//var display_out = vdmd;
		/*for ( line in display_list["text"] ) {
			display_out = display_out + line + "\n";
		}*/
		document.getElementById(display_stdout).value = vdmd;
	}
	if ( console_list["is_changed"] == 1) {
		//console.log(console_list["text"]);
		var display_out = document.getElementById(console_stdout).value;
		for (let i = 0; i < console_list["text"].length; i++) {
			display_out = display_out + console_list["text"][i] + "\n";
			//console.log(console_list["text"][i]);
		}
		/*for ( line in console_list["text"] ) {
			display_out = display_out + line + "\n";
		}*/
		document.getElementById(console_stdout).value = display_out;
		document.getElementById(console_stdout).scrollTop=document.getElementById(console_stdout).scrollHeight;
	}
}

function rest_api_post_new_name() {
	let newName = document.getElementById('new_device_name').value.replace(' ', '_');
	console.log("rest_api_post_new_name = " + newName);
	const route = "device_name";
	/*var cmd = {
		cmd: 'change_device_name',
		payload: newName,
		sender: 'local-web',
	};*/
	var cmd = {
		cmd: 'change_device_name',
		payload: { 
			newName: newName,
			deviceId: deviceList[currentTabName].name
		},
		sender: 'local-web',
	};
	send_post_rest_api(cmd, 'change_name', (responseStatus, responseText) => {
		if ( responseStatus === httpStatusOk ) {
			console.log("Change Name response = " + newName);
			updateTabName(newName);
		}
	}, route);

	cmd = {
		cmd: 'change_device_name',
		payload: { 'newName': newName, 'deviceId': deviceList.currentTabName.name},
		sender: 'local-web',
	};
	send_post_rest_api(cmd, 'change_name', null, route, getApiWebUrl());

	document.getElementById('new_device_name').value = '';
}

function rest_api_get_token() {
	if (flagWait)
		return;

	var request = new XMLHttpRequest();
	var token_target = "display_dmd";

	var current_url = "";
	current_url += window.location;
	if ( current_url === '' ) {
		console.log(`send_post_rest_api -> current_url empty`);	
		return;
	}
	api_url = 'http://' + current_url + "api/token/";
	get_request = api_url + token_target;
	
	request.open('GET', get_request, true);
	
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == httpStatusOk) {
			var json_obj = JSON.parse(this.responseText);
			retrive_text(json_obj);
		}
	};
	request.send();
}

function call_api() {
	//rest_api_get_token()
	//var s = document.getElementById("display_stdout").value;
	//console.log("Here");
	//console.log(s);
	//s = s + "A";
	//document.getElementById("display_stdout").value = s;
}

function getApiWebUrl() {
	var request = new XMLHttpRequest();

	var current_url = "";
	current_url += window.location;

	//console.log(`current_url: ${current_url}`);
	api_url = current_url.replace("5001","4065")

	console.log(`api_url: ${api_url}`);
	return api_url;
}


function startUp() {
	console.log("Body Start Up");

	return;
	
	var request = new XMLHttpRequest();

	var current_url = "";
	current_url += window.location;

	console.log(`current_url: ${current_url}`);
	api_url = current_url.replace("5001","4065") + "api/search_dmd_devices";
	console.log(`api_url: ${api_url}`);

	//console.log(`current_url: ${current_url}`);
	//var token_target = token;
	//post_request = api_url;// + token_target;
	get_request = api_url;
	console.log("GET: " + get_request);

	request.open('GET', get_request, true);
	//request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	//request.onload = function() {
	
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == httpStatusOk) {
			var json_obj = JSON.parse(this.responseText);
			//retrive_dmd_status(json_obj);
			console.log(`Post Response: ${JSON.stringify(json_obj)}`);
			addNewTab(json_obj);
		}
		else
		{
			console.log(`Post Error: ${this.status}`);
		}
	};
	request.send();
}

function atoi(addr) {
	var parts = addr.split('.')
	return parts;
}

async function getRequest(get_request, fn = null){
	const result = new Promise( async (resolve, reject) => {
	//const result = await new Promise( async (resolve, reject) => {

		var request = new XMLHttpRequest();
		
		request.open('GET', get_request, true);
		
		request.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == httpStatusOk) {
					var json_obj = JSON.parse(this.responseText);
					console.log(`GET ${get_request} Response: ${JSON.stringify(json_obj)}`);
					resolve({status:this.status, payload: json_obj});
				}
				else
				{
					console.log(`GET ${get_request} Error: readyState: ${this.readyState}, status: ${this.status}, `);
					reject({readyState: this.readyState, status: this.status});
				}
			}
		};
		request.send();
	});
	result.then(result => {
		console.log(`Resolved: ${result}:`);
		if (fn != null) {
			fn(result.payload);
		}
		return result;
	})
		.catch(err => {
			console.log(`Error in function getRequest: ${err}`);
	});
	//return result;
}

async function getDeviceApiAlive(ipAddr, fn = null) {
	try {
		//console.log(`Waiting Alive response from ${ipAddr} ...`);
		const result = await new Promise( async resolve => {
			
			const port = 4005;

			get_request = "http://" + ipAddr + ":" + port + "/api/alive";

			getResponse = await getRequest(get_request);
			
			if ( getResponse.status === httpStatusOk ) {
				console.log(`Alive response from ${ipAddr}: ${JSON.stringify(getResponse)}`);
				if ( fn !== null ) {
					fn(true);
				}
				resolve(true);
			} else {
				resolve(false);
			}
		});
		console.log(`Alive response from ${ipAddr}: ${result}`);
		return result;
	} catch (err) {
		return false;
	}
}

function getApiAddress(addressesList, key) {
	var localAddr = '';
	localAddr += window.location;
	var parts = localAddr.split('//');
	var localAddrSegments = (parts.length === 1? parts[0] : parts[1]).split('.');
	//localAddrSegments = localAddr.split('.');

	addressesList.forEach( async addr => {
		segments = addr.split('.');
		if ( segments[0] == localAddrSegments[0] && segments[1] == localAddrSegments[1] ) {
			getDeviceApiAlive(addr, success => {
				if ( success ) {
					deviceList[key].apiAddress = addr;
					//console.log(`ip = ${addr}; deviceList[key].apiAddress = ${deviceList[key].apiAddress}`);
					//console.log(`deviceList[currentTabName].apiAddress = ${deviceList[currentTabName].apiAddress}`);
				}
			});
		} else {
			console.log(`Segments don't match: localAddrSegments=${JSON.stringify(localAddrSegments)}; segments= ${JSON.stringify(segments)}`);
		}
	});
	return '';
}

function getCurrentDeviceApiAddress() {
	//console.log('deviceList=' + JSON.stringify(deviceList));
	//console.log('currentTabName=' + currentTabName);
	if ( currentTabName !== '' && typeof deviceList[currentTabName] !== "undefined" ) {
		//console.log(`getCurrentDeviceApiAddress->${currentTabName}=${JSON.stringify(deviceList[currentTabName])}`);
		let deviceInfo = deviceList[currentTabName];
		if ( typeof deviceInfo.apiAddress !== "undefined" && deviceInfo.apiAddress !== '' ) {
			let deviceAddresses = deviceInfo.apiAddress + ":4005";
			return deviceAddresses;
		}
	}
	return "";
}

function send_get_rest_api(route = '', token = '', fn = null, api_url = '') {
	var request = new XMLHttpRequest();
	//let current_url = getCurrentDeviceApiAddress();
	var current_url = "";
	current_url += window.location;

	console.log(`current_url -> ${current_url}`);	

	//console.log(`current_url: ${current_url}`);
	if (route === '') { 
		route = 'command_to_dmd';
	}
	/*if (token === '') {
		token = 'all'
	}*/
	const url = (api_url === '' ? 'http://' + current_url : api_url) + `api/${route}`;

	console.log(`api_url: ${url}`);

	const get_request = url + (token != '' ? '/' + token : '');
	
	console.log("GET: " + get_request);

	getRequest(get_request, fn);
}

function send_post_rest_api(cmd, token, fn = null, route = '', apiUrl = '') {
	var request = new XMLHttpRequest();
	//var current_url = Object.assign("", window.location);
	let current_url = getCurrentDeviceApiAddress();

	if ( current_url === '' && apiUrl === '') {
		console.log(`send_post_rest_api -> current_url empty`);	
		return;
	}
	//var current_url = "";
	//current_url += window.location;

	console.log(`current_url: ${current_url}`);
	//api_url = current_url.replace("5001","4065") + "api/command_to_dmd/";
	if (route === '') { 
		route = 'command_to_dmd';
	}
	var api_url = '';
	if ( apiUrl === '' ) {
		api_url = 'http://' + current_url + `/api/${route}/`;
	} else {
		api_url = apiUrl + `api/${route}/`;
	}
	console.log(`api_url: ${api_url}`);

	//api_url = "http://127.0.0.1:4005/api/command_to_dmd/";
	//console.log(`current_url: ${current_url}`);
	var token_target = token;
	post_request = api_url + token_target;
	//post_request = api_url;
	console.log("POST: " + post_request);

	request.open('POST', post_request);
	request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	request.onload = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(`this.responseText: ${this.responseText}`);
			let json_obj = JSON.parse(this.responseText);
			//retrive_dmd_status(json_obj);
			console.log(`Post Response: ${JSON.stringify(json_obj)}`);
			if ( fn !== null ) {
				fn(this.status, this.responseText);
			}
		}
		else
		{
			console.log(`Post Error: ${this.status}`);
		}
	};
	cmd["sender"] = "spw";
	const body = JSON.stringify(cmd);
	request.send(body)
}

function rest_api_start_match() {
	//get_local_ip();
	console.log("rest_api_start_match")
	var d = new Date();
	console.log("current time: " + d);
	startTimeSinceEpoch = Math.floor(d.getTime()/1000);
	d.setHours(d.getHours() + 1);
	stopTimeSinceEpoch = Math.floor(d.getTime()/1000);
	//d.setMinutes(59);
	//d.setSeconds(59);
	console.log("stop time: " + d);
	const subject = "dmd_start_match";
	const cmd = {
		payload: {
		cmd:'start',
		stop_time: stopTimeSinceEpoch,
		duration: 3600,
		now: true
		}
	};
	console.log('rest_api_start_match -> cmd: ' + JSON.stringify(cmd));
	send_post_rest_api(cmd, subject);

	//cmd = {cmd: 'stop',
	//	now: false
	//};
	//console.log('rest_api_start_match -> cmd: ' + JSON.stringify(cmd));
	//send_post_rest_api(cmd, "stop_match");
}

function addTab() {
	console.log("addTab()");

}

function rest_api_stop_match() {
	const cmd = { payload: {'cmd':'stop', now: true}};
	send_post_rest_api(cmd, "dmd_stop_match");
}
function rest_api_clear_score() {
	const cmd = {payload: {'cmd':'clear'}};
	send_post_rest_api(cmd, "dmd_clear_score");
}

function rest_api_inc_left() {
	const cmd = {payload: {'cmd':'inc_left'}};
	send_post_rest_api(cmd, "dmd_inc_left_score");
}

function rest_api_inc_right() {
	const cmd = {payload: {'cmd':'inc_right'}};
	send_post_rest_api(cmd, "dmd_inc_right_score");
}

function rest_api_dec_left() {
	const cmd = {payload: {'cmd':'dec_left'}};
	send_post_rest_api(cmd, "dmd_dec_left_score");
}
function rest_api_dec_right() {
	const cmd = {payload: {'cmd':'dec_right'}};
	send_post_rest_api(cmd, "dmd_dec_right_score");
}

function getDevicesByLocation(fnOnSuccess = null) {
	console.log(`${getFuncName()}:`);
	const info = {url: 'devices_by_location', payload: {'cmd':'dec_right'}};
	const route = 'devices_by_location';
	const token = ''
	const current_url = getApiWebUrl();

	send_get_rest_api(route, token, fnOnSuccess, current_url);
}


function submitBuyLicense() {
	const info = getInfoFromRadioButton();
	if (info == null) {
		return;
	}
	let start_obj = new Date(document.getElementById('start-date').value);
	start_obj.setUTCHours(0,0,0,0);
	const start_date = start_obj.toISOString().split('.')[0];
	let stop_obj = new Date(document.getElementById('stop-date').value);
	stop_obj.setUTCHours(23,59,59,999);
	const stop_date = stop_obj.toISOString().split('.')[0];
	const device_id = document.getElementById('device_id').value;
	const duration = info.qty;
	const msg = { start_date, stop_date, duration, 'price':info.price, device_id};

	const route = 'license'
	console.log(`Calling send_post_rest_api() with cmd: ${JSON.stringify(msg)}`);
	// api_url = "http://127.0.0.1:4005/api/license/add_new_license
	const url = getApiWebUrl();
	send_post_rest_api(msg, 'add_new_license', (responseStatus, responseText) => {
		let json_obj = JSON.parse(responseText);
		if ( responseStatus === httpStatusOk ) {
			if ( json_obj.result === 'success') {
				console.log("Scheduling added. Response = " + responseText);
			} else {
				console.log(`Licensing Request Error: ${json_obj.error_msg}`);
			}
		} else {
			console.log(`POST error code: ${responseStatus}`)
		}
	}, route, url);
}

function getInfoFromRadioButton() {
	const radios = document.getElementsByTagName('input');
	var info = null;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].type === 'radio' && radios[i].checked) {
			// get value, set checked flag or do whatever you need to
			info = JSON.parse(radios[i].value);
			break;
		}
	}
	return info;
}
function startDateChange() {
	info = getInfoFromRadioButton();
	if (info == null) {
		info = {'qty': 1};
	}
	const start_date = document.getElementById('start-date');
	console.log('Start Date: ', start_date.value);
	const stop_date = document.getElementById('stop-date');
	//const new_date = Date.parse(start_date.value);
	var new_date = new Date(start_date.value);
	console.log('Start Date: ', new_date);
	new_date.setDate(new_date.getDate() + info.qty - 1);
	console.log('new_date: ', new_date);
	stop_date.value = new_date.toISOString().substr(0,10);
	stop_date.min = stop_date.value
}
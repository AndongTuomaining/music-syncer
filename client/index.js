function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  if (document.getElementById("ms-header")) {
    document.getElementById("ms-header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dragElement(document.getElementById("ms-menu"));

let content = document.getElementById("ms-content");

let button = content.querySelector("button")
button.addEventListener("click", () => {
  if (JSON.parse(button.getAttribute("ready"))) {
    button.innerText = "готов";
    button.classList = "btn btn-success";
    button.setAttribute("ready", false)
    socket.send('{"ready": false}')
  } else {
    button.innerText = "не готов";
    button.classList = "btn btn-danger";
    button.setAttribute("ready", true)
    socket.send('{"ready": true}')
  }
})

let socket = new WebSocket("ws://localhost:3000");
socket.onmessage = (message) => {
  msg = JSON.parse(message.data);
  let htmlStr = "";
  for (n in msg) {
    htmlStr += `<div class="ready-state ${msg[n] ? "on" : "off"}"></div>`;
  }
  document.getElementById("connections").innerHTML = htmlStr;
}
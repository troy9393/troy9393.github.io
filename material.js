//Side nav init
const sideNav = document.querySelector(".sidenav");
M.Sidenav.init(sideNav, {});

//Home page index
const slider = document.querySelector(".slider");
M.Slider.init(slider, {
  indicators: false,
  full_width: true,
  trasition: 5000,
  interval: 0,
});

//Get started button animation
$(function () {
  var effects = "animated bounce";
  var effectsEnd =
    "animationend oAnimationEnd mozAnimationENd webkitAnimationEnd";

  $("li.h2").click(function () {
    $(this)
      .addClass(effects)
      .one(effectsEnd, function () {
        $(this).removeClass(effects);
      });
  });
});

//init slider
$(document).ready(function () {
  $(".slider").slider();
});

$(document).ready(function () {
  $(".tooltipped").tooltip();
  $(".collapsible").collapsible();
});

//Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC_r1jPfXBgBKLQ1WJd83RyAexzd5qEdpA",
  authDomain: "mp-1-resume.firebaseapp.com",
  databaseURL: "https://mp-1-resume.firebaseio.com",
  projectId: "mp-1-resume",
  storageBucket: "mp-1-resume.appspot.com",
  messagingSenderId: "795638442893",
  appId: "1:795638442893:web:9b66e34b62b264fa61ebc4",
};

// Initialize Firebase
var defaultProject = firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

const intro = document.querySelector("#introHeader");

function renderIntro(doc) {
  intro.textContent = doc.data().value;
}

//Show introduction data to website
db.collection("others")
  .doc("intro")
  .get()
  .then(function (doc) {
    renderIntro(doc);
  });

const educList = document.querySelector("#tableEducs");

//create element and render educations
function renderEducs(doc) {
  let tr = document.createElement("tr");
  let tdName = document.createElement("td");
  let tdDegree = document.createElement("td");
  let tdStart = document.createElement("td");
  let tdEnd = document.createElement("td");
  let name = document.createElement("span");
  let degree = document.createElement("span");
  let start = document.createElement("span");
  let end = document.createElement("span");

  tr.setAttribute("data-id", doc.id);
  tr.setAttribute("data-aos", "fade-right");
  tr.setAttribute("data-aos-once", "false");
  tr.setAttribute("data-aos-delay", "100");

  name.textContent = doc.data().name;
  degree.textContent = doc.data().degree;
  start.textContent = doc.data().year_start;
  end.textContent = doc.data().year_end;

  tdName.appendChild(name);
  tdDegree.appendChild(degree);
  tdStart.appendChild(start);
  tdEnd.appendChild(end);

  tr.appendChild(tdName);
  tr.appendChild(tdDegree);
  tr.appendChild(tdStart);
  tr.appendChild(tdEnd);

  educList.appendChild(tr);
}

//get data from firebase and render educations section
db.collection("educations")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderEducs(doc);
    });
  });

const workList = document.querySelector("#cardsWorks");

function renderWorks(doc) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divContent = document.createElement("div");
  let spanTitle = document.createElement("span");
  //let spanC = document.createElement("span");

  divCol.setAttribute("class", "col s3 m4");

  divCard.setAttribute("class", "card hoverable");

  divContent.setAttribute("class", "black-text card-content");

  spanTitle.setAttribute("class", "black-text card-title");

  spanTitle.textContent = doc.data().name;

  divContent.appendChild(spanTitle);
  divContent.append(doc.data().lab + " " + doc.data().year_start);
  divCard.appendChild(divContent);
  divCol.appendChild(divCard);

  workList.appendChild(divCol);
}
//get data from firebase and render works section
db.collection("works")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderWorks(doc);
    });
  });

const orgList = document.querySelector("#cardsOrgs");

function renderOrgs(doc) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divContent = document.createElement("div");
  let spanTitle = document.createElement("span");
  //let spanC = document.createElement("span");

  divCol.setAttribute("class", "col s3 m4");

  divCard.setAttribute("class", "card hoverable");

  divContent.setAttribute("class", "black-text card-content");

  spanTitle.setAttribute("class", "black-text card-title");

  spanTitle.textContent = doc.data().name;

  divContent.appendChild(spanTitle);
  divContent.append(
    doc.data().position +
      " " +
      doc.data().year_start +
      " " +
      doc.data().year_end
  );
  divCard.appendChild(divContent);
  divCol.appendChild(divCard);

  orgList.appendChild(divCol);
}
//get data from firebase and render organizations section
db.collection("organizations")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderOrgs(doc);
    });
  });

const skillList = document.querySelector("#cardsSkills");

function renderSkills(doc) {
  let li = document.createElement("li");
  let divRow = document.createElement("div");
  let name = document.createElement("h5");
  let level = document.createElement("h5");
  let divProgress = document.createElement("div");
  let progress = document.createElement("div");

  li.setAttribute("class", "li-skills");

  divRow.setAttribute("class", "row");

  name.setAttribute("class", "col s10 black-text");
  level.setAttribute("class", "col s2 right-align black-text");

  divProgress.setAttribute("class", "progress");
  progress.setAttribute("class", "determinate blue lighten-1");
  progress.setAttribute("style", "width: " + doc.data().level + "%");

  name.textContent = doc.data().name;
  level.textContent = doc.data().level + "%";

  divProgress.appendChild(progress);
  //level.appendChild(divProgress);
  divRow.append(name);
  divRow.append(level);
  divRow.appendChild(divProgress);

  li.appendChild(divRow);

  skillList.appendChild(li);
}
//get data from firebase and render skills section
db.collection("skills")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderSkills(doc);
    });
  });

const aboutList = document.querySelector("#aboutMeCard");

function renderAbout(doc) {
  aboutList.textContent = doc.data().value;
}
//get data from firebase and render about me section
db.collection("others")
  .doc("about")
  .get()
  .then(function (doc) {
    renderAbout(doc);
  });

const contactFB = document.querySelector("#facebook");

function renderFB(doc) {
  let a = document.createElement("a");
  let i = document.createElement("i");

  a.setAttribute("id", "fblink");
  a.setAttribute("href", doc.data().facebook);
  a.setAttribute("class", "blue-text");
  i.setAttribute("class", "fa fa-facebook fa-4x");

  a.appendChild(i);

  contactFB.appendChild(a);
}
//get data from firebase and render facebook icon and links
db.collection("others")
  .doc("link")
  .get()
  .then(function (doc) {
    renderFB(doc);
  });

const contactIG = document.querySelector("#instagram");

function renderIG(doc) {
  let a = document.createElement("a");
  let i = document.createElement("i");

  a.setAttribute("id", "iglink");
  a.setAttribute("href", doc.data().instagram);
  a.setAttribute("class", "blue-text");
  i.setAttribute("class", "fa fa-instagram fa-4x");

  a.appendChild(i);

  contactIG.appendChild(a);
}
//get data from firebase and render instagram icon and links
db.collection("others")
  .doc("link")
  .get()
  .then(function (doc) {
    renderIG(doc);
  });

const contactGIT = document.querySelector("#github");

function renderGIT(doc) {
  let a = document.createElement("a");
  let i = document.createElement("i");

  a.setAttribute("id", "gitlink");
  a.setAttribute("href", doc.data().github);
  a.setAttribute("class", "blue-text");
  i.setAttribute("class", "fa fa-github fa-4x");
  a.appendChild(i);

  contactGIT.appendChild(a);
}
//get data from firebase and render instagram icon and links
db.collection("others")
  .doc("link")
  .get()
  .then(function (doc) {
    renderGIT(doc);
  });

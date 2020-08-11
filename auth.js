$(document).ready(function () {
  //To initialize the modal at page load and make it undismissible until a user logs in
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems, {
    dismissible: false,
  });
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

// assigning the firebase.firestore() as db for easier access.
var db = firebase.firestore();

//Login form
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
  //Prevent page refresh
  e.preventDefault();

  //get data from login form
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  //Firebase authentication
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (user) {
      //console.log("user signed in");

      var user = firebase.auth().currentUser;
      if (user != null) {
        const modal = document.querySelector("#modal-login");
        M.Modal.getInstance(modal).close();
        loginForm.reset();
      }
    })
    .catch(function (err) {
      if (err.code == "auth/wrong-password") {
        alert("Wrong password");
      } else {
        alert(err.message);
      }
    });
});

//Show the edit website's key contents based on there is a logged in user or not.
firebase.auth().onAuthStateChanged((user) => {
  //If a user is logged in.
  if (user) {
    //Set the display to inherit so contents would be visible
    document.getElementById("edit-intro-form").style.display = "inherit";
    document.getElementById("add-education-form").style.display = "inherit";
    document.getElementById("workform").style.display = "inherit";
    document.getElementById("add-orgs-form").style.display = "inherit";
    document.getElementById("skillsForm").style.display = "inherit";
    document.getElementById("edit-about-form").style.display = "inherit";
    document.getElementById("edit-facebook-form").style.display = "inherit";
    document.getElementById("edit-instagram-form").style.display = "inherit";
    document.getElementById("edit-github-form").style.display = "inherit";
    //render the key elements of edit.html
    renderWebsite();
  }
  //if the user is logged out.
  else {
    //open the modal at page load
    var singleModalElem = document.querySelector("#modal-login");
    var instance = M.Modal.getInstance(singleModalElem);
    instance.open();
  }
});

//This functions renders the key contents of the edit.html
function renderWebsite() {
  //logout the user and refresh page to open login modal again
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("user signed out");
        location.reload();
      });
  });

  //select the intro object
  const intro = document.querySelector("#introHeader");

  //render the introduction
  function renderIntro(doc) {
    intro.textContent = doc.data().value;
  }

  //show introduction data to website
  db.collection("others")
    .doc("intro")
    .get()
    .then(function (doc) {
      renderIntro(doc);
    });

  //select the tableEducs object
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
    let del = document.createElement("div");

    tr.setAttribute("data-id", doc.id);
    tr.setAttribute("data-aos", "fade-right");
    tr.setAttribute("data-aos-once", "false");
    tr.setAttribute("data-aos-delay", "100");

    del.setAttribute("style", "cursor:pointer;");

    name.textContent = doc.data().name;
    degree.textContent = doc.data().degree;
    start.textContent = doc.data().year_start;
    end.textContent = doc.data().year_end;
    del.textContent = "X Delete";

    tdName.appendChild(name);
    tdDegree.appendChild(degree);
    tdStart.appendChild(start);
    tdEnd.appendChild(end);

    tr.appendChild(tdName);
    tr.appendChild(tdDegree);
    tr.appendChild(tdStart);
    tr.appendChild(tdEnd);
    tr.appendChild(del);

    educList.appendChild(tr);

    //delete data educations
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute("data-id");
      db.collection("educations").doc(id).delete();
    });
  }

  //update the educations data to the education table in the website
  db.collection("educations")
    .orderBy("year_start")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added") {
          renderEducs(change.doc);
        } else if (change.type == "removed") {
          let tr = educList.querySelector("[data-id=" + change.doc.id + "]");
          educList.removeChild(tr);
        }
      });
    });

  //select the cardWorks object
  const workList = document.querySelector("#cardsWorks");

  //render the work cards
  function renderWorks(doc) {
    let divCol = document.createElement("div");
    let divCard = document.createElement("div");
    let divContent = document.createElement("div");
    let spanTitle = document.createElement("span");
    let del = document.createElement("div");

    divCol.setAttribute("data-id", doc.id);
    divCol.setAttribute("class", "col s3 m4");

    divCard.setAttribute("class", "card hoverable");

    del.setAttribute("class", "black-text");
    del.setAttribute("style", "cursor:pointer;");

    divContent.setAttribute("class", "black-text card-content");

    spanTitle.setAttribute("class", "black-text card-title");

    spanTitle.textContent = doc.data().name;
    del.textContent = "X Delete";

    divContent.appendChild(spanTitle);
    divContent.append(doc.data().lab + " " + doc.data().year_start);
    divCard.appendChild(divContent);
    divCol.appendChild(divCard);
    divCol.appendChild(del);

    workList.appendChild(divCol);

    //delete data educations
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute("data-id");
      db.collection("works").doc(id).delete();
    });
  }

  //show the work cards on the html and update when added/deleted
  db.collection("works")
    .orderBy("year_start")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added") {
          renderWorks(change.doc);
        } else if (change.type == "removed") {
          let tr = workList.querySelector("[data-id=" + change.doc.id + "]");
          workList.removeChild(tr);
        }
      });
    });

  //select the cardsOrgs object
  const orgList = document.querySelector("#cardsOrgs");
  //render the organization cards
  function renderOrgs(doc) {
    let divCol = document.createElement("div");
    let divCard = document.createElement("div");
    let divContent = document.createElement("div");
    let spanTitle = document.createElement("span");
    let del = document.createElement("div");

    divCol.setAttribute("data-id", doc.id);
    divCol.setAttribute("class", "col s3 m4");
    del.setAttribute("style", "cursor:pointer;");

    divCard.setAttribute("class", "card hoverable");

    divContent.setAttribute("class", "black-text card-content");

    spanTitle.setAttribute("class", "black-text card-title");

    spanTitle.textContent = doc.data().name;
    del.textContent = "X Delete";

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
    divCol.appendChild(del);

    orgList.appendChild(divCol);

    //delete data educations
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute("data-id");
      db.collection("organizations").doc(id).delete();
    });
  }

  //show the organization cards in the doc and update when added/deleted
  db.collection("organizations")
    .orderBy("year_start")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added") {
          renderOrgs(change.doc);
        } else if (change.type == "removed") {
          let tr = orgList.querySelector("[data-id=" + change.doc.id + "]");
          orgList.removeChild(tr);
        }
      });
    });

  //select the skills card div
  const skillList = document.querySelector("#cardsSkills");

  //render the skills cards
  function renderSkills(doc) {
    let li = document.createElement("li");
    let divRow = document.createElement("div");
    let name = document.createElement("h5");
    let level = document.createElement("h5");
    let divProgress = document.createElement("div");
    let progress = document.createElement("div");
    let del = document.createElement("div");
    li.setAttribute("data-id", doc.id);
    li.setAttribute("class", "li-skills");
    del.setAttribute("style", "cursor:pointer;");
    divRow.setAttribute("class", "row");

    name.setAttribute("class", "col s10 black-text");
    level.setAttribute("class", "col s2 right-align black-text");

    divProgress.setAttribute("class", "progress");
    progress.setAttribute("class", "determinate blue lighten-1");
    progress.setAttribute("style", "width: " + doc.data().level + "%");

    name.textContent = doc.data().name;
    level.textContent = doc.data().level + "%";
    del.textContent = "X Delete";

    divProgress.appendChild(progress);

    divRow.append(name);
    divRow.append(level);
    divRow.appendChild(divProgress);

    li.appendChild(divRow);
    li.appendChild(del);

    skillList.appendChild(li);

    //delete data skills
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute("data-id");
      db.collection("skills").doc(id).delete();
    });
  }

  //updates the skills cards whenever data is added or deleted
  db.collection("skills").onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderSkills(change.doc);
      } else if (change.type == "removed") {
        let tr = skillList.querySelector("[data-id=" + change.doc.id + "]");
        skillList.removeChild(tr);
      }
    });
  });

  //select the aboutMeCard div
  const aboutList = document.querySelector("#aboutMeCard");

  //render the about card
  function renderAbout(doc) {
    aboutList.textContent = doc.data().value;
  }

  //render the about card
  db.collection("others")
    .doc("about")
    .get()
    .then(function (doc) {
      renderAbout(doc);
    });

  //select the facebook div
  const contactFB = document.querySelector("#facebook");

  //render the fb icon
  function renderFB(doc) {
    let a = document.createElement("a");
    let i = document.createElement("i");
    let span = document.createElement("span");

    a.setAttribute("id", "fblink");
    a.setAttribute("href", doc.data().facebook);
    a.setAttribute("class", "blue-text");
    i.setAttribute("class", "fa fa-facebook fa-4x");
    span.setAttribute("id", "facebookLink");
    span.textContent = doc.data().facebook;

    i.appendChild(span);
    a.appendChild(i);

    contactFB.appendChild(a);
  }

  db.collection("others")
    .doc("link")
    .get()
    .then(function (doc) {
      renderFB(doc);
    });

  //select the instagram div
  const contactIG = document.querySelector("#instagram");

  //render the instagram icon and link
  function renderIG(doc) {
    let a = document.createElement("a");
    let i = document.createElement("i");
    let span = document.createElement("span");

    a.setAttribute("id", "iglink");
    a.setAttribute("href", doc.data().instagram);
    a.setAttribute("class", "blue-text");
    i.setAttribute("class", "fa fa-instagram fa-4x");
    span.setAttribute("id", "instagramLink");
    span.textContent = doc.data().instagram;

    i.appendChild(span);
    a.appendChild(i);

    contactIG.appendChild(a);
  }

  db.collection("others")
    .doc("link")
    .get()
    .then(function (doc) {
      renderIG(doc);
    });

  //select the github div
  const contactGIT = document.querySelector("#github");
  //render github icon and link
  function renderGIT(doc) {
    let a = document.createElement("a");
    let i = document.createElement("i");
    let span = document.createElement("span");

    a.setAttribute("id", "gitlink");
    a.setAttribute("href", doc.data().github);
    a.setAttribute("class", "blue-text");
    i.setAttribute("class", "fa fa-github fa-4x");
    span.setAttribute("id", "githubLink");
    span.textContent = doc.data().github;

    i.appendChild(span);
    a.appendChild(i);

    contactGIT.appendChild(a);
  }

  db.collection("others")
    .doc("link")
    .get()
    .then(function (doc) {
      renderGIT(doc);
    });

  //add educ form
  const educForm = document.querySelector("#add-education-form");

  educForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("educations").add({
      name: educForm.addSchool.value,
      degree: educForm.addDegree.value,
      year_end: educForm.addSchoolEnd.value,
      year_start: educForm.addSchoolStart.value,
    });

    educForm.addSchool.value = "";
    educForm.addDegree.value = "";
    educForm.addSchoolEnd.value = "";
    educForm.addSchoolStart.value = "";
  });

  //add work form
  const workForm = document.querySelector("#workform");

  workForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("works").add({
      name: workForm.addName.value,
      lab: workForm.addLab.value,
      year_start: workForm.addWorkStart.value,
    });

    workForm.addName.value = "";
    workForm.addLab.value = "";
    workForm.addWorkStart.value = "";
  });

  //add orgs form
  const orgForm = document.querySelector("#add-orgs-form");

  orgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("organizations").add({
      name: orgForm.addOrgName.value,
      position: orgForm.addPosition.value,
      year_end: orgForm.addOrgEnd.value,
      year_start: orgForm.addOrgStart.value,
    });

    orgForm.addOrgName.value = "";
    orgForm.addPosition.value = "";
    orgForm.addOrgEnd.value = "";
    orgForm.addOrgStart.value = "";
  });

  //add skills form
  const skillsForm = document.querySelector("#skillsForm");

  skillsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("skills").add({
      name: skillsForm.addLang.value,
      level: skillsForm.addLevel.value,
    });

    skillsForm.addLang.value = "";
    skillsForm.addLevel.value = "";
  });

  //edit intro form
  const introForm = document.querySelector("#edit-intro-form");

  introForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("others").doc("intro").update({
      value: introForm.editIntro.value,
    });
    (introForm.editIntro.value = ""),
      db
        .collection("others")
        .doc("intro")
        .get()
        .then(function (doc) {
          renderIntro(doc);
        });
  });

  //edit about form
  const aboutForm = document.querySelector("#edit-about-form");

  aboutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("others").doc("about").update({
      value: aboutForm.editAbout.value,
    });
    (aboutForm.editAbout.value = ""),
      db
        .collection("others")
        .doc("about")
        .get()
        .then(function (doc) {
          renderAbout(doc);
        });
  });

  //edit fb link
  const fbForm = document.querySelector("#edit-facebook-form");

  fbForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("others").doc("link").update({
      facebook: fbForm.editFB.value,
    });
    (fbForm.editFB.value = ""),
      db
        .collection("others")
        .doc("link")
        .get()
        .then(function (doc) {
          var fblink = document.querySelector("#fblink");
          var fblink2 = document.getElementById("facebookLink");

          fblink.setAttribute("href", doc.data().facebook);
          fblink2.textContent = doc.data().facebook;

          console.log(doc.data().facebook);
        });
  });

  //edit IG link
  const igForm = document.querySelector("#edit-instagram-form");

  igForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("others").doc("link").update({
      instagram: igForm.editIG.value,
    });
    (igForm.editIG.value = ""),
      db
        .collection("others")
        .doc("link")
        .get()
        .then(function (doc) {
          const iglink = document.getElementById("iglink");
          const iglink2 = document.getElementById("instagramLink");

          iglink.setAttribute("href", doc.data().instagram);
          iglink2.textContent = doc.data().instagram;

          console.log(doc.data().instagram);
        });
  });

  //edit git link
  const gitForm = document.querySelector("#edit-github-form");

  gitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("others").doc("link").update({
      github: gitForm.editGIT.value,
    });
    (gitForm.editGIT.value = ""),
      db
        .collection("others")
        .doc("link")
        .get()
        .then(function (doc) {
          const gitlink = document.getElementById("gitlink");
          const gitlink2 = document.getElementById("githubLink");

          gitlink.setAttribute("href", doc.data().github);
          gitlink2.textContent = doc.data().github;

          console.log(doc.data().github);
        });
  });
}

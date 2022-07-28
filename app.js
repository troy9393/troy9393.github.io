const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');

//Mobile menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

menu.addEventListener('click', mobileMenu);


//show active menu
const highlightMenu = () =>{
    const elem = document.querySelector('.highlight');
    const homeMenu = document.querySelector('#home-page');
    const educMenu = document.querySelector('#educ-page');
    const backMenu = document.querySelector('#back-page');
    const affiMenu = document.querySelector('#affi-page');
    const certMenu = document.querySelector('#cert-page');
    let scrollPos = window.scrollY;
    // console.log(scrollPos)

    if(window.innerWidth > 960 && scrollPos < 600){
        homeMenu.classList.add('highlight');
        
        educMenu.classList.remove('highlight');
        return
    } else if(window.innerWidth > 960 && scrollPos < 1400){
        educMenu.classList.add('highlight');

        homeMenu.classList.remove('highlight');   
        backMenu.classList.remove('highlight');
        return
    } else if(window.innerWidth > 960 && scrollPos < 2600){
        backMenu.classList.add('highlight');

        educMenu.classList.remove('highlight');   
        affiMenu.classList.remove('highlight');  
        return
    } else if(window.innerWidth > 960 && scrollPos < 3700){
        affiMenu.classList.add('highlight');

        backMenu.classList.remove('highlight');   
        certMenu.classList.remove('highlight'); 
        return 
    } else if(window.innerWidth > 960 && scrollPos < 5000){
        certMenu.classList.add('highlight');

        affiMenu.classList.remove('highlight');   
        return 
    }

    if((elem && window.innerWidth < 960 && scrollPos < 600) || elem){
        elem.classList.remove('highlight');
    }
}

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active')
    if(window.innerWidth<=768 && menuBars){
        menu.classList.toggle('is-active')
        menuLinks.classList.remove('active')
    }
}

menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);

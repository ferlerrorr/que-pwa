
var deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    
});





window.addEventListener('appinstalled', (evt) => {
    // Log install to analytics
    if (!isInStandaloneMode()) {
        alert('open in app');
    }
});


async function ifexist(){
    if ('getInstalledRelatedApps' in window.navigator) {
        const relatedApps = await navigator.getInstalledRelatedApps();
        relatedApps.forEach((app) => {
          //if your PWA exists in the array it is installed
          alert(app.platform, app.url);
        });
      }
}

ifexist();

const isInStandaloneMode = () =>(window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');




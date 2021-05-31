function onLoadFunction(){
    var timp = document.getElementById("timp");
    var locatie = document.getElementById("locatie");
    var url=document.getElementById("url");
    var nume=document.getElementById("nume");
    var so = document.getElementById("so");
    var versiune=document.getElementById("versiune");
    var castigatoare=document.getElementById("castigatoare");


    timp.innerText=new Date();
    url.innerText=window.location.hostname;
    nume.innerText=window.navigator.appCodeName;
    so.innerText=window.navigator.platform;
    versiune.innerText=window.navigator.appVersion;
    navigator.geolocation.getCurrentPosition((pos)=>{
        document.getElementById("locatie").innerHTML="Lat:" + pos.coords.latitude + ",Long " + pos.coords.longitude;
    });

    var myVar=setInterval(myTimer,1000);
    function myTimer(){
        var d=new Date();
        document.getElementById("timp").innerHTML="ora curenta: " + d.toLocaleTimeString();
    }

  
    

   
};



function schimbaContinut(resursa){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            document.getElementById("continut").innerHTML = this.responseText;

            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                    console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = "/"+jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
        }
    }

    xhttp.open("GET",resursa, true)
    xhttp.send();
};
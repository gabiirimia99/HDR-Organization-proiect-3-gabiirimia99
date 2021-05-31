const cookieParser=require('cookie-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const fs=require('fs');

const app = express();
app.use(cookieParser())
const port = 6780;

var listaIntrebari= [];
var utilizatori;
fs.readFile('utilizatori.json',(err,data) => {
	if(err) throw err;
	utilizatori = JSON.parse(data);
});

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => res.render('index'));

app.get('/despre', (req, res) => res.render('despre'));

app.get('/iesire', (req, res) => res.render('iesire'));


app.get('/video', (req, res) => res.render('video'));

app.get('/butonjs', (req, res) => res.render('butonjs'));


app.get('/autentificare', (req,res) => res.render('autentificare',{ErrorAuth:req.cookies['ErrorAuth']}));

app.post('/verificare-autentificare',(req,res) => {
	console.log(req.body);
	if(req.body["uname"]==utilizatori[0].uname && req.body["psw"]==utilizatori[0].psw)
	{
		res.cookie('log','Te-ai logat cu succes! '+req.body['uname']+'!',{maxAge:600000,httpOnly:true});
		if(req.cookies['uname']!=null)
		{
			res.clearCookie('uname');
		}
		res.redirect('/iesire');
	}

	else
	{
		res.cookie('ErrorAuth','Utilizator sau parola gresit!',{maxAge:1000,httpOnly:true});
		res.cookie('uname',null);
		res.redirect('/autentificare');

		res.end();
	}
});


app.get('/iesire',function(req,res) {
	res.clearCookie('uname');
	res.clearCookie('log');
	res.redirect('/');
});

/*app.get('/autentificare',(req,res) =>{


	var eroare="";
	//if(!req.session.uname)
	//{
	//	delete req.session.usrname
	//}

	//if(req,cookies.mesajEroare)
	//{
		//eroare=req.cookies.mesajEroare;
		//res.clearCookie("mesajEroare");
	//}
	
	res.render('autentificare',{mesaj:eroare});

});
const users = require('./data').userDB;
*/


/*app.post('/autentificarerez', async (req, res) => {
   // try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: data.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
  //  } 
	//catch 
	//	{
    //    	res.send("Internal server error");
    //	}
});*/

/*app.post('/verificare-autentificare', (req, res) => {
   // try{
	   console.log(req.body);
	   var ok=0;
	   var content= fs.readFileSync('utilizatori.json','utf8');
	   var conturi = JSON.parse(content);
	   var name="";
	   for(var cont of conturi)
	   {
			if(req.body.user =cont.utilizator && req.body.pass == cont.parola)
			{
				ok =1;
				name = req.body.user;
				show =1;
			}
	   }
	   if(ok == 1)
	   {
		   res.cookie('numeUtilizator',name);
		 //  req.session.numeUtilizator = name;

		   res.redirect("https://localhost:6789/");
	   }
	   else
	   {
			res.cookie('mesajEroare','Utilizator/parola gresite: Reintroduceti datele de autentificare!');
			res.redirect(302,"https://localhost:6789/autentificare");
	   }
       
   // } catch{
   //    res.send("Internal server error");
   // }
});
*/
// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar', (req, res) => {
	listaIntrebari = [
		{
			intrebare: '1. Pisica SFINX provine din:',
			variante: ['Toronto', 'Londra', 'Instanbul', 'Sofia'],
			corect: 0
		},
		{
			intrebare: '2. Principala caracteristică a pisicii Sphynx este lipsa _______!',
			variante: ['nasului', 'capului', 'cozii', 'blănii'],
			corect: 3
		},
		{
			intrebare: 'Ochii sunt adânciți în orbite și au formă de _______',
			variante: ['măr', 'banană', 'lămâie', 'piersică'],
			corect: 2
		},
		{
			intrebare: 'In ce an au fost găsiți, cei trei pui fără păr în Toronto  ?',
			variante: ['1978', '1938', '1993', '1983'],
			corect: 0
		},
		{
			intrebare: 'Are nevoie de îngrijire : ',
			variante: ['zilnică', 'săptămânală', 'anuală', 'lunară'],
			corect: 1
		}
		//...
	];
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('chestionar', {intrebari: listaIntrebari});
});

app.post('/rezultat-chestionar', (req, res) => {
	console.log(req.body);
	let raspuns=0;
	for(i=0;i<listaIntrebari.length;i++)
		{
			for(j=0;j<listaIntrebari[i].variante.length;j++)
				{
					if(req.body["ras"+(i+1)]==listaIntrebari[i].corect)
					{
						raspuns=raspuns+2;
					}
				}

		}
	res.render('rezultat-chestionar', {a:raspuns});
	//res.send("formular: " + JSON.stringify(req.body));
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:6780`));
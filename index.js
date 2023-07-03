import express from "express";
import path from "path";
import mongoose, { mongo } from "mongoose"


//DataBase connection
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"NewDb",
}).then(()=>{
    console.log("DataBase is connected")
}).catch((err)=>{
    console.log(err);
})
//creating Schema...
const RegSch = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,

    }
});

const Reg = mongoose.model("RegDB",RegSch);




//variables
let path_location = path.resolve()   // for getting  static file location
let arr = [];
const app = express();
const port = 3000;

// using middlewares
app.use(express.static(path.join(path_location, "public"))); // to connect with public folder
app.use(express.urlencoded({ extended: true })); // to get the form inputs

// set the view engine to ejs
app.set('view engine', 'ejs');




app.get('/', (req, res) => {
    res.render("index");

})


app.post('/register', (req, res) => {

    
        const id= req.body.UserID;
        const Email= req.body.email;
        const Password=req.body.pass;
  
   
    // res.render("submitted",{user})
    Reg.create({name:id,email:Email,password:Password}).then(()=>{
        // res.send("Data Is Added");
        res.render("index");
    }).catch((err)=>{
        console.log(err);
    })


})

app.post('/login',async(req,res)=>{
    
    const {name,password}=req.body;
    let data = await Reg.findOne({name});
    console.log(data.name)
    if(!data){
        console.log("User not found Register first")
        return res.render('index',{msg:"User not found Register first"});
    }
   
    const ismatch = data.password===password;
    if(!ismatch){
        console.log("password Incorrecd")
        return res.render('index',{msg:"password Incorrecd"});
    } 
    else{
        return res.render("submitted",{msg:data.name});
     }
   });






// app.get('/add',(req,res)=>{
//     msg.create({name:"Kush Kumar",password:"Kushkumar@123"}).then(()=>{
//         res.send("Data is Added");
//     }).catch((err)=>{
//         console.log(err);
//     })
// })

























// saving data in temperory array
app.get('/arr', (req, res) => {
    res.json({ arr, });

});


// app.get("/", (req, res) => {
//     /*
//      // this is when you only wants to send html file to browser by nodejs but you can naot pass any value to html page by the server
//     const file1 = path.join(path_location,"index.html")  -> for convertion location in string.

//     res.sendFile(file1);   
//     */



// });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
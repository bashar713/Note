const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');



mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

wikiDBSchema = {
    title: String,
    content: String
};

const articles = mongoose.model("article" , wikiDBSchema);



const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '../node_modules/bootstrap/dist'));

app.get("/" , (req,res)=>{
   articles.find({}, (err , data)=>{
       if(!err){
            res.render('home.ejs' , {content : data})
       }
   });
});


app.post("/" , (req,res)=>{
    const newPosts = new articles({
        title :   req.body.title,
        content : req.body.content
    })
    newPosts.save(function(err){
        if (!err){
     
          res.redirect("/");
        }
     
      });
});

app.route("/delete")    
    .get((req,res)=>{
        res.render("delete.ejs")
    })

    .post((req, res)=>{
        const deleteItem = req.body.delete
        articles.deleteOne({"title" : deleteItem} , (err , data)=>{
            if(!err){
                res.redirect('/')
            }
        })
    })


app.get("/upload" , (req , res )=>{
    res.render("upload" );
})
app.listen('3000' ,()=>
{
    console.log("Server is running on Port 3000...");
});
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash")
const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view-engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-zyzer:VQHWsBICNL9nv9qE@cluster1.pkihfp9.mongodb.net/todolistDB")

const itemsSchema = new Schema({
    name: String
});

const Item = model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to your todolist"
})
const item2 = new Item ({
    name: "Press the plus button to add a new item"
})
const item3 = new Item ({
    name: "Hit the checkbox to delete an item"
})

const defaultItems = [item1, item2, item3];

const listSchema = new Schema({
    name: String,
    items: [itemsSchema]
})

const List = model("List", listSchema);


app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err){
            if (err) {
                console.log(err);
            } else {
                console.log("Document inserted succesfully");
            }
        })
        res.redirect("/")
        } else {
            res.render("list.ejs", {listTitle: "Today", newListItems: foundItems })
        }
    })

    // const day = date.getDate();

    
})

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listTitle = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (listTitle === "Today") {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({name: listTitle}, function(err, foundList){
            foundList.items.push(item)
            foundList.save();
            res.redirect("/" + listTitle);
        })
    }

})

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName)
            } else {
                res.render("list.ejs", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    })
});



app.get("/about", function(req, res){
    res.render("about.ejs");
})

app.post("/delete", function(req, res){
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItem, function(err){
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted one item");
                res.redirect("/")
    
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, foundList){
            if (!err) {
                res.redirect("/" + listName)
            }
        });

    }

})


app.listen(process.env.PORT || port, function(){
    console.log("App is running on port " + port);
})


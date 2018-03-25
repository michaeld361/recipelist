
var app = app || {};
app.dom = {};
app.recipeList = [];

app.init = function()
{
    app.setupDom();
    console.log('setup!');
    app.recipes = document.querySelectorAll('.recipe');
    console.log(app.recipes.length);

    app.addEvents();
    app.getRecipeList();


}

app.setupDom = function(){
    app.dom.recipe        = document.getElementById('recipeContainer');
    app.dom.list          = document.getElementById('listContainer');
    app.dom.backBtn       = document.getElementById('backBtn');
    app.dom.addBtn        = document.getElementById('addBtn');
    app.dom.addContainer  = document.getElementById('addContainer');
    app.dom.header        = document.getElementById('header');
    app.dom.listContainer = document.getElementById('listContainer');
    app.dom.submitBtn     = document.getElementById('submitBtn');
}

app.addEvents = function()
{
    for(var i = 0; i < app.recipes.length; i++)
    {
        
        app.recipes[i].addEventListener('click', function(){app.showRecipe(app.recipes[i])});
    }

    app.dom.backBtn.addEventListener('click', function(){
    app.dom.header.style.letterSpacing = "3px";
    app.dom.recipe.style.left       = "100%";
    app.dom.list.style.left         = "0%";
    app.dom.backBtn.style.display   = "none";
    app.dom.addBtn.style.display    = "block";
    app.dom.header.innerHTML        = "RecipeStack"
    });

    app.dom.addBtn.addEventListener('click', function(){
        app.dom.addContainer.style.display = "block";
        app.dom.header.style.filter = 'blur(3px)';
        app.dom.listContainer.style.filter = 'blur(3px)';
        setTimeout(function(){app.dom.addContainer.style.opacity = '0.8';}, 10);
    });

    app.dom.submitBtn.addEventListener('click', function(){app.postList();});
}



app.showRecipe = function(recipe)
{
    app.getRecipe(recipe._id)
    app.dom.recipe.style.left     = "0px";
    app.dom.list.style.left       = "-50%";
    app.dom.backBtn.style.display = "block";
    app.dom.addBtn.style.display  = "none";
    app.dom.header.innerHTML = recipe.name;
    app.dom.header.style.letterSpacing = "initial";
   console.log("recipe: " + recipe);
}

app.getRecipeList = function()
{
  var xmlhttp = new XMLHttpRequest();
  var url     = "http://localhost:7000/api/recipe/";

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          app.showRecipeList(JSON.parse(xmlhttp.responseText));
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


app.getRecipe = function(recipeID)
{
  var xmlhttp = new XMLHttpRequest();
  var url     = "http://localhost:7000/api/recipe/" + recipeID + "/lists";

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          //app.showRecipeList(JSON.parse(xmlhttp.responseText));
          console.log(JSON.parse(xmlhttp.responseText));
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


app.showRecipeList = function(recipeList)
{
    for(var i = 0; i< recipeList.length; i++)
    {
        console.log(recipeList[i].name);
        app.buildRecipeList(recipeList[i]);
    }



}



app.buildRecipeList = function(recipeItem)
{
    var recipe = document.createElement('div');
    app.recipeList.push(recipe);
    recipe.setAttribute('class', 'recipe');
    recipe.innerHTML = recipeItem.name;
    recipe.addEventListener('click', function(){
        app.showRecipe(recipeItem);
    })
    app.dom.listContainer.appendChild(recipe);

}


app.postList = function()
{

  var recipeName = document.getElementById('recipeName').value;
  var recipeIngredients = document.getElementById('ingredients').value;

  var partsOfStr = recipeIngredients.split(',');
  var listItems = "";
  for(var i = 0; i < partsOfStr.length; i++)
  {
    listItems += "&lists=" + partsOfStr[i];
    console.log(listItems);
  }

  document.getElementById('recipeName').value = "";
  document.getElementById('ingredients').value = "";

  var http = new XMLHttpRequest();
  var url = "http://localhost:7000/api/recipe/";
  var params = "name=" + recipeName + "&" + listItems;
  console.log('params: ' + params)
  http.open("POST", url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
        app.dom.addContainer.style.opacity = "0";
        app.dom.addContainer.style.display = "none";
        app.dom.listContainer.style.filter = "initial";
        app.dom.header.style.filter = "initial";
    }
  }

  http.send(params);
}






setTimeout(function(){
    app.init();
}, 10);
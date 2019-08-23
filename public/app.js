//opens and adds content to modals
$(document).on("click", ".articleComment", function () {
    $("#comments").empty()
    var thisId = $(this).attr("data-_id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#comments").append("<h2>" + data.title + "</h2><br>");
            $("#comments").append("<div id='otherComments'></div>")
            $("#comments").append("Title: <br><input id='titleinput' name='title' ><br>");
            $("#comments").append("Comment: <br><textarea id='bodyinput' class='form-control' name='body'></textarea><br>");
            $("#comments").append("<button class='btn btn-success' data-_id='" + data._id + "' id='saveComment'>Save Comment</button>");

            if (data.comment) {
                $("#otherComments").append("<hr>Another user commented: <strong>" + data.comment.title + "</strong> - " + data.comment.body + "  <button class='ml-2 btn btn-danger' data-_id='" + data.comment._id + "' id='deleteComment'>Delete</button><hr>");
            }
        });
});

//saves comment to db
$(document).on("click", "#saveComment", function () {
    var thisId = $(this).attr("data-_id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            location.reload()
        });

    $("#commentTitle").val("");
    $("#commentArea").val("");
});

//saves article by updating save status
$(document).on("click", ".articleSave", function () {
  
    var thisId = $(this).attr("data-_id");
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId,
        data: {
            saved: true
        }
    })
        .then(function (data) {
            console.log(data);
            location.reload()
        });
});

//removes article from saved
$(document).on("click", ".articleUnsave", function () {
    var thisId = $(this).attr("data-_id");
    $.ajax({
        method: "POST",
        url: "/unsaved/" + thisId,
        data: {
            saved: false
        }
    })
        .then(function () {
            location.reload()
        });
});

//runs new scrape
$(document).on("click", "#scrapeButton", function () {
    setTimeout(location.reload.bind(location), 2500);
    $.ajax({
        method: "GET",
        url: "/scraper",
    })
    
        .then(function () {
            
            
        });
});

//clears database of articles
$(document).on("click", "#clearButton", function () {
    $.ajax({
        method: "GET",
        url: "/clear",
    })
        .then(function () {
            console.log("db cleared");
            location.reload()
        });
        
});


//removes a comment
$(document).on("click", "#deleteComment", function () {

    var thisId = $(this).attr("data-_id");

    $.ajax({
        method: "GET",
        url: "/comments/" + thisId,
    })
        .then(function (data) {
            console.log(data);
            location.reload()
        });

});
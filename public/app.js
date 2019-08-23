$.getJSON("/articles", function(data) {
    console.log(data)
});

$(document).on("click", ".articleComment", function () {
    $("#comments").empty()
    var thisId = $(this).attr("data-_id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#comments").append("<h2>" + data.title + "</h2><br>");
            // An input to enter a new title
            $("#comments").append("<input id='titleinput' name='title' ><br><br>");
           
            $("#comments").append("<textarea id='bodyinput' class='form-control' name='body'></textarea><br>");
            // A button to submit a new note, with the id of the article saved to it
            $("#comments").append("<button class='btn btn-success' data-_id='" + data._id + "' id='saveComment'>Save Comment</button>");

            if (data.comment) {
                $("#titleinput").val(data.comment.title);
                $("#bodyinput").val(data.comment.body);
               
            }
        });
});

// When you click the savenote button
$(document).on("click", "#saveComment", function () {
    alert("howdy")
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-_id");
   
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#commentTitle").val("");
    $("#commentArea").val("");
});

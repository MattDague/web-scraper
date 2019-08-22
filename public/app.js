$(".articleComment").on("click", function () {
    // $("#notes").empty();// $("#notes").empty();
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // // The title of the article
            // $("#notes").append("<h2>" + data.title + "</h2>");
            // // An input to enter a new title
            // $("#notes").append("<input id='titleinput' name='title' >");
            // // A textarea to add a new note body
            // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // // A button to submit a new note, with the id of the article saved to it
            // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.comment) {
                $("#commentTitle").val(data.note.title);
                $("#commentArea").val(data.note.body);
               
            }
        });
});

// When you click the savenote button
$(".saveComment").on("click", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    alert("hello")

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#commentTitle").val(),
            // Value taken from note textarea
            body: $("#commentArea").val()
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

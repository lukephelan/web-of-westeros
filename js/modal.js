$(function(){
    // When the user clicks on <span> (x), close the modal
    $(".close").click(function() {
        $("#name, #bio").empty();
        $(".modal").css("display", "none");
    });
});

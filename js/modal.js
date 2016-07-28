$(function(){
    // When the user clicks on <span> (x), close the modal
    $(".close").click(function() {
        $("#name, #bio, #profile-pic").empty();
        $(".modal").css("display", "none");
    });
});

$(".fa-brands").hover(function() {
    $(this).toggleClass("fa-2xl");
});

function confirmDel() {
    return confirm("Are you sure?");
};

function submitForm() {
    // Find the form by its ID
    var form = document.getElementById('signOutForm');

    // Trigger the form submission
    form.submit();
}
document.getElementById("toggleDescriptionButton").addEventListener("click", function () {
    var descriptionSection = document.getElementById("descriptionSection");
    if (descriptionSection.className === "invisible") {
        descriptionSection.className = "visible";
    } else {
        descriptionSection.className = "invisible";
    }
});

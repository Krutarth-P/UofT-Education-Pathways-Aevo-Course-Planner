// We want an array of all the times someone clicked some "Add" button
// Resulting output will be the following: 
    // (1) Change text from "Add" to "Added" momentarily --> Incorporate state change and timeout
    // (2) Add course to local array/map/dataType to be stored into CSV later
    // (3) Add

const addCourse = document.querySelector(".addCourse") 

addCourse.addEventListener("click", e => {
    //Apply code to change
})

setTimeout(() => 
    addCourse.removeEventListener("click", courseAddedStatement)
}, 2000)


function courseAddedStatement() {
    console.log("Course Added")         //(1)
}
//SHORTER VERSION OF THE CODE

exports.getDate = function() {

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    return (today.toLocaleDateString("en-US", options));

}

//LONGER VERSION OF THE CODE

module.exports.getDay = getDay;

function getDay() {
    
    const date = new Date();

    const options = {
        weekday: "long"
    }

    return (date.toLocaleDateString("en-US", options));

}

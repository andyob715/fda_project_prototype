// read json file
d3.json('../../df.json'). then(function(response){
    var table = []; 
    for (var i = 0; i < response.length; i++) {
        $.each(response, function(index, value){
            alert(value.(voluntary_mandated:"Voluntary: Firm initiated"))
        })
    }
    
});







//select recall table to add values



// var reasons = []





// loop through json file for count of FDA Mandated & vol recall for each status type (ongoing, terminated, complete)




//pie chart of 
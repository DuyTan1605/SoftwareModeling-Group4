function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
 function updateTextArea() { 
        
    if ($("input:checked").length == ($("#Numseats").val()))
        {
        $(".seatStructure *").prop("disabled", true);
        
        var allNameVals = [];
        var allNumberVals = [];
        var allSeatsVals = [];
    
        //Storing in Array
        allNumberVals.push($("#Numseats").val());
        $('#seatsBlock :checked').each(function() {
        allSeatsVals.push($(this).val());
        });
        
        //Displaying 
    
        $('#NumberDisplay').val(allNumberVals);
        $('#seatsDisplay').val(allSeatsVals);
        }
    else
        {
        document.getElementById("notification").innerHTML = `Vui lòng chọn đủ `+ $("#Numseats").val()+` ghế`;
        $(".notice").show();
        //alert("Please select " + ($("#Numseats").val()) + " seats")
        }
    }

$(document).ready(function()
{
    function myFunction() {
    alert($("input:checked").length);
    }

    $("#backStep1").on("click",function()
    {
       window.history.back();
    })


    $(":checkbox").click(function() {
    if ($("input:checked").length == ($("#Numseats").val())) {
        $(":checkbox").prop('disabled', true);
        $(':checked').prop('disabled', false);
    }
    else
        {
        $(":checkbox").prop('disabled', false);
        }
    });
   function loadData()
   {
       let html='';
       let sum=0;
       let seat=0;
    
       var reversed_arr=JSON.parse(decodeURIComponent("{{{seats}}}"));
       console.log(reversed_arr);
      
       $("#sum_price").html(sum+" VNĐ");
       $("#Numseats").val(seat);
       $("input[type='checkbox']").each(function()
       {
         if(reversed_arr.length>0)
         {
           for(let i=0;i<reversed_arr.length;i++)
           {
            let temp=reversed_arr[i].vitrighe.split(",");
            for(let j=0;j<temp.length;j++)
            {
              if($(this).val()==temp[j])
              {
                 $(this).attr({type:'text',readonly:'true'}).addClass("redBg");
                 
              }
            }
         }
         }
       });
   }
   loadData();
   
})


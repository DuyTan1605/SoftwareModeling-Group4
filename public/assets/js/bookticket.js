

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
function updateSummary()
{
    var data='';
    var sum_ticket=0;
    var tickets=document.getElementsByClassName("ticket");
    var services=document.getElementsByClassName("service");
    for(let i=0;i<tickets.length;i++)
    {
        console.log(tickets[i]);
      if(tickets[i].getElementsByClassName("sum_tickets")[0].innerHTML!="")
      {
         
        data+=tickets[i].getElementsByClassName("quantity_ticket")[0].value+" "+tickets[i].getElementsByClassName("ticket_name")[0].innerHTML+" + ";
      sum_ticket+=parseInt(tickets[i].getElementsByClassName("quantity_ticket")[0].value);
      
    }
    
    }
   
    for(let i=0;i<services.length;i++)
    {
      if(services[i].getElementsByClassName("sum_services")[0].innerHTML!="")
      {
         
        data+=services[i].getElementsByClassName("quantity_service")[0].value+" "+services[i].getElementsByClassName("service_name")[0].innerHTML+" + ";
        
          
    }
    
    }
    data=data.slice(0,data.length-3);
    document.getElementById("arr_choices").innerHTML=data;
    sessionStorage.setItem("total_ticket",sum_ticket);
}
function updateTotalPrice()
{
    var sum=0;
    var tickets=document.getElementsByClassName("ticket");
    for(let i=0;i<tickets.length;i++)
    {
        let price=Number(tickets[i].getElementsByClassName("sum_tickets")[0].innerHTML==''?0:tickets[i].getElementsByClassName("sum_tickets")[0].innerHTML);
        sum+=price;
        
    }

    var services=document.getElementsByClassName("service");
    for(let i=0;i<services.length;i++)
    {
        let price=Number(services[i].getElementsByClassName("sum_services")[0].innerHTML==''?0:services[i].getElementsByClassName("sum_services")[0].innerHTML);
        sum+=price;
        
    }
  document.getElementById("sum_price").innerHTML=sum+" VNĐ";
    // var services=document.getElementsByClassName("sum_services");
    // for(let i=0;services.length;i++)
    // {
    //     console.log(services[i]);
    // }
}

function quantityChanged(event,type)
{

    var quantity=Number(event.target.value);
    var price=Number(event.target.parentElement.parentElement.getElementsByClassName("price")[0].innerText);
    console.log(type);
    console.log(quantity*price);
    if(type==1)
    {
        $(".seatStructure *").prop("disabled", false);
        if(quantity==0)
        {
            event.target.parentElement.parentElement.getElementsByClassName("sum_tickets")[0].innerText='';
        }
        else
        {
            event.target.parentElement.parentElement.getElementsByClassName("sum_tickets")[0].innerText=quantity*price;
            //console.log(event.target.parentElement.parentElement.getElementsByClassName("sum_tickets")[0]);
        }
    }
    else{

        if(quantity==0)
        {
            event.target.parentElement.parentElement.getElementsByClassName("sum_services")[0].innerText='';
        }
        else
        {
            event.target.parentElement.parentElement.getElementsByClassName("sum_services")[0].innerText=quantity*price;
            //console.log(event.target.parentElement.parentElement.getElementsByClassName("sum_tickets")[0]);
        }
    }
    updateTotalPrice();
    updateSummary();
}

function ready()
{
    var quantityInputsTicket = document.getElementsByClassName('quantity_ticket');
    for (var i = 0; i < quantityInputsTicket.length; i++) {
        var input = quantityInputsTicket[i];
        input.addEventListener('change', function(event){quantityChanged(event,1)});
    }
    var quantityInputsService = document.getElementsByClassName('quantity_service');
    for (var i = 0; i < quantityInputsService.length; i++) {
        var input = quantityInputsService[i];
        input.addEventListener('change', function(event){quantityChanged(event,2)});
    }
}
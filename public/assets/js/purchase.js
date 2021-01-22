const stripe = require('stripe')(stripeSecretKey);
const dotenv=require("dotenv");
dotenv.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
var stripeHandler = StripeCheckout.configure({
    key: process.env.STRIPE_PUBLIC_KEY,
    locale: 'en',
    token: function(token) {

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                amount: 80000
            })
        })
    }
})
function openPayment(price)
{
    stripeHandler.open({
        amount: price,
        currency:'vnd'
    })
}

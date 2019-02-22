var stripe = Stripe('pk_test_oWvq3qZUH3yrFK24DXudUqBK');
var elements = stripe.elements();

// wat Discount Jonas doet:

var $form = $('#checkout-form');        // grijp het formulier bij zijn ID

$form.submit(function(event) {
    $('#charge-error').addClass('hidden');  // om dat html-element onzichtbaar te maken (...moet je 'hidden' dan niet weghalen in de html zelf? Krijg je anders niet 2 hiddens zodat er niks gebeurt als je er 1 weghaalt??)
    $form.find('button').prop('disabled', true);    // grijp button (is er maar 1), zet 'disabled' op 'true'
    
    // copypaste deze functie van de Stripesite van 3 jaar geleden
    Stripe.card.createToken({
        number: $('#card-number').val(),            // is dus de jQueryversie van getElementById, met ID-nummer van die html-elementen
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()       
    }, stripeResponseHandler);          // met callback (zie hieronder)
    return false;           // want we willen dit nog niet naar de server sturen voor het is gevalidatet
});

function stripeResponseHandler() {      // stond ook op Stripesite
    if (Response.error) {

        // show the errors on the form
        $('#charge-error').text(response.error.message);       // grijp html-element waar errors geshowd moeten worden. Geen form.find, want charge-error staat niet binnen de form
        $('#charge-error').removeClass('hidden');              // dat html is normaal gesproken niet zichtbaar, en moet dat nu wel worden
        $form.find('button').prop('disabled', false);   // de submit button moet weer actief gemaakt worden, anders kan de gebruiker geen tweede poging doen na een tikfout oid
    } else {    // token was created
        var token = response.id; // get the token ID

        //insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));       // dus hier wordt dat token als extra info aan de info uit het formulier toegevoegd, en dat is dan... bewijs dat de boel valid is?

        //submit the form to the server
        $form.get(0).submit();
    }

}
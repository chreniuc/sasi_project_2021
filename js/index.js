// Button actions

// Playfair encrypt button
$( "#playfair_encrypt" ).click(function( event ) {
    event.preventDefault(); // Avoid going to the top page.
    // call playfair encrypt
    console.log("playfair_encrypt");
    encyrpt_playfair_button();
});

// Playfair decrypt button
$( "#playfair_decrypt" ).click(function( event ) {
    event.preventDefault(); // Avoid going to the top page.
    // call playfair decrypt
    console.log("playfair_decrypt");
    decrypt_playfair_button();
});

// ADFGVX encrypt button
$( "#adfgvx_encrypt" ).click(function( event ) {
    event.preventDefault(); // Avoid going to the top page.
    // call playfair encrypt
    console.log("adfgvx_encrypt");
});

// ADFGVX encrypt button
$( "#adfgvx_decrypt" ).click(function( event ) {
    event.preventDefault(); // Avoid going to the top page.
    // call playfair encrypt
    console.log("adfgvx_decrypt");
});
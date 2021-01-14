//
// Hreniuc Cristian-Alexandru 2020 
// ADFGVX implementation
// Source of inspiration: http://practicalcryptography.com/ciphers/classical-era/adfgvx/#a-short-example

// Called when encyrpt_adfgvx is pressed.
function encyrpt_adfgvx_button()
{
  let input_string = $( "#adfgvx_input_text" ).val().toUpperCase();
  // Keep only the letters and numbers:
  input_string = input_string.replace(/[^A-Z0-9]/g, "");
  // Convert to array
  let input_string_array = input_string.split("");

  let input_key_1_array =  prepare_key_1();
  let input_key_2_array = prepare_key_2();
  let ciphertext_1 = get_ciphertext_1(input_string_array, input_key_1_array, input_key_2_array);

  let encrypted_text = encrypt(ciphertext_1, input_key_2_array);
  let output_string = $( "#adfgvx_output_text" );
  output_string.val(encrypted_text);
}

// Prepare the first key to be used to generate the ciphertext.
function prepare_key_1()
{
  let input_key_1 = $( "#adfgvx_input_key_1" ).val().toUpperCase();
  console.log("Key1 val: " + input_key_1);
  input_key_1 = input_key_1.replace(/[^A-Z]/g, "");
  console.log("After replace: " + input_key_1);
  // Convert to array
  let input_key_1_array = input_key_1.split("");
  // Keep only the unique chars
  input_key_1_array = [...new Set(input_key_1_array)];
  console.log("After unique: " + input_key_1_array);

  // Key 1
  // Complete with the missing letters, until we reach 36 elements: 6*6
  for(let char_code = 65; char_code <= 90; char_code++) // ascii code for capital letters
  {
    let letter = String.fromCharCode(char_code);
    if(!input_key_1_array.includes(letter))
    {
      input_key_1_array.push(letter);
    }
    if(input_key_1_array.length == 36)
    {
      break;
    }
  }
  console.log("After missing letters: " + input_key_1_array);

  // Add the missing digits:
  let digit_ascii_code = 48; // for 0 digit.
  while(input_key_1_array.length < 36)
  {
    let digit = String.fromCharCode(digit_ascii_code);
    input_key_1_array.push(digit);
    digit_ascii_code = digit_ascii_code+1;
  }
  console.log("After missing digits: " + input_key_1_array);
  console.log(input_key_1_array);

  return input_key_1_array;
}

// Generate the first ciphertext based on the first key.
function get_ciphertext_1(input_string_array, input_key_1_array, input_key_2_array)
{
  // first use polybius square to encipher plaintext
  const adfgvx = "ADFGVX";
  let ciphertext_1 = "";
  for( i = 0; i < input_string_array.length; i++)
  {
    let index = input_key_1_array.indexOf(input_string_array[i]);
    ciphertext_1 += adfgvx.charAt(index/6) + adfgvx.charAt(index%6);
  }
  let num_cols = ciphertext_1.length%input_key_2_array.length;

  while(num_cols!=0)
  {
    ciphertext_1 = ciphertext_1 + "X";
    num_cols = ciphertext_1.length%input_key_2_array.length;
  }
  console.log("Ciphertext: " + ciphertext_1);
  return ciphertext_1.split("");
}

// Prepare the second key to be used to generate the encrypted text.
function prepare_key_2()
{
  let input_key_2 = $( "#adfgvx_input_key_2" ).val().toUpperCase();
  console.log("Key2 val: " + input_key_2);
  input_key_2 = input_key_2.replace(/[^A-Z]/g, "");
  console.log("After replace: " + input_key_2);
  // Convert to array
  let input_key_2_array = input_key_2.split("");
  input_key_2_array = [...new Set(input_key_2_array)];
  
  return input_key_2_array;
}

function encrypt(ciphertext_1, input_key_2_array)
{
  // Get transposition array:
  let num_cols = ciphertext_1.length/input_key_2_array.length;
  let transposition_array = create_transposition_array(ciphertext_1,num_cols );
  console.log("After transpositon: \n" + JSON.stringify(transposition_array));

  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
  let encrypted_text = "";
  let letters_found = 0;
  // For every letter from the second key, we will search to see the order.

  for(letter_in_alphabet = 0; letter_in_alphabet < letters.length && letters_found <  input_key_2_array.length; letter_in_alphabet++)
  {
    letter_position_in_key = input_key_2_array.indexOf(letters.charAt(letter_in_alphabet));
    console.log("Searching for: " + letters.charAt(letter_in_alphabet) + ". Fount at: " + letter_position_in_key + ". Letters found: " + letters_found);
    if(letter_position_in_key >= 0)
    {
      // found in the key
      letters_found++;
      encrypted_text = encrypted_text + transposition_array[letter_position_in_key].join("");
    }
    console.log("Partial encrypted text: " + encrypted_text);
  }
  console.log("Encrypted text: " + encrypted_text);
  let rgxp = new RegExp(".{1," + num_cols +"}", "g");
  return encrypted_text.match(rgxp).join(" ");
}


/// Decrypt

// Called when encyrpt_adfgvx is pressed.
function decrypt_adfgvx_button()
{
  let input_string = $( "#adfgvx_input_text" ).val().toUpperCase();
  input_string = input_string.replace(/[^A-Z0-9]/g, "");
  // Convert to array
  let input_string_array = input_string.split("");

  let input_key_1_array =  prepare_key_1();
  let input_key_2_array = prepare_key_2();
  
  // Obtain the ciphercode
  console.log("Input string length: " + input_string_array.length + ". key2 length: " + input_key_2_array.length);
  let num_cols = input_string_array.length/input_key_2_array.length;
  let num_cols_validation = input_string_array.length%input_key_2_array.length;
  if(num_cols_validation != 0)
  {
    alert("The key lenght and the encrypted text length do not match.");
    return;
  }
  let encrypted_array = chunk(input_string_array, num_cols);
  console.log("Before reorder: \n" + JSON.stringify(encrypted_array));
  // reorder
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
  let letters_found = 0;
  let ciphertext_1 = [];
  // For every letter from the second key, we will search to see the order.
  for(let i = 0; i < input_key_2_array.length; i++)
  {
    ciphertext_1.push([]);
  }
  for(let letter_in_alphabet =letters.length; letter_in_alphabet >= 0 && letters_found <  input_key_2_array.length; letter_in_alphabet--)
  {
    letter_position_in_key = input_key_2_array.indexOf(letters.charAt(letter_in_alphabet));
    console.log("Searching for: " + letters.charAt(letter_in_alphabet) + ". Fount at: " + letter_position_in_key + ". Letters found: " + letters_found);
    if(letter_position_in_key >= 0)
    {
      ciphertext_1[letter_position_in_key] = encrypted_array[encrypted_array.length - 1 - letters_found];
      letters_found++;
    }
  }
  console.log("Ciphertext: \n" + JSON.stringify(ciphertext_1));
  // Transposition:
  let resulted_array = get_array_to_be_decrypted(ciphertext_1, num_cols, input_key_2_array.length);

  let decrypted_text = decrypt(resulted_array, input_key_1_array);
  let output_string = $( "#adfgvx_output_text" );
  output_string.val(decrypted_text);
}

function decrypt(resulted_array, input_key_1_array)
{
  const adfgvx = "ADFGVX".split("");
  let decrypted_text = "";
  let input_key_2d_array = chunk(input_key_1_array, adfgvx.length);
  
  for (let index = 0; index < resulted_array.length -1; index= index +2)
  {
    let row = adfgvx.indexOf(resulted_array[index]);
    let column = adfgvx.indexOf(resulted_array[index+1]);
    decrypted_text = decrypted_text + input_key_2d_array[row][column];
  }
  console.log("Decrypted string: " + decrypted_text);
  return decrypted_text;
}

// Utils:
function create_transposition_array(array, num_cols)
{
  let num_row = array.length/num_cols;
  let resulted_array = [];
  for(let i = 0; i < num_row; i++)
  {
    resulted_array.push([]);
  }
  for(let i=0; i<array.length; i++)
  {
    resulted_array[i%num_row].push(array[i]);
  }
  return resulted_array;
}


// Gnerate two dimentional array from simple array: https://stackoverflow.com/a/35668333
function chunk(arr, size) {
  for(var chunks=[], i=0; i<arr.length; i+=size)
  {
    let slice = arr.slice(i, i+size);
    chunks.push(slice);
  }
  return chunks;
}

function get_array_to_be_decrypted(ciphertext_1, num_cols, num_row)
{
  let resulted_array = [];
  for(let col = 0; col < num_cols; col++)
  {
    for(let row = 0; row < num_row; row++)
    {
      resulted_array.push(ciphertext_1[row][col])
    }
  }
  console.log("Resulted array: \n" +  resulted_array);
  return resulted_array;
}
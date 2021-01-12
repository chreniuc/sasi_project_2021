//
// Hreniuc Cristian-Alexandru 2020 
// Playfair implementation
//

// Called when encyrpt_playfair is pressed.
function encyrpt_playfair_button()
{
  let input_string = $( "#playfair_input_text" ).val().toUpperCase();
  console.log("Preparing input string: " + input_string);
  let input_string_array = input_string.split("");

  console.log("After split: " + input_string_array);
  // Keep only the letters
  input_string_array = input_string_array.filter(item => isLetter(item));
  console.log("After filter: " + input_string_array);

  // Replace J with I
  for(let index = 0; index < input_string_array.length; index++)
  {
    if(input_string_array[index] == 'J')
    {
      input_string_array[index] = 'I';
    }
  }
  // After replace J with I
  console.log("After replace J with I: " + input_string_array);

  // After inserting X between duplicates
  for(let index = 1; index < input_string_array.length; index++)
  {
    if(input_string_array[index] == input_string_array[index-1])
    {

      input_string_array.insert(index, 'X');
      index++;
    }
  }
  // After removing the duplicates
  console.log("After inserting X between duplicates: " + input_string_array);

  if(input_string_array.length%2)
  {
    // If the size of the array is an odd number, we will add a random letter,
    // that is different than the last letter.
    input_string_array.push(rand_letter(input_string_array[input_string_array.length -1]));

    // After removing the duplicates
    console.log("Added random letter at the end: " + input_string_array);
  }

  let input_key_matrix = prepare_key();

  let output_string = $( "#playfair_output_text" );
  let encrypted_string = encrypt_string(input_string_array, input_key_matrix);
  output_string.val(encrypted_string);
}

// Called when decrypt_playfair is pressed.
function decrypt_playfair_button()
{
  let input_string = $( "#playfair_input_text" ).val().toUpperCase();
  console.log("Preparing input string: " + input_string);
  let input_string_array = input_string.split("");

  console.log("After split: " + input_string_array);

  if(input_string_array.length%2 != 0)
  {
    $( "#playfair_output_text" ).val("Provide a valid encrypted string");
    return;
  }

  let input_key_matrix = prepare_key();

  let output_string = $( "#playfair_output_text" );
  let decrypted_string = decrypt_string(input_string_array, input_key_matrix);
  output_string.val(decrypted_string);
}

// Encrypt string 
function encrypt_string(input_string_array, input_key_matrix)
{
  let encrypted_string = "";
  // We'll take two by two.
  for(index=0; index < input_string_array.length - 1; index = index+2)
  {
    const first_letter_index = search_in_matrix_key(input_key_matrix,input_string_array[index]);
    const second_letter_index = search_in_matrix_key(input_key_matrix,input_string_array[index+1]);
    // First rule:
    if(first_letter_index.row != second_letter_index.row && first_letter_index.col != second_letter_index.col)
    {
      encrypted_string += input_key_matrix[first_letter_index.row][second_letter_index.col];
      encrypted_string += input_key_matrix[second_letter_index.row][first_letter_index.col];
      continue;
    }
    if(first_letter_index.row == second_letter_index.row)
    {
      encrypted_string += input_key_matrix[first_letter_index.row][(first_letter_index.col + 1)%5];
      encrypted_string += input_key_matrix[second_letter_index.row][(second_letter_index.col + 1)%5];
      continue;
    }
    // if(first_letter_index.col == second_letter_index.col)
    encrypted_string += input_key_matrix[(first_letter_index.row+ 1)%5][first_letter_index.col ];
    encrypted_string += input_key_matrix[(second_letter_index.row+ 1)%5][second_letter_index.col];
  }
  console.log("Encrypted string: " + encrypted_string);
  return encrypted_string;
}

// Decrypt string 
function decrypt_string(input_string_array, input_key_matrix)
{
  let decrypted_string = "";
  // We'll take two by two.
  for(index=0; index < input_string_array.length - 1; index = index+2)
  {
    const first_letter_index = search_in_matrix_key(input_key_matrix,input_string_array[index]);
    const second_letter_index = search_in_matrix_key(input_key_matrix,input_string_array[index+1]);
    // First rule:
    if(first_letter_index.row != second_letter_index.row && first_letter_index.col != second_letter_index.col)
    {
      decrypted_string += input_key_matrix[first_letter_index.row][second_letter_index.col];
      decrypted_string += input_key_matrix[second_letter_index.row][first_letter_index.col];
      continue;
    }
    if(first_letter_index.row == second_letter_index.row)
    {
      decrypted_string += input_key_matrix[first_letter_index.row][first_letter_index.col - 1 >= 0 ? first_letter_index.col - 1 : 4];
      decrypted_string += input_key_matrix[second_letter_index.row][second_letter_index.col - 1 >= 0 ? second_letter_index.col - 1 : 4];
      continue;
    }
    // if(first_letter_index.col == second_letter_index.col)
    decrypted_string += input_key_matrix[first_letter_index.row - 1 >= 0 ? first_letter_index.row - 1 : 4][first_letter_index.col ];
    decrypted_string += input_key_matrix[second_letter_index.row - 1 >= 0 ? second_letter_index.row - 1 : 4][second_letter_index.col];
  }
  console.log("Decrypted string: " + decrypted_string);
  return decrypted_string;
}

// Utils


// Prepare key array
function prepare_key()
{
  let input_key = $( "#playfair_input_key" ).val().toUpperCase();
  console.log("Preparing key: " + input_key);
  let input_key_array = input_key.split("");
  console.log("After split: " + input_key_array);
  input_key_array = input_key_array.filter(item => isLetter(item));

  input_key_array = [...new Set(input_key_array)]; // spread syntax : https://stackoverflow.com/a/9229821
  console.log("After unique: " + input_key_array);

  // Complete with the missing letters, until we reach 25 elements: 5*5
  for(let char_code = 65; char_code <= 90; char_code++) // ascii code for capital letters
  {
    if(char_code == 74)
    {
      char_code++; // Ignore J
    }
    let letter = String.fromCharCode(char_code);
    if(!input_key_array.includes(letter))
    {
      input_key_array.push(letter);
    }
    if(input_key_array.length == 25)
    {
      break;
    }
  }
  console.log("After adding missing letters: " + input_key_array);
  input_key_matrix = chunk(input_key_array, 5);
  console.log("Matrix: " + JSON.stringify(input_key_matrix));
  
  return input_key_matrix;
}


// Check if a char is a letter.
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

// Needed to insert at specific index in array.
Array.prototype.insert = function ( index, item ) {
  this.splice( index, 0, item );
};

// Generate random letter that is different than remove_letter. The J is missing from the alphabet
function rand_letter(remove_letter) {
  var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  letters = letters.filter(item => item != remove_letter.toLowerCase());
  var letter = letters[Math.floor(Math.random() * letters.length)];
  return letter.toUpperCase();
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

// Lazy implementation: https://dev.to/ptable/two-dimensional-array-search-4b2g
function search_in_matrix_key(input_key_matrix, letter)
{
  const row = input_key_matrix.findIndex(row => row.includes(letter));
  const col = input_key_matrix[row].indexOf(letter);
  return {row, col};
}
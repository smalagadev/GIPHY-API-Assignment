let topicsList = ['Trending','dog', 'cat', 'bird', 'fish', 'bunny', 'hamster'];
let displayedGifs = [];

// Display list of GIF objects to the DOM
const display = function(gifs){
  gifs.forEach(gif => {
    const card = $('<div>').addClass('card');
    const img = $('<img>').addClass('card-img-top').attr('src',gif.static).attr('alt','Click to play.').attr('data-static', gif.static).attr('data-dynamic', gif.dynamic);
    const card_body = $('<div>').addClass('card-body');
    const card_title = $('<h5>').addClass('card-title').text(`Rated ${gif.rating.toUpperCase()}`);
    card.append(img).append(card_body.append(card_title));
    $('#gifs').prepend(card);
  });
  // Give each card an on click function to play GIF
  $('.card > img').on('click',function(){
    if($(this).attr('src') == $(this).attr('data-static')){
      $(this).attr('src', $(this).attr('data-dynamic'));
    }
    else{
      $(this).attr('src', $(this).attr('data-static'));
    }
  });
};

const clearDisplay = function(){
    displayedGifs = [];
    $('.card').remove();
};


$(document).ready(function(){
  const api_key = 'mdqlLgQqaq1caF1pcmh25rARoWaXSjM7';
  const topics = $('#topics');

  // Display trending GIFS on load.
  $.ajax({
    url: `http://api.giphy.com/v1/gifs/trending?limit=10&api_key=${api_key}`,
    method: 'GET'
  }).then(function(response){
    response.data.forEach(data =>{
      const gif = {
        static: data.images.fixed_height_small_still.url,
        dynamic: data.images.fixed_height_small.url,
        rating: data.rating
      }
      displayedGifs.push(gif);
    });
    display(displayedGifs);
    $('#gif-header').text('Trending');
  });

  // Render topics buttons
  topicsList.forEach(topic => {
    const a = $('<a>').attr('href','#');
    a.text(topic);
    a.addClass('badge').addClass('badge-dark').addClass('badge-pill').addClass('topic');
    $('#topics').append(a);
  });

  // Add a button to topics via clicking submit button
  $('#add-button').on('click', function(event){
    event.preventDefault();
    if(!topicsList.includes($('#new-topic').val())){
      topicsList.push($('#new-topic').val());
      const a = $('<a>');
      a.text($('#new-topic').val());
      a.addClass('badge').addClass('badge-light').addClass('badge-pill').addClass('topic');
      $('#topics').append(a);
      $('#new-topic').val('');
    }
  });

  // Add a button to topics via pressing enter
  $('#new-topic').on('keydown', function(event){
    if(event.key == 'Enter'){
      if($('#new-topic').val() != '' && !topicsList.includes($('#new-topic').val())){
        topicsList.push($('#new-topic').val());
        const a = $('<a>');
        a.text($('#new-topic').val());
        a.addClass('badge').addClass('badge-light').addClass('badge-pill').addClass('topic');
        $('#topics').append(a);
        $('#new-topic').val('');
      }
    }
  });

  $('.topic').on('click', function(){
    // Declare variables
    const topic = $(this).text();
    $('#gif-header').text(topic);

    // Fetch relevant GIFs
    if(topic == 'Trending'){
      $.ajax({
        url: `http://api.giphy.com/v1/gifs/trending?limit=10&api_key=${api_key}`,
        method: 'GET'
      }).then(function(response){
        // Clear current GIFs
        clearDisplay();

        response.data.forEach(data =>{
          const gif = {
            static: data.images.fixed_height_small_still.url,
            dynamic: data.images.fixed_height_small.url,
            rating: data.rating
          }
          displayedGifs.push(gif);
        });
        display(displayedGifs);
      });
    }
    else{
      $.ajax({
        url: `http://api.giphy.com/v1/gifs/search?q=${topic}&limit=10&api_key=${api_key}`,
        method: 'GET'
      }).then(function(response){
        // Clear current GIFs
        clearDisplay();

        response.data.forEach(data =>{
          const gif = {
            static: data.images.fixed_height_small_still.url,
            dynamic: data.images.fixed_height_small.url,
            rating: data.rating
          }
          displayedGifs.push(gif);
        });
        display(displayedGifs);
      });
    }
  });

});

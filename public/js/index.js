jQuery(function () {

    var m = moment();
    m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  

    //Check if stats of todays game are already present locally and if not create them
    if (localStorage.getItem('todays_game') == null || localStorage.getItem('todays_game') == '' || !(moment(localStorage.getItem('todays_game')).isSame(m))) {
        
        setupInitialDailyGameState()
    }

    //Check if user played todays game and replicate game board state
    if (localStorage.getItem('game_state') != null && localStorage.getItem('game_state') != '' && localStorage.getItem('todays_score')) {
        setupCurrentBoardState();
    }

    $(".word-button").on('click', function (e) {
        console.log('here');
        if ($('#' + e.currentTarget.id).hasClass('not-revealed')) {
            let id = e.currentTarget.id.split("_").pop()
            revealWord(id, e.currentTarget);

        }

    });


    /**
     * Reveal a Language / Translation pair clue
     * @param {Number} id 
     * @param {Button} element 
     */
       function revealWord(id, element) {

        $.get("/dayword", { id: id }, function (word) {
            word.position = id;
            if (localStorage.getItem('game_state') == null || localStorage.getItem('game_state') == '') {
                let game_state = [];
                game_state.push(word);
                localStorage.setItem('game_state', JSON.stringify(game_state));
            } else {

                updateGameState(word)

            }

            $('#word_' + word.position).hide();
            $('#language-id-button-text-' + word.position)[0].innerHTML = word.language.charAt(0).toUpperCase() + word.language.slice(1);
            $('#language-value-button-text-' + word.position).css({ opacity: 0 }).show();
            $('#language-id-button-text-' + word.position).css({ opacity: 0, display: 'flex' }).animate({
                opacity: 1
            }, 1000);

            $('#language-value-button-text-' + word.position)[0].innerHTML = word.value.charAt(0).toUpperCase() + word.value.slice(1);

            setTimeout(function () {
                $('#language-value-button-text-' + word.position).css({ opacity: 0, display: 'flex' }).animate({
                    opacity: 1
                }, 1000);
            }, 500)

        })

        element.classList.remove('not-revealed');
        element.classList.add('revealed');

    }

    /**
     * Setup initial game state before any play has ocurred
     */
         function setupInitialDailyGameState() {

            localStorage.setItem('todays_game', m);
            localStorage.setItem('todays_score', 10);
            localStorage.setItem('game_state', []);
            localStorage.setItem('solved', false);
    
            let first_word_button_reveal = $('.word-button.not-revealed')[0];
            let first_word_button_id = first_word_button_reveal.id.split("_").pop();
    
            revealWord(first_word_button_id, first_word_button_reveal);
        }

        /**
     * Setup the board State equal to the last time user played 
     */
         function setupCurrentBoardState() {

            let game_state_words = JSON.parse(localStorage.getItem('game_state'));
            for (word of game_state_words) {
    
                $('#word_' + word.position).hide();
                $('#word_' + word.position)[0].classList.remove('not-revealed');
                $('#word_' + word.position)[0].classList.add('revealed');
            }
    
            for (word of game_state_words) {
                $('#language-id-button-text-' + word.position)[0].innerHTML = word.language.charAt(0).toUpperCase() + word.language.slice(1);
                $('#language-value-button-text-' + word.position).css({ opacity: 0 }).show();
                $('#language-id-button-text-' + word.position).css({ opacity: 0, display: 'flex' }).animate({
                    opacity: 1
                }, 1000);
    
                $('#language-value-button-text-' + word.position)[0].innerHTML = word.value.charAt(0).toUpperCase() + word.value.slice(1);
                $('#language-value-button-text-' + word.position).css({ opacity: 0, display: 'flex' }).animate({
                    opacity: 1
                }, 1000);
    
            }
    
        }


    /**
     * Update game state on local storage
     * @param {Word} word 
     */
         function updateGameState(word) {
            let game_state = localStorage.getItem('game_state');
            game_state = JSON.parse(game_state)
            game_state.push(word);
            game_state = JSON.stringify(game_state)
            localStorage.setItem('game_state', game_state)
        }

});
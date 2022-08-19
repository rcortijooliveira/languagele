jQuery(function () {

    var m = moment();
    m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    let game_state_ended = false;
  

    //Check if stats of todays game are already present locally and if not create them
    if (localStorage.getItem('todays_game') == null || localStorage.getItem('todays_game') == '' || !(moment(localStorage.getItem('todays_game')).isSame(m))) {
        
        setupInitialDailyGameState()
    }

    //Present statistics in case the game already ended
    if (localStorage.getItem('solved') == 'true' || localStorage.getItem('todays_score') == 0) {
         game_state_ended = true;
    }

    //Check if user has local statistics of past games and if not start new statistics
    if (localStorage.getItem('statistics') == null || localStorage.getItem('statistics') == '') {
            setupInitialGameStats();
        }

    //Check if user played todays game and replicate game board state
    if (localStorage.getItem('game_state') != null && localStorage.getItem('game_state') != '' && localStorage.getItem('todays_score')) {
        setupCurrentBoardState();
    }

    $(".word-button").on('click', function (e) {
        if (game_state_ended) {
            return;
        }

        if ($('#' + e.currentTarget.id).hasClass('not-revealed')) {
            let id = e.currentTarget.id.split("_").pop()
            revealWord(id, e.currentTarget);
            let current_score = decreaseScore();
        }

    });

    let next_letter = 0;
    let current_guess = [];
    let solution_length = $('.english-solution-length-js')[0].dataset.solutionLength;

    /** Conventional Keyboard Inputs */
    $(document).on('keyup', function (e) {

        if (game_state_ended) {
            return;
        }

        let score = localStorage.getItem('todays_score');

        if (score == 0) {
            return
        }

        let key_pressed = String(e.key);
        if (key_pressed === "Backspace" && next_letter !== 0) {
            deleteLetter();
            return;
        }

        if (key_pressed === "Enter") {
         
            checkGuess();
            return;
        }

        let found = key_pressed.match(/^[a-z]$/gi)

        if (!found || found.length > 1) {
            return
        } else {
            insertLetter(key_pressed);
            return;
        }

    });

    /** Clicable Keyboard Inputs */
    $("#keyboard-cont").on('click', function (e) {

        let target = e.target;

        if (!target.classList.contains('keyboard-button')) {
            return;
        }

        let key = target.textContent;

        if (key === 'Del') {

            key = "Backspace"

        }


        document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
    });

    /**
     * Insert letter into solution row
     * @param {string} key_pressed 
     * @returns 
     */
    function insertLetter(key_pressed) {

        if (next_letter === parseInt(solution_length)) {
            return;
        }

        key_pressed = key_pressed.toLowerCase()
        let row = $('.solution-row');
        let box = row[0].children[next_letter];
        box.textContent = key_pressed;
        box.classList.add("filled-box")
        current_guess.push(key_pressed);
        next_letter++;
    }

    /**
     * Delete last letter entered to solution row
     */
    function deleteLetter() {
        let row = $('.solution-row');
        let box = row[0].children[next_letter - 1];
        box.textContent = ""
        box.classList.remove("filled-box");
        current_guess.pop();
        next_letter--;

    }



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
     * Check if user guess  is correct and update game state accordingly
     */
     function checkGuess() {
        let guess_string = '';

        for (char of current_guess) {
            guess_string += char;
        }

        if(guess_string.length != solution_length){

            return;
        }

        $.get("/solutionCheck", { solution: guess_string }, function (response) {

            let score = decreaseScore();

            if (response.result) {
                endGameWinPreparations(score);

            } else {
                //if score is 0 end game
                if (score == 0) {
                    endGameLossPreparations();
                } else {

                    for (word_button of $('.word-button.not-revealed')) {
                        let id = word_button.id.split("_").pop()
                        revealWord(id, word_button);
                        break;
                    }
                }

                current_guess = [];
                next_letter = 0;
                let row = $('.solution-row');
                let boxes = row[0].children;

                for (box of boxes) {

                    box.textContent = ""
                    box.classList.remove("filled-box");

                }

            }

        });

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
     * Decrease todays game score
     * @returns 
     */
         function decreaseScore() {
            let score = localStorage.getItem('todays_score');
            score--;
            localStorage.setItem('todays_score', score);
            return score;
        }

     /**
     * Final setups in case of game loss
     */
      function endGameLossPreparations() {

        let final_score = localStorage.getItem('todays_score');
        let final_statistics = JSON.parse(localStorage.getItem('statistics'));
        final_statistics[final_score]++;
        localStorage.setItem('statistics', JSON.stringify(final_statistics));
        localStorage.setItem('solved', true);
        let times_played = updateTimesPlayed();
        game_state_ended = true;
        updateWinRate(times_played, final_statistics);
        alert('You Lost');
    }

    /**
     * Final setups in case of game victory
     * @param {Number} score 
     */
    function endGameWinPreparations(score) {
        let game_win_statistics = JSON.parse(localStorage.getItem('statistics'));

        game_win_statistics[score]++;
        localStorage.setItem('statistics', JSON.stringify(game_win_statistics));
        let times_played = updateTimesPlayed();
        updateWinRate(times_played, game_win_statistics);
        localStorage.setItem('solved', true);
        let solution_letter_boxes = $('.solution-row').children();
        let solution_reveal_timeout = 0;
        for (let letter_box of solution_letter_boxes) {
            solution_reveal_timeout += 250
            setTimeout(function () {

                letter_box.classList.add('correct-solution-box');
            },
                solution_reveal_timeout)
        }
        game_state_ended = true;
        alert('You won');
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

    /**
     * Update number of times played on local storage
     * @returns times game was played
     */
     function updateTimesPlayed() {
        let times_played = localStorage.getItem('times_played');
        times_played++;
        localStorage.setItem('times_played', times_played);
        return times_played;
    }

    /**
     * Update win rate on local storage
     * @param {Number} times_played 
     * @param {Array} statistics 
     */
    function updateWinRate(times_played, statistics) {

        let win_rate = ((times_played - statistics[0]) / times_played) * 100;
        localStorage.setItem('win_rate', Math.round((win_rate + Number.EPSILON) * 100) / 100);
    }

    /**
     * Setup statistics, times played and win rate for the first time
     */
    function setupInitialGameStats() {
        localStorage.setItem('statistics', JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        localStorage.setItem('times_played', 0);
        localStorage.setItem('win_rate', 0);
    }
    
});
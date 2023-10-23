// When the document is ready
$(function () {
    google.script.run
        .withSuccessHandler(initializeSelectors)
        .getListOfTeams();
});

function initializeSelectors(teamsData) {
    const genderSelector = $('#gender-selector');
    const uniqueGenders = [...new Set(teamsData.map(team => team.gender))];
    uniqueGenders.forEach(gender => {
        genderSelector.append(`<option value="${gender}">${gender}</option>`);
    });

    genderSelector.on('change', function () {
        const selectedGender = $(this).val();
        const levelSelector = $('#level-selector');
        levelSelector.empty();
        levelSelector.append(`<option value="" disabled selected>Select Level</option>`);
        const uniqueLevels = [...new Set(teamsData.filter(team => team.gender === selectedGender).map(team => team.level))];
        uniqueLevels.forEach(level => {
            levelSelector.append(`<option value="${level}">${level}</option>`);
        });
    });

    $('#level-selector').on('change', function () {
        const selectedLevel = $(this).val();
        const selectedGender = $('#gender-selector').val();
        const teamSelector = $('#team-selector');
        teamSelector.empty();
        teamSelector.append(`<option value="" disabled selected>Select Team</option>`);
        const filteredTeams = teamsData.filter(team => team.level === selectedLevel && team.gender === selectedGender);
        filteredTeams.forEach(team => {
            teamSelector.append(`<option value="${team.name}">${team.name}</option>`);
        });
    });

    $('#team-selector').on('change', function () {
        const selectedTeam = $(this).val();
    
        // Remove any existing confirm button or team header
        $('#confirm-button, #team-header').remove();
    
        // Add a 'Let's Go' button
        const confirmButton = $('<button id="confirm-button">Let\'s Go</button>');
        $('#selectors').after(confirmButton);
    
        confirmButton.on('click', function () {
            // Replace the button with the team header and welcome message
            const teamHeader = `<h2 id="team-header">${selectedTeam} status page <button>...</button></h2>`;
            const welcomeMessage = '<p>Welcome to your team page</p>';
            $('#sec-select').hide();
            $(this).replaceWith(teamHeader + welcomeMessage);
        });
    });
    
}

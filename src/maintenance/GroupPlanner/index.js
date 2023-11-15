class GroupPlanner {
    constructor(teams, optimalGroupSize, maxGroupSize, overrides) {
        this.teams = teams;
        this.optimalGroupSize = optimalGroupSize;
        this.maxGroupSize = maxGroupSize;
        this.overrides = overrides || {};
        this.groups = {};
        this.fixtures = [];
    }

    createGroups() {
        let teamList = [...this.teams];
        let groupIndex = 'A';
        while (teamList.length > 0) {
            let groupSize = Math.min(teamList.length, this.optimalGroupSize);
            this.groups[groupIndex] = teamList.splice(0, groupSize);
            groupIndex = String.fromCharCode(groupIndex.charCodeAt(0) + 1);
        }
    }

    generateGroupStageFixtures() {
        Object.keys(this.groups).forEach(group => {
            const teams = this.groups[group];
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    const umpire = teams[(i + j) % teams.length];
                    this.fixtures.push({
                        group: group,
                        team1: teams[i],
                        team2: teams[j],
                        umpire: umpire,
                        stage: "group"
                    });
                }
            }
        });
    }

    randomizeFixtures() {
        for (let i = this.fixtures.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.fixtures[i], this.fixtures[j]] = [this.fixtures[j], this.fixtures[i]];
        }
    }

    generateKnockoutStageFixtures() {
        // This method needs to be implemented based on specific rules for knockout stage
        // and how the teams are ranked and selected from the group stage.
    }

    generateFixtures() {
        this.createGroups();
        this.generateGroupStageFixtures();
        this.randomizeFixtures();
        // this.generateKnockoutStageFixtures(); // Uncomment when implemented
        return {
            groups: this.groups,
            fixtures: this.fixtures
        };
    }
}

module.exports = GroupPlanner;
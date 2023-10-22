/**
 * Manage group information
 */
class GroupManager extends Base {

  constructor(results) {
    super()
    this.results = []
    this.print()
  }

  addResult(result) {
    this.results.push(result)
  }

  getStandings(groupName, groupNumber) {
    return 'Standings will go here'
  }

}
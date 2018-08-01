module.exports = {
  timeIntervalEveryHour: 1500, // Actual timer in ms for every hour of a day
  totalHours: 21,
  // Critical limits
  criticalHappiness:  -20,
  criticalHunger: 50,
  // Hours of teh day for which state lasts in a day
  idleStateTime: 10,
  poopStateTime: 1,
  sleepStateTime: 10,
  // Deltas of vitals during each state
  idleHappinessDecr: 1,
  idleHungerIncr: 1,
  poopHungerIncr: 4,
  // Deltas of vitals due to each action
  playHappinessIncr: 10,
  playHungerIncr: 2,
  feedHappinessIncr: 1,
  feedHungerDecr: 10,
  //Span of life (in days)
  teenAge: 5,
  adultAge: 10,
  oldAge: 15,
  deathAge: 20,

}
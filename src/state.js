module.exports = class State {
  constructor(name, hoursOfDay) {
    this.name = name;
    this.hoursOfDay = hoursOfDay;
  }
  onEntryHandler(handler) {
    this.onEntryHandler = handler;
  }
  onEntryExitHandler(handler) {
    this.onExitHandler = handler;
  }
  onEveryHourHandler(hanlder) {
    this.onEveryHourHandler = handler;
  }
}

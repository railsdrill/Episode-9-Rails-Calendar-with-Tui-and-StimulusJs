import { Controller } from "@hotwired/stimulus"
import Calendar from "tui-calendar";
import TuiCodeSnippe from "tui-code-snippet";
import TuiDatePicker from "tui-date-picker";
import TuiTimePicker from "tui-time-picker";
import Rails from "@rails/ujs"

export default class extends Controller {

  createCalendarSchedule(){
    let calendar = this.calendar;
    calendar.on('beforeCreateSchedule', function(event) {
    var schedule = {
    id: 1,
    calendarId: '1',
    title: event.title,
    category: 'time',
    location: event.location,
    start: event.start,
    end: event.end
    }
    calendar.createSchedules([schedule]);
    let formData = new FormData()
    formData.append('[schedule]title', schedule.title);
    formData.append('[schedule]start', schedule.start._date);
    formData.append('[schedule]end', schedule.end._date);
    formData.append('[schedule]location', schedule.location);
    
    Rails.ajax({
    type: "POST",
    url: '/schedules',
    data: formData
    })
    
    });
    } 
    updatedCalendarSchedule(){
      let calendar = this.calendar;
      calendar.on('beforeUpdateSchedule', function(event) {
      var schedule = event.schedule;
      var changes = event.changes;
      var formUpdate = new FormData() 
      if (changes.end) {
      formUpdate.append("[schedule]end", changes.end._date) 
      }
      if (changes.start) {
      formUpdate.append("[schedule]start", changes.start._date) 
      }
      if (changes.title) {
      formUpdate.append("[schedule]title", changes.title) 
      }
      calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
      
      Rails.ajax({
      type: "PATCH",
      url: '/schedules/'+ schedule.id,
      data: formUpdate
      })
      
      });
      }

  getCalendarData(){
    let url = "/schedules.json"
    fetch(url)
    .then(response =>response.json())
    .then(response=>response.forEach(schedule => {
      this.calendar.createSchedules([
        {
          id: schedule.id,
          calendarId: "1",
          title: schedule.title,
          category: "time",
          dueDateClass: schedule.dueDateClass,
          location: schedule.location,
          start:schedule.start,
          end: schedule.end
        }
      ])
      
    }))
  }
  deleteCalendarSchedule(){
    let calendar = this.calendar
    calendar.on('beforeDeleteSchedule', function(event) {
    var schedule = event.schedule;
    calendar.deleteSchedule(schedule.id, schedule.calendarId)
    
    Rails.ajax({
    type: "DELETE",
    url: '/schedules/'+ schedule.id,
    })
    });
    }
    
  connect() {
    this.calendar = new Calendar(document.getElementById('calendar'), {
      id: "1",
      name: "My Calendar",
      defaultView: 'month',
      color: '#00a9ff',
        bgColor: '#00a9ff',
        dragBgColor: '#00a9ff',
        borderColor: 'red',

      milestone: true,
      scheduleView: true,
      useCreationPopup: true,
      useDetailPopup: true
    })
    this.getCalendarData()
    this.createCalendarSchedule()
    this.updatedCalendarSchedule()
    this.deleteCalendarSchedule()

  }
}

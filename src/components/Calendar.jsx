import { useEffect, useState } from "react";
import { COMMANDCRABS } from "../constants/commandCrabs";

export function Calendar() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date();
    let currentDate = date.getDate();
    let currentDay = days[date.getDay()];
    let currentMonth = months[date.getMonth()];

    let dateFormatted = (currentMonth.toString().substring(0,3) +" " + currentDate);
    let commandCrab = COMMANDCRABS.GRABS.find(grab => grab.displayDate === dateFormatted)

    return (
        <div>
            <p> Today's Command Crab </p>
            <h3> {currentDay}, {currentMonth} {currentDate} </h3>
            <div>
                <h1> {commandCrab.grabName} </h1>
                <h2 className="text-3xl"> {commandCrab.grabCharacter} </h2>
                <h2 className="text-xl"> Input: {commandCrab.grabInput} </h2>

            </div>
        </div>
    )
}

export default Calendar;
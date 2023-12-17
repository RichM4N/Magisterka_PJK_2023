# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#   
#       return []

import json
from pathlib import Path
import datetime

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

class ActionListMenuItems(Action):

    def name(self) -> Text:
        return "action_list_menu_items"
    
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        

        path = Path(__file__).parent / "../menu_items.json"
        file = open(path)
        menu_data = json.load(file)

        msg = "Menu (order by item number)\n"
        iter = 0

        for i in menu_data['items']:
            tempMsg = ""
            tempMsg = tempMsg + str(iter) + ")" + "\t"
            tempMsg = tempMsg + i["name"]
            
            while len(tempMsg) < 40:
                tempMsg = tempMsg + " "

            tempMsg = tempMsg + json.dumps(i["price"])
            tempMsg = tempMsg + " \n"
            msg = msg + tempMsg
            iter = iter + 1

        dispatcher.utter_message(text=msg)

        return[]

class ActionAddToOrder(Action):

    def name(self) -> Text:
        return "action_add_to_order"
    
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        itemNumber = int(tracker.get_slot('meal'))

        path = Path(__file__).parent / "../menu_items.json"
        file = open(path)
        menu_data = json.load(file)

        if itemNumber > 0 and itemNumber < len(menu_data['items']):
            msg = "Sure, " + menu_data['items'][itemNumber]['name'] + " has been added to the order. What else can I do for you?"
        else:
            msg = "Im not sure I understand. To order pick a meal by its number."

        dispatcher.utter_message(text=msg)

        return[]
    
class ActionConfirmOrder(Action):

    def name(self) -> Text:
        return "action_confirm_order"
    
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        msg = "order confirmed"

        dispatcher.utter_message(text=msg)

        return[]

class ActionOpeningHoursNow(Action):

    def name(self) -> Text:
        return "action_opening_hours_now"
    
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        path = Path(__file__).parent / "../opening_hours.json"
        file = open(path)
        opening_data = json.load(file)

        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        today = datetime.datetime.now()
        todayWeekday = int(today.strftime("%w")) + 6

        if opening_data["items"][weekdays[todayWeekday]]["open"] == 0 and opening_data["items"][weekdays[todayWeekday]]["close"] == 0:
            msg = "Today the restaurant is closed"
        else:
            msg = "Today the restaurant is open from " + str(opening_data["items"][weekdays[todayWeekday]]["open"]) + " to " + str(opening_data["items"][weekdays[todayWeekday]]["close"])

        dispatcher.utter_message(text=msg)

        return[]
        
class ActionOpeningHoursFuture(Action):

    def name(self) -> Text:
        return "action_opening_hours_future"
    
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        path = Path(__file__).parent / "../opening_hours.json"
        file = open(path)
        opening_data = json.load(file)

        weekday = tracker.get_slot('weekday')

        if opening_data["items"][weekday]["open"] == 0 and opening_data["items"][weekday]["close"] == 0:
            msg = "On " + weekday + " the restaurant is closed."
        else:
            msg = "On " + weekday + " the restaurant is opened from " + str(opening_data["items"][weekday]["open"]) + " to " + str(opening_data["items"][weekday]["close"]) + "."

        dispatcher.utter_message(text=msg)

        return[]

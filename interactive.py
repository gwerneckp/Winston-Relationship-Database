import sys
from os import system
from time import sleep
from typing import Callable, List, Optional, Tuple

from neo4j_utils import NeoHandler


def error(msg: str):
    print(f"\033[91m{msg}\033[0m")


def success(msg: str):
    print(f"\033[92m{msg}\033[0m")


def info(msg: str):
    return f"\033[94m{msg}\033[0m"


def choose_option(options: List[Tuple[str, Callable]], title='Options') -> Optional[any]:
    """
    Displays a list of options and handles user input to choose one.

    Parameters
    ----------
    options : list of tuples
        A list of tuples where the first element is the name of the option, and the second element is
        the value to return if the option is chosen.

    Returns
    -------
    Any or None
        The value associated with the chosen option, or None if the user chose to go back.

    """
    print(f"{title}:")
    for i, (name, _) in enumerate(options):
        print(f"{i+1}. {name}")
    print(f"{len(options) + 1}. Back")

    while True:
        try:
            choice = int(input("Enter number: "))
            if choice == len(options) + 1:
                return None
            if 1 <= choice <= len(options):
                return options[choice-1][1]()
        except ValueError:
            pass

        error("Invalid choice. Please enter a number.")


class Interactive:
    def __init__(self):
        self.API = NeoHandler('neo4j://localhost:7687',
                              'neo4j', 'xxxxxxxx')

        while True:
            self.start_screen()

    def start_screen(self):
        options = [
            ('Create a person', self.create_person),
            ('Create a relationship', self.create_relationship),
            ('Search for a person', self.person_info),
        ]
        choose_option(options, 'Welcome to the Churchill Database')

    def create_person(self):
        kwargs = {}
        kwargs['name'] = input("Enter name: ")
        if kwargs['name'] == '':
            error("Name cannot be empty")
            sleep(1)
            return

        if kwargs['name'] in self.API.search(kwargs['name']):
            error("Person already exists")
            sleep(1)
            return

        properties = ['grade', 'email', 'snapchat', 'phone', 'instagram']
        while True:
            options = [(f"Set {prop}", lambda prop=prop: self.set_property(
                prop, kwargs)) for prop in properties]
            options.append(('Back', lambda: None))
            options.append(('Create person', lambda: True))
            result = choose_option(options)

            if result is None:
                return
            if result:
                break

        print("Person info:")
        for k, v in kwargs.items():
            print(f"{k}: {info(v)}")
        if input(f'Are you sure you want to create {info(kwargs["name"])}? (y/n) ').lower() == 'n':
            sleep(1)
            return

        self.API.create_person(**kwargs)

    def set_property(self, prop: str, kwargs: dict):
        value = input(f"Enter {prop}: ")
        if value == '':
            error("Value cannot be empty")
            return False

        kwargs[prop] = value
        return True

    def create_relationship(self, p1: Optional[str] = None):
        if not p1:
            p1 = self.choose_person()
            if not p1:
                return

        relationships = {
            1: 'FRIENDS_WITH',
            2: 'DONT_LIKE',
            3: 'GOT_WITH',
            4: 'DATED',
            5: 'DATING'
        }

        options = [(f"{relationship}", lambda relationship=relationship: self.create_relationship_for(
            p1, relationship)) for relationship in relationships.values()]
        options.append(('Back', lambda: None))
        choose_option(options, 'Choose relationship')

    def create_relationship_for(self, p1: str, relationship: str):
        people_list = []
        while True:
            p2 = self.choose_person()
            if not p2:
                error("Person does not exist")
                if input("Try again? (Y/n) ").lower() != 'y':
                    return
                continue
            if p2 == p1:
                error("Cannot have a relationship with yourself")
                continue
            if p2 in people_list:
                error("Cannot have duplicate relationships")
                continue
            people_list.append(p2)
            current_query = f"{p1} {relationship} with {', '.join(people_list)}"
            print(f"Current query: {info(current_query)}")
            if input("Add another person? (y/N) ").lower() == 'n':
                break

        for p2 in people_list:
            self.API.relationship(p1, relationship, p2)

        success('Relationships created')
        options = [
            ('Create another relationship with this person',
             lambda: self.create_relationship(p1)),
            ('Create a relationship with a different person', self.create_relationship),
            ('Back', lambda: None)
        ]
        choose_option(options, 'Options')

    def person_info(self):
        name = self.choose_person()
        if name:
            result = self.API.get_person_info(name)
            print(f"Relationships for {name}:")
            for property in result['person']:
                print(f"{property}: {info(result['person'][property])}")
            for record in result['relationships']:
                print(f"{record['relationship']} {info(record['p2'])}")
            input("Press enter to continue")
        return

    def choose_person(self) -> Optional[str]:
        name = input("Enter name: ")
        if name == '':
            error("Name cannot be empty")
            sleep(1)
            return None

        result = self.API.search(name)

        if len(result) == 0:
            error("No results found")
            return None

        if len(result) == 1:
            if input(f'Is this the person you were looking for? {result[0]} (y/n) ').lower() == 'y':
                success(f"Selected {result[0]}")
                return result[0]
            else:
                sleep(1)
                return None

        options = [(result[i], lambda name=result[i]: name)
                   for i in range(len(result))]
        return choose_option(options, 'Select a person')


i = Interactive()

import sys
from os import system
from time import sleep
from typing import Optional, List, Tuple, Callable
from SchoolAPI import AppAPI


def clear():
    sleep(1)
    # system('clear')
    print('\n')


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
                return options[choice-1][1]
        except ValueError:
            pass

        error("Invalid choice. Please enter a number.")


class Interactive:
    def __init__(self):
        self.API = AppAPI('neo4j://localhost:7687', 'neo4j', 'xxxxxxxx')

        while True:
            self.start_screen()

    def start_screen(self):
        print('Welcome to the Churchill Database')
        print("1. Create a person")
        print("2. Create a relationship")
        print("3. Search for a person")
        print("4. Exit")
        choice = int(input("Enter number: "))
        if choice == 1:
            self.create_person()
        elif choice == 2:
            self.create_relationship()
        elif choice == 3:
            self.person_info()
        elif choice == 4:
            exit()
        else:
            error("Invalid choice. Please try again.")

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
            for i, prop in enumerate(properties):
                print(f"{i+1}. Set {prop}")

            print(f"{len(properties) + 1}. Back")
            print(f"{len(properties) + 2}. Create person")

            choice = int(input("Enter number: "))
            if choice == len(properties) + 1:
                return
            if choice == len(properties) + 2:
                break

            value = input(f"Enter {properties[choice-1]}: ")
            if value == '':
                error("Value cannot be empty")
                continue

            kwargs[properties[choice-1]] = value

            properties.pop(choice-1)

        print("Person info:")
        for k, v in kwargs.items():
            print(f"{k}: {info(v)}")
        if input(f'Are you sure you want to create {info(kwargs["name"])}? (y/n) ').lower() == 'n':
            sleep(1)
            return

        self.API.create_person(**kwargs)

    def create_relationship(self, p1: Optional[str] = None):
        if not p1:
            result = self.choose_person()
            if not result:
                return
            p1 = result

        print("Relationships:")
        print("1. Friends with")
        print("2. Don't like")
        print("3. Got with")
        print("4. Dated")
        print("5. Dating")
        print("6. Back")
        choice = int(input("Enter number: "))
        if choice == 6:
            return

        relationship = {
            1: 'FRIENDS_WITH',
            2: 'DONT_LIKE',
            3: 'GOT_WITH',
            4: 'DATED',
            5: 'DATING'
        }[choice]

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
            clear()

        for p2 in people_list:
            self.API.relationship(p1, relationship, p2)

        success('Relationships created')
        print('1. Create another relationship with this person')
        print('2. Create a relationship with a different person')
        print('3. Back')

        choice = int(input("Enter number: "))
        if choice == 1:
            self.create_relationship(p1=p1)
        elif choice == 2:
            self.create_relationship()
        elif choice == 3:
            pass
        else:
            error("Invalid choice. Please try again.")

    def person_info(self):
        name = self.choose_person()
        if name:
            result = self.API.get_person_info(name)
            print(f"Relationships for {name}:")
            for record in result['relationships']:
                print(f"{record['relationship']} {record['p2']}")
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

        person: str = ''
        if len(result) == 1:
            if input(f'Is this the person you were looking for? {result[0]} (y/n) ').lower() == 'y':
                person = result[0]
            else:
                sleep(1)
                return None

        if len(result) > 1:
            print("Multiple results found:")
            for i in range(len(result)):
                print(f"{i+1}. {result[i]}")
            choice = int(input("Enter number: "))
            try:
                person = result[choice-1]
            except:
                error("Invalid choice")
                sleep(1)
                return None

        success(f"Selected {person}")
        return person


i = Interactive()
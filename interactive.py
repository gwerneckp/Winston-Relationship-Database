from os import system
from time import sleep


def clear():
    sleep(1)
    # system('clear')
    print('\n')


def do_nothing():
    pass


def error(msg):
    print(f"\033[91m{msg}\033[0m")


def success(msg):
    print(f"\033[92m{msg}\033[0m")


def info(msg):
    return f"\033[94m{msg}\033[0m"




class Interactive:
    def __init__(self):
        self.API = AppAPI()

        while True:
            self.start_screen()

    def start_screen(self):
        print('Welcome to the Churchill Database')
        print("1. Create a person")
        print("2. Create a relationship")
        print("3. Search for a person")
        print("4. Exit")
        choice = int(input("Enter number: "))
        match choice:
            case 1:
                self.create_person()
            case 2:
                self.create_relationship()
            case 3:
                self.person_info()
            case 4:
                exit()

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
            sleep()
            return

        self.API.create_person(**kwargs)

    def create_relationship(self, p1=None):
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
        print('2. Create a relationship with different person')
        print('3. Back')

        choice = int(input("Enter number: "))
        {
            1: lambda: self.create_relationship(p1=p1),
            2: lambda: self.create_relationship(),
            3: do_nothing
        }[choice]()

    def person_info(self):
        name = self.choose_person()
        result = self.API.get_person_info(name)
        if result:
            print(f"Relationships for {name}:")
            for record in result:
                print(f"{record['type(r)']} {record['p2']['name']}")
            input("Press enter to continue")
        return

    def choose_person(self):
        name = input("Enter name: ")
        if name == '':
            error("Name cannot be empty")
            sleep(1)
            return

        result = self.API.search(name)

        if len(result) == 0:
            error("No results found")
            return

        person: str = ''
        if len(result) == 1:
            if input(f'Is this the person you were looking for? {result[0]} (y/n) ').lower() == 'y':
                person = result[0]
            else:
                sleep(1)
                return

        if len(result) > 1:
            print("Multiple results found:")
            for i in range(len(result)):
                print(f"{i+1}. {result[i]}")
            choice = int(input("Enter number: "))
            try:
                person = result[choice-1]
            except:
                error("Invalid choice")
                sleep()
                return

        success(f"Selected {person}")
        return person


if __name__ == '__main__':
    i = Interactive()

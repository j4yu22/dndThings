import random

start = input("Welcome to my dice roller. Please only respond with numeric values, with the exception of CTRL + C to terminate the program.\nPress ENTER to begin.")

if start.lower() == "darkside":
    while True:
        sides = int(input("How many sides does your die have?\n"))
        count = int(input("How many of this die are you rolling?\n"))

        rolls = []
        for i in range (count):
            roll = random.randint(1, sides)

            if roll < sides / 2:
                roll2 = random.randint(1, sides)
                roll = roll if roll2 <= roll else roll2
            
            rolls.append(roll)

        print(rolls)

else:
    while True:
        sides = int(input("How many sides does your die have?\n"))
        count = int(input("How many of this die are you rolling?\n"))

        rolls = []
        for i in range(count):
            roll = random.randint(1, sides)
            rolls.append(roll)

        print(rolls)
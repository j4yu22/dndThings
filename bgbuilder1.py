def select_option(options):
    """Prompts the user to select an option from the provided dictionary."""
    prompt = "\n".join([f"{key}. {value['name']}" for key, value in options.items()])
    selection = input(prompt + "\n")

    return options.get(selection, None)

def main():
    print("Welcome to BGBulider v1! As you make selections, please input the number of the selection. (ex: '2')")

    # Race and subrace selector
    races = {
        '1': {'name': 'Elf', 'subraces': {'1': 'High Elf', '2': 'Wood Elf'}},
        '2': {'name': 'Tiefling', 'subraces': {'1': 'Asmodeous Tiefling', '2': 'Mephistopheles Tiefling', '3': 'Zariel Tiefling'}},
        '3': {'name': 'Drow', 'subraces': {'1': 'Lolth Sworn Drow', '2': 'Seldarine Drow'}},
        '4': {'name': 'Human', 'subraces': None},
        '5': {'name': 'Githyanki', 'subraces': None},
        '6': {'name': 'Dwarf', 'subraces': {'1': 'Gold Dwarf', '2': 'Shield Dwarf', '3': 'Duergar'}},
        '7': {'name': 'Half Elf', 'subraces': {'1': 'High Half Elf', '2': 'Wood Half Elf', '3': 'Drow Half Elf'}},
        '8': {'name': 'Halfling', 'subraces': {'1': 'Lighfoot Halfling', '2': 'Strongheart Halfling'}},
        '9': {'name': 'Gnome', 'subraces': {'1': 'Deep Gnome', '2': 'Forest Gnome', '3': 'Rock Gnome'}},
        '10': {'name': 'Dragonborn', 'subraces': {'1': 'Black Dragonborn', '2': 'Blue Dragonborn', '3': 'Brass Dragonborn', '4': 'Bronze Dragonborn', '5': 'Copper Dragonborn', '6': 'Gold Dragonborn', '7': 'Green Dragonborn', '8': 'Red Dragonborn', '9': 'Silver Dragonborn', '10': 'White Dragonborn'}},
        '11': {'name': 'Half Orc', 'subraces': None},
    }

    race = select_option(races)

    if race:
        print(f"You selected: {race['name']}")

        if race.get('subraces'):
            subrace = select_option({k: {'name': v} for k, v in race['subraces'].items()})
            if subrace:
                print(f"You selected: {subrace['name']}")
            else:
                print("Invalid subrace selection.")
    else:
        print("Invalid race selection.")

if __name__ == "__main__":
    main()

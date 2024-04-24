import random
import re

def parse_dice_input(dice_input):
    """
    Parses the dice input into a list of parts (dice rolls and modifiers).

    Parameters:
        dice_input (str): The dice input string.

    Returns:
        list: A list of parts extracted from the dice input.
    """
    return [part.strip() for part in re.split(r'\+', dice_input)]

def roll_dice(num_dice, dice_type, roll_type=None):
    """Rolls dice and applies modifiers like 'adv', 'disadv', and 'fire'."""
    rolls = [random.randint(1, dice_type) for _ in range(num_dice)]

    if roll_type == 'adv' or roll_type == 'disadv':
        extra_rolls = [random.randint(1, dice_type) for _ in range(num_dice)]
        final_rolls = [max(roll, extra_roll) if roll_type == 'adv' else min(roll, extra_roll) for roll, extra_roll in zip(rolls, extra_rolls)]
        roll_display = " + ".join([f"{roll}|{extra_roll} -> {max(roll, extra_roll) if roll_type == 'adv' else min(roll, extra_roll)}" for roll, extra_roll in zip(rolls, extra_rolls)])
        roll_sum = sum(final_rolls)

    elif roll_type == 'fire':
        rerolls = [(random.randint(1, dice_type) if roll == 1 else roll) for roll in rolls]
        final_rolls = [f"{roll}{'|' + str(reroll) + ' -> ' + str(reroll) if roll == 1 else ''}" for roll, reroll in zip(rolls, rerolls)]
        roll_display = " + ".join(final_rolls)
        roll_sum = sum(rerolls)

    else:
        roll_sum = sum(rolls)
        roll_display = " + ".join(str(r) for r in rolls)

    return roll_display, roll_sum


def handle_crit(roll_sum, is_crit):
    """
    Doubles the roll sum if a critical hit is indicated.

    Parameters:
        roll_sum (int): The sum of rolls to potentially double.
        is_crit (bool): Indicates whether a critical hit is applied.

    Returns:
        int: The potentially doubled roll sum.
    """
    return roll_sum * 2 if is_crit else roll_sum

def format_rolls_output(rolls_output, total_sum):
    """
    Formats the rolls output and total sum into a string.

    Parameters:
        rolls_output (list): The list of formatted roll strings.
        total_sum (int): The total sum of all rolls and modifiers.

    Returns:
        str: The formatted output string.
    """
    return ", ".join(rolls_output) + f" = {total_sum}"

def main():
    while True:
        dice_input = input("Enter your dice roll (or 'exit' to quit): ")
        if dice_input.lower() == 'exit':
            break

        is_crit = 'crit' in dice_input.lower()
        parts = parse_dice_input(dice_input.replace('crit', '') if is_crit else dice_input)
        total_sum = 0
        rolls_output = []

        for part in parts:
            match = re.match(r'(\d+)d(\d+)(\s+(adv|disadv|fire))?', part)
            if match:
                num_dice, dice_type, _, roll_type = match.groups()
                rolls, roll_sum = roll_dice(int(num_dice), int(dice_type), roll_type)
                roll_sum = handle_crit(roll_sum, is_crit)
                rolls_output.append(f"{rolls} = {roll_sum}")
                total_sum += roll_sum
            else:
                try:
                    modifier = int(part)
                    total_sum += modifier
                    rolls_output.append(str(modifier))
                except ValueError:
                    print(f"Invalid format: {part}")
                    break

        print(format_rolls_output(rolls_output, total_sum))

if __name__ == "__main__":
    main()

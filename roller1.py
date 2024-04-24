import random
import re

def roll_dice(dice_input):
    is_crit = 'crit' in dice_input.lower()
    if is_crit:
        dice_input = dice_input.replace('crit', '')  # Remove 'crit' from the input

    parts = [part.strip() for part in re.split(r'\+', dice_input)]
    total_sum = 0
    rolls_output = []

    for part in parts:
        if 'd' in part:
            match = re.match(r'(\d+)d(\d+)(\s+(adv|disadv))?', part)
            if not match:
                try:
                    modifier = int(part)
                    total_sum += modifier
                    rolls_output.append(str(modifier))
                    continue
                except ValueError:
                    return "Invalid format: " + part

            num_dice, dice_type, _, roll_type = match.groups()
            num_dice, dice_type = int(num_dice), int(dice_type)
            rolls = [random.randint(1, dice_type) for _ in range(num_dice)]
            roll_sum = sum(rolls)
            roll_display = f"{rolls}"

            if roll_type in ['adv', 'disadv']:
                extra_rolls = [random.randint(1, dice_type) for _ in range(num_dice)]
                combined_rolls = [f"{roll}|{extra_roll}" for roll, extra_roll in zip(rolls, extra_rolls)]
                roll_sum = sum([max(roll, extra_roll) if roll_type == 'adv' else min(roll, extra_roll) for roll, extra_roll in zip(rolls, extra_rolls)])
                roll_display = f"[{' '.join(combined_rolls)}]"

            if is_crit:
                roll_sum *= 2
            total_sum += roll_sum
            rolls_output.append(f"{roll_display} = {roll_sum}")
        else:
            try:
                modifier = int(part)
                total_sum += modifier
                rolls_output.append(str(modifier))
            except ValueError:
                return "Invalid modifier format: " + part

    return " + ".join(rolls_output) + f" = {total_sum}"

def main():
    while True:
        user_input = input("Enter your dice roll (or 'exit' to quit): ")
        if user_input.lower() == 'exit':
            break
        print(roll_dice(user_input))

if __name__ == "__main__":
    main()

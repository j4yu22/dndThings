#https://discord.com/api/oauth2/authorize?client_id=1232759454961766401&permissions=8&scope=bot%20applications.commands

import discord
from discord.ext import commands
import asyncio

intents = discord.Intents.all()

bot = commands.Bot(command_prefix='/', intents=intents)

@bot.command()
async def initiative(ctx):
    prompt_message = await ctx.send('Reply to this message with your initiative roll.')
    prompt_message_id = prompt_message.id
    print(f"Prompt message ID: {prompt_message_id}")

    def check(m):
        # Check if the message is a reply to the prompt message or if it's an 'end' command
        is_valid_reply = m.reference and m.reference.message_id == prompt_message_id
        is_end_command = m.content.strip().lower() == 'end' and m.channel == ctx.channel
        print(f"Message ID: {m.id}, Content: '{m.content}', Valid reply: {is_valid_reply}, End command: {is_end_command}")
        return is_valid_reply or is_end_command

    initiatives = {}
    try:
        while True:
            response = await bot.wait_for('message', check=check, timeout=60.0)
            if response.content.strip().lower() == 'end':
                print("Ending on user command.")
                break  # Exit the loop if 'end' is received
            try:
                roll = int(response.content.strip())
                member = ctx.guild.get_member(response.author.id)
                name = member.nick if member.nick else response.author.name
                initiatives[name] = roll
                print(f"Added {name} with roll {roll}")
            except ValueError:
                await ctx.send("Please enter a valid number for your initiative roll.")
    except asyncio.TimeoutError:
        print("Timeout reached.")
    finally:
        await ctx.send('Initiative collection complete.')
        print("Final initiatives:", initiatives)
        save_initiatives(initiatives)

def save_initiatives(initiatives):
    with open('o:/coding/python/projects/dnd/initiatives.txt', 'w') as file:
        for character, initiative in sorted(initiatives.items(), key=lambda item: item[1], reverse=True):
            file.write(f"{character} : {initiative}\n")
        print("Initiatives saved to file.")


bot.run('MTIzMjc1OTQ1NDk2MTc2NjQwMQ.GMPBNw.UUXB0C0AW3xbKRxyoF1_XJ7QTDul9Ar30Xdmzc')

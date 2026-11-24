import os
import discord

client = discord.Client()

@client.event
async def on_ready():
    print(f'Logged in as {client.user}')

client.run(os.environ["DISCORD_DICETRAY_TOKEN"])


# link to invite to server: https://discord.com/api/oauth2/authorize?client_id=1183947554178728036&permissions=8&scope=bot
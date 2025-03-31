# SPECIFICATION.md

A GENERAL CMS IS NEEDED: IMAGES, MARKDOWN(X)

## specification
- DM page and players page
- create account with k-number, name, email, password -> then on, login with email and pass -- email sending system, resend's react-email, supabase
- DM tag is given by the committee (which are admins)
- DMs add players to their party
- each player (the person) can have multiple characters: these characters are displayed on the website
- the players can also have public pages, these can be made private by the player

## overall public space
- `/journal`: journal -- updated each week, with what happened on that session
	- !!! DMs should be able to update this, so some sort of cms is needed
- `/campaign/[name]`: some info about the current campaign -- a way to see other campaigns as well, arhived ones
- `/dnd`: info about the game itself -- with the cms

## character pages
- `/character/[name]`
- class, species, level, some background info -- a link to the player's page

## dm page
- `/dm/[name]`

## player account page
- `/player/[name]`

---
# database

## roles table
- user uuid
- role = admin, DM, player -- probably there is a better way to integrate this with supabase auth, eh maybe not

## DMs table
- user uuid

## players table
- user uuid

## characters table
- player's uuid
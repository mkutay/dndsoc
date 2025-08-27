SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8daf5d66-4726-49ba-8286-2755d73febcd', 'authenticated', 'authenticated', 'table@kcl.ac.uk', '$2a$10$jDiE6EyCY6lXN5BJM0natuZdw9GLVavsWKYwEynDT6K.4Filvzygq', '2025-07-30 12:53:28.06672+00', NULL, '', '2025-07-30 12:53:21.784171+00', '', NULL, '', '', NULL, '2025-07-30 13:00:05.15989+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8daf5d66-4726-49ba-8286-2755d73febcd", "name": "table", "email": "table@kcl.ac.uk", "knumber": "K12341234", "siteUrl": "http://localhost:3000", "username": "table", "email_verified": true, "phone_verified": false}', NULL, '2025-07-30 12:53:21.781379+00', '2025-07-30 13:00:05.160231+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '49432716-c956-4f14-86fb-060e827acd44', 'authenticated', 'authenticated', 'alastor@a.com', '$2a$10$drIf1smn0bgGhAKIciZSrOTrqhoxwtxxO6mbpmY.YBLsbP1qJFTVK', '2025-07-30 12:57:41.029916+00', '2025-07-30 12:57:28.847478+00', '', NULL, '', NULL, '', '', NULL, '2025-07-30 13:00:44.393332+00', '{"provider": "email", "providers": ["email"]}', '{"name": "Alastor", "email": "alastor@a.com", "siteUrl": "http://localhost:3000", "username": "alastor", "requestId": "674c0927-996f-4192-aa1d-374b54988fa1", "email_verified": true}', NULL, '2025-07-30 12:57:28.842813+00', '2025-07-30 13:00:44.393816+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '240434b4-a2b3-4920-a1c3-aeccc6b60b94', 'authenticated', 'authenticated', 'kutay@kcl.ac.uk', '$2a$10$u8i3d0y9HM8X8MIxTeoSBeL5H4FWRMs8NwOZhzYknMALBtuvUgLje', '2025-07-30 12:37:37.868366+00', NULL, '', '2025-07-30 12:37:18.572392+00', '', NULL, '', '', NULL, '2025-07-30 12:56:06.97524+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "240434b4-a2b3-4920-a1c3-aeccc6b60b94", "name": "kutay", "email": "kutay@kcl.ac.uk", "knumber": "K12345678", "siteUrl": "http://localhost:3000", "username": "kutay", "email_verified": true, "phone_verified": false}', NULL, '2025-07-30 12:37:18.568878+00', '2025-07-30 12:56:06.975825+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '42dc41a9-98e2-416b-a97d-d222e3735654', 'authenticated', 'authenticated', 'admin@kcl.ac.uk', '$2a$10$c/a.vICM0QCntS1ZvIFXN.FttMimFyVqa6tDr.DwAc076SwKxUTdK', '2025-07-30 12:40:53.606557+00', NULL, '', '2025-07-30 12:40:49.479127+00', '', NULL, '', '', NULL, '2025-07-30 12:57:51.437469+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "42dc41a9-98e2-416b-a97d-d222e3735654", "name": "admin", "email": "admin@kcl.ac.uk", "knumber": "K87654321", "siteUrl": "http://localhost:3000", "username": "admin", "email_verified": true, "phone_verified": false}', NULL, '2025-07-30 12:40:49.476708+00', '2025-07-30 12:57:51.437904+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('240434b4-a2b3-4920-a1c3-aeccc6b60b94', '240434b4-a2b3-4920-a1c3-aeccc6b60b94', '{"sub": "240434b4-a2b3-4920-a1c3-aeccc6b60b94", "name": "kutay", "email": "kutay@kcl.ac.uk", "knumber": "K12345678", "siteUrl": "http://localhost:3000", "username": "kutay", "email_verified": true, "phone_verified": false}', 'email', '2025-07-30 12:37:18.571384+00', '2025-07-30 12:37:18.571396+00', '2025-07-30 12:37:18.571396+00', 'ebfac8f2-d56e-4b14-8926-96bd6f8bbbb7'),
	('42dc41a9-98e2-416b-a97d-d222e3735654', '42dc41a9-98e2-416b-a97d-d222e3735654', '{"sub": "42dc41a9-98e2-416b-a97d-d222e3735654", "name": "admin", "email": "admin@kcl.ac.uk", "knumber": "K87654321", "siteUrl": "http://localhost:3000", "username": "admin", "email_verified": true, "phone_verified": false}', 'email', '2025-07-30 12:40:49.477543+00', '2025-07-30 12:40:49.47794+00', '2025-07-30 12:40:49.47794+00', 'c99cec6e-0c4f-4788-8334-39cf95ffe73b'),
	('8daf5d66-4726-49ba-8286-2755d73febcd', '8daf5d66-4726-49ba-8286-2755d73febcd', '{"sub": "8daf5d66-4726-49ba-8286-2755d73febcd", "name": "table", "email": "table@kcl.ac.uk", "knumber": "K12341234", "siteUrl": "http://localhost:3000", "username": "table", "email_verified": true, "phone_verified": false}', 'email', '2025-07-30 12:53:21.783469+00', '2025-07-30 12:53:21.783494+00', '2025-07-30 12:53:21.783494+00', '9fb4f38c-42ba-41bf-b1d4-ae9ed1d5bdd2'),
	('49432716-c956-4f14-86fb-060e827acd44', '49432716-c956-4f14-86fb-060e827acd44', '{"sub": "49432716-c956-4f14-86fb-060e827acd44", "email": "alastor@a.com", "email_verified": true, "phone_verified": false}', 'email', '2025-07-30 12:57:28.846424+00', '2025-07-30 12:57:28.846454+00', '2025-07-30 12:57:28.846454+00', 'eda50010-fafa-48a7-8ed4-9be2673f2681');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."achievements" ("id", "name", "description", "shortened", "category", "difficulty", "points", "type", "is_hidden", "max_unlocks", "description_long") VALUES
	('eafa536f-79b4-4c13-ad7d-1f399609985f', 'First Adventure', 'Participate in your first session.', 'first-adventure', 'community', 'easy', 10, 'player', false, 1, 'Join your first D&D session and take your first steps into the world of tabletop roleplaying.'),
	('303da206-48f1-4e1d-b518-3e56a49c4fa2', 'Veteran Adventurer', 'Play in 10 sessions.', 'veteran-adventurer', 'community', 'medium', 25, 'player', false, 1, 'Show your dedication by participating in 10 D&D sessions.'),
	('16b9dfc2-3245-4615-9b36-681e55e4ae05', 'Campaign Conqueror', 'Complete a full campaign.', 'campaign-conqueror', 'community', 'hard', 50, 'player', false, 1, 'Finish an entire campaign from start to finish.'),
	('092f7f74-2a42-463a-b61d-68bf3d516e8b', 'Social Butterfly', 'Interact with 10 different players on the website.', 'social-butterfly', 'community', 'easy', 10, 'player', false, 1, 'Get to know your fellow adventurers by chatting with 10 different players.'),
	('49b424ee-f726-4a88-85be-1c9f6a741999', 'Guildmaster', 'Recruit 5 new members to the D&D Society.', 'guildmaster', 'community', 'medium', 30, 'player', false, 1, 'Help grow the D&D Society by bringing in 5 new members.'),
	('8dfc7d0c-a0b7-4be4-a11b-bdfdb30da682', 'In Character', 'Roleplay your character for an entire session without breaking immersion.', 'in-character', 'roleplay', 'medium', 20, 'player', false, 1, 'Stay fully in character for an entire session, embracing your role.'),
	('e47ffe93-6459-450a-8fcd-8002f9f3b944', 'Master of Voices', 'Use 5 different voices for your characters.', 'master-of-voices', 'roleplay', 'hard', 40, 'player', false, 1, 'Show off your voice-acting skills by using 5 unique voices for your characters.'),
	('d147a661-e769-4f6d-a187-5f9d9975e89d', 'Drama King/Queen', 'Deliver an emotional monologue during a session.', 'drama-king-queen', 'roleplay', 'medium', 25, 'player', false, 1, 'Move the party with a heartfelt or dramatic monologue in character.'),
	('e220c264-55a9-4a6b-af62-e65489fef541', 'The Bard''s Tale', 'Write a poem or song for your character and perform it.', 'the-bards-tale', 'roleplay', 'hard', 50, 'player', false, 1, 'Create and perform a poem or song that reflects your character''s story.'),
	('3cbcb0c1-a940-4343-8070-9d3b0eef0ccc', 'Rules Lawyer', 'Correctly answer 10 rules-related questions.', 'rules-lawyer', 'knowledge', 'medium', 20, 'player', false, 1, 'Demonstrate your knowledge of the rules by answering 10 rules-related questions correctly.'),
	('ad60913d-9203-4fe3-948e-c8b9855dfbc5', 'Lorekeeper', 'Share a detailed piece of D&D lore on the website.', 'lorekeeper', 'knowledge', 'medium', 20, 'player', false, 1, 'Contribute to the community by sharing a detailed piece of D&D lore.'),
	('8d20c074-67e5-4af5-828b-e42c6980c364', 'Strategist', 'Successfully plan and execute a complex strategy in-game.', 'strategist', 'combat', 'hard', 30, 'player', false, 1, 'Work with your party to create and execute a flawless strategy in combat.'),
	('ba602e17-e853-412d-9291-443ad201cef6', 'Critical Hit!', 'Roll a natural 20 in a session.', 'critical-hit', 'combat', 'easy', 10, 'player', false, 1000, 'Experience the thrill of rolling a natural 20 during a session.'),
	('4b321dea-73a9-4587-b607-197b421a987b', 'Critical Miss...', 'Roll a natural 1 in a session.', 'critical-miss', 'combat', 'easy', 5, 'player', false, 1000, 'Face the consequences of rolling a natural 1 during a session.'),
	('966fedb0-42f2-46e6-b866-b4cccc4099b3', 'Snack Hoarder', 'Bring snacks to 5 sessions.', 'snack-hoarder', 'community', 'easy', 10, 'player', false, 1, 'Keep the party fueled by bringing snacks to 5 different sessions.'),
	('8112e6be-374c-48eb-bdd9-7385f8cca000', 'Dice Goblin', 'Own 10 sets of dice.', 'dice-goblin', 'miscellaneous', 'medium', 15, 'player', false, 1, 'Show off your collection by owning 10 unique sets of dice.'),
	('e655bebf-0e6c-4dc5-bd5d-c2746c53dbcc', 'Monster Slayer', 'Defeat 10 enemies.', 'monster-slayer', 'combat', 'medium', 20, 'character', false, 1, 'Prove your combat prowess by defeating 10 enemies in battle.'),
	('e4983462-bcc0-4cdc-9e86-970977309b7e', 'Boss Killer', 'Defeat a campaign boss.', 'boss-killer', 'combat', 'hard', 50, 'character', false, 1, 'Take down a major campaign boss and lead your party to victory.'),
	('4f16105b-bc5f-4541-9002-10e5d5313013', 'Unstoppable Force', 'Deal over 50 damage in a single turn.', 'unstoppable-force', 'combat', 'hard', 40, 'character', false, 1, 'Unleash your power by dealing over 50 damage in a single turn.'),
	('41eb5d7d-622c-431f-9647-cb32f724c7f4', 'Tank Supreme', 'Absorb over 100 damage in a single session.', 'tank-supreme', 'combat', 'hard', 40, 'character', false, 1, 'Show your resilience by absorbing over 100 damage in a single session.'),
	('cf4c952f-0ef4-47ba-9737-0f0e1569902a', 'Backstory Builder', 'Submit a detailed backstory for your character.', 'backstory-builder', 'roleplay', 'easy', 15, 'character', false, 1, 'Create a rich and detailed backstory for your character and share it with the group.'),
	('28e0c4ea-219d-4385-9b66-97933d441d19', 'Character Growth', 'Have your character undergo a major personality change.', 'character-growth', 'roleplay', 'medium', 25, 'character', false, 1, 'Develop your character by having them undergo a significant personality shift.'),
	('72f0af9b-0690-4b2d-8070-8a2e1120016f', 'Heroic Sacrifice', 'Have your character sacrifice themselves for the party.', 'heroic-sacrifice', 'roleplay', 'hard', 50, 'character', false, 1, 'Make the ultimate sacrifice by giving up your character''s life to save the party.'),
	('f2fe4ca6-bc44-4112-aca0-703ae02ec06c', 'Dungeon Delver', 'Successfully navigate a dungeon.', 'dungeon-delver', 'exploration', 'medium', 20, 'character', false, 1, 'Lead your party through a dungeon and emerge victorious.'),
	('4c537c14-760f-43d1-af12-27eb68ffc29d', 'Treasure Hunter', 'Find a hidden treasure.', 'treasure-hunter', 'exploration', 'easy', 15, 'character', false, 1, 'Discover a hidden treasure during your adventures.'),
	('ec034b3f-04bb-4755-b1ee-48fc83f0dcb1', 'Map Maker', 'Create a map for the party.', 'map-maker', 'exploration', 'medium', 20, 'character', false, 1, 'Help your party by creating a detailed map of the area.'),
	('0d7a3776-21e2-41e7-96d6-16fb96ce794e', 'Animal Whisperer', 'Befriend a wild animal.', 'animal-whisperer', 'roleplay', 'easy', 10, 'character', false, 1, 'Use your charm or skills to befriend a wild animal.'),
	('e8413592-5059-4eac-8cc1-034b2a4a8906', 'The Collector', 'Acquire 10 unique items.', 'the-collector', 'exploration', 'medium', 20, 'character', false, 1, 'Build your collection by acquiring 10 unique items during your adventures.'),
	('26a8b751-8fae-4042-98e3-c1816df92b4c', 'Fashionista', 'Wear 5 different outfits during the campaign.', 'fashionista', 'miscellaneous', 'easy', 10, 'character', false, 1, 'Show off your style by wearing 5 different outfits during the campaign.'),
	('18a24a53-2cec-4fa3-87d2-8e30f622d840', 'World Builder', 'Create a custom campaign setting.', 'world-builder', 'dm', 'hard', 50, 'dm', false, 1, 'Design and run a campaign in a custom world of your own creation.'),
	('177c12f0-06c6-4fe2-a43e-bc7352d15a84', 'Plot Twister', 'Introduce a major plot twist that surprises the party.', 'plot-twister', 'dm', 'medium', 30, 'dm', false, 1, 'Keep your players on their toes with a surprising plot twist.'),
	('2771e8c5-472e-4403-b992-ce2954cd2cd0', 'Epic Finale', 'Conclude a campaign with a memorable ending.', 'epic-finale', 'dm', 'hard', 50, 'dm', false, 1, 'End your campaign with a finale that your players will never forget.'),
	('3152fc2f-8713-472b-bf0a-e406abe6cd4e', 'The Puppet Master', 'Keep all players engaged for an entire session.', 'the-puppet-master', 'dm', 'medium', 25, 'dm', false, 1, 'Ensure that every player stays engaged and involved throughout a session.'),
	('4db8d6e7-b5a3-4054-98f5-4243b752b9f7', 'The Improviser', 'Successfully adapt to an unexpected player action.', 'the-improviser', 'dm', 'medium', 25, 'dm', false, 1, 'Think on your feet and adapt to an unexpected action from your players.'),
	('2ddb6c8c-d5fa-4522-b003-59db236c93c4', 'The Mentor', 'Teach a new player how to play D&D.', 'the-mentor', 'community', 'easy', 15, 'dm', false, 1, 'Help a new player learn the ropes of D&D and join the fun.'),
	('28738595-c5b6-464b-9de2-eff343ec2e33', 'Master of Puzzles (DM)', 'Create a puzzle that takes the party over 30 minutes to solve.', 'master-of-puzzles-dm', 'dm', 'hard', 40, 'dm', false, 1, 'Challenge your players with a puzzle that takes over 30 minutes to solve.'),
	('3d666761-d837-4b48-b7aa-43aa619bb8c1', 'First Campaign', 'Start your first campaign.', 'first-campaign', 'community', 'easy', 10, 'player', false, 1, 'Embark on your first adventure by starting your first campaign.'),
	('0228139b-0e3c-412e-bdb2-4fc11aa3f41d', 'Master of Dungeons', 'Complete 10 dungeons.', 'master-of-dungeons', 'exploration', 'hard', 40, 'character', false, 1, 'Skillful at exploration of dungeons.'),
	('e16be1bf-0901-4644-927e-0353de3753af', 'The Balancer', 'Run a combat encounter that challenges the party without overwhelming them.', 'the-balancer', 'dm', 'medium', 30, 'dm', false, 1, 'Design a combat encounter that is both challenging and fair for the party.'),
	('629fd1d7-0630-491d-8503-59624d4863b8', 'The Tactician', 'Use enemy tactics that force the party to think creatively.', 'the-tactician', 'dm', 'hard', 40, 'dm', false, 1, 'Employ clever enemy tactics that require the party to think outside the box.'),
	('83838629-8da2-4e96-a086-5acea3721ab3', 'Dice Dealer', 'Lend dice to a player who forgot theirs.', 'dice-dealer', 'community', 'easy', 10, 'dm', false, 1, 'Be a helpful DM by lending dice to a player who forgot theirs.'),
	('09806417-4b22-4b56-b2fa-b200dd58bdd7', 'The Voice Actor', 'Use 5 different voices for NPCs in a single session.', 'the-voice-actor', 'dm', 'hard', 40, 'dm', false, 1, 'Bring your NPCs to life by using 5 unique voices in a single session.'),
	('05027597-cd2a-4c46-99da-220fb54ad167', 'The Chef', 'Bring snacks for the group.', 'the-chef', 'community', 'easy', 10, 'dm', false, 1, 'Keep your players happy by bringing snacks for the group.'),
	('19ab3e8b-b10f-4b77-8109-d89be87d75dc', 'First Steps', 'Join your first campaign.', 'first-steps', 'community', 'easy', 10, 'player', false, 1, 'Take your first steps into the world of D&D by joining your first campaign.'),
	('ebc7f7d0-a155-466e-85c7-7cc7c96b853d', 'Level Up!', 'Reach level 5 in a campaign.', 'level-up', 'combat', 'medium', 20, 'character', false, 1, 'Advance your character to level 5 and unlock new abilities.'),
	('bbb887dd-73e5-484b-a9d0-6fce703e8339', 'Epic Hero', 'Reach level 20 in a campaign.', 'epic-hero', 'combat', 'hard', 50, 'character', false, 1, 'Achieve greatness by reaching level 20 with your character.'),
	('3c08a3ef-7971-4071-a527-d0998ad2d189', 'Forum Contributor', 'Post 10 times on the website''s forums.', 'forum-contributor', 'community', 'easy', 10, 'player', false, 1, 'Engage with the community by posting 10 times on the website''s forums.'),
	('eadbed6d-95ef-4252-a123-ba2c0ca43096', 'Event Organizer', 'Host a D&D-related event for the society.', 'event-organizer', 'community', 'medium', 30, 'player', false, 1, 'Bring people together by organizing a D&D-related event for the society.'),
	('44f0ed7b-3f34-47e5-9ede-6451cb899af9', 'Team Player', 'Help another player with their character sheet.', 'team-player', 'community', 'easy', 10, 'player', false, 1, 'Be a team player by helping another member with their character sheet.'),
	('6044f205-e4b9-4306-8381-c458839c6aeb', 'The Lucky One', 'Roll 3 natural 20s in a single session.', 'the-lucky-one', 'combat', 'hard', 40, 'player', false, 1000, 'Experience incredible luck by rolling 3 natural 20s in a single session.'),
	('478f65c7-e445-4188-a90c-27813bbbdc0c', 'The Unlucky One', 'Roll 3 natural 1s in a single session.', 'the-unlucky-one', 'combat', 'hard', 40, 'player', false, 1000, 'Endure terrible luck by rolling 3 natural 1s in a single session.'),
	('6ca3b721-d0e3-43df-83a6-79512cba2cc4', 'The Procrastinator', 'Submit your character sheet at the last minute.', 'the-procrastinator', 'miscellaneous', 'easy', 10, 'player', false, 1, 'Wait until the last minute to submit your character sheet.'),
	('3586bd6f-4a9c-4126-80f6-6130f3e07ecb', 'Combat Mastery', 'Excel in battle-related achievements.', 'combat-mastery', 'combat', 'hard', 50, 'player', false, 1, 'Demonstrate your mastery of combat by excelling in battle-related achievements.'),
	('312a05fe-fbf0-4603-93c5-1366fcc1e033', 'Roleplay Royalty', 'Excel in storytelling and character development.', 'roleplay-royalty', 'roleplay', 'hard', 50, 'player', false, 1, 'Show your storytelling skills by excelling in roleplay and character development.'),
	('c2d1b0d2-2b6d-4a77-a583-706931964c9a', 'Exploration Expert', 'Excel in discovery and adventure.', 'exploration-expert', 'exploration', 'hard', 50, 'player', false, 1, 'Prove your expertise in exploration by excelling in discovery and adventure.'),
	('56c5e58d-bc3a-42fa-a29e-097c3592b2b8', 'Community Builder', 'Excel in contributions to the society.', 'community-builder', 'community', 'hard', 50, 'player', false, 1, 'Make a lasting impact by excelling in contributions to the D&D Society.'),
	('afaf0f06-62de-4985-a4c6-8735e9e4fcac', 'Roll the Dice', 'Roll your first dice in a session.', 'roll-the-dice', 'miscellaneous', 'easy', 10, 'player', false, 1, 'Take your first step into gameplay by rolling your first dice in a session.'),
	('261a1f52-7879-4988-bdd4-679f132be3c9', 'Character Creator', 'Create your first character.', 'character-creator', 'miscellaneous', 'easy', 10, 'player', false, 1, 'Design your first character and bring them to life in the game.'),
	('9300577a-534f-4c02-abb0-8fde3719c53f', 'Join the Party', 'Join a group for a campaign.', 'join-the-party', 'community', 'easy', 10, 'player', false, 1, 'Become part of a group and join a campaign.'),
	('fda15fd7-40f7-4209-b595-c6de52648679', 'Ask a Question', 'Ask a rules-related question during a session.', 'ask-a-question', 'knowledge', 'easy', 10, 'player', false, 1, 'Learn more about the game by asking a rules-related question during a session.'),
	('cc450e4f-c417-496a-a8a9-e9aed69c6d89', 'Make a Friend', 'Chat with another player on the website.', 'make-a-friend', 'community', 'easy', 10, 'player', false, 1, 'Connect with another player by chatting on the website.'),
	('03b22467-f0d5-40e9-af93-94ad879ff081', 'First Kill', 'Defeat your first enemy.', 'first-kill', 'combat', 'easy', 10, 'character', false, 1, 'Prove your combat skills by defeating your first enemy.'),
	('4d5809d5-fbb3-46dd-b41a-595ebf22879c', 'Loot Finder', 'Pick up your first piece of loot.', 'loot-finder', 'exploration', 'easy', 10, 'character', false, 1, 'Discover your first piece of loot during your adventure.'),
	('dda8c710-2f9e-4613-8a13-c6bd5b0adc50', 'Level One Hero', 'Reach level 1 with your character.', 'level-one-hero', 'combat', 'easy', 10, 'character', false, 1, 'Begin your journey by reaching level 1 with your character.'),
	('2105fb25-c468-4ceb-8c3f-3497bf454edf', 'Say Hello', 'Introduce yourself on the website''s forums.', 'say-hello', 'community', 'easy', 10, 'player', false, 1, 'Introduce yourself to the community by posting on the website''s forums.'),
	('b4edc4a3-fe77-41f0-b3f3-a313b13fd828', 'Roll Initiative', 'Roll initiative for the first time.', 'roll-initiative', 'combat', 'easy', 10, 'player', false, 1, 'Take your first step into combat by rolling initiative for the first time.'),
	('455af2ea-12dd-488f-bbf6-8f01627f8d1b', 'Use a Spell', 'Cast your first spell.', 'use-a-spell', 'combat', 'easy', 10, 'character', false, 1, 'Harness your magical abilities by casting your first spell.'),
	('7819f98c-0ed1-4d6f-bed6-662244b32548', 'Equip Gear', 'Equip your first weapon or armor.', 'equip-gear', 'combat', 'easy', 10, 'character', false, 1, 'Prepare for battle by equipping your first weapon or armor.'),
	('6cb269fe-05a7-4203-bfcc-6fda56390675', 'Take a Rest', 'Complete your first long rest.', 'take-a-rest', 'miscellaneous', 'easy', 10, 'character', false, 1, 'Recover and prepare for your next adventure by completing your first long rest.'),
	('ec5f06d5-b815-4ce0-90d1-6701cac37106', 'First Gold', 'Earn your first gold piece.', 'first-gold', 'exploration', 'easy', 10, 'character', false, 1, 'Start your fortune by earning your first gold piece.'),
	('c9b36ac5-b098-4318-818c-c842939a8c2a', 'First NPC', 'Interact with your first NPC.', 'first-npc', 'roleplay', 'easy', 10, 'character', false, 1, 'Begin your journey by interacting with your first NPC.'),
	('7cf060d8-c763-456a-baa4-6fdb4a2d4727', 'First Map', 'View your first map during a session.', 'first-map', 'exploration', 'easy', 10, 'player', false, 1, 'Navigate your adventure by viewing your first map during a session.'),
	('185205c9-21e5-4c69-aeb3-e53a8b2e347d', 'First Quest', 'Accept your first quest.', 'first-quest', 'exploration', 'easy', 10, 'character', false, 1, 'Start your adventure by accepting your first quest.'),
	('124247e9-7114-4a2e-bf09-ac9f0eac25c5', 'First Trap', 'Trigger your first trap.', 'first-trap', 'exploration', 'easy', 10, 'character', false, 1, 'Learn from your mistakes by triggering your first trap.'),
	('c117ded7-4274-43ea-a2d8-60b91f1a39e1', 'First Puzzle', 'Solve your first puzzle.', 'first-puzzle', 'exploration', 'easy', 10, 'character', false, 1, 'Test your problem-solving skills by solving your first puzzle.'),
	('e7b16cb2-b16e-48e4-b557-3c9e093b46f2', 'First Roleplay', 'Speak in character for the first time.', 'first-roleplay', 'roleplay', 'easy', 10, 'player', false, 1, 'Immerse yourself in the game by speaking in character for the first time.'),
	('6a6ba553-c0ce-418e-b45b-e67db4dc2779', 'First DM', 'Play in a session with your first DM.', 'first-dm', 'community', 'easy', 10, 'player', false, 1, 'Begin your journey by playing in a session with your first DM.'),
	('89050dd4-5aa6-4293-bb2e-30126199277a', 'First Achievement', 'Unlock your first achievement.', 'first-achievement', 'miscellaneous', 'easy', 10, 'player', false, 1, 'Celebrate your progress by unlocking your first achievement.'),
	('7a2042ef-a99b-4b88-a507-22e72ff462ef', 'First Crit', 'Roll your first natural 20.', 'first-crit', 'combat', 'easy', 10, 'player', false, 1, 'Experience the thrill of rolling your first natural 20.'),
	('4066383a-6ea9-45a7-ac10-b862c7780cb0', 'First Fail', 'Roll your first natural 1.', 'first-fail', 'combat', 'easy', 5, 'player', false, 1, 'Face the consequences of rolling your first natural 1.'),
	('eb148678-af52-472e-bcf0-a331447fec01', 'First Companion', 'Gain your first animal companion.', 'first-companion', 'roleplay', 'easy', 10, 'character', false, 1, 'Form a bond with the wild by gaining your first animal companion.'),
	('a9bcde0b-d2bd-491f-8c82-e28d8f1b9fb8', 'First Magic Item', 'Find your first magic item.', 'first-magic-item', 'exploration', 'easy', 10, 'character', false, 1, 'Uncover a magical artifact by finding your first magic item.'),
	('948005a2-9db3-4cec-9002-2be4bc059789', 'First Dungeon', 'Enter your first dungeon.', 'first-dungeon', 'exploration', 'easy', 10, 'character', false, 1, 'Brave the depths by entering your first dungeon.'),
	('3ad04244-120a-4d7b-bb9e-9c662edaff0f', 'First Boss', 'Fight your first boss.', 'first-boss', 'combat', 'easy', 10, 'character', false, 1, 'Test your skills against a formidable foe by fighting your first boss.'),
	('1862693d-2adb-4125-b3c6-a781b4edf7bd', 'First Death', 'Have your character die for the first time.', 'first-death', 'roleplay', 'easy', 5, 'character', false, 1, 'Experience the sting of defeat by having your character die for the first time.'),
	('53c8b0f2-562f-4f34-9edf-38fb4d26751d', 'First Resurrection', 'Bring your character back to life.', 'first-resurrection', 'roleplay', 'easy', 10, 'character', false, 1, 'Defy the odds by bringing your character back to life.'),
	('09b24a65-05de-4204-ba66-63b37d6fb087', 'First Level Up', 'Level up your character for the first time.', 'first-level-up', 'miscellaneous', 'easy', 10, 'character', false, 1, 'Enhance your abilities by levelling up your character for the first time.'),
	('226143fa-2c63-4e62-93a1-6d2924242906', 'First Treasure', 'Find your first treasure chest.', 'first-treasure', 'exploration', 'easy', 10, 'character', false, 1, 'Unearth riches by finding your first treasure chest.'),
	('5d9a2b70-5b02-48e1-9e55-f7ad5c586ce2', 'First Party Wipe', 'Experience your first total party wipe.', 'first-party-wipe', 'combat', 'easy', 5, 'player', false, 1, 'Learn from your mistakes by experiencing your first total party wipe.'),
	('0242612b-6b74-428e-aef9-ffcb503794fb', 'First Escape', 'Escape from a dangerous situation.', 'first-escape', 'exploration', 'easy', 10, 'character', false, 1, 'Outsmart your enemies by escaping from a dangerous situation.'),
	('7f38d487-430e-425e-81ed-4577e1fb5a14', 'First Bargain', 'Negotiate with an NPC.', 'first-bargain', 'roleplay', 'easy', 10, 'character', false, 1, 'Hone your diplomacy skills by negotiating with an NPC.'),
	('f1d5df17-1b24-4b56-9fab-8141ebaf3a09', 'First Ally', 'Recruit your first ally.', 'first-ally', 'roleplay', 'easy', 10, 'character', false, 1, 'Gain support by recruiting your first ally.'),
	('1fb372b5-ca40-427a-b78a-0441229646a2', 'First Enemy', 'Encounter your first enemy.', 'first-enemy', 'combat', 'easy', 10, 'character', false, 1, 'Make enemies on the battlefield by encountering your first enemy.'),
	('b1b513b4-b914-4d0b-bd1a-7dca3172de2f', 'First Victory', 'Win your first combat encounter.', 'first-victory', 'combat', 'easy', 10, 'character', false, 1, 'Taste success by winning your first combat encounter.'),
	('21baea8a-b3a8-4d33-b5b3-18c5a731a527', 'First Defeat', 'Lose your first combat encounter.', 'first-defeat', 'combat', 'easy', 5, 'character', false, 1, 'Learn from adversity by losing your first combat encounter.'),
	('253863da-988f-4da9-b3b5-cd6307fb5c63', 'First Plan', 'Create your first strategy.', 'first-plan', 'knowledge', 'easy', 10, 'player', false, 1, 'Contribute to the party''s success by creating your first strategy.'),
	('ce447bac-351e-49cf-bffb-161129baa9c2', 'First Vote', 'Participate in a party decision.', 'first-vote', 'community', 'easy', 10, 'player', false, 1, 'Contribute to the party by participating in a party decision.'),
	('861e8abf-019e-443e-8c8f-613a14ae5beb', 'Master Strategist', 'Plan and execute a flawless strategy.', 'master-strategist', 'knowledge', 'hard', 40, 'player', false, 1, 'Achieve perfection in planning by executing a flawless strategy.'),
	('f84b1554-3c7e-4ef8-bd92-2b3e565206f3', 'Perfect Session', 'Complete a session without making a single mistake.', 'perfect-session', 'miscellaneous', 'hard', 50, 'player', false, 1, 'Achieve flawlessness by completing a session without a single mistake.'),
	('78f82708-ceb3-4f8b-8d95-792beff52b1b', 'Flawless Victory', 'Win a combat encounter without taking any damage.', 'flawless-victory', 'combat', 'hard', 40, 'character', false, 1, 'Display prowess in combat with a flawless victory.'),
	('deae9934-c24c-44c4-8aad-ab9a32c70818', 'Master Roleplayer', 'Stay in character for an entire campaign.', 'master-roleplayer', 'roleplay', 'hard', 50, 'player', false, 1, 'Achieve complete immersion by staying in character for an entire campaign.'),
	('6ffc1575-8d6d-43f6-b0c1-f32c9df35f23', 'Lore Master', 'Recite detailed lore without notes.', 'lore-master', 'knowledge', 'hard', 40, 'player', false, 1, 'Exhibit expertise with lore by reciting it without notes.'),
	('120861e4-a9a4-4a98-959d-92ceeb18a6a9', 'Puzzle Master', 'Solve a complex puzzle in under 10 minutes.', 'puzzle-master', 'exploration', 'hard', 40, 'character', false, 1, 'Show quick-thinking by solving a puzzle under 10 minutes.'),
	('c667c7dd-69dc-4c9b-8356-d20684d3a10a', 'Dungeon Mastermind', 'Navigate a dungeon without triggering any traps.', 'dungeon-mastermind', 'exploration', 'hard', 40, 'character', false, 1, 'Display skill in exploration by avoiding all traps.'),
	('a5b83312-a196-4a85-80f8-a94a84099bbd', 'Treasure Hoarder', 'Collect 50 unique items.', 'treasure-hoarder', 'exploration', 'hard', 40, 'character', false, 1, 'Build an impressive hoard with 50 unique items.'),
	('62648c67-5ea6-4eb3-b7b7-d74fff920431', 'Epic Combatant', 'Deal over 100 damage in a single turn.', 'epic-combatant', 'combat', 'hard', 40, 'character', false, 1, 'Show extreme prowess in combat by dealing over 100 damage.'),
	('be8b5548-7d17-4a53-a6a5-2750e74bba7c', 'Tank Legend', 'Absorb over 500 damage in a single campaign.', 'tank-legend', 'combat', 'hard', 40, 'character', false, 1, 'Become a resilient protector by absorbing 500 damage.'),
	('a6db8d89-3210-40fc-b644-295addf04005', 'Boss Slayer', 'Defeat 5 campaign bosses.', 'boss-slayer', 'combat', 'hard', 50, 'character', false, 1, 'Display domination over foes by defeating multiple bosses.'),
	('ad6a13d6-21d4-4f97-ae56-afab6dec31bd', 'World Explorer', 'Visit 10 unique locations.', 'world-explorer', 'exploration', 'hard', 40, 'character', false, 1, 'Show curiosity by visiting several distinct locations.'),
	('148cbb98-7865-416a-948e-5f284d00e229', 'Master Negotiator', 'Convince an NPC to change sides.', 'master-negotiator', 'roleplay', 'hard', 40, 'character', false, 1, 'Exhibit persuasion by converting an NPC.'),
	('e11c5614-a708-4026-b591-053a72634a75', 'Legendary Hero', 'Reach level 20 with your character.', 'legendary-hero', 'miscellaneous', 'hard', 50, 'character', false, 1, 'Become a legend by reaching the highest level.'),
	('efa1aa80-d58d-45ec-9bfb-fe4eef8b4862', 'Master DM', 'Run 10 successful campaigns.', 'master-dm', 'community', 'hard', 50, 'dm', false, 1, 'Show long-term skill as a DM.'),
	('84044ace-c4c5-4401-b424-cf8bdb141a03', 'Unstoppable Party', 'Complete a campaign without a single party member dying.', 'unstoppable-party', 'community', 'hard', 50, 'player', false, 1, 'Display exceptional luck or coordination.'),
	('bc762d1e-ac3e-4520-a631-dbb5152fec1b', 'Master of Secrets', 'Discover 10 hidden secrets.', 'master-of-secrets', 'exploration', 'hard', 40, 'character', false, 1, 'Dig into the story by uncovering 10 hidden secrets.'),
	('0d1aa68c-4855-47f1-8bc8-1ed3f0e0ae57', 'Master of Magic', 'Cast 50 unique spells.', 'master-of-magic', 'combat', 'hard', 40, 'character', false, 1, 'Exploit versatility by casting dozens of distinct spells.'),
	('cb4b88a5-f885-4e55-8a6d-2a92275faf3d', 'Master of Combat', 'Win 50 combat encounters.', 'master-of-combat', 'combat', 'hard', 40, 'character', false, 1, 'Demonstrate repeated domination in combat.'),
	('ea5d3da8-890d-4153-92c0-cc59c4ce54c5', 'Master of Roleplay', 'Deliver 10 emotional monologues.', 'master-of-roleplay', 'roleplay', 'hard', 40, 'player', false, 1, 'Dominate as a roleplayer with your impressive talent.'),
	('9e7998e5-71cf-4a1a-ac14-6612a9b12efa', 'Master of Puzzles', 'Solve 10 complex puzzles.', 'master-of-puzzles', 'exploration', 'hard', 40, 'character', false, 1, 'Become skilled in problem-solving.'),
	('893d4536-f330-43b5-9482-7647acba4f19', 'Master of Bosses', 'Defeat 10 bosses.', 'master-of-bosses', 'combat', 'hard', 40, 'character', false, 1, 'Consistently defeating bosses, you demonstrate competence.'),
	('c35476fa-197e-4703-8947-574f4d45ea16', 'Master of Lore', 'Write 10 detailed pieces of lore.', 'master-of-lore', 'knowledge', 'hard', 40, 'player', false, 1, 'Expert lore creator.'),
	('6aa21933-0e9b-47c4-a051-7f4689d8d884', 'Master of Maps', 'Create 10 detailed maps.', 'master-of-maps', 'exploration', 'hard', 40, 'player', false, 1, 'You know your cartography.'),
	('d7a55815-8c70-4fae-890b-ceb228b7beb1', 'Master of NPCs', 'Create 10 unique NPCs.', 'master-of-npcs', 'roleplay', 'hard', 40, 'dm', false, 1, 'Show skill in your ability to create NPCs.'),
	('b0c7feb7-b7cd-46a4-9720-397b8e0b4e45', 'Master of Campaigns', 'Complete 10 campaigns.', 'master-of-campaigns', 'community', 'hard', 40, 'dm', false, 1, 'Show skill as a DM by the sheer volume of campaigns completed.'),
	('b577ec76-efb2-4a16-bdee-3e9a251d6ca9', 'Master of Achievements', 'Unlock 50 achievements.', 'master-of-achievements', 'miscellaneous', 'hard', 50, 'player', false, 1, 'You will unlock a lot of achievements.'),
	('6a71539c-5fed-467a-bf85-c99a798c4082', 'Immortal Hero', 'Complete a campaign without taking any damage.', 'immortal-hero', 'miscellaneous', 'impossible', 100, 'character', true, 1, 'Display luck like no other and complete a campaign invulnerable.'),
	('d473a607-2ade-429c-90a6-f078a84a26a8', 'Perfect Campaign', 'Complete a campaign without making a single mistake.', 'perfect-campaign', 'miscellaneous', 'impossible', 100, 'player', true, 1, 'Are you a god? Make not a single mistake throughout your journey.'),
	('ca9fd07d-10b3-4c5d-92c1-0e9fcee78f19', 'Ultimate Strategist', 'Plan and execute a flawless strategy in every session of a campaign.', 'ultimate-strategist', 'knowledge', 'impossible', 100, 'player', true, 1, 'Unlikely is an understatement: always have a perfect flawless strategy.'),
	('918118f7-463a-42fd-992d-c01b5997ceb5', 'Legendary DM', 'Run a campaign that every player rates 10/10.', 'legendary-dm', 'community', 'impossible', 100, 'dm', true, 1, 'Are you a mythical beast? Every player must have had the time of their lives.'),
	('a10d317f-aab2-4304-a71b-8d16a490805e', 'Ultimate Roleplayer', 'Stay in character for every session of a campaign.', 'ultimate-roleplayer', 'roleplay', 'impossible', 100, 'player', true, 1, 'Immerse yourself: you''ve never broken character.'),
	('02ec0954-47c5-4eca-8a2f-07bb66f7fbc6', 'Ultimate Explorer', 'Visit every location in the campaign world.', 'ultimate-explorer', 'exploration', 'impossible', 100, 'character', true, 1, 'In your adventure, you''ve seen everything the world has to offer and discovered.'),
	('954b7b4b-e6d8-460c-9d30-1bf2a14fa049', 'Ultimate Collector', 'Collect every unique item in the campaign.', 'ultimate-collector', 'exploration', 'impossible', 100, 'character', true, 1, 'Not a single item has escaped your grasp. You own them all.'),
	('99023179-ec3a-48ca-842f-1de55e949c33', 'Ultimate Combatant', 'Win every combat encounter in a campaign flawlessly.', 'ultimate-combatant', 'combat', 'impossible', 100, 'character', true, 1, 'Flawless victories: you dominate every single one of the combat encounters.'),
	('3ef9242f-b2b2-4e2a-a5f3-e2d2696c6959', 'Ultimate Lorekeeper', 'Write a detailed history of the campaign world.', 'ultimate-lorekeeper', 'knowledge', 'impossible', 100, 'player', true, 1, 'Did you write the history books? The history is all recorded because of you.'),
	('64cb7c78-1f31-44a8-b448-3dbae25dfbb3', 'Ultimate Puzzle Solver', 'Solve every puzzle in a campaign flawlessly.', 'ultimate-puzzle-solver', 'exploration', 'impossible', 100, 'character', true, 1, 'Never once having failed or used outside help, you dominate the puzzles.'),
	('67acc270-18d7-4a8d-a477-b1d43c6c119a', 'Ultimate Dungeon Delver', 'Complete every dungeon in a campaign flawlessly.', 'ultimate-dungeon-delver', 'exploration', 'impossible', 100, 'character', true, 1, 'Traps mean nothing to you. You explore the deepest depths with no mistakes.'),
	('7b133fde-cea4-4a13-aeef-efaec99144e8', 'Ultimate Boss Slayer', 'Defeat every boss in a campaign flawlessly.', 'ultimate-boss-slayer', 'combat', 'impossible', 100, 'character', true, 1, 'Every boss has fallen, no hit taken: a display of ultimate skill and luck.'),
	('6206cc96-da76-4905-849c-feca6817f217', 'Ultimate Hero', 'Reach level 20 without dying.', 'ultimate-hero', 'miscellaneous', 'impossible', 100, 'character', true, 1, 'Not once have you fallen throughout your entire journey.'),
	('9d33aa02-e27c-4787-a77f-409d4a8214f6', 'Ultimate Party', 'Complete a campaign without a single party member dying.', 'ultimate-party', 'community', 'impossible', 100, 'player', true, 1, 'Protect your friends. You can make sure your party comes out with zero casualties.'),
	('fdd7d9bc-1c1a-4f07-8b04-f1e14dab69c2', 'First Spell Slot', 'Use your first spell slot.', 'first-spell-slot', 'combat', 'easy', 10, 'character', false, 1, 'Unleash your magical abilities by using your first spell slot.'),
	('9f35f705-944d-442f-8db7-10c1fbe39669', 'First Inspiration', 'Earn your first inspiration point.', 'first-inspiration', 'miscellaneous', 'easy', 10, 'player', false, 1, 'Spark creativity by earning your first inspiration point.'),
	('ed075ec8-0460-4fb2-a2b2-ee76781d8a90', 'First DM Note', 'Receive your first note from the DM.', 'first-dm-note', 'community', 'easy', 10, 'player', false, 1, 'Immerse yourself in the world by receiving your first note from the DM.'),
	('b8340074-fb57-48c7-bed4-156ebcb70100', 'First Secret', 'Discover your first secret.', 'first-secret', 'exploration', 'easy', 10, 'character', false, 1, 'Uncover a hidden truth by discovering your first secret.'),
	('599dd569-0e5b-400f-a399-b2924303496b', 'First Clue', 'Find your first clue.', 'first-clue', 'exploration', 'easy', 10, 'character', false, 1, 'Solve the mystery by finding your first clue.'),
	('ea46eeba-060c-4e98-9a29-12200b1e8787', 'First Mystery', 'Solve your first mystery.', 'first-mystery', 'knowledge', 'easy', 10, 'character', false, 1, 'Test your skills by solving your first mystery.'),
	('dccb01ba-dd80-44e9-a9c3-662b99688c01', 'First Ally Death', 'Witness the death of a party member', 'first-ally-death', 'roleplay', 'easy', 5, 'player', false, 1, 'Experience the loss by witnessing the death of a party member.'),
	('181d1882-f3f7-4990-885a-149c5f9529fa', 'First Betrayal', 'Experience your first betrayal.', 'first-betrayal', 'roleplay', 'easy', 5, 'character', false, 1, 'Discover treachery by experiencing your first betrayal.'),
	('8b24e0e1-a0f5-4018-bd6e-0f4a025049e1', 'First Victory Speech', 'Give your first victory speech.', 'first-victory-speech', 'roleplay', 'easy', 10, 'player', false, 1, 'Celebrate your triumphs by giving your first victory speech.'),
	('919756e1-921d-4784-a053-57710458fbc2', 'First Loss Speech', 'Give your first loss speech.', 'first-loss-speech', 'roleplay', 'easy', 5, 'player', false, 1, 'Reflect on defeat by giving your first loss speech.'),
	('67957976-7fc5-4a23-add8-6e2321570223', 'First Joke', 'Tell your first joke in character.', 'first-joke', 'roleplay', 'easy', 10, 'player', false, 1, 'Liven things up by telling your first joke in character.'),
	('ccc10658-ecc5-46c6-843d-16046ec174b9', 'First Laugh', 'Make the party laugh.', 'first-laugh', 'community', 'easy', 10, 'player', false, 1, 'Bring joy by making the party laugh.'),
	('0636b7cb-8817-4996-9ca7-0c8d904c21a2', 'First Cry', 'Make the party cry.', 'first-cry', 'roleplay', 'easy', 5, 'player', false, 1, 'Evoke emotion by making the party cry.'),
	('e26059a2-1027-44da-93cb-5cdb4ad5d853', 'First Song', 'Sing your first song in character.', 'first-song', 'roleplay', 'easy', 10, 'player', false, 1, 'Express yourself through song in character.'),
	('6e9503c7-1a8f-43b7-bc5c-efac26d31980', 'First Poem', 'Recite your first poem in character.', 'first-poem', 'roleplay', 'easy', 10, 'player', false, 1, 'Share your artistry by reciting your first poem in character.'),
	('7e6f0f09-ccc2-47db-bf72-cdf0a130492a', 'First Drawing', 'Draw your first map or character sketch.', 'first-drawing', 'exploration', 'easy', 10, 'player', false, 1, 'Express creativity through drawing.'),
	('436e640c-01b5-4b24-8ed7-5658d6a9d92d', 'First Gift', 'Give another player a gift.', 'first-gift', 'community', 'easy', 10, 'player', false, 1, 'Spread kindness by giving another player a gift.'),
	('8ba15ed3-6526-458b-8e7b-ead54438206b', 'First Trade', 'Trade an item with another player.', 'first-trade', 'exploration', 'easy', 10, 'player', false, 1, 'Connect with another player by trading.');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("auth_user_uuid", "knumber", "username", "name", "email") VALUES
	('240434b4-a2b3-4920-a1c3-aeccc6b60b94', 'K12345678', 'kutay', 'Kutay', 'kutay@kcl.ac.uk'),
	('42dc41a9-98e2-416b-a97d-d222e3735654', 'K87654321', 'admin', 'Admin', 'admin@kcl.ac.uk'),
	('8daf5d66-4726-49ba-8286-2755d73febcd', 'K12341234', 'table', 'Table', 'table@kcl.ac.uk'),
	('49432716-c956-4f14-86fb-060e827acd44', NULL, 'alastor', 'Alastor', 'alastor@a.com');


--
-- Data for Name: associates_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."associates_requests" ("id", "created_at", "email", "name", "notes", "status", "user_id", "decision_by") VALUES
	('674c0927-996f-4192-aa1d-374b54988fa1', '2025-07-30 12:57:06.034435+00', 'alastor@a.com', 'Alastor', 'You know who I am.', 'approved', '49432716-c956-4f14-86fb-060e827acd44', '42dc41a9-98e2-416b-a97d-d222e3735654');


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."campaigns" ("id", "name", "description", "start_date", "end_date", "shortened") VALUES
	('35df310b-adb9-480d-8f07-59df3563e774', 'Waterdeep: Dragon Heist', 'An awesome campaign about uncovering the secrets of a city, Waterdeep.', '2025-07-30', NULL, 'waterdeep-dragon-heist');


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."images" ("id", "name") VALUES
	('513bb4b3-cba1-456f-8e19-c40797625fee', 'player.jpg'),
	('d4b45746-f0c8-462d-b53a-7404862b6034', 'character.png'),
	('ff8ea5e5-472f-4c10-a5df-1741a9b5782b', 'dm.jpg'),
	('8516f20e-c458-491a-aff4-3816d44a64d3', 'party.jpg'),
	('e4e6334b-aadc-4099-ad50-fde5dd54c0ea', 'characters/lizard-man-8d788b63-7c2b-4117-8220-4ac3343b396a-humanoid_bluedragonbornbard1.png'),
	('294b587e-8dde-460d-b7fc-9973bd27ec58', 'characters/lizard-man-9cfe2bb6-a2a8-4c0f-a755-c39d16c13aeb-humanoid_bluedragonbornbard1.png'),
	('63921e0d-3439-4142-9526-d9e790b08d07', 'players/kutay-711dbaf9-1d2f-4513-ba3f-808c9fc81ac8-RPG-group-copy-3.jpg'),
	('15b86ea9-5d3f-48bb-b706-b936dc29f9e9', 'dms/admin-8e1904c1-9f31-428c-9abd-353739e2beb2-silverymoon.jpg'),
	('01b74744-2043-497e-8b1a-1048d3d82bae', 'dms/admin-28ec66cc-511d-46a5-90a2-289c8a04e720-silverymoon.jpg'),
	('ec771870-8e71-42dd-a2de-298a0542991c', 'players/admin-539925c4-a3f8-4214-a050-f569e81de4ad-RPG-group-copy.jpg'),
	('c51386b0-f919-4f23-b1d4-359567f4e3bb', 'parties/two-and-a-half-man-party-034ba455-787c-47c2-b822-a03e75329a14-fluv8updfjsa1.jpg'),
	('e9a0dac0-aef9-4902-af50-f0e37d4936ae', 'players/table-acccfca9-a94e-44e0-8331-4b7cc4e6020b-5i3xgez2r9c91.jpg'),
	('7e0add04-d933-42c1-b6f0-a254cc6a00ee', 'dms/alastor-a76883f8-d416-4185-8e57-83fc79b01536-Astral Elf Commander.webp');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("auth_user_uuid", "role") VALUES
	('240434b4-a2b3-4920-a1c3-aeccc6b60b94', 'player'),
	('42dc41a9-98e2-416b-a97d-d222e3735654', 'admin'),
	('8daf5d66-4726-49ba-8286-2755d73febcd', 'player'),
	('49432716-c956-4f14-86fb-060e827acd44', 'dm');


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."players" ("auth_user_uuid", "level", "id", "about", "image_uuid") VALUES
	('240434b4-a2b3-4920-a1c3-aeccc6b60b94', 1, 'df1ff490-79e0-474c-9914-5937b3b57424', 'I am an amazing person. I can solve the Rubik''s Cube.', '63921e0d-3439-4142-9526-d9e790b08d07'),
	('42dc41a9-98e2-416b-a97d-d222e3735654', 1, '649ede5f-8144-49ff-b866-148f33bcb91f', 'I am a player of DND. I''ve started playing the game six years ago!', 'ec771870-8e71-42dd-a2de-298a0542991c'),
	('8daf5d66-4726-49ba-8286-2755d73febcd', 1, 'a5102fd7-a0d2-4b03-828e-9ccc67f1fec8', '', 'e9a0dac0-aef9-4902-af50-f0e37d4936ae'),
	('49432716-c956-4f14-86fb-060e827acd44', 1, '581a5d2a-20da-414e-9a0b-d114d9aa5a3b', '', NULL);


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."characters" ("id", "player_uuid", "name", "level", "shortened", "about", "image_uuid") VALUES
	('4b00a01f-310d-4868-ae9a-65880ffe44d0', 'df1ff490-79e0-474c-9914-5937b3b57424', 'Lizard Man', 4, 'lizard-man', 'I am an amazing dragon where I try to defeat evil!', '294b587e-8dde-460d-b7fc-9973bd27ec58'),
	('ca7b8736-62d8-41ca-868a-282d71cd260d', '649ede5f-8144-49ff-b866-148f33bcb91f', 'Son of Thor', 20, 'son-of-thor', 'I am the SON of THOR', NULL),
	('12f6fba0-2545-448c-88a9-06009a55cd2c', 'a5102fd7-a0d2-4b03-828e-9ccc67f1fec8', 'Chair', 3, 'chair', 'Chair. Chair. Chair. Chair. Chair. Chair. I am a Chair.', NULL),
	('99641cef-39a7-4143-9c89-92fd237315e6', 'a5102fd7-a0d2-4b03-828e-9ccc67f1fec8', 'Second Chair', 1, 'second-chair', '', NULL);


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."classes" ("id", "name", "rules_url") VALUES
	('92f68d53-350f-431d-80e3-348cbe368478', 'Monk', 'https://2014.5e.tools/classes.html#monk_phb'),
	('eb16ca0b-3431-430d-85f9-6e1324cfbf43', 'Wizard', 'https://2014.5e.tools/classes.html#wizard_phb'),
	('a2acc211-d2ca-45c8-a917-ea1be560279d', 'Rogue', 'https://2014.5e.tools/classes.html#rogue_phb'),
	('c08989a8-fc4f-49bf-83ad-d3ec15e8ff19', 'Cleric', 'https://2014.5e.tools/classes.html#cleric_phb'),
	('f66f6340-70af-4d83-beb8-d6daa8fc0f7d', 'Paladin', 'https://2014.5e.tools/classes.html#paladin_phb'),
	('445ea976-b746-4293-b3f8-86c6ddd8a150', 'Ranger', 'https://2014.5e.tools/classes.html#ranger_phb'),
	('9fdcd293-0646-4869-986e-bf584705b2ed', 'Druid', 'https://2014.5e.tools/classes.html#druid_phb'),
	('4a635d16-f9b8-4d8c-acb1-c062699b4fbf', 'Sorcerer', 'https://2014.5e.tools/classes.html#sorcerer_phb'),
	('83abf98b-2dd1-49e1-b5db-5bc1340e5030', 'Warlock', 'https://2014.5e.tools/classes.html#warlock_phb'),
	('f5be59a6-96ba-4691-8a9f-a2ae3cbc9758', 'Barbarian', 'https://2014.5e.tools/classes.html#barbarian_phb'),
	('ad97176a-9517-491c-9b77-0a95c97aad40', 'Bard', 'https://2014.5e.tools/classes.html#bard_phb'),
	('57f751fb-97a7-4a76-810c-208c425a1943', 'Mage', NULL),
	('39a102d1-3f4d-403a-959c-4964d62bfc65', 'Fighter', 'https://2014.5e.tools/classes.html#fighter_phb'),
	('c305e527-d32d-453a-8420-81fda909f321', 'Chair', NULL);


--
-- Data for Name: character_class; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."character_class" ("character_id", "class_id") VALUES
	('4b00a01f-310d-4868-ae9a-65880ffe44d0', 'ad97176a-9517-491c-9b77-0a95c97aad40'),
	('ca7b8736-62d8-41ca-868a-282d71cd260d', '57f751fb-97a7-4a76-810c-208c425a1943'),
	('12f6fba0-2545-448c-88a9-06009a55cd2c', '39a102d1-3f4d-403a-959c-4964d62bfc65'),
	('99641cef-39a7-4143-9c89-92fd237315e6', 'c305e527-d32d-453a-8420-81fda909f321');


--
-- Data for Name: parties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."parties" ("id", "name", "shortened", "level", "about", "image_uuid") VALUES
	('edaf4411-ff14-4d07-89eb-f24384addfbb', 'Two and a Half Man Party', 'two-and-a-half-man-party', 2, 'We are the Two and a Half Man Party, not sure how you''ve guessed it but yes we have five halflings.', 'c51386b0-f919-4f23-b1d4-359567f4e3bb'),
	('fb0154dd-3913-4d2d-8b0f-1622f4ce1548', 'The Second Ones', 'the-second-ones', 1, '', NULL);


--
-- Data for Name: character_party; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."character_party" ("party_id", "character_id") VALUES
	('edaf4411-ff14-4d07-89eb-f24384addfbb', '4b00a01f-310d-4868-ae9a-65880ffe44d0'),
	('edaf4411-ff14-4d07-89eb-f24384addfbb', '12f6fba0-2545-448c-88a9-06009a55cd2c'),
	('edaf4411-ff14-4d07-89eb-f24384addfbb', 'ca7b8736-62d8-41ca-868a-282d71cd260d'),
	('fb0154dd-3913-4d2d-8b0f-1622f4ce1548', '99641cef-39a7-4143-9c89-92fd237315e6');


--
-- Data for Name: races; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."races" ("id", "name", "rules_url") VALUES
	('88b9763c-9f12-476e-8a28-faff78ff9ab2', 'Half-Orc', 'https://2014.5e.tools/races.html#half-orc_phb'),
	('6296a44b-3236-4668-99f2-4ab0897c2e7a', 'Tiefling', 'https://2014.5e.tools/races.html#tiefling_phb'),
	('b9595c49-fd03-4bef-921f-2dd3fd4928ac', 'Aasimar', 'https://2014.5e.tools/races.html#aasimar_vgm'),
	('3b33071c-7717-4273-b8e3-0f3aebeaef8e', 'Tabaxi', 'https://2014.5e.tools/races.html#tabaxi_vgm'),
	('04964be6-33e6-4189-b1a7-6daf00a017f5', 'Triton', 'https://2014.5e.tools/races.html#triton_vgm'),
	('cec219fd-b92c-48aa-bd26-1ff5381d5718', 'Elf', 'https://2014.5e.tools/races.html#elf_phb'),
	('65c1a061-c78b-4671-813a-ff06ce8d7097', 'Dwarf', 'https://2014.5e.tools/races.html#dwarf_phb'),
	('0e5f30b2-2803-4016-b256-3f109155f1e6', 'Halfling', 'https://2014.5e.tools/races.html#halfling_phb'),
	('de121870-7e1d-4ab8-b44f-8338a308437c', 'Dragonborn', 'https://2014.5e.tools/races.html#dragonborn_phb'),
	('7eab9e2f-62e7-40e4-96d7-b41cf7e7f207', 'Gnome', 'https://2014.5e.tools/races.html#gnome_phb'),
	('581d9959-ef15-4e55-85f5-fb3cdc0d07f0', 'Half-Elf', 'https://2014.5e.tools/races.html#half-elf_phb'),
	('21f8ac1e-4e8b-473f-853b-672cfaa91321', 'Blue Draagon', NULL),
	('fb7ec8a4-5002-4d9c-814a-f7a54b3af448', 'Human', 'https://2014.5e.tools/races.html#human_phb'),
	('2c681850-dca4-412b-ba3a-319350885b3f', 'Chair', NULL);


--
-- Data for Name: character_race; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."character_race" ("character_id", "race_id") VALUES
	('4b00a01f-310d-4868-ae9a-65880ffe44d0', '21f8ac1e-4e8b-473f-853b-672cfaa91321'),
	('ca7b8736-62d8-41ca-868a-282d71cd260d', 'fb7ec8a4-5002-4d9c-814a-f7a54b3af448'),
	('12f6fba0-2545-448c-88a9-06009a55cd2c', '2c681850-dca4-412b-ba3a-319350885b3f'),
	('99641cef-39a7-4143-9c89-92fd237315e6', '2c681850-dca4-412b-ba3a-319350885b3f');


--
-- Data for Name: dms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dms" ("auth_user_uuid", "level", "id", "about", "image_uuid") VALUES
	('42dc41a9-98e2-416b-a97d-d222e3735654', 1, '256e594d-bb61-4401-a4b0-afd1e1971834', 'This is the admin of the entire application. This account is used for general testing and administrative purposes.', '01b74744-2043-497e-8b1a-1048d3d82bae'),
	('49432716-c956-4f14-86fb-060e827acd44', 1, 'f12ac7a0-6ba0-410a-8332-4226728e6a17', 'You know who I am.', '7e0add04-d933-42c1-b6f0-a254cc6a00ee');


--
-- Data for Name: dm_party; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dm_party" ("party_id", "dm_id") VALUES
	('edaf4411-ff14-4d07-89eb-f24384addfbb', '256e594d-bb61-4401-a4b0-afd1e1971834'),
	('fb0154dd-3913-4d2d-8b0f-1622f4ce1548', 'f12ac7a0-6ba0-410a-8332-4226728e6a17');


--
-- Data for Name: journal; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: polls; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: party_campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."party_campaigns" ("party_id", "campaign_id") VALUES
	('edaf4411-ff14-4d07-89eb-f24384addfbb', '35df310b-adb9-480d-8f07-59df3563e774');


--
-- Data for Name: party_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: received_achievements_character; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: received_achievements_dm; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: received_achievements_player; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: when2dnd_polls; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: when2dnd_votes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 430, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;

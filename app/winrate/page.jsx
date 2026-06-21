'use client';
import { motion, AnimatePresence } from 'framer-motion';
import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { 
  Search, ExternalLink, HelpCircle, TrendingUp, BarChart3, 
  Trophy, Crown, Award, LayoutGrid, DollarSign, Layers, Swords,
  Target, Zap, Flame, X
} from 'lucide-react';

// ============================================================
// BAKED-IN PLAYER DATA - 3,000 records from 30 CSV files
// Sites: GGPoker, PokerStars, iPoker, Winamax, WPN
// ============================================================

const POKER_DATA_COMPRESSED = [
{n:"littlesquirrel (GG)",h:1500000,w:-2.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Matjaz Vogrinec (GG)",h:1300000,w:-1.8,s:"GGPoker",k:"1000NL",b:10},
{n:"MindReaver (GG)",h:1100000,w:-5.4,s:"GGPoker",k:"1000NL",b:10},
{n:"Cameron Couch (GG)",h:1000000,w:3,s:"GGPoker",k:"1000NL",b:10},
{n:"Tahmurus (GG)",h:832000,w:-0.3,s:"GGPoker",k:"1000NL",b:10},
{n:"Zazano1 (GG)",h:620000,w:-1.9,s:"GGPoker",k:"1000NL",b:10},
{n:"Shirachi (GG)",h:608000,w:-0.9,s:"GGPoker",k:"1000NL",b:10},
{n:"T Maluchnik (GG)",h:589000,w:-1.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Misha Inner (GG)",h:581000,w:-3.8,s:"GGPoker",k:"1000NL",b:10},
{n:"omar comin yo (GG)",h:572000,w:-0.9,s:"GGPoker",k:"1000NL",b:10},
{n:"MrBuilderman (GG)",h:510000,w:2.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Timinator (GG)",h:486000,w:1.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Manuel Saavedra (GG)",h:458000,w:3.7,s:"GGPoker",k:"1000NL",b:10},
{n:"l MP l (GG)",h:447000,w:-0.6,s:"GGPoker",k:"1000NL",b:10},
{n:"A Cvetkovic (GG)",h:444000,w:0,s:"GGPoker",k:"1000NL",b:10},
{n:"Mikhail Kotov (GG)",h:430000,w:0.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Boris Premovic (GG)",h:426000,w:0,s:"GGPoker",k:"1000NL",b:10},
{n:"C Sanhueza (GG)",h:418000,w:0.8,s:"GGPoker",k:"1000NL",b:10},
{n:"QuantumKey (GG)",h:416000,w:-1.9,s:"GGPoker",k:"1000NL",b:10},
{n:"H Rodriguez (GG)",h:393000,w:-0.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Lucas Landa (GG)",h:381000,w:-3.7,s:"GGPoker",k:"1000NL",b:10},
{n:"DalinarK (GG)",h:376000,w:-1,s:"GGPoker",k:"1000NL",b:10},
{n:"Gonzalo Almeida (GG)",h:367000,w:1.3,s:"GGPoker",k:"1000NL",b:10},
{n:"ImTHEcharlie (GG)",h:328000,w:-2.4,s:"GGPoker",k:"1000NL",b:10},
{n:"Chris Nguyen (GG)",h:325000,w:-0.7,s:"GGPoker",k:"1000NL",b:10},
{n:"medellin (GG)",h:323000,w:-3.6,s:"GGPoker",k:"1000NL",b:10},
{n:"akirasgo (GG)",h:322000,w:-2.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Jerome LHostis (GG)",h:321000,w:1.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Sergei Pronin (GG)",h:318000,w:1.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Borys Turitsa (GG)",h:317000,w:0.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Scott Corbett (GG)",h:313000,w:1.6,s:"GGPoker",k:"1000NL",b:10},
{n:"Mikhail Rykov (GG)",h:305000,w:0.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Sunisthemoon (GG)",h:305000,w:-0.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Ricky Roach (GG)",h:301000,w:1.3,s:"GGPoker",k:"1000NL",b:10},
{n:"HelloCashTy (GG)",h:298000,w:0.3,s:"GGPoker",k:"1000NL",b:10},
{n:"omnislash (GG)",h:298000,w:3,s:"GGPoker",k:"1000NL",b:10},
{n:"Harold Terwagne (GG)",h:297000,w:-2.8,s:"GGPoker",k:"1000NL",b:10},
{n:"Alessandro Da Re (GG)",h:297000,w:-1.5,s:"GGPoker",k:"1000NL",b:10},
{n:"mikethepike (GG)",h:295000,w:-1,s:"GGPoker",k:"1000NL",b:10},
{n:"Matheus Souza (GG)",h:294000,w:-2.8,s:"GGPoker",k:"1000NL",b:10},
{n:"Nyuli Tibor (GG)",h:294000,w:0.5,s:"GGPoker",k:"1000NL",b:10},
{n:"Tu Bui (GG)",h:293000,w:-5.8,s:"GGPoker",k:"1000NL",b:10},
{n:"Martin Finger (GG)",h:292000,w:-2.7,s:"GGPoker",k:"1000NL",b:10},
{n:"UNBROKEN23 (GG)",h:290000,w:1.5,s:"GGPoker",k:"1000NL",b:10},
{n:"Sunny weather (GG)",h:288000,w:-1.2,s:"GGPoker",k:"1000NL",b:10},
{n:"pokersnowy18 (GG)",h:288000,w:1.9,s:"GGPoker",k:"1000NL",b:10},
{n:"Naoufel Smires (GG)",h:283000,w:-1.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Pavel Meshkov (GG)",h:283000,w:-3.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Marco Zevola (GG)",h:273000,w:1.8,s:"GGPoker",k:"1000NL",b:10},
{n:"Viscacha_666 (GG)",h:271000,w:-1.1,s:"GGPoker",k:"1000NL",b:10},
{n:"layumy (GG)",h:270000,w:1,s:"GGPoker",k:"1000NL",b:10},
{n:"Aleksei Istomin (GG)",h:270000,w:-1.4,s:"GGPoker",k:"1000NL",b:10},
{n:"tiripiri (GG)",h:269000,w:-5.5,s:"GGPoker",k:"1000NL",b:10},
{n:"Brian Kamphorst (GG)",h:269000,w:3.3,s:"GGPoker",k:"1000NL",b:10},
{n:"A Zgirouski (GG)",h:267000,w:0.9,s:"GGPoker",k:"1000NL",b:10},
{n:"Severus Snap (GG)",h:267000,w:-2.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Michael Weiss (GG)",h:264000,w:-0.4,s:"GGPoker",k:"1000NL",b:10},
{n:"superher0_ (GG)",h:264000,w:0,s:"GGPoker",k:"1000NL",b:10},
{n:"Tim Khamidullin (GG)",h:261000,w:-2.2,s:"GGPoker",k:"1000NL",b:10},
{n:"N Evdokimov (GG)",h:258000,w:0.3,s:"GGPoker",k:"1000NL",b:10},
{n:"George Froggatt (GG)",h:250000,w:1.8,s:"GGPoker",k:"1000NL",b:10},
{n:"VendaS (GG)",h:250000,w:-2.1,s:"GGPoker",k:"1000NL",b:10},
{n:"mrPupa (GG)",h:241000,w:-1,s:"GGPoker",k:"1000NL",b:10},
{n:"Martin Vialla (GG)",h:239000,w:-3.9,s:"GGPoker",k:"1000NL",b:10},
{n:"Owen Messere (GG)",h:236000,w:-2.8,s:"GGPoker",k:"1000NL",b:10},
{n:"SooooMuchuhu (GG)",h:236000,w:-3,s:"GGPoker",k:"1000NL",b:10},
{n:"iPoker22 (GG)",h:229000,w:-10.2,s:"GGPoker",k:"1000NL",b:10},
{n:"A Krapyvnytskyj (GG)",h:228000,w:-1.5,s:"GGPoker",k:"1000NL",b:10},
{n:"Stefan Burakov (GG)",h:226000,w:-2.5,s:"GGPoker",k:"1000NL",b:10},
{n:"Shibendu Saha (GG)",h:223000,w:-2.1,s:"GGPoker",k:"1000NL",b:10},
{n:"hulahHULAH (GG)",h:222000,w:-1.4,s:"GGPoker",k:"1000NL",b:10},
{n:"Double Meow (GG)",h:221000,w:-3.6,s:"GGPoker",k:"1000NL",b:10},
{n:"Dobey Lin (GG)",h:221000,w:-2.8,s:"GGPoker",k:"1000NL",b:10},
{n:"MrJaguars (GG)",h:220000,w:-1,s:"GGPoker",k:"1000NL",b:10},
{n:"Edwinsucks (GG)",h:220000,w:-16.5,s:"GGPoker",k:"1000NL",b:10},
{n:"J Bogdanovski (GG)",h:219000,w:3.5,s:"GGPoker",k:"1000NL",b:10},
{n:"Dr_ZCash (GG)",h:219000,w:-0.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Land River (GG)",h:216000,w:0.6,s:"GGPoker",k:"1000NL",b:10},
{n:"iamfatty (GG)",h:214000,w:-3.3,s:"GGPoker",k:"1000NL",b:10},
{n:"RukiaKuchiki (GG)",h:211000,w:-0.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Etienne Fortin (GG)",h:210000,w:-3.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Gergo Pinter (GG)",h:208000,w:2.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Manuel77 (GG)",h:206000,w:2,s:"GGPoker",k:"1000NL",b:10},
{n:"Sea Shepherd (GG)",h:202000,w:1.8,s:"GGPoker",k:"1000NL",b:10},
{n:"Hugo Martins (GG)",h:201000,w:-3.2,s:"GGPoker",k:"1000NL",b:10},
{n:"Peter Kovacs (GG)",h:199000,w:2.8,s:"GGPoker",k:"1000NL",b:10},
{n:"ACannavacciuolo (GG)",h:197000,w:-1.9,s:"GGPoker",k:"1000NL",b:10},
{n:"J Schusteritsch (GG)",h:197000,w:1.3,s:"GGPoker",k:"1000NL",b:10},
{n:"Shakermaker (GG)",h:196000,w:-3.5,s:"GGPoker",k:"1000NL",b:10},
{n:"N Spallanzani (GG)",h:194000,w:-2.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Nikita Lebedev (GG)",h:193000,w:0.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Jan Eckert (GG)",h:193000,w:0.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Vesa M Takkinen (GG)",h:192000,w:-1.8,s:"GGPoker",k:"1000NL",b:10},
{n:"tomakawk (GG)",h:192000,w:-1.2,s:"GGPoker",k:"1000NL",b:10},
{n:"greedybob (GG)",h:189000,w:0.1,s:"GGPoker",k:"1000NL",b:10},
{n:"Einf (GG)",h:188000,w:-2.6,s:"GGPoker",k:"1000NL",b:10},
{n:"Juanferquintero (GG)",h:188000,w:-2.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Matthew Bergart (GG)",h:188000,w:5.3,s:"GGPoker",k:"1000NL",b:10},
{n:"Petar Vuckovic (GG)",h:188000,w:-2.8,s:"GGPoker",k:"1000NL",b:10},
{n:"G Aleksanian (GG)",h:187000,w:0.7,s:"GGPoker",k:"1000NL",b:10},
{n:"Otb_RedBakon (GG)",h:2000000,w:0.2,s:"GGPoker",k:"100NL",b:1},
{n:"Spel (GG)",h:1700000,w:-0.2,s:"GGPoker",k:"100NL",b:1},
{n:"Alexey Granovski (GG)",h:1200000,w:-1.3,s:"GGPoker",k:"100NL",b:1},
{n:"OddLot (GG)",h:1100000,w:-5.4,s:"GGPoker",k:"100NL",b:1},
{n:"BarryBulnik (GG)",h:965000,w:-2.1,s:"GGPoker",k:"100NL",b:1},
{n:"RobinGooDD (GG)",h:905000,w:-1.6,s:"GGPoker",k:"100NL",b:1},
{n:"AAVvector (GG)",h:842000,w:-0.2,s:"GGPoker",k:"100NL",b:1},
{n:"IWinToLose (GG)",h:836000,w:-1,s:"GGPoker",k:"100NL",b:1},
{n:"EmpalaTOR (GG)",h:830000,w:-1.9,s:"GGPoker",k:"100NL",b:1},
{n:"moneyhysteria (GG)",h:745000,w:-2.3,s:"GGPoker",k:"100NL",b:1},
{n:"BPATAPb (GG)",h:737000,w:-0.1,s:"GGPoker",k:"100NL",b:1},
{n:"RitaDakota (GG)",h:714000,w:-1.2,s:"GGPoker",k:"100NL",b:1},
{n:"Cutie- (GG)",h:703000,w:-0.4,s:"GGPoker",k:"100NL",b:1},
{n:"ReiLuizinho (GG)",h:673000,w:-0.1,s:"GGPoker",k:"100NL",b:1},
{n:"Sexy_Helena (GG)",h:641000,w:-2,s:"GGPoker",k:"100NL",b:1},
{n:"Godgory (GG)",h:608000,w:3,s:"GGPoker",k:"100NL",b:1},
{n:"LITTLETRAIN555 (GG)",h:589000,w:-0.6,s:"GGPoker",k:"100NL",b:1},
{n:"TiceNits (GG)",h:583000,w:-0.3,s:"GGPoker",k:"100NL",b:1},
{n:"Evgeny Paketov (GG)",h:566000,w:-0.1,s:"GGPoker",k:"100NL",b:1},
{n:"tunczyk (GG)",h:564000,w:0.3,s:"GGPoker",k:"100NL",b:1},
{n:"Agent_Orange (GG)",h:558000,w:6.3,s:"GGPoker",k:"100NL",b:1},
{n:"H3rlin9 (GG)",h:543000,w:-1.1,s:"GGPoker",k:"100NL",b:1},
{n:"PanTapka (GG)",h:541000,w:-3.2,s:"GGPoker",k:"100NL",b:1},
{n:"Sochinka (GG)",h:540000,w:-1.9,s:"GGPoker",k:"100NL",b:1},
{n:"LuckyStrike1994 (GG)",h:525000,w:-1.3,s:"GGPoker",k:"100NL",b:1},
{n:"arcticloud (GG)",h:515000,w:-2.1,s:"GGPoker",k:"100NL",b:1},
{n:"BigOldTurtle (GG)",h:514000,w:-5,s:"GGPoker",k:"100NL",b:1},
{n:"GTObalance (GG)",h:495000,w:-2.7,s:"GGPoker",k:"100NL",b:1},
{n:"The Virtuoso (GG)",h:495000,w:1.5,s:"GGPoker",k:"100NL",b:1},
{n:"LinaHere (GG)",h:488000,w:-1.3,s:"GGPoker",k:"100NL",b:1},
{n:"ArtemBondarenko (GG)",h:487000,w:-1.5,s:"GGPoker",k:"100NL",b:1},
{n:"champion! (GG)",h:467000,w:1.1,s:"GGPoker",k:"100NL",b:1},
{n:"Maybe_ (GG)",h:465000,w:1.3,s:"GGPoker",k:"100NL",b:1},
{n:"Echromeee (GG)",h:454000,w:-1.8,s:"GGPoker",k:"100NL",b:1},
{n:"Ceca (GG)",h:447000,w:-1.5,s:"GGPoker",k:"100NL",b:1},
{n:"ragerB (GG)",h:443000,w:-1,s:"GGPoker",k:"100NL",b:1},
{n:"ivicatodoric (GG)",h:442000,w:2,s:"GGPoker",k:"100NL",b:1},
{n:"yBePeHHo (GG)",h:435000,w:-1.4,s:"GGPoker",k:"100NL",b:1},
{n:"Zola (GG)",h:434000,w:1.2,s:"GGPoker",k:"100NL",b:1},
{n:"seiteeen (GG)",h:428000,w:3.5,s:"GGPoker",k:"100NL",b:1},
{n:"Igor Shamordin (GG)",h:427000,w:2,s:"GGPoker",k:"100NL",b:1},
{n:"5zai (GG)",h:424000,w:-5.5,s:"GGPoker",k:"100NL",b:1},
{n:"BlackJesus23 (GG)",h:422000,w:-1.3,s:"GGPoker",k:"100NL",b:1},
{n:"LaAnchous (GG)",h:418000,w:-3.3,s:"GGPoker",k:"100NL",b:1},
{n:"Shia LaBluff (GG)",h:413000,w:-1.5,s:"GGPoker",k:"100NL",b:1},
{n:"xxxxV (GG)",h:409000,w:3.9,s:"GGPoker",k:"100NL",b:1},
{n:"A Selimhanov (GG)",h:405000,w:3.6,s:"GGPoker",k:"100NL",b:1},
{n:"neo79 (GG)",h:398000,w:-1.2,s:"GGPoker",k:"100NL",b:1},
{n:"cerilloin (GG)",h:396000,w:-4.6,s:"GGPoker",k:"100NL",b:1},
{n:"GT_Hanton (GG)",h:390000,w:3.5,s:"GGPoker",k:"100NL",b:1},
{n:"LetLennyPlay (GG)",h:386000,w:0.7,s:"GGPoker",k:"100NL",b:1},
{n:"lenovok19635 (GG)",h:385000,w:-0.3,s:"GGPoker",k:"100NL",b:1},
{n:"locoiti8711 (GG)",h:385000,w:-0.9,s:"GGPoker",k:"100NL",b:1},
{n:"Radagast_ (GG)",h:384000,w:4.1,s:"GGPoker",k:"100NL",b:1},
{n:"treborWOK (GG)",h:378000,w:-2.5,s:"GGPoker",k:"100NL",b:1},
{n:"Geoflex (GG)",h:374000,w:1.1,s:"GGPoker",k:"100NL",b:1},
{n:"HarrysonFold (GG)",h:373000,w:2.2,s:"GGPoker",k:"100NL",b:1},
{n:"Wonderk1d (GG)",h:368000,w:-7.5,s:"GGPoker",k:"100NL",b:1},
{n:"TOMBATLE (GG)",h:364000,w:-4.7,s:"GGPoker",k:"100NL",b:1},
{n:"0OIvas0O (GG)",h:359000,w:-2.4,s:"GGPoker",k:"100NL",b:1},
{n:"Tesla212 (GG)",h:358000,w:-0.3,s:"GGPoker",k:"100NL",b:1},
{n:"Dimaadam (GG)",h:358000,w:-0.8,s:"GGPoker",k:"100NL",b:1},
{n:"IPlayForFun (GG)",h:351000,w:-3.8,s:"GGPoker",k:"100NL",b:1},
{n:"d0n1 (GG)",h:351000,w:5.4,s:"GGPoker",k:"100NL",b:1},
{n:"Nedostup_92 (GG)",h:350000,w:-2,s:"GGPoker",k:"100NL",b:1},
{n:"de_Dakwerker (GG)",h:349000,w:5.4,s:"GGPoker",k:"100NL",b:1},
{n:"Michael_oher (GG)",h:348000,w:-3.4,s:"GGPoker",k:"100NL",b:1},
{n:"SolidSnake17 (GG)",h:348000,w:-1.2,s:"GGPoker",k:"100NL",b:1},
{n:"LOMUS (GG)",h:347000,w:-8.7,s:"GGPoker",k:"100NL",b:1},
{n:"Ult!matum (GG)",h:337000,w:1.2,s:"GGPoker",k:"100NL",b:1},
{n:"Saint Mars ICM (GG)",h:335000,w:1.5,s:"GGPoker",k:"100NL",b:1},
{n:"shadowkitty (GG)",h:334000,w:2,s:"GGPoker",k:"100NL",b:1},
{n:"lakaem44 (GG)",h:334000,w:-9,s:"GGPoker",k:"100NL",b:1},
{n:"youkan (GG)",h:333000,w:0.6,s:"GGPoker",k:"100NL",b:1},
{n:"SaVaRRuS (GG)",h:331000,w:-3.8,s:"GGPoker",k:"100NL",b:1},
{n:"BLR_White (GG)",h:330000,w:-1.1,s:"GGPoker",k:"100NL",b:1},
{n:"Almost_all (GG)",h:330000,w:-0.8,s:"GGPoker",k:"100NL",b:1},
{n:"GreaTArtemka (GG)",h:326000,w:-2.2,s:"GGPoker",k:"100NL",b:1},
{n:"COQUITOO (GG)",h:325000,w:0.7,s:"GGPoker",k:"100NL",b:1},
{n:"Starw!nd (GG)",h:321000,w:-1.2,s:"GGPoker",k:"100NL",b:1},
{n:"Baby_Dolphin (GG)",h:320000,w:-0.5,s:"GGPoker",k:"100NL",b:1},
{n:"vada1 (GG)",h:316000,w:-2.9,s:"GGPoker",k:"100NL",b:1},
{n:"WimHofMethod (GG)",h:316000,w:2.9,s:"GGPoker",k:"100NL",b:1},
{n:"AlexPlesGG (GG)",h:316000,w:-8.8,s:"GGPoker",k:"100NL",b:1},
{n:"T3xpOK (GG)",h:312000,w:-2.5,s:"GGPoker",k:"100NL",b:1},
{n:"A Kozlovskii (GG)",h:309000,w:-1.3,s:"GGPoker",k:"100NL",b:1},
{n:"Stivesaigalo (GG)",h:304000,w:-3.1,s:"GGPoker",k:"100NL",b:1},
{n:"fog frog (GG)",h:302000,w:1.1,s:"GGPoker",k:"100NL",b:1},
{n:"pure_amateur (GG)",h:301000,w:-1.6,s:"GGPoker",k:"100NL",b:1},
{n:"Rodrella86 (GG)",h:298000,w:-0.4,s:"GGPoker",k:"100NL",b:1},
{n:"PushochKA (GG)",h:298000,w:-4,s:"GGPoker",k:"100NL",b:1},
{n:"IWW19 (GG)",h:297000,w:-2.3,s:"GGPoker",k:"100NL",b:1},
{n:"Beresterk (GG)",h:296000,w:1.3,s:"GGPoker",k:"100NL",b:1},
{n:"OV1Gxci (GG)",h:295000,w:7.8,s:"GGPoker",k:"100NL",b:1},
{n:"C-J-Luffffffy (GG)",h:291000,w:-3.6,s:"GGPoker",k:"100NL",b:1},
{n:"TblKBA (GG)",h:288000,w:-2.6,s:"GGPoker",k:"100NL",b:1},
{n:"WynDHamW (GG)",h:287000,w:-1.6,s:"GGPoker",k:"100NL",b:1},
{n:"eldoctor86 (GG)",h:286000,w:-0.3,s:"GGPoker",k:"100NL",b:1},
{n:"rabbitbunny (GG)",h:286000,w:-3.3,s:"GGPoker",k:"100NL",b:1},
{n:"driga88 (GG)",h:280000,w:-9.9,s:"GGPoker",k:"100NL",b:1},
{n:"Matjaz Vogrinec (GG)",h:236000,w:-0.7,s:"GGPoker",k:"2000NL",b:20},
{n:"Bring_Them_Home (GG)",h:213000,w:0.2,s:"GGPoker",k:"2000NL",b:20},
{n:"Michael Weiss (GG)",h:176000,w:-8.4,s:"GGPoker",k:"2000NL",b:20},
{n:"I MP I (GG)",h:161000,w:1.7,s:"GGPoker",k:"2000NL",b:20},
{n:"Pedro Toledo (GG)",h:132000,w:-0.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Antonio Scala (GG)",h:122000,w:-0.1,s:"GGPoker",k:"2000NL",b:20},
{n:"RiverRunAA (GG)",h:119000,w:-0.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Joseph Adams (GG)",h:111000,w:-0.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Scott Corbett (GG)",h:109000,w:6.6,s:"GGPoker",k:"2000NL",b:20},
{n:"Zeljko Tokic (GG)",h:104000,w:-1.3,s:"GGPoker",k:"2000NL",b:20},
{n:"PiscoSour (GG)",h:102000,w:-0.3,s:"GGPoker",k:"2000NL",b:20},
{n:"H Rodriguez (GG)",h:89000,w:-6.7,s:"GGPoker",k:"2000NL",b:20},
{n:"Boris Premovic (GG)",h:88000,w:-3.6,s:"GGPoker",k:"2000NL",b:20},
{n:"Naoufel Smires (GG)",h:86000,w:-9.2,s:"GGPoker",k:"2000NL",b:20},
{n:"Manuel Saavedra (GG)",h:78000,w:-4.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Cameron Couch (GG)",h:76000,w:-4.7,s:"GGPoker",k:"2000NL",b:20},
{n:"ZakkenWasser (GG)",h:76000,w:-3.1,s:"GGPoker",k:"2000NL",b:20},
{n:"A Zgirouski (GG)",h:74000,w:1,s:"GGPoker",k:"2000NL",b:20},
{n:"Viscacha_666 (GG)",h:73000,w:1.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Ricky Roach (GG)",h:72000,w:-2.7,s:"GGPoker",k:"2000NL",b:20},
{n:"DalinarK (GG)",h:71000,w:1.5,s:"GGPoker",k:"2000NL",b:20},
{n:"N Evdokimov (GG)",h:70000,w:-2.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Matthias Ehlers (GG)",h:68000,w:-4.1,s:"GGPoker",k:"2000NL",b:20},
{n:"A Cvetkovic (GG)",h:65000,w:-2.2,s:"GGPoker",k:"2000NL",b:20},
{n:"EverythnBuThink (GG)",h:59000,w:2.4,s:"GGPoker",k:"2000NL",b:20},
{n:"CARLlTOS (GG)",h:59000,w:-3.8,s:"GGPoker",k:"2000NL",b:20},
{n:"P Sekinger (GG)",h:58000,w:3.6,s:"GGPoker",k:"2000NL",b:20},
{n:"Evgeny Nazarev (GG)",h:57000,w:4,s:"GGPoker",k:"2000NL",b:20},
{n:"R Gabdullin (GG)",h:57000,w:-4.9,s:"GGPoker",k:"2000NL",b:20},
{n:"Milla_Gloria (GG)",h:56000,w:7.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Gergely Kulcsar (GG)",h:53000,w:-2.1,s:"GGPoker",k:"2000NL",b:20},
{n:"Misha Inner (GG)",h:53000,w:6.9,s:"GGPoker",k:"2000NL",b:20},
{n:"forh7 (GG)",h:52000,w:0.6,s:"GGPoker",k:"2000NL",b:20},
{n:"LutsVanZuid (GG)",h:51000,w:1.2,s:"GGPoker",k:"2000NL",b:20},
{n:"Sergei Pronin (GG)",h:50000,w:-8.5,s:"GGPoker",k:"2000NL",b:20},
{n:"J Laczkowski (GG)",h:50000,w:0.6,s:"GGPoker",k:"2000NL",b:20},
{n:"KopjeKoffie (GG)",h:48000,w:2.2,s:"GGPoker",k:"2000NL",b:20},
{n:"mrPupa (GG)",h:48000,w:-3.3,s:"GGPoker",k:"2000NL",b:20},
{n:"Angel Ganchev (GG)",h:47000,w:4.3,s:"GGPoker",k:"2000NL",b:20},
{n:"heavyweightplay (GG)",h:43000,w:1.4,s:"GGPoker",k:"2000NL",b:20},
{n:"blzbu (GG)",h:43000,w:0.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Mucky (GG)",h:41000,w:-0.9,s:"GGPoker",k:"2000NL",b:20},
{n:"E Monari (GG)",h:38000,w:0.6,s:"GGPoker",k:"2000NL",b:20},
{n:"MaxMaxi (GG)",h:38000,w:-8.2,s:"GGPoker",k:"2000NL",b:20},
{n:"J Schusteritsch (GG)",h:38000,w:-0.6,s:"GGPoker",k:"2000NL",b:20},
{n:"Mikhail Rykov (GG)",h:37000,w:1.6,s:"GGPoker",k:"2000NL",b:20},
{n:"Checazzofai (GG)",h:37000,w:-6.2,s:"GGPoker",k:"2000NL",b:20},
{n:"CiuciMima (GG)",h:34000,w:0.5,s:"GGPoker",k:"2000NL",b:20},
{n:"ben_sims (GG)",h:34000,w:1.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Siarhei Mashko (GG)",h:34000,w:-1.5,s:"GGPoker",k:"2000NL",b:20},
{n:"SIR NAPKINS (GG)",h:34000,w:16,s:"GGPoker",k:"2000NL",b:20},
{n:"Shakermaker (GG)",h:33000,w:-5.7,s:"GGPoker",k:"2000NL",b:20},
{n:"tomakawk (GG)",h:33000,w:-1.8,s:"GGPoker",k:"2000NL",b:20},
{n:"VendaS (GG)",h:33000,w:6,s:"GGPoker",k:"2000NL",b:20},
{n:"KhaleesiFire (GG)",h:33000,w:-3.5,s:"GGPoker",k:"2000NL",b:20},
{n:"Matheus Souza (GG)",h:32000,w:-0.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Jo Hiratsuka (GG)",h:32000,w:-6.7,s:"GGPoker",k:"2000NL",b:20},
{n:"HereComesPain (GG)",h:31000,w:2.9,s:"GGPoker",k:"2000NL",b:20},
{n:"funkychicken4 (GG)",h:30000,w:1,s:"GGPoker",k:"2000NL",b:20},
{n:"Donghoang (GG)",h:29000,w:-23.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Kasper Henriksen (GG)",h:28000,w:9.4,s:"GGPoker",k:"2000NL",b:20},
{n:"ColonelTigh (GG)",h:28000,w:-3.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Yoshiaki Paco (GG)",h:28000,w:2.8,s:"GGPoker",k:"2000NL",b:20},
{n:"GG_Gelatino (GG)",h:27000,w:6.3,s:"GGPoker",k:"2000NL",b:20},
{n:"Bolombolo (GG)",h:27000,w:-14.5,s:"GGPoker",k:"2000NL",b:20},
{n:"Kevin Paque (GG)",h:27000,w:-8.1,s:"GGPoker",k:"2000NL",b:20},
{n:"Gergo Zsiros (GG)",h:26000,w:1.3,s:"GGPoker",k:"2000NL",b:20},
{n:"Istvan Kovacs (GG)",h:26000,w:-4,s:"GGPoker",k:"2000NL",b:20},
{n:"J Tacoronte (GG)",h:26000,w:-8.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Valeri Filippov (GG)",h:25000,w:7,s:"GGPoker",k:"2000NL",b:20},
{n:"Como Siempre (GG)",h:25000,w:-5.9,s:"GGPoker",k:"2000NL",b:20},
{n:"ToughSpot (GG)",h:24000,w:-8.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Goran Mandic (GG)",h:23000,w:-2.6,s:"GGPoker",k:"2000NL",b:20},
{n:"LLinusLL0ve (GG)",h:23000,w:1.2,s:"GGPoker",k:"2000NL",b:20},
{n:"D Kaladjurdjevic (GG)",h:23000,w:4.1,s:"GGPoker",k:"2000NL",b:20},
{n:"WilmaDikFit (GG)",h:22000,w:2.9,s:"GGPoker",k:"2000NL",b:20},
{n:"Afouteza (GG)",h:22000,w:4.4,s:"GGPoker",k:"2000NL",b:20},
{n:"K Ramazanov (GG)",h:22000,w:2.3,s:"GGPoker",k:"2000NL",b:20},
{n:"Ilia Trusov (GG)",h:22000,w:-6.6,s:"GGPoker",k:"2000NL",b:20},
{n:"Mikita Novikau (GG)",h:21000,w:7.3,s:"GGPoker",k:"2000NL",b:20},
{n:"Benjamin Raven (GG)",h:21000,w:-5.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Filip685 (GG)",h:21000,w:-1.5,s:"GGPoker",k:"2000NL",b:20},
{n:"DingDaiN-ai (GG)",h:21000,w:1,s:"GGPoker",k:"2000NL",b:20},
{n:"TropicalTilt (GG)",h:20000,w:9.8,s:"GGPoker",k:"2000NL",b:20},
{n:"Ivan Galinec (GG)",h:20000,w:0.2,s:"GGPoker",k:"2000NL",b:20},
{n:"Pintoto (GG)",h:20000,w:-26.1,s:"GGPoker",k:"2000NL",b:20},
{n:"SprasesAces (GG)",h:20000,w:-10.2,s:"GGPoker",k:"2000NL",b:20},
{n:"abarros (GG)",h:20000,w:-26.4,s:"GGPoker",k:"2000NL",b:20},
{n:"U Sidoranka (GG)",h:19000,w:-9,s:"GGPoker",k:"2000NL",b:20},
{n:"Jerome LHostis (GG)",h:19000,w:1.7,s:"GGPoker",k:"2000NL",b:20},
{n:"GREAGYPoker (GG)",h:19000,w:2.1,s:"GGPoker",k:"2000NL",b:20},
{n:"Pavel Abramov (GG)",h:18000,w:17.7,s:"GGPoker",k:"2000NL",b:20},
{n:"PadThaiYung (GG)",h:18000,w:-11.5,s:"GGPoker",k:"2000NL",b:20},
{n:"KazushiSakuraba (GG)",h:18000,w:7.5,s:"GGPoker",k:"2000NL",b:20},
{n:"Peter Kovacs (GG)",h:18000,w:-6.5,s:"GGPoker",k:"2000NL",b:20},
{n:"Fully Aligned (GG)",h:17000,w:-8.2,s:"GGPoker",k:"2000NL",b:20},
{n:"FunAmsterdam (GG)",h:17000,w:-8.1,s:"GGPoker",k:"2000NL",b:20},
{n:"chiptake (GG)",h:17000,w:1.4,s:"GGPoker",k:"2000NL",b:20},
{n:"Leo93666 (GG)",h:17000,w:-37.5,s:"GGPoker",k:"2000NL",b:20},
{n:"Bluegreenpurple (GG)",h:17000,w:-11.2,s:"GGPoker",k:"2000NL",b:20},
{n:"PbI6HAg30P (GG)",h:1300000,w:1.4,s:"GGPoker",k:"200NL",b:2},
{n:"arcticloud (GG)",h:1000000,w:0.8,s:"GGPoker",k:"200NL",b:2},
{n:"pate[]laine (GG)",h:983000,w:1.7,s:"GGPoker",k:"200NL",b:2},
{n:"Alitun (GG)",h:951000,w:1.8,s:"GGPoker",k:"200NL",b:2},
{n:"JustMoneyBro (GG)",h:932000,w:3.1,s:"GGPoker",k:"200NL",b:2},
{n:"MikeHustle (GG)",h:922000,w:-3,s:"GGPoker",k:"200NL",b:2},
{n:"Koekebakker (GG)",h:894000,w:0.2,s:"GGPoker",k:"200NL",b:2},
{n:"VilkasVytis (GG)",h:879000,w:0.2,s:"GGPoker",k:"200NL",b:2},
{n:"Dario Dimaggio (GG)",h:846000,w:2,s:"GGPoker",k:"200NL",b:2},
{n:"pepealas (GG)",h:843000,w:-2.3,s:"GGPoker",k:"200NL",b:2},
{n:"5KAPTA (GG)",h:712000,w:-2.7,s:"GGPoker",k:"200NL",b:2},
{n:"J-Salinsky (GG)",h:672000,w:0.7,s:"GGPoker",k:"200NL",b:2},
{n:"suvarak (GG)",h:572000,w:0.3,s:"GGPoker",k:"200NL",b:2},
{n:"Andrea Di Coste (GG)",h:563000,w:-1.5,s:"GGPoker",k:"200NL",b:2},
{n:"skeleten (GG)",h:556000,w:-2.8,s:"GGPoker",k:"200NL",b:2},
{n:"Hagebuddne (GG)",h:534000,w:-1.1,s:"GGPoker",k:"200NL",b:2},
{n:"SolNL11 (GG)",h:522000,w:0.9,s:"GGPoker",k:"200NL",b:2},
{n:"danilshch98 (GG)",h:521000,w:0.4,s:"GGPoker",k:"200NL",b:2},
{n:"NhacYourAxxx (GG)",h:520000,w:2.5,s:"GGPoker",k:"200NL",b:2},
{n:"Malong1993 (GG)",h:507000,w:-3,s:"GGPoker",k:"200NL",b:2},
{n:"GeneralSiska (GG)",h:499000,w:-1.4,s:"GGPoker",k:"200NL",b:2},
{n:"Andrey Kuklin (GG)",h:499000,w:4.6,s:"GGPoker",k:"200NL",b:2},
{n:"TrueProGambler (GG)",h:499000,w:-2.4,s:"GGPoker",k:"200NL",b:2},
{n:"au_revoir! (GG)",h:491000,w:2.2,s:"GGPoker",k:"200NL",b:2},
{n:"Gaunar (GG)",h:490000,w:-2.4,s:"GGPoker",k:"200NL",b:2},
{n:"tripsmaker (GG)",h:485000,w:-0.2,s:"GGPoker",k:"200NL",b:2},
{n:"Nightwish ! (GG)",h:481000,w:-2.5,s:"GGPoker",k:"200NL",b:2},
{n:"IWinToLose (GG)",h:478000,w:-1.8,s:"GGPoker",k:"200NL",b:2},
{n:"dezefaixa (GG)",h:456000,w:-2.1,s:"GGPoker",k:"200NL",b:2},
{n:"Th3KinG (GG)",h:455000,w:-4.2,s:"GGPoker",k:"200NL",b:2},
{n:"ICEMAN2710 (GG)",h:450000,w:4.5,s:"GGPoker",k:"200NL",b:2},
{n:"R Malakhov (GG)",h:445000,w:-0.4,s:"GGPoker",k:"200NL",b:2},
{n:"Valery Gukasov (GG)",h:435000,w:-2.5,s:"GGPoker",k:"200NL",b:2},
{n:"ArtEquilovski1 (GG)",h:432000,w:-1.2,s:"GGPoker",k:"200NL",b:2},
{n:"I Wonder (GG)",h:429000,w:2.3,s:"GGPoker",k:"200NL",b:2},
{n:"Szocs (GG)",h:427000,w:-1.8,s:"GGPoker",k:"200NL",b:2},
{n:"JustTheKing (GG)",h:422000,w:3.3,s:"GGPoker",k:"200NL",b:2},
{n:"A Kozlovskii (GG)",h:416000,w:-5.1,s:"GGPoker",k:"200NL",b:2},
{n:"Tu Bui (GG)",h:407000,w:0.6,s:"GGPoker",k:"200NL",b:2},
{n:"Thebookthief (GG)",h:400000,w:2.7,s:"GGPoker",k:"200NL",b:2},
{n:"NO4444CARDS (GG)",h:398000,w:3.4,s:"GGPoker",k:"200NL",b:2},
{n:"M0neyMike (GG)",h:394000,w:-0.4,s:"GGPoker",k:"200NL",b:2},
{n:"Full Scammed (GG)",h:379000,w:-1.6,s:"GGPoker",k:"200NL",b:2},
{n:"KUK23 (GG)",h:375000,w:-0.9,s:"GGPoker",k:"200NL",b:2},
{n:"Sexy_Helena (GG)",h:369000,w:-4.4,s:"GGPoker",k:"200NL",b:2},
{n:"FLC GROUP (GG)",h:364000,w:-7.7,s:"GGPoker",k:"200NL",b:2},
{n:"Shirachi (GG)",h:360000,w:1.2,s:"GGPoker",k:"200NL",b:2},
{n:"medellin (GG)",h:358000,w:-3,s:"GGPoker",k:"200NL",b:2},
{n:"LuckyStrike1994 (GG)",h:347000,w:-3.3,s:"GGPoker",k:"200NL",b:2},
{n:"MMelo (GG)",h:344000,w:-1.6,s:"GGPoker",k:"200NL",b:2},
{n:"crazypoker123 (GG)",h:342000,w:2.4,s:"GGPoker",k:"200NL",b:2},
{n:"adekrom_poker (GG)",h:340000,w:3.5,s:"GGPoker",k:"200NL",b:2},
{n:"momgonakillme (GG)",h:335000,w:-2.8,s:"GGPoker",k:"200NL",b:2},
{n:"Reflexiona (GG)",h:325000,w:0.8,s:"GGPoker",k:"200NL",b:2},
{n:"Merfinis (GG)",h:324000,w:1.2,s:"GGPoker",k:"200NL",b:2},
{n:"Max Martensson (GG)",h:324000,w:-2.9,s:"GGPoker",k:"200NL",b:2},
{n:"Buniomber (GG)",h:323000,w:-6,s:"GGPoker",k:"200NL",b:2},
{n:"yobuecinim (GG)",h:321000,w:-0.2,s:"GGPoker",k:"200NL",b:2},
{n:"EmmaPapa (GG)",h:321000,w:1.4,s:"GGPoker",k:"200NL",b:2},
{n:"enoh1 (GG)",h:318000,w:-2.9,s:"GGPoker",k:"200NL",b:2},
{n:"gluttonous fish (GG)",h:317000,w:-8,s:"GGPoker",k:"200NL",b:2},
{n:"Major I (GG)",h:316000,w:2,s:"GGPoker",k:"200NL",b:2},
{n:"goga7 (GG)",h:315000,w:-5,s:"GGPoker",k:"200NL",b:2},
{n:"imacomunist (GG)",h:314000,w:1.8,s:"GGPoker",k:"200NL",b:2},
{n:"Plantenbak (GG)",h:313000,w:-0.8,s:"GGPoker",k:"200NL",b:2},
{n:"AleisterCrowley (GG)",h:309000,w:-4.1,s:"GGPoker",k:"200NL",b:2},
{n:"KeinGullo (GG)",h:305000,w:-3.1,s:"GGPoker",k:"200NL",b:2},
{n:"Aezakm (GG)",h:300000,w:-0.7,s:"GGPoker",k:"200NL",b:2},
{n:"Fernando1326 (GG)",h:299000,w:-1.4,s:"GGPoker",k:"200NL",b:2},
{n:"lhjynfobn (GG)",h:296000,w:0.5,s:"GGPoker",k:"200NL",b:2},
{n:"Hursia (GG)",h:296000,w:-2.2,s:"GGPoker",k:"200NL",b:2},
{n:"GoVeganNow (GG)",h:288000,w:0.1,s:"GGPoker",k:"200NL",b:2},
{n:"Brazzookka (GG)",h:283000,w:0.1,s:"GGPoker",k:"200NL",b:2},
{n:"kotorake (GG)",h:281000,w:2.4,s:"GGPoker",k:"200NL",b:2},
{n:"pohyikol (GG)",h:280000,w:-6.6,s:"GGPoker",k:"200NL",b:2},
{n:"Nikita Popov (GG)",h:278000,w:-2.8,s:"GGPoker",k:"200NL",b:2},
{n:"Talkingdog (GG)",h:274000,w:3.6,s:"GGPoker",k:"200NL",b:2},
{n:"Sephiroth10 (GG)",h:273000,w:1.9,s:"GGPoker",k:"200NL",b:2},
{n:"OddLot (GG)",h:273000,w:-4.2,s:"GGPoker",k:"200NL",b:2},
{n:"shipit2you (GG)",h:266000,w:2.2,s:"GGPoker",k:"200NL",b:2},
{n:"HaveAAdream_1 (GG)",h:263000,w:1.6,s:"GGPoker",k:"200NL",b:2},
{n:"Rodrella86 (GG)",h:263000,w:-0.6,s:"GGPoker",k:"200NL",b:2},
{n:"Hammer2Fall (GG)",h:262000,w:2,s:"GGPoker",k:"200NL",b:2},
{n:"Liet Kynes (GG)",h:262000,w:-0.9,s:"GGPoker",k:"200NL",b:2},
{n:"Sneazy (GG)",h:261000,w:-0.8,s:"GGPoker",k:"200NL",b:2},
{n:"20_Something (GG)",h:258000,w:3.8,s:"GGPoker",k:"200NL",b:2},
{n:"ToxicF[][][][]r (GG)",h:257000,w:-1.8,s:"GGPoker",k:"200NL",b:2},
{n:"Big Ange (GG)",h:255000,w:1.6,s:"GGPoker",k:"200NL",b:2},
{n:"3BetForFood (GG)",h:255000,w:1.1,s:"GGPoker",k:"200NL",b:2},
{n:"brizoles (GG)",h:255000,w:-0.7,s:"GGPoker",k:"200NL",b:2},
{n:"NOruntwice! (GG)",h:250000,w:1.5,s:"GGPoker",k:"200NL",b:2},
{n:"NeIkron (GG)",h:250000,w:2.8,s:"GGPoker",k:"200NL",b:2},
{n:"snap10 (GG)",h:249000,w:-4.4,s:"GGPoker",k:"200NL",b:2},
{n:"BEaSToN (GG)",h:249000,w:-3.4,s:"GGPoker",k:"200NL",b:2},
{n:"Via negativa 97 (GG)",h:245000,w:-3.9,s:"GGPoker",k:"200NL",b:2},
{n:"magneto77 (GG)",h:244000,w:-1.2,s:"GGPoker",k:"200NL",b:2},
{n:"raff3betbluff (GG)",h:244000,w:-4.8,s:"GGPoker",k:"200NL",b:2},
{n:"moneyhysteria (GG)",h:243000,w:-4.9,s:"GGPoker",k:"200NL",b:2},
{n:"IWW19 (GG)",h:243000,w:0,s:"GGPoker",k:"200NL",b:2},
{n:"MMAsCat (GG)",h:238000,w:-2.7,s:"GGPoker",k:"200NL",b:2},
{n:"Shirachi (GG)",h:1400000,w:-1.3,s:"GGPoker",k:"500NL",b:5},
{n:"Tu Bui (GG)",h:1000000,w:-1.6,s:"GGPoker",k:"500NL",b:5},
{n:"CheckMate_ (GG)",h:820000,w:-2.2,s:"GGPoker",k:"500NL",b:5},
{n:"Helping Hand (GG)",h:688000,w:-1.8,s:"GGPoker",k:"500NL",b:5},
{n:"gkhqyx (GG)",h:594000,w:-2,s:"GGPoker",k:"500NL",b:5},
{n:"luckylover1 (GG)",h:577000,w:-0.1,s:"GGPoker",k:"500NL",b:5},
{n:"Nightwish ! (GG)",h:574000,w:-4.8,s:"GGPoker",k:"500NL",b:5},
{n:"BosseBakfull (GG)",h:552000,w:-2,s:"GGPoker",k:"500NL",b:5},
{n:"superher0_ (GG)",h:552000,w:0.7,s:"GGPoker",k:"500NL",b:5},
{n:"9ballcornrpockt (GG)",h:550000,w:1,s:"GGPoker",k:"500NL",b:5},
{n:"Whiskey1988 (GG)",h:544000,w:2.4,s:"GGPoker",k:"500NL",b:5},
{n:"skeleten (GG)",h:507000,w:-1.7,s:"GGPoker",k:"500NL",b:5},
{n:"Matjaz Vogrinec (GG)",h:466000,w:-0.7,s:"GGPoker",k:"500NL",b:5},
{n:"Miha Gabric (GG)",h:443000,w:0.4,s:"GGPoker",k:"500NL",b:5},
{n:"Gabriel R (GG)",h:443000,w:-2.2,s:"GGPoker",k:"500NL",b:5},
{n:"Fidi1 (GG)",h:442000,w:0,s:"GGPoker",k:"500NL",b:5},
{n:"littlesquirrel (GG)",h:425000,w:-1.9,s:"GGPoker",k:"500NL",b:5},
{n:"medellin (GG)",h:422000,w:-4.1,s:"GGPoker",k:"500NL",b:5},
{n:"Supersoaker2000 (GG)",h:420000,w:-3.6,s:"GGPoker",k:"500NL",b:5},
{n:"au_revoir! (GG)",h:414000,w:0.5,s:"GGPoker",k:"500NL",b:5},
{n:"Dario Dimaggio (GG)",h:404000,w:-1.8,s:"GGPoker",k:"500NL",b:5},
{n:"Kaupo Tenno (GG)",h:395000,w:0.1,s:"GGPoker",k:"500NL",b:5},
{n:"ResidentEagle (GG)",h:381000,w:1,s:"GGPoker",k:"500NL",b:5},
{n:"Alex Vakhrushev (GG)",h:381000,w:5.7,s:"GGPoker",k:"500NL",b:5},
{n:"Gary Chappell (GG)",h:380000,w:-0.3,s:"GGPoker",k:"500NL",b:5},
{n:"Fettleif (GG)",h:371000,w:-1.1,s:"GGPoker",k:"500NL",b:5},
{n:"NullBock (GG)",h:370000,w:-7.7,s:"GGPoker",k:"500NL",b:5},
{n:"JuGGernAAut (GG)",h:366000,w:1.5,s:"GGPoker",k:"500NL",b:5},
{n:"MAODEE (GG)",h:357000,w:-4.1,s:"GGPoker",k:"500NL",b:5},
{n:"MrBuilderman (GG)",h:350000,w:-0.5,s:"GGPoker",k:"500NL",b:5},
{n:"tiripiri (GG)",h:344000,w:-3.1,s:"GGPoker",k:"500NL",b:5},
{n:"ImTHEcharlie (GG)",h:337000,w:-1.5,s:"GGPoker",k:"500NL",b:5},
{n:"TheShaman22 (GG)",h:326000,w:-2.2,s:"GGPoker",k:"500NL",b:5},
{n:"adekrom_poker (GG)",h:322000,w:-0.4,s:"GGPoker",k:"500NL",b:5},
{n:"UsedToBluff (GG)",h:318000,w:-0.6,s:"GGPoker",k:"500NL",b:5},
{n:"PYYDYSTAJA (GG)",h:318000,w:-3.5,s:"GGPoker",k:"500NL",b:5},
{n:"Vesa M Takkinen (GG)",h:312000,w:-0.7,s:"GGPoker",k:"500NL",b:5},
{n:"Alessandro Da Re (GG)",h:304000,w:1,s:"GGPoker",k:"500NL",b:5},
{n:"DavidWallace (GG)",h:303000,w:-1.4,s:"GGPoker",k:"500NL",b:5},
{n:"Naughty Poker (GG)",h:302000,w:-4.5,s:"GGPoker",k:"500NL",b:5},
{n:"2DaMoon (GG)",h:302000,w:0.3,s:"GGPoker",k:"500NL",b:5},
{n:"Trueseller (GG)",h:301000,w:2.7,s:"GGPoker",k:"500NL",b:5},
{n:"momgonakillme (GG)",h:301000,w:-4,s:"GGPoker",k:"500NL",b:5},
{n:"ducks nuts (GG)",h:300000,w:-4,s:"GGPoker",k:"500NL",b:5},
{n:"akirasgo (GG)",h:299000,w:-2.2,s:"GGPoker",k:"500NL",b:5},
{n:"VerdyVerca (GG)",h:291000,w:-3.2,s:"GGPoker",k:"500NL",b:5},
{n:"Lucas Landa (GG)",h:288000,w:-2.1,s:"GGPoker",k:"500NL",b:5},
{n:"craigburley (GG)",h:287000,w:-1.1,s:"GGPoker",k:"500NL",b:5},
{n:"M LeBlanc Poirier (GG)",h:285000,w:-1.3,s:"GGPoker",k:"500NL",b:5},
{n:"Joseph Warren (GG)",h:284000,w:0.5,s:"GGPoker",k:"500NL",b:5},
{n:"kisvakond (GG)",h:278000,w:1.4,s:"GGPoker",k:"500NL",b:5},
{n:"MrProtein (GG)",h:273000,w:0.5,s:"GGPoker",k:"500NL",b:5},
{n:"joeyps (GG)",h:267000,w:-1.2,s:"GGPoker",k:"500NL",b:5},
{n:"iPoker22 (GG)",h:266000,w:-7.1,s:"GGPoker",k:"500NL",b:5},
{n:"Misha Inner (GG)",h:261000,w:-1.6,s:"GGPoker",k:"500NL",b:5},
{n:"Rafal Maluchnik (GG)",h:260000,w:-4.6,s:"GGPoker",k:"500NL",b:5},
{n:"Patryk Sypien (GG)",h:255000,w:-0.9,s:"GGPoker",k:"500NL",b:5},
{n:"04z1st (GG)",h:252000,w:-2.1,s:"GGPoker",k:"500NL",b:5},
{n:"A Zgirouski (GG)",h:251000,w:1.8,s:"GGPoker",k:"500NL",b:5},
{n:"Sea Shepherd (GG)",h:247000,w:-4,s:"GGPoker",k:"500NL",b:5},
{n:"Mucky (GG)",h:247000,w:0.6,s:"GGPoker",k:"500NL",b:5},
{n:"Hermilo garza V (GG)",h:244000,w:-6,s:"GGPoker",k:"500NL",b:5},
{n:"ToughSpot (GG)",h:241000,w:-1.3,s:"GGPoker",k:"500NL",b:5},
{n:"KingKong_ (GG)",h:240000,w:-1.1,s:"GGPoker",k:"500NL",b:5},
{n:"dndn_chi (GG)",h:240000,w:-4.4,s:"GGPoker",k:"500NL",b:5},
{n:"Nizzatin (GG)",h:236000,w:-2.4,s:"GGPoker",k:"500NL",b:5},
{n:"Dedes Paris (GG)",h:229000,w:-0.8,s:"GGPoker",k:"500NL",b:5},
{n:"Glory Gulbi (GG)",h:228000,w:-0.2,s:"GGPoker",k:"500NL",b:5},
{n:"Alex Wejdrup (GG)",h:223000,w:3,s:"GGPoker",k:"500NL",b:5},
{n:"2wsx (GG)",h:223000,w:1.9,s:"GGPoker",k:"500NL",b:5},
{n:"GGhosT (GG)",h:220000,w:3.2,s:"GGPoker",k:"500NL",b:5},
{n:"D0NNIE DARK0 (GG)",h:220000,w:0.9,s:"GGPoker",k:"500NL",b:5},
{n:"Queen_Dora (GG)",h:220000,w:2.6,s:"GGPoker",k:"500NL",b:5},
{n:"greedybob (GG)",h:219000,w:3.6,s:"GGPoker",k:"500NL",b:5},
{n:"gremllIlan (GG)",h:217000,w:0.3,s:"GGPoker",k:"500NL",b:5},
{n:"yeovill (GG)",h:216000,w:-0.6,s:"GGPoker",k:"500NL",b:5},
{n:"Zazano1 (GG)",h:210000,w:-1,s:"GGPoker",k:"500NL",b:5},
{n:"IM A BIG BOY (GG)",h:208000,w:0,s:"GGPoker",k:"500NL",b:5},
{n:"Tschutschuwa (GG)",h:200000,w:1.1,s:"GGPoker",k:"500NL",b:5},
{n:"Damian Bell (GG)",h:198000,w:-1.7,s:"GGPoker",k:"500NL",b:5},
{n:"tripsmaker (GG)",h:194000,w:0.3,s:"GGPoker",k:"500NL",b:5},
{n:"Chatgpttt (GG)",h:193000,w:-2.5,s:"GGPoker",k:"500NL",b:5},
{n:"Aleksei Istomin (GG)",h:192000,w:-1.9,s:"GGPoker",k:"500NL",b:5},
{n:"ggpoker1948 (GG)",h:191000,w:2,s:"GGPoker",k:"500NL",b:5},
{n:"InDaFlow (GG)",h:191000,w:-2.1,s:"GGPoker",k:"500NL",b:5},
{n:"meryl0l (GG)",h:190000,w:-2.1,s:"GGPoker",k:"500NL",b:5},
{n:"J Bogdanovski (GG)",h:189000,w:3,s:"GGPoker",k:"500NL",b:5},
{n:"Mi No Hablo (GG)",h:187000,w:-3.6,s:"GGPoker",k:"500NL",b:5},
{n:"QuantumKey (GG)",h:186000,w:1.7,s:"GGPoker",k:"500NL",b:5},
{n:"pinkyblinder (GG)",h:186000,w:-3.9,s:"GGPoker",k:"500NL",b:5},
{n:"arcticloud (GG)",h:185000,w:-3.4,s:"GGPoker",k:"500NL",b:5},
{n:"Cheers! (GG)",h:185000,w:-1,s:"GGPoker",k:"500NL",b:5},
{n:"Kuromichan (GG)",h:182000,w:-6.3,s:"GGPoker",k:"500NL",b:5},
{n:"Miroslav Atanasov (GG)",h:181000,w:-3.6,s:"GGPoker",k:"500NL",b:5},
{n:"FastBreak (GG)",h:181000,w:-4.1,s:"GGPoker",k:"500NL",b:5},
{n:"LutsVanZuid (GG)",h:179000,w:-1.7,s:"GGPoker",k:"500NL",b:5},
{n:"Max Martensson (GG)",h:179000,w:-1.6,s:"GGPoker",k:"500NL",b:5},
{n:"AAirball (GG)",h:179000,w:-6.6,s:"GGPoker",k:"500NL",b:5},
{n:"samoako (GG)",h:177000,w:-5.1,s:"GGPoker",k:"500NL",b:5},
{n:"LosMuchosHeapos (GG)",h:176000,w:-7.5,s:"GGPoker",k:"500NL",b:5},
{n:"Loosepls (GG)",h:1600000,w:-2.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"RobinGooDD (GG)",h:1500000,w:-0.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"KOORA3 (GG)",h:1500000,w:-2.2,s:"GGPoker",k:"50NL",b:0.5},
{n:"BiigFish (GG)",h:1200000,w:-3.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"BarryBulnik (GG)",h:1200000,w:-2.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"WynDHamW (GG)",h:916000,w:-3.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"SpleenRiffa (GG)",h:899000,w:-2,s:"GGPoker",k:"50NL",b:0.5},
{n:"FatCarpMD (GG)",h:781000,w:-1.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"IPlayForFun (GG)",h:780000,w:-0.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"Censored1984 (GG)",h:768000,w:-2.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"lakaem44 (GG)",h:733000,w:-7.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"RSNL (GG)",h:713000,w:2.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"Ivan Moshkov (GG)",h:693000,w:-2.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"SlyAss (GG)",h:674000,w:-4.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"BondJupmer (GG)",h:634000,w:-2.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"ZbigG (GG)",h:618000,w:1.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"IckeWieder (GG)",h:596000,w:1.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"sonicka (GG)",h:558000,w:-1.2,s:"GGPoker",k:"50NL",b:0.5},
{n:"kangdaniel (GG)",h:554000,w:-6.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"Hurracan (GG)",h:550000,w:-4.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"ShakeYourMind (GG)",h:543000,w:0.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"Beresterk (GG)",h:543000,w:1.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"T3xpOK (GG)",h:535000,w:-1,s:"GGPoker",k:"50NL",b:0.5},
{n:"tunczyk (GG)",h:531000,w:1.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"RPP76 (GG)",h:517000,w:-1.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"DeadMansHand8 (GG)",h:514000,w:2.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"ilumiy (GG)",h:511000,w:-3,s:"GGPoker",k:"50NL",b:0.5},
{n:"ALieniST83 (GG)",h:506000,w:-2.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"LaAnchous (GG)",h:504000,w:-2.2,s:"GGPoker",k:"50NL",b:0.5},
{n:"Raven089 (GG)",h:480000,w:-8.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"StressAddict (GG)",h:467000,w:2.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"Yspenyanin1 (GG)",h:465000,w:-1.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"DLemma (GG)",h:465000,w:3.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"maygo (GG)",h:436000,w:-2,s:"GGPoker",k:"50NL",b:0.5},
{n:"joyce0722 (GG)",h:432000,w:-4.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"ayor4251 (GG)",h:421000,w:-4.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"fortuna major (GG)",h:413000,w:-0.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"Tesla212 (GG)",h:410000,w:-1,s:"GGPoker",k:"50NL",b:0.5},
{n:"TACKLEWHEEL106 (GG)",h:401000,w:-3.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"Lockerl7199 (GG)",h:397000,w:3.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"DJHaMaN (GG)",h:396000,w:4,s:"GGPoker",k:"50NL",b:0.5},
{n:"OMG!Falcon (GG)",h:391000,w:-7.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"vaduwka (GG)",h:387000,w:-1.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"RPP23 (GG)",h:385000,w:-1.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"Zloy_Bengal (GG)",h:379000,w:-9.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"vezand (GG)",h:379000,w:-5.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"5zai (GG)",h:378000,w:-4.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"yBePeHHo (GG)",h:374000,w:-1.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"breikin4 (GG)",h:365000,w:-3.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"SystemShock (GG)",h:360000,w:-0.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"KeleVRaN- (GG)",h:360000,w:-2.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"reDWhite (GG)",h:359000,w:1.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"SolidSnake17 (GG)",h:353000,w:-1.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"PINOKO3 (GG)",h:352000,w:-2.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"XIONGYING11 (GG)",h:345000,w:-33.2,s:"GGPoker",k:"50NL",b:0.5},
{n:"Bayraktar_ (GG)",h:344000,w:1.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"Rabonet99 (GG)",h:340000,w:0.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"strang3r (GG)",h:339000,w:-2.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"111XXX (GG)",h:338000,w:-2.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"chipsmunk (GG)",h:334000,w:5.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"Croft17 (GG)",h:330000,w:1.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"Crotine Blanche (GG)",h:330000,w:0.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"Tamag0tchi (GG)",h:329000,w:-1.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"EmbraceThePain (GG)",h:327000,w:-3.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"AA Pridi (GG)",h:326000,w:-1.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"vudox (GG)",h:324000,w:-3.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"champion! (GG)",h:322000,w:0.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"insane88 (GG)",h:318000,w:-3.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"RandomGame (GG)",h:316000,w:-2.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"San_Paulo (GG)",h:314000,w:5.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"mikubeast (GG)",h:314000,w:3.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"chijara (GG)",h:314000,w:2,s:"GGPoker",k:"50NL",b:0.5},
{n:"Bitcoin_Bull (GG)",h:310000,w:-4.9,s:"GGPoker",k:"50NL",b:0.5},
{n:"Zoo_MTT (GG)",h:309000,w:-2,s:"GGPoker",k:"50NL",b:0.5},
{n:"ShootnicKK (GG)",h:308000,w:-5.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"technobanana (GG)",h:308000,w:-1.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"Igor Peremitin (GG)",h:307000,w:0,s:"GGPoker",k:"50NL",b:0.5},
{n:"driga88 (GG)",h:306000,w:-2,s:"GGPoker",k:"50NL",b:0.5},
{n:"MaximusGreat (GG)",h:305000,w:1.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"PaintedBird777 (GG)",h:304000,w:-4.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"0OIvas0O (GG)",h:303000,w:-0.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"SayInGame (GG)",h:301000,w:-4.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"iLoveMoschino (GG)",h:300000,w:-3,s:"GGPoker",k:"50NL",b:0.5},
{n:"BING77 (GG)",h:297000,w:-6.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"CasperTheCat (GG)",h:295000,w:-2.8,s:"GGPoker",k:"50NL",b:0.5},
{n:"fargys_07 (GG)",h:294000,w:-2.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"Almost_all (GG)",h:293000,w:1.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"Eterno10 (GG)",h:291000,w:-0.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"LostMyBB (GG)",h:291000,w:0.3,s:"GGPoker",k:"50NL",b:0.5},
{n:"LJ__GRAPPA (GG)",h:290000,w:-6.7,s:"GGPoker",k:"50NL",b:0.5},
{n:"JJ_Dreams (GG)",h:288000,w:-4.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"A Selimhanov (GG)",h:285000,w:-2.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"LawofAtraction (GG)",h:282000,w:0.5,s:"GGPoker",k:"50NL",b:0.5},
{n:"K3llyBrok3 (GG)",h:281000,w:-4,s:"GGPoker",k:"50NL",b:0.5},
{n:"sAnt1n1 (GG)",h:281000,w:-3.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"werduna (GG)",h:278000,w:3.1,s:"GGPoker",k:"50NL",b:0.5},
{n:"SimpleClicker (GG)",h:278000,w:-2.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"AvGeLWin (GG)",h:273000,w:-3.6,s:"GGPoker",k:"50NL",b:0.5},
{n:"NeviR (GG)",h:272000,w:5.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"Xakske (GG)",h:272000,w:0.4,s:"GGPoker",k:"50NL",b:0.5},
{n:"RPBL",h:226000,w:0.55,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"super00998178",h:203000,w:-5.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"TERKERJERBS",h:181000,w:-1.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Vesper_31",h:178000,w:-3.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Kalthorr",h:168000,w:-3.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Ryan Gibson",h:163000,w:-2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"V Zheleztsov",h:162000,w:-1.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"messica",h:147000,w:2.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Ivan lysyakov",h:145000,w:2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Rake2High",h:142000,w:-0.31,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"slabii",h:141000,w:-2.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Stable Genius",h:139000,w:-7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Cookmaster",h:136000,w:-3.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Mandark1",h:130000,w:-0.41,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"qwert87",h:130000,w:-1.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"akirasgo",h:127000,w:-4.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Mrnono",h:124000,w:-10,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"madddddd",h:122000,w:-4.8,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"kderling",h:120000,w:2.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Gary Chappell",h:110000,w:2.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Dennis Henn",h:105000,w:-3.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"ChamoD_",h:103000,w:-0.62,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"SING_HAAA",h:101000,w:8.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Team Loki",h:101000,w:-4.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"LeeHanCho",h:99000,w:-3.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"A Selimhanov",h:97000,w:1.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"NoArmor_",h:95000,w:0.79,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"End Boss",h:94000,w:1.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"joaking223",h:94000,w:-2.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"I Yastremskyi",h:92000,w:-0.59,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Simba0528",h:91000,w:-2.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"luxGloria",h:91000,w:-4.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Mrhiphop07",h:91000,w:-2.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Roger Fedex",h:88000,w:-2.8,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"OtecMikhail",h:88000,w:-5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Aleksey Lazarev",h:88000,w:-3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"surge17",h:86000,w:-4.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"respeasy",h:86000,w:-8.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Anyone_but_i",h:84000,w:-3.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"smlovema0107",h:83000,w:-3.9,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"DENKI-D",h:82000,w:-11,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"RoyRogerss",h:81000,w:0.33,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Sr Coffee",h:81000,w:-0.77,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Glass mental",h:80000,w:-8.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Repoio",h:79000,w:-2.9,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"PatekPhilippe",h:79000,w:-6.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"LuckyStrike1994",h:79000,w:-3.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"LottolsMyMOTTO",h:79000,w:-2.8,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"TreshkaPiva",h:78000,w:-5.9,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"April ONeil",h:77000,w:-0.01,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"HI KH",h:76000,w:-14,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"4-OT",h:75000,w:-5.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Filip685",h:74000,w:-2.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Sailing2024",h:74000,w:-16,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"LudopatiaFree",h:74000,w:-3.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"s1rozhAA",h:73000,w:-0.87,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"StayingAlive15",h:73000,w:0.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"SixSixFour",h:73000,w:2.9,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Doge0008",h:73000,w:-6.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"NitKarmita",h:72000,w:-1.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Ray_GL",h:71000,w:-1.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"ONEMOREJACKPOT",h:71000,w:1.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Abdulakir",h:71000,w:1.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Wonderk1d",h:70000,w:-9.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"II_Kiwicito_II",h:70000,w:2.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Goldx5",h:69000,w:-3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"JINX !",h:68000,w:0.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"godgodgood",h:67000,w:-4.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Nit Player",h:67000,w:-3.8,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Rafa Costa",h:66000,w:-2.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"OMGIMSOLUCK7",h:66000,w:2.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"cqian7",h:65000,w:-0.28,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"LoveHateLove-",h:65000,w:-4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Jaste",h:65000,w:-7.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Ekaneire",h:65000,w:-1.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Shunsui Ankang",h:64000,w:2.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Rafal Maluchnik",h:64000,w:-2.8,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Silverstoneia",h:63000,w:-1.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"rkmsn",h:63000,w:-1.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"zlhhh",h:63000,w:-1.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"David Keta",h:63000,w:-3.2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"baccarat12",h:62000,w:-2.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Brick63",h:61000,w:-2.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"munched_march",h:61000,w:1.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"CaaiCingCam",h:61000,w:4.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"isildur9569",h:60000,w:0.75,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Money Taker69",h:60000,w:2,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"eussit",h:60000,w:2.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Bobby_Fisher@",h:60000,w:-0.44,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"LarryTheLimper",h:60000,w:-1.7,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"peyotecoyote",h:59000,w:1.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"ggsddup",h:59000,w:-6.5,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"maxpadong",h:59000,w:-7.4,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Marian Murcek",h:58000,w:-5.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Gennadiy Malfanov",h:58000,w:-3.8,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Anacobra1",h:57000,w:-0.74,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"Old Tree",h:57000,w:-8.6,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"IvanZhan",h:57000,w:-2.3,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"R Lewandowskii",h:56000,w:-0.56,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"KowsaiOuO",h:56000,w:2.1,s:"GGPoker",k:"Rush & Cash 100NL+",b:1},
{n:"ChilliPepperrrr (IP)",h:575000,w:2.5,s:"iPoker",k:"1000NL",b:10},
{n:"totomonkey (IP)",h:404000,w:-9.3,s:"iPoker",k:"1000NL",b:10},
{n:"IUsed2BASpy (IP)",h:335000,w:2,s:"iPoker",k:"1000NL",b:10},
{n:"bf51918840 (IP)",h:317000,w:1.2,s:"iPoker",k:"1000NL",b:10},
{n:"FaRDeRaQuiOJr (IP)",h:286000,w:3.3,s:"iPoker",k:"1000NL",b:10},
{n:"uniC0rno (IP)",h:273000,w:5.2,s:"iPoker",k:"1000NL",b:10},
{n:"ChiIIiPepperrr (IP)",h:271000,w:3.8,s:"iPoker",k:"1000NL",b:10},
{n:"Fred3x (IP)",h:256000,w:1.5,s:"iPoker",k:"1000NL",b:10},
{n:"UpayMyPenthouse (IP)",h:252000,w:2.3,s:"iPoker",k:"1000NL",b:10},
{n:"TwoThreeTwo (IP)",h:243000,w:1.1,s:"iPoker",k:"1000NL",b:10},
{n:"tiripaki (IP)",h:241000,w:-2.2,s:"iPoker",k:"1000NL",b:10},
{n:"AIRWISBTS (IP)",h:214000,w:7.4,s:"iPoker",k:"1000NL",b:10},
{n:"sailordiamond92 (IP)",h:204000,w:6.6,s:"iPoker",k:"1000NL",b:10},
{n:"SicoXXI (IP)",h:204000,w:-1.8,s:"iPoker",k:"1000NL",b:10},
{n:"Anybeveragesss (IP)",h:204000,w:5.4,s:"iPoker",k:"1000NL",b:10},
{n:"crashandburn4 (IP)",h:202000,w:6.9,s:"iPoker",k:"1000NL",b:10},
{n:"PKT0 (IP)",h:190000,w:3,s:"iPoker",k:"1000NL",b:10},
{n:"ChilliPepperrr (IP)",h:189000,w:-3.2,s:"iPoker",k:"1000NL",b:10},
{n:"offyourun (IP)",h:185000,w:3.6,s:"iPoker",k:"1000NL",b:10},
{n:"feeelingpoker (IP)",h:179000,w:-0.4,s:"iPoker",k:"1000NL",b:10},
{n:"RoyalA5 (IP)",h:176000,w:3.3,s:"iPoker",k:"1000NL",b:10},
{n:"feelingrelax (IP)",h:176000,w:0.6,s:"iPoker",k:"1000NL",b:10},
{n:"LLevoLasNueces (IP)",h:174000,w:0,s:"iPoker",k:"1000NL",b:10},
{n:"Agarramelasbolas (IP)",h:173000,w:3.7,s:"iPoker",k:"1000NL",b:10},
{n:"SirMokSegg (IP)",h:168000,w:-2.2,s:"iPoker",k:"1000NL",b:10},
{n:"RIVERFOLD92 (IP)",h:168000,w:1.7,s:"iPoker",k:"1000NL",b:10},
{n:"C12H17N2O4P (IP)",h:167000,w:2.7,s:"iPoker",k:"1000NL",b:10},
{n:"dukehuge7 (IP)",h:161000,w:6,s:"iPoker",k:"1000NL",b:10},
{n:"LLinusLLess (IP)",h:159000,w:5.1,s:"iPoker",k:"1000NL",b:10},
{n:"PeterFisher (IP)",h:152000,w:11.5,s:"iPoker",k:"1000NL",b:10},
{n:"NaRiZaGaR (IP)",h:150000,w:10.7,s:"iPoker",k:"1000NL",b:10},
{n:"ConnieBurt (IP)",h:145000,w:-0.7,s:"iPoker",k:"1000NL",b:10},
{n:"TheJericho2 (IP)",h:144000,w:-4.2,s:"iPoker",k:"1000NL",b:10},
{n:"BAMbamBAMBoo (IP)",h:143000,w:1.1,s:"iPoker",k:"1000NL",b:10},
{n:"HilarioMontepina (IP)",h:141000,w:0.9,s:"iPoker",k:"1000NL",b:10},
{n:"Ufretin1Ranger (IP)",h:139000,w:2,s:"iPoker",k:"1000NL",b:10},
{n:"EmilLarsenErTyk (IP)",h:135000,w:3.2,s:"iPoker",k:"1000NL",b:10},
{n:"floriiiii (IP)",h:134000,w:3.5,s:"iPoker",k:"1000NL",b:10},
{n:"NoGambIeNoFu1ure (IP)",h:134000,w:5,s:"iPoker",k:"1000NL",b:10},
{n:"SteelBallls (IP)",h:133000,w:-0.2,s:"iPoker",k:"1000NL",b:10},
{n:"MYX0M0NK (IP)",h:130000,w:-4,s:"iPoker",k:"1000NL",b:10},
{n:"lrrelevant (IP)",h:129000,w:2.2,s:"iPoker",k:"1000NL",b:10},
{n:"BigFatherrr (IP)",h:128000,w:12.5,s:"iPoker",k:"1000NL",b:10},
{n:"WhatIsSociety (IP)",h:127000,w:9.3,s:"iPoker",k:"1000NL",b:10},
{n:"bigwig1 (IP)",h:125000,w:1.7,s:"iPoker",k:"1000NL",b:10},
{n:"uANDiAREfriends (IP)",h:122000,w:-2.4,s:"iPoker",k:"1000NL",b:10},
{n:"IMPKT (IP)",h:121000,w:-3,s:"iPoker",k:"1000NL",b:10},
{n:"B1NGOPlayer (IP)",h:120000,w:3,s:"iPoker",k:"1000NL",b:10},
{n:"PIayer00 (IP)",h:119000,w:4.9,s:"iPoker",k:"1000NL",b:10},
{n:"Waarzeggerr (IP)",h:118000,w:2.2,s:"iPoker",k:"1000NL",b:10},
{n:"ZanshinArt (IP)",h:117000,w:6.9,s:"iPoker",k:"1000NL",b:10},
{n:"eatFreshFood (IP)",h:117000,w:6.2,s:"iPoker",k:"1000NL",b:10},
{n:"tarantale0 (IP)",h:113000,w:2.6,s:"iPoker",k:"1000NL",b:10},
{n:"abr7kadabra (IP)",h:112000,w:4.1,s:"iPoker",k:"1000NL",b:10},
{n:"IWANNABEEDOUARD (IP)",h:110000,w:2.2,s:"iPoker",k:"1000NL",b:10},
{n:"male2012 (IP)",h:109000,w:18.3,s:"iPoker",k:"1000NL",b:10},
{n:"Haitsu (IP)",h:108000,w:-3.1,s:"iPoker",k:"1000NL",b:10},
{n:"cardreader31 (IP)",h:108000,w:8.5,s:"iPoker",k:"1000NL",b:10},
{n:"SingularityNET (IP)",h:105000,w:10.3,s:"iPoker",k:"1000NL",b:10},
{n:"AAbsorbatoRR (IP)",h:105000,w:2.2,s:"iPoker",k:"1000NL",b:10},
{n:"Anon1m112 (IP)",h:104000,w:3.5,s:"iPoker",k:"1000NL",b:10},
{n:"SuntaFunta (IP)",h:104000,w:17.1,s:"iPoker",k:"1000NL",b:10},
{n:"knifegreedy214 (IP)",h:104000,w:6.3,s:"iPoker",k:"1000NL",b:10},
{n:"MobileGO (IP)",h:103000,w:2.2,s:"iPoker",k:"1000NL",b:10},
{n:"m0lOd0i62 (IP)",h:103000,w:4.7,s:"iPoker",k:"1000NL",b:10},
{n:"WentToSD (IP)",h:103000,w:3.7,s:"iPoker",k:"1000NL",b:10},
{n:"inv3ra (IP)",h:103000,w:2.5,s:"iPoker",k:"1000NL",b:10},
{n:"fireStart333r (IP)",h:102000,w:3.1,s:"iPoker",k:"1000NL",b:10},
{n:"irunsogood23 (IP)",h:102000,w:8.1,s:"iPoker",k:"1000NL",b:10},
{n:"sharkk10 (IP)",h:101000,w:13,s:"iPoker",k:"1000NL",b:10},
{n:"FlyingSmile (IP)",h:101000,w:8.4,s:"iPoker",k:"1000NL",b:10},
{n:"oGmUDBON3 (IP)",h:101000,w:13.6,s:"iPoker",k:"1000NL",b:10},
{n:"ElPatron (IP)",h:99000,w:1.5,s:"iPoker",k:"1000NL",b:10},
{n:"LURWENTHAAL (IP)",h:99000,w:-8.6,s:"iPoker",k:"1000NL",b:10},
{n:"R0ckEtSc1NTisT (IP)",h:97000,w:1.2,s:"iPoker",k:"1000NL",b:10},
{n:"TheLionKing8 (IP)",h:97000,w:6.5,s:"iPoker",k:"1000NL",b:10},
{n:"ttr131433572 (IP)",h:97000,w:-37.2,s:"iPoker",k:"1000NL",b:10},
{n:"Coopahh (IP)",h:96000,w:4.5,s:"iPoker",k:"1000NL",b:10},
{n:"vdy1331 (IP)",h:96000,w:5.5,s:"iPoker",k:"1000NL",b:10},
{n:"Inmarcecible (IP)",h:94000,w:4.9,s:"iPoker",k:"1000NL",b:10},
{n:"navign (IP)",h:93000,w:5.2,s:"iPoker",k:"1000NL",b:10},
{n:"Johnmccl3an (IP)",h:93000,w:10.5,s:"iPoker",k:"1000NL",b:10},
{n:"prundeel (IP)",h:93000,w:6,s:"iPoker",k:"1000NL",b:10},
{n:"MuckItNSuckit (IP)",h:92000,w:0.8,s:"iPoker",k:"1000NL",b:10},
{n:"Guylarious (IP)",h:92000,w:-5.7,s:"iPoker",k:"1000NL",b:10},
{n:"RichParents (IP)",h:91000,w:0.1,s:"iPoker",k:"1000NL",b:10},
{n:"nimthechimp (IP)",h:91000,w:19.1,s:"iPoker",k:"1000NL",b:10},
{n:"jakadraka (IP)",h:91000,w:6.3,s:"iPoker",k:"1000NL",b:10},
{n:"Payphone911 (IP)",h:90000,w:3.2,s:"iPoker",k:"1000NL",b:10},
{n:"donthurtmee (IP)",h:90000,w:3.4,s:"iPoker",k:"1000NL",b:10},
{n:"BlacKKbatman (IP)",h:89000,w:4.2,s:"iPoker",k:"1000NL",b:10},
{n:"callm3lat3r (IP)",h:88000,w:3.1,s:"iPoker",k:"1000NL",b:10},
{n:"1riparenchts (IP)",h:88000,w:3.7,s:"iPoker",k:"1000NL",b:10},
{n:"musis (IP)",h:86000,w:-4,s:"iPoker",k:"1000NL",b:10},
{n:"musicdu (IP)",h:85000,w:-2.8,s:"iPoker",k:"1000NL",b:10},
{n:"supernova18 (IP)",h:84000,w:-1.8,s:"iPoker",k:"1000NL",b:10},
{n:"InfinityLove33 (IP)",h:82000,w:3.6,s:"iPoker",k:"1000NL",b:10},
{n:"ch4atsftw (IP)",h:82000,w:10.2,s:"iPoker",k:"1000NL",b:10},
{n:"CMbackTime (IP)",h:82000,w:8.9,s:"iPoker",k:"1000NL",b:10},
{n:"smartnig7 (IP)",h:81000,w:9.3,s:"iPoker",k:"1000NL",b:10},
{n:"leedsutd22 (IP)",h:1700000,w:-0.5,s:"iPoker",k:"100NL",b:1},
{n:"Ibetmyjeans (IP)",h:1400000,w:0.4,s:"iPoker",k:"100NL",b:1},
{n:"exFilibuster (IP)",h:969000,w:1.7,s:"iPoker",k:"100NL",b:1},
{n:"aliannababa (IP)",h:955000,w:3.3,s:"iPoker",k:"100NL",b:1},
{n:"Faust1808 (IP)",h:806000,w:0.2,s:"iPoker",k:"100NL",b:1},
{n:"R0mellow (IP)",h:806000,w:-2,s:"iPoker",k:"100NL",b:1},
{n:"FstnStbelt (IP)",h:726000,w:0.7,s:"iPoker",k:"100NL",b:1},
{n:"sciusciainer3 (IP)",h:692000,w:-0.1,s:"iPoker",k:"100NL",b:1},
{n:"H3HABUCTb (IP)",h:678000,w:6.3,s:"iPoker",k:"100NL",b:1},
{n:"headgefox (IP)",h:610000,w:4.7,s:"iPoker",k:"100NL",b:1},
{n:"Papasulke (IP)",h:557000,w:-0.1,s:"iPoker",k:"100NL",b:1},
{n:"TTR470510958 (IP)",h:553000,w:2.9,s:"iPoker",k:"100NL",b:1},
{n:"g0lfersam (IP)",h:541000,w:-0.9,s:"iPoker",k:"100NL",b:1},
{n:"tictaccc (IP)",h:536000,w:-3.8,s:"iPoker",k:"100NL",b:1},
{n:"makar0ff1 (IP)",h:516000,w:0.2,s:"iPoker",k:"100NL",b:1},
{n:"ttthatsrightbaby (IP)",h:515000,w:1.8,s:"iPoker",k:"100NL",b:1},
{n:"maitlaleyenda (IP)",h:499000,w:6.5,s:"iPoker",k:"100NL",b:1},
{n:"Tatarka16 (IP)",h:498000,w:0.3,s:"iPoker",k:"100NL",b:1},
{n:"getoverhere111 (IP)",h:496000,w:0.9,s:"iPoker",k:"100NL",b:1},
{n:"Fortunemen (IP)",h:496000,w:-7,s:"iPoker",k:"100NL",b:1},
{n:"Shadowplayy (IP)",h:480000,w:-2.3,s:"iPoker",k:"100NL",b:1},
{n:"shiskagorit (IP)",h:473000,w:0.6,s:"iPoker",k:"100NL",b:1},
{n:"s4ssaren (IP)",h:471000,w:1.5,s:"iPoker",k:"100NL",b:1},
{n:"sofia1994 (IP)",h:465000,w:0.8,s:"iPoker",k:"100NL",b:1},
{n:"knightquiet98 (IP)",h:463000,w:-0.8,s:"iPoker",k:"100NL",b:1},
{n:"rekk1ess (IP)",h:442000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"LosDomos (IP)",h:436000,w:-1.8,s:"iPoker",k:"100NL",b:1},
{n:"KvokkA (IP)",h:434000,w:0.3,s:"iPoker",k:"100NL",b:1},
{n:"PoltergeistKF (IP)",h:434000,w:1.4,s:"iPoker",k:"100NL",b:1},
{n:"AhmedBet (IP)",h:434000,w:4.1,s:"iPoker",k:"100NL",b:1},
{n:"sa1nte (IP)",h:434000,w:3.1,s:"iPoker",k:"100NL",b:1},
{n:"IUsed2BASpy (IP)",h:433000,w:-1.3,s:"iPoker",k:"100NL",b:1},
{n:"PayWay1 (IP)",h:425000,w:1,s:"iPoker",k:"100NL",b:1},
{n:"025usd (IP)",h:425000,w:-0.6,s:"iPoker",k:"100NL",b:1},
{n:"Braw1er (IP)",h:422000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"spfdt (IP)",h:422000,w:1.4,s:"iPoker",k:"100NL",b:1},
{n:"suzzywongs (IP)",h:416000,w:-0.9,s:"iPoker",k:"100NL",b:1},
{n:"kkxtro03 (IP)",h:415000,w:-1.5,s:"iPoker",k:"100NL",b:1},
{n:"utrovderevne1 (IP)",h:396000,w:-0.7,s:"iPoker",k:"100NL",b:1},
{n:"Cloeva (IP)",h:393000,w:-0.3,s:"iPoker",k:"100NL",b:1},
{n:"Aniliidvin (IP)",h:376000,w:-1.7,s:"iPoker",k:"100NL",b:1},
{n:"C1r9A2c9K (IP)",h:376000,w:1.7,s:"iPoker",k:"100NL",b:1},
{n:"uDuC10DA (IP)",h:375000,w:-0.4,s:"iPoker",k:"100NL",b:1},
{n:"manimayker1 (IP)",h:371000,w:3.4,s:"iPoker",k:"100NL",b:1},
{n:"FelixFelicisss (IP)",h:370000,w:-0.2,s:"iPoker",k:"100NL",b:1},
{n:"murtao (IP)",h:366000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"Tyulpanchik1 (IP)",h:365000,w:8.3,s:"iPoker",k:"100NL",b:1},
{n:"RedSerral (IP)",h:362000,w:2.9,s:"iPoker",k:"100NL",b:1},
{n:"nomochild (IP)",h:362000,w:-1.3,s:"iPoker",k:"100NL",b:1},
{n:"colecond (IP)",h:358000,w:0.5,s:"iPoker",k:"100NL",b:1},
{n:"Bluesomething (IP)",h:352000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"vant1me (IP)",h:350000,w:-0.3,s:"iPoker",k:"100NL",b:1},
{n:"RNDsun (IP)",h:339000,w:1.2,s:"iPoker",k:"100NL",b:1},
{n:"w0lf3inst3in (IP)",h:336000,w:1.1,s:"iPoker",k:"100NL",b:1},
{n:"BGS047 (IP)",h:334000,w:-1,s:"iPoker",k:"100NL",b:1},
{n:"black3711 (IP)",h:333000,w:0.5,s:"iPoker",k:"100NL",b:1},
{n:"ShesElectric (IP)",h:333000,w:3,s:"iPoker",k:"100NL",b:1},
{n:"Yankee67 (IP)",h:329000,w:0.3,s:"iPoker",k:"100NL",b:1},
{n:"VetervLico (IP)",h:329000,w:0.9,s:"iPoker",k:"100NL",b:1},
{n:"Calogero1 (IP)",h:329000,w:3.2,s:"iPoker",k:"100NL",b:1},
{n:"cbd889f7c77fdfc3 (IP)",h:328000,w:3.7,s:"iPoker",k:"100NL",b:1},
{n:"MrDonkMaster (IP)",h:328000,w:1.9,s:"iPoker",k:"100NL",b:1},
{n:"padv (IP)",h:324000,w:-3.5,s:"iPoker",k:"100NL",b:1},
{n:"sanguineperson (IP)",h:319000,w:2.2,s:"iPoker",k:"100NL",b:1},
{n:"PatriotAce (IP)",h:316000,w:-6,s:"iPoker",k:"100NL",b:1},
{n:"xtc1223 (IP)",h:315000,w:-15.8,s:"iPoker",k:"100NL",b:1},
{n:"NotSoSexy (IP)",h:311000,w:-0.7,s:"iPoker",k:"100NL",b:1},
{n:"Cylindrom (IP)",h:310000,w:-2.6,s:"iPoker",k:"100NL",b:1},
{n:"eriosyce (IP)",h:310000,w:5.9,s:"iPoker",k:"100NL",b:1},
{n:"protriple48 (IP)",h:309000,w:-3.8,s:"iPoker",k:"100NL",b:1},
{n:"Bahceli (IP)",h:308000,w:0.2,s:"iPoker",k:"100NL",b:1},
{n:"GMtactic (IP)",h:306000,w:0,s:"iPoker",k:"100NL",b:1},
{n:"Samboucaaa (IP)",h:303000,w:0.3,s:"iPoker",k:"100NL",b:1},
{n:"bashkabalit (IP)",h:303000,w:1.9,s:"iPoker",k:"100NL",b:1},
{n:"KarIMarx (IP)",h:301000,w:-0.4,s:"iPoker",k:"100NL",b:1},
{n:"h4ppyDayz (IP)",h:300000,w:-0.4,s:"iPoker",k:"100NL",b:1},
{n:"SatanicPanic (IP)",h:299000,w:1.6,s:"iPoker",k:"100NL",b:1},
{n:"RepartiendoAmor (IP)",h:299000,w:-2.8,s:"iPoker",k:"100NL",b:1},
{n:"ogurez951 (IP)",h:299000,w:0.9,s:"iPoker",k:"100NL",b:1},
{n:"lapidarto (IP)",h:297000,w:-1.6,s:"iPoker",k:"100NL",b:1},
{n:"pinoydfr (IP)",h:296000,w:1.6,s:"iPoker",k:"100NL",b:1},
{n:"Nightcrawler06 (IP)",h:293000,w:-4,s:"iPoker",k:"100NL",b:1},
{n:"zatoichi (IP)",h:293000,w:-0.3,s:"iPoker",k:"100NL",b:1},
{n:"1618033 (IP)",h:291000,w:-5.1,s:"iPoker",k:"100NL",b:1},
{n:"MadDogTannen83 (IP)",h:290000,w:-3.1,s:"iPoker",k:"100NL",b:1},
{n:"blessed3311 (IP)",h:287000,w:-2.8,s:"iPoker",k:"100NL",b:1},
{n:"Pareatins (IP)",h:279000,w:-2.7,s:"iPoker",k:"100NL",b:1},
{n:"Kapyto (IP)",h:279000,w:2.4,s:"iPoker",k:"100NL",b:1},
{n:"xAzzaro696 (IP)",h:278000,w:-1.4,s:"iPoker",k:"100NL",b:1},
{n:"Caligula897 (IP)",h:278000,w:2.9,s:"iPoker",k:"100NL",b:1},
{n:"MishaWinner1 (IP)",h:277000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"TTR1640303821 (IP)",h:277000,w:-2.2,s:"iPoker",k:"100NL",b:1},
{n:"WithFireInside (IP)",h:277000,w:2.2,s:"iPoker",k:"100NL",b:1},
{n:"Fess177 (IP)",h:277000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"c0c0Nuts4me (IP)",h:276000,w:0.3,s:"iPoker",k:"100NL",b:1},
{n:"ElYagua (IP)",h:274000,w:2,s:"iPoker",k:"100NL",b:1},
{n:"skytoss87 (IP)",h:273000,w:4,s:"iPoker",k:"100NL",b:1},
{n:"WhatRUDoing1 (IP)",h:272000,w:0.3,s:"iPoker",k:"100NL",b:1},
{n:"cmonhope (IP)",h:272000,w:2.2,s:"iPoker",k:"100NL",b:1},
{n:"Zdorowyak (IP)",h:270000,w:-0.1,s:"iPoker",k:"100NL",b:1},
{n:"ChilliPepperrrr (IP)",h:63000,w:-6.7,s:"iPoker",k:"2000NL",b:20},
{n:"fireStart333r (IP)",h:40000,w:4.8,s:"iPoker",k:"2000NL",b:20},
{n:"Haitsu (IP)",h:39000,w:-3.9,s:"iPoker",k:"2000NL",b:20},
{n:"WlTCHER (IP)",h:32000,w:-0.2,s:"iPoker",k:"2000NL",b:20},
{n:"ninjaable331 (IP)",h:31000,w:4.3,s:"iPoker",k:"2000NL",b:20},
{n:"faliyosanroque (IP)",h:31000,w:-13.7,s:"iPoker",k:"2000NL",b:20},
{n:"DefendtheAgora (IP)",h:27000,w:-4.2,s:"iPoker",k:"2000NL",b:20},
{n:"ChokDee (IP)",h:26000,w:-12.9,s:"iPoker",k:"2000NL",b:20},
{n:"uniC0rno (IP)",h:26000,w:4.2,s:"iPoker",k:"2000NL",b:20},
{n:"RoyalA5 (IP)",h:26000,w:-2.4,s:"iPoker",k:"2000NL",b:20},
{n:"Bet0n1 (IP)",h:23000,w:1.6,s:"iPoker",k:"2000NL",b:20},
{n:"Sesame99 (IP)",h:22000,w:-2,s:"iPoker",k:"2000NL",b:20},
{n:"sailordiamond92 (IP)",h:22000,w:2.7,s:"iPoker",k:"2000NL",b:20},
{n:"sticklnteger (IP)",h:20000,w:-1.4,s:"iPoker",k:"2000NL",b:20},
{n:"taoteching1 (IP)",h:20000,w:-13,s:"iPoker",k:"2000NL",b:20},
{n:"fay13 (IP)",h:19000,w:-3.1,s:"iPoker",k:"2000NL",b:20},
{n:"Disconcerted (IP)",h:18000,w:3.6,s:"iPoker",k:"2000NL",b:20},
{n:"appleshout (IP)",h:18000,w:10.7,s:"iPoker",k:"2000NL",b:20},
{n:"Anarchy99 (IP)",h:18000,w:-2.7,s:"iPoker",k:"2000NL",b:20},
{n:"ChiIIiPepperrr (IP)",h:18000,w:13.7,s:"iPoker",k:"2000NL",b:20},
{n:"AIRWISBTS (IP)",h:18000,w:20,s:"iPoker",k:"2000NL",b:20},
{n:"M0ney4Value (IP)",h:18000,w:3.7,s:"iPoker",k:"2000NL",b:20},
{n:"R0rsch4ch (IP)",h:16000,w:-5.6,s:"iPoker",k:"2000NL",b:20},
{n:"kramer147 (IP)",h:15000,w:-7,s:"iPoker",k:"2000NL",b:20},
{n:"PKT0 (IP)",h:14000,w:6.8,s:"iPoker",k:"2000NL",b:20},
{n:"ItachiAmaterasu (IP)",h:14000,w:-5,s:"iPoker",k:"2000NL",b:20},
{n:"SultansOfSw1ng (IP)",h:14000,w:-20.3,s:"iPoker",k:"2000NL",b:20},
{n:"Zybki777 (IP)",h:14000,w:12.5,s:"iPoker",k:"2000NL",b:20},
{n:"TwoThreeTwo (IP)",h:13000,w:0.4,s:"iPoker",k:"2000NL",b:20},
{n:"Anybeveragesss (IP)",h:13000,w:-1.1,s:"iPoker",k:"2000NL",b:20},
{n:"EatMan1 (IP)",h:12000,w:-16.3,s:"iPoker",k:"2000NL",b:20},
{n:"StacyMalibu (IP)",h:12000,w:-4.3,s:"iPoker",k:"2000NL",b:20},
{n:"BobbyBaguette (IP)",h:12000,w:-14.8,s:"iPoker",k:"2000NL",b:20},
{n:"LamboAvent (IP)",h:12000,w:-3.8,s:"iPoker",k:"2000NL",b:20},
{n:"McPuhuvaPaaa (IP)",h:12000,w:13.1,s:"iPoker",k:"2000NL",b:20},
{n:"kogtiorla47 (IP)",h:12000,w:4.8,s:"iPoker",k:"2000NL",b:20},
{n:"oneringtoruleall (IP)",h:11000,w:-7.9,s:"iPoker",k:"2000NL",b:20},
{n:"xF0Ph1x (IP)",h:11000,w:18.3,s:"iPoker",k:"2000NL",b:20},
{n:"ess1ty (IP)",h:11000,w:-4,s:"iPoker",k:"2000NL",b:20},
{n:"Johnmcl33an (IP)",h:11000,w:7.7,s:"iPoker",k:"2000NL",b:20},
{n:"cloudjolly85 (IP)",h:11000,w:-5.8,s:"iPoker",k:"2000NL",b:20},
{n:"solapokerr (IP)",h:11000,w:-4.2,s:"iPoker",k:"2000NL",b:20},
{n:"gambler217 (IP)",h:11000,w:-4.9,s:"iPoker",k:"2000NL",b:20},
{n:"ThurmanMerman1 (IP)",h:11000,w:6.5,s:"iPoker",k:"2000NL",b:20},
{n:"SamBF (IP)",h:11000,w:19.8,s:"iPoker",k:"2000NL",b:20},
{n:"LLinusLLess (IP)",h:10000,w:2.6,s:"iPoker",k:"2000NL",b:20},
{n:"moglimiranda (IP)",h:10000,w:0.4,s:"iPoker",k:"2000NL",b:20},
{n:"ChiIliPepperrr (IP)",h:10000,w:-7.3,s:"iPoker",k:"2000NL",b:20},
{n:"ImNotSpanish (IP)",h:10000,w:11.3,s:"iPoker",k:"2000NL",b:20},
{n:"TintyNasty (IP)",h:9900,w:3.7,s:"iPoker",k:"2000NL",b:20},
{n:"brokerfast761 (IP)",h:9700,w:-3,s:"iPoker",k:"2000NL",b:20},
{n:"forvegass (IP)",h:9700,w:24.5,s:"iPoker",k:"2000NL",b:20},
{n:"NewFoIder (IP)",h:9500,w:-6.2,s:"iPoker",k:"2000NL",b:20},
{n:"PygmyMarmoset (IP)",h:9300,w:1.5,s:"iPoker",k:"2000NL",b:20},
{n:"JMAC100 (IP)",h:9200,w:30.6,s:"iPoker",k:"2000NL",b:20},
{n:"FlyingSmile (IP)",h:9200,w:5.8,s:"iPoker",k:"2000NL",b:20},
{n:"CbetChFold (IP)",h:9000,w:-10.8,s:"iPoker",k:"2000NL",b:20},
{n:"alcofun1 (IP)",h:8800,w:9.9,s:"iPoker",k:"2000NL",b:20},
{n:"7AverageGuys (IP)",h:8700,w:-3.9,s:"iPoker",k:"2000NL",b:20},
{n:"Parturi (IP)",h:8600,w:4.8,s:"iPoker",k:"2000NL",b:20},
{n:"FaRDeRaQuiOJr (IP)",h:8500,w:-27.8,s:"iPoker",k:"2000NL",b:20},
{n:"UsUnOfaRlch (IP)",h:8300,w:8.2,s:"iPoker",k:"2000NL",b:20},
{n:"howdy22 (IP)",h:8200,w:-2.9,s:"iPoker",k:"2000NL",b:20},
{n:"BFLeslieMillR (IP)",h:8200,w:-0.5,s:"iPoker",k:"2000NL",b:20},
{n:"tobluffisfun (IP)",h:8100,w:10.8,s:"iPoker",k:"2000NL",b:20},
{n:"BigFatherrr (IP)",h:8000,w:-19.8,s:"iPoker",k:"2000NL",b:20},
{n:"gevshig1 (IP)",h:7900,w:7.1,s:"iPoker",k:"2000NL",b:20},
{n:"WhatMyName1 (IP)",h:7800,w:11.3,s:"iPoker",k:"2000NL",b:20},
{n:"PIayer00 (IP)",h:7800,w:-7.7,s:"iPoker",k:"2000NL",b:20},
{n:"Intensebook9 (IP)",h:7700,w:13.1,s:"iPoker",k:"2000NL",b:20},
{n:"karistaja18 (IP)",h:7600,w:4.7,s:"iPoker",k:"2000NL",b:20},
{n:"Born2Avtaz (IP)",h:7600,w:11.6,s:"iPoker",k:"2000NL",b:20},
{n:"SuiFeng1 (IP)",h:7500,w:-11.1,s:"iPoker",k:"2000NL",b:20},
{n:"DanNorthman (IP)",h:7500,w:6.8,s:"iPoker",k:"2000NL",b:20},
{n:"RemindMyself (IP)",h:7300,w:-5.7,s:"iPoker",k:"2000NL",b:20},
{n:"WiltProyet (IP)",h:7300,w:12.5,s:"iPoker",k:"2000NL",b:20},
{n:"ZanshinArt (IP)",h:7100,w:4.4,s:"iPoker",k:"2000NL",b:20},
{n:"SinguIarityNET (IP)",h:7100,w:15.5,s:"iPoker",k:"2000NL",b:20},
{n:"DealersChoice123 (IP)",h:7100,w:-4.1,s:"iPoker",k:"2000NL",b:20},
{n:"Greenliner (IP)",h:7000,w:10.2,s:"iPoker",k:"2000NL",b:20},
{n:"NTNMCKIN (IP)",h:7000,w:0.9,s:"iPoker",k:"2000NL",b:20},
{n:"bosssea11 (IP)",h:7000,w:-8.1,s:"iPoker",k:"2000NL",b:20},
{n:"Zyzyxyxy (IP)",h:6900,w:6.3,s:"iPoker",k:"2000NL",b:20},
{n:"Pipperrr (IP)",h:6900,w:27.9,s:"iPoker",k:"2000NL",b:20},
{n:"lrrelevant (IP)",h:6700,w:2.7,s:"iPoker",k:"2000NL",b:20},
{n:"H4nsGruber (IP)",h:6600,w:30,s:"iPoker",k:"2000NL",b:20},
{n:"WillBeDifferent (IP)",h:6600,w:-9.4,s:"iPoker",k:"2000NL",b:20},
{n:"menschenfeind1 (IP)",h:6600,w:5.8,s:"iPoker",k:"2000NL",b:20},
{n:"Quelindodiaa (IP)",h:6300,w:-1.1,s:"iPoker",k:"2000NL",b:20},
{n:"bydhongkong16 (IP)",h:6300,w:0.8,s:"iPoker",k:"2000NL",b:20},
{n:"DonCheadle (IP)",h:6200,w:17.5,s:"iPoker",k:"2000NL",b:20},
{n:"R0ckEtSc1NTisT (IP)",h:6100,w:0.9,s:"iPoker",k:"2000NL",b:20},
{n:"simulacr (IP)",h:6100,w:7.3,s:"iPoker",k:"2000NL",b:20},
{n:"solapokerrrr (IP)",h:6000,w:-5.2,s:"iPoker",k:"2000NL",b:20},
{n:"Pakat0 (IP)",h:6000,w:-11.3,s:"iPoker",k:"2000NL",b:20},
{n:"DrSaturn0 (IP)",h:6000,w:0.9,s:"iPoker",k:"2000NL",b:20},
{n:"inv3ra (IP)",h:6000,w:7.4,s:"iPoker",k:"2000NL",b:20},
{n:"KihleniGrilhen (IP)",h:6000,w:9.2,s:"iPoker",k:"2000NL",b:20},
{n:"FelixTheFox (IP)",h:5900,w:8.5,s:"iPoker",k:"2000NL",b:20},
{n:"ClasOhlson (IP)",h:5800,w:8.6,s:"iPoker",k:"2000NL",b:20},
{n:"CnacuCoxpaHu (IP)",h:1600000,w:3.8,s:"iPoker",k:"200NL",b:2},
{n:"bk2mcdssoon (IP)",h:1400000,w:-0.5,s:"iPoker",k:"200NL",b:2},
{n:"exFilibuster (IP)",h:736000,w:2.4,s:"iPoker",k:"200NL",b:2},
{n:"shining98 (IP)",h:727000,w:-0.8,s:"iPoker",k:"200NL",b:2},
{n:"DonkbetMaster (IP)",h:695000,w:1.9,s:"iPoker",k:"200NL",b:2},
{n:"IWasBornInIt (IP)",h:591000,w:5,s:"iPoker",k:"200NL",b:2},
{n:"FortunaWinner (IP)",h:554000,w:-3,s:"iPoker",k:"200NL",b:2},
{n:"alpoll1 (IP)",h:550000,w:2.3,s:"iPoker",k:"200NL",b:2},
{n:"SatanicPanic (IP)",h:546000,w:2.1,s:"iPoker",k:"200NL",b:2},
{n:"R0mellow (IP)",h:539000,w:-0.2,s:"iPoker",k:"200NL",b:2},
{n:"MartalMrko3 (IP)",h:536000,w:3.7,s:"iPoker",k:"200NL",b:2},
{n:"HaveNoFoldButton (IP)",h:515000,w:2.7,s:"iPoker",k:"200NL",b:2},
{n:"bigil333 (IP)",h:490000,w:1.9,s:"iPoker",k:"200NL",b:2},
{n:"Nelfio (IP)",h:481000,w:1.7,s:"iPoker",k:"200NL",b:2},
{n:"hulahHULAH (IP)",h:472000,w:5.7,s:"iPoker",k:"200NL",b:2},
{n:"tictaccc (IP)",h:472000,w:-1.1,s:"iPoker",k:"200NL",b:2},
{n:"YaJokinArentYa (IP)",h:463000,w:-1.4,s:"iPoker",k:"200NL",b:2},
{n:"Ibetmyjeans (IP)",h:439000,w:0,s:"iPoker",k:"200NL",b:2},
{n:"Tastypork14 (IP)",h:437000,w:0.6,s:"iPoker",k:"200NL",b:2},
{n:"songoku8 (IP)",h:432000,w:2.9,s:"iPoker",k:"200NL",b:2},
{n:"Billy545 (IP)",h:420000,w:-2.6,s:"iPoker",k:"200NL",b:2},
{n:"VeryBigAndLong (IP)",h:411000,w:1.6,s:"iPoker",k:"200NL",b:2},
{n:"DominicThiem (IP)",h:401000,w:-3,s:"iPoker",k:"200NL",b:2},
{n:"spicestable771 (IP)",h:399000,w:-0.4,s:"iPoker",k:"200NL",b:2},
{n:"S4P13NS (IP)",h:391000,w:-2.9,s:"iPoker",k:"200NL",b:2},
{n:"headgefox (IP)",h:388000,w:0.6,s:"iPoker",k:"200NL",b:2},
{n:"1L0V3ASS2M0UTH (IP)",h:388000,w:2.2,s:"iPoker",k:"200NL",b:2},
{n:"Xn1nt3nd0X (IP)",h:378000,w:0.1,s:"iPoker",k:"200NL",b:2},
{n:"TTR164030441 (IP)",h:372000,w:3.9,s:"iPoker",k:"200NL",b:2},
{n:"e4silyy (IP)",h:371000,w:1.9,s:"iPoker",k:"200NL",b:2},
{n:"frequentPenny (IP)",h:361000,w:0.6,s:"iPoker",k:"200NL",b:2},
{n:"HarrisonFold1 (IP)",h:359000,w:2.8,s:"iPoker",k:"200NL",b:2},
{n:"coiinfl1p (IP)",h:357000,w:4.9,s:"iPoker",k:"200NL",b:2},
{n:"CJHRZH (IP)",h:352000,w:-1.6,s:"iPoker",k:"200NL",b:2},
{n:"puppup11 (IP)",h:350000,w:5.2,s:"iPoker",k:"200NL",b:2},
{n:"H3HABUCTb (IP)",h:342000,w:2.5,s:"iPoker",k:"200NL",b:2},
{n:"cleariiis (IP)",h:339000,w:-1.4,s:"iPoker",k:"200NL",b:2},
{n:"julianherold123 (IP)",h:338000,w:-1.4,s:"iPoker",k:"200NL",b:2},
{n:"maitlaleyenda (IP)",h:336000,w:3.4,s:"iPoker",k:"200NL",b:2},
{n:"Y0ker (IP)",h:326000,w:3.3,s:"iPoker",k:"200NL",b:2},
{n:"Punisher19 (IP)",h:326000,w:0.9,s:"iPoker",k:"200NL",b:2},
{n:"MuckItNSuckit (IP)",h:322000,w:-1.5,s:"iPoker",k:"200NL",b:2},
{n:"LLevoLasNueces (IP)",h:315000,w:-1.6,s:"iPoker",k:"200NL",b:2},
{n:"J1mboJ (IP)",h:314000,w:1.2,s:"iPoker",k:"200NL",b:2},
{n:"shiskagorit (IP)",h:304000,w:1.4,s:"iPoker",k:"200NL",b:2},
{n:"KvokkA (IP)",h:300000,w:-2.8,s:"iPoker",k:"200NL",b:2},
{n:"eroxone77 (IP)",h:294000,w:-0.7,s:"iPoker",k:"200NL",b:2},
{n:"0neTreeHill (IP)",h:290000,w:-2.5,s:"iPoker",k:"200NL",b:2},
{n:"g0lfersam (IP)",h:289000,w:-3.2,s:"iPoker",k:"200NL",b:2},
{n:"Kapyto (IP)",h:288000,w:1.6,s:"iPoker",k:"200NL",b:2},
{n:"totomonkey (IP)",h:283000,w:-3.2,s:"iPoker",k:"200NL",b:2},
{n:"RedSerral (IP)",h:283000,w:3.8,s:"iPoker",k:"200NL",b:2},
{n:"RazzleBazzle (IP)",h:281000,w:-0.6,s:"iPoker",k:"200NL",b:2},
{n:"Mikasaakm (IP)",h:280000,w:1.3,s:"iPoker",k:"200NL",b:2},
{n:"twentybets (IP)",h:279000,w:-4.6,s:"iPoker",k:"200NL",b:2},
{n:"wakeemup (IP)",h:278000,w:-4.5,s:"iPoker",k:"200NL",b:2},
{n:"anarchy013 (IP)",h:276000,w:-4.2,s:"iPoker",k:"200NL",b:2},
{n:"rekk1ess (IP)",h:270000,w:-1.8,s:"iPoker",k:"200NL",b:2},
{n:"eastkiller (IP)",h:269000,w:1.1,s:"iPoker",k:"200NL",b:2},
{n:"MartaiMrko3 (IP)",h:267000,w:3.5,s:"iPoker",k:"200NL",b:2},
{n:"Dagny1M (IP)",h:262000,w:1.2,s:"iPoker",k:"200NL",b:2},
{n:"Kontrnastup (IP)",h:261000,w:1,s:"iPoker",k:"200NL",b:2},
{n:"Cartman3 (IP)",h:259000,w:-0.6,s:"iPoker",k:"200NL",b:2},
{n:"Kazantrip2013 (IP)",h:258000,w:-1.5,s:"iPoker",k:"200NL",b:2},
{n:"S1CKANDTW1STED (IP)",h:254000,w:0.5,s:"iPoker",k:"200NL",b:2},
{n:"IUsed2BASpy (IP)",h:253000,w:-5.4,s:"iPoker",k:"200NL",b:2},
{n:"Rambo182 (IP)",h:250000,w:4.3,s:"iPoker",k:"200NL",b:2},
{n:"BANANAPURA (IP)",h:246000,w:8,s:"iPoker",k:"200NL",b:2},
{n:"AdeptP (IP)",h:243000,w:-3,s:"iPoker",k:"200NL",b:2},
{n:"Hax2theMax8 (IP)",h:242000,w:1,s:"iPoker",k:"200NL",b:2},
{n:"Ataturkk (IP)",h:241000,w:4,s:"iPoker",k:"200NL",b:2},
{n:"tirria47 (IP)",h:240000,w:-0.7,s:"iPoker",k:"200NL",b:2},
{n:"ANewApproach (IP)",h:237000,w:5,s:"iPoker",k:"200NL",b:2},
{n:"cardreader31 (IP)",h:236000,w:2.8,s:"iPoker",k:"200NL",b:2},
{n:"FBeAt365 (IP)",h:235000,w:1.6,s:"iPoker",k:"200NL",b:2},
{n:"butchie86 (IP)",h:234000,w:6.4,s:"iPoker",k:"200NL",b:2},
{n:"Vlanire (IP)",h:234000,w:1.3,s:"iPoker",k:"200NL",b:2},
{n:"tropical2 (IP)",h:233000,w:2.1,s:"iPoker",k:"200NL",b:2},
{n:"SVINUKA (IP)",h:229000,w:3.1,s:"iPoker",k:"200NL",b:2},
{n:"Bajkoslav (IP)",h:228000,w:-4.9,s:"iPoker",k:"200NL",b:2},
{n:"Ruslan223 (IP)",h:228000,w:-7.1,s:"iPoker",k:"200NL",b:2},
{n:"bashkabalit (IP)",h:228000,w:2.5,s:"iPoker",k:"200NL",b:2},
{n:"lifeisgame777 (IP)",h:227000,w:-3.9,s:"iPoker",k:"200NL",b:2},
{n:"berezsnyev89 (IP)",h:227000,w:5.7,s:"iPoker",k:"200NL",b:2},
{n:"BarkeviousMingo (IP)",h:227000,w:-0.8,s:"iPoker",k:"200NL",b:2},
{n:"rakemaker83 (IP)",h:225000,w:2.4,s:"iPoker",k:"200NL",b:2},
{n:"bf003099 (IP)",h:225000,w:-17.6,s:"iPoker",k:"200NL",b:2},
{n:"EmilLarsenErTyk (IP)",h:223000,w:-1.3,s:"iPoker",k:"200NL",b:2},
{n:"BIGshirley (IP)",h:222000,w:3.4,s:"iPoker",k:"200NL",b:2},
{n:"martyb12 (IP)",h:221000,w:-9.6,s:"iPoker",k:"200NL",b:2},
{n:"DeuceBiGaL0W (IP)",h:220000,w:0.8,s:"iPoker",k:"200NL",b:2},
{n:"OnkelBoBo (IP)",h:216000,w:-0.2,s:"iPoker",k:"200NL",b:2},
{n:"sheriffBG (IP)",h:214000,w:-2.8,s:"iPoker",k:"200NL",b:2},
{n:"YeahMaracuyea (IP)",h:214000,w:-3.3,s:"iPoker",k:"200NL",b:2},
{n:"B2BBrother (IP)",h:214000,w:-2.9,s:"iPoker",k:"200NL",b:2},
{n:"FYALLSCRIPTERS (IP)",h:213000,w:8.2,s:"iPoker",k:"200NL",b:2},
{n:"CsakEgyHalacska (IP)",h:213000,w:2.4,s:"iPoker",k:"200NL",b:2},
{n:"3O47 (IP)",h:211000,w:-5,s:"iPoker",k:"200NL",b:2},
{n:"NoGambIeNoFu1ure (IP)",h:209000,w:-3.6,s:"iPoker",k:"200NL",b:2},
{n:"0xRandon22 (IP)",h:207000,w:4.2,s:"iPoker",k:"200NL",b:2},
{n:"Punisher19 (IP)",h:1200000,w:0.7,s:"iPoker",k:"400-600NL",b:5},
{n:"Y0ker (IP)",h:604000,w:3.7,s:"iPoker",k:"400-600NL",b:5},
{n:"RazzleBazzle (IP)",h:544000,w:2.7,s:"iPoker",k:"400-600NL",b:5},
{n:"IWasBornInIt (IP)",h:530000,w:1.8,s:"iPoker",k:"400-600NL",b:5},
{n:"EmilLarsenErTyk (IP)",h:521000,w:-0.2,s:"iPoker",k:"400-600NL",b:5},
{n:"HilarioMontepina (IP)",h:511000,w:3.3,s:"iPoker",k:"400-600NL",b:5},
{n:"bk2mcdssoon (IP)",h:497000,w:1.4,s:"iPoker",k:"400-600NL",b:5},
{n:"uniC0rno (IP)",h:481000,w:1.3,s:"iPoker",k:"400-600NL",b:5},
{n:"Waarzeggerr (IP)",h:459000,w:2.8,s:"iPoker",k:"400-600NL",b:5},
{n:"BANANAPURA (IP)",h:436000,w:6.6,s:"iPoker",k:"400-600NL",b:5},
{n:"NoGambIeNoFu1ure (IP)",h:406000,w:0.2,s:"iPoker",k:"400-600NL",b:5},
{n:"PainIsReal (IP)",h:402000,w:3.1,s:"iPoker",k:"400-600NL",b:5},
{n:"11am (IP)",h:400000,w:1.8,s:"iPoker",k:"400-600NL",b:5},
{n:"vdy1331 (IP)",h:399000,w:2.9,s:"iPoker",k:"400-600NL",b:5},
{n:"UshouldveStudied (IP)",h:395000,w:0.6,s:"iPoker",k:"400-600NL",b:5},
{n:"Rrrroasty (IP)",h:389000,w:2.5,s:"iPoker",k:"400-600NL",b:5},
{n:"GuadaloupeFox (IP)",h:385000,w:3,s:"iPoker",k:"400-600NL",b:5},
{n:"Sintia906090 (IP)",h:377000,w:-0.6,s:"iPoker",k:"400-600NL",b:5},
{n:"LLevoLasNueces (IP)",h:373000,w:-1.8,s:"iPoker",k:"400-600NL",b:5},
{n:"InfinityLove33 (IP)",h:370000,w:1.8,s:"iPoker",k:"400-600NL",b:5},
{n:"navign (IP)",h:368000,w:5.1,s:"iPoker",k:"400-600NL",b:5},
{n:"PKT0 (IP)",h:364000,w:0.4,s:"iPoker",k:"400-600NL",b:5},
{n:"ElPatron (IP)",h:351000,w:0,s:"iPoker",k:"400-600NL",b:5},
{n:"IWANNABEEDOUARD (IP)",h:343000,w:2.7,s:"iPoker",k:"400-600NL",b:5},
{n:"Sesame99 (IP)",h:343000,w:-3.6,s:"iPoker",k:"400-600NL",b:5},
{n:"bf51918840 (IP)",h:342000,w:0.5,s:"iPoker",k:"400-600NL",b:5},
{n:"RIVERFOLD92 (IP)",h:329000,w:-1.7,s:"iPoker",k:"400-600NL",b:5},
{n:"ChiIIiPepperrr (IP)",h:326000,w:5.4,s:"iPoker",k:"400-600NL",b:5},
{n:"greenlainer (IP)",h:315000,w:1.4,s:"iPoker",k:"400-600NL",b:5},
{n:"FaRDeRaQuiOJr (IP)",h:312000,w:4.3,s:"iPoker",k:"400-600NL",b:5},
{n:"julianherold123 (IP)",h:305000,w:3.8,s:"iPoker",k:"400-600NL",b:5},
{n:"cleariiis (IP)",h:303000,w:1.4,s:"iPoker",k:"400-600NL",b:5},
{n:"COWABUNGA911 (IP)",h:296000,w:0.6,s:"iPoker",k:"400-600NL",b:5},
{n:"wakeemup (IP)",h:290000,w:-4.5,s:"iPoker",k:"400-600NL",b:5},
{n:"B1NGOPlayer (IP)",h:289000,w:-1.5,s:"iPoker",k:"400-600NL",b:5},
{n:"elOsodeMasha (IP)",h:288000,w:1.7,s:"iPoker",k:"400-600NL",b:5},
{n:"oldtimer72 (IP)",h:283000,w:3.6,s:"iPoker",k:"400-600NL",b:5},
{n:"TTR164030441 (IP)",h:283000,w:6.9,s:"iPoker",k:"400-600NL",b:5},
{n:"cardreader31 (IP)",h:282000,w:2.3,s:"iPoker",k:"400-600NL",b:5},
{n:"eZ4rtZ (IP)",h:274000,w:4.4,s:"iPoker",k:"400-600NL",b:5},
{n:"offyourun (IP)",h:274000,w:0.3,s:"iPoker",k:"400-600NL",b:5},
{n:"lrrelevant (IP)",h:268000,w:3.5,s:"iPoker",k:"400-600NL",b:5},
{n:"Xn1nt3nd0X (IP)",h:266000,w:0.4,s:"iPoker",k:"400-600NL",b:5},
{n:"RealMadrid777 (IP)",h:263000,w:3.1,s:"iPoker",k:"400-600NL",b:5},
{n:"ForgoneConclusio (IP)",h:261000,w:-1.5,s:"iPoker",k:"400-600NL",b:5},
{n:"VeryBigAndLong (IP)",h:259000,w:0,s:"iPoker",k:"400-600NL",b:5},
{n:"B2BBrother (IP)",h:259000,w:-0.8,s:"iPoker",k:"400-600NL",b:5},
{n:"Guylarious (IP)",h:253000,w:-0.1,s:"iPoker",k:"400-600NL",b:5},
{n:"DonkbetMaster (IP)",h:247000,w:5.8,s:"iPoker",k:"400-600NL",b:5},
{n:"Naiharnn (IP)",h:247000,w:2.7,s:"iPoker",k:"400-600NL",b:5},
{n:"e53f15 (IP)",h:245000,w:3.8,s:"iPoker",k:"400-600NL",b:5},
{n:"MegaT00th (IP)",h:244000,w:4.8,s:"iPoker",k:"400-600NL",b:5},
{n:"GroguBaby (IP)",h:241000,w:0.2,s:"iPoker",k:"400-600NL",b:5},
{n:"TheJericho2 (IP)",h:241000,w:0.9,s:"iPoker",k:"400-600NL",b:5},
{n:"songoku8 (IP)",h:240000,w:5.2,s:"iPoker",k:"400-600NL",b:5},
{n:"shining98 (IP)",h:240000,w:-2.1,s:"iPoker",k:"400-600NL",b:5},
{n:"totomonkey (IP)",h:237000,w:-2.2,s:"iPoker",k:"400-600NL",b:5},
{n:"Coopahh (IP)",h:237000,w:1.9,s:"iPoker",k:"400-600NL",b:5},
{n:"HyperKitchen (IP)",h:237000,w:3.1,s:"iPoker",k:"400-600NL",b:5},
{n:"Kanu2500 (IP)",h:236000,w:4.3,s:"iPoker",k:"400-600NL",b:5},
{n:"RoyalA5 (IP)",h:236000,w:-0.8,s:"iPoker",k:"400-600NL",b:5},
{n:"MAT147F (IP)",h:234000,w:6.1,s:"iPoker",k:"400-600NL",b:5},
{n:"Stupaczuk (IP)",h:233000,w:-0.3,s:"iPoker",k:"400-600NL",b:5},
{n:"coiinfl1p (IP)",h:233000,w:0.9,s:"iPoker",k:"400-600NL",b:5},
{n:"PeterFisher (IP)",h:231000,w:11.2,s:"iPoker",k:"400-600NL",b:5},
{n:"abr7kadabra (IP)",h:230000,w:4.1,s:"iPoker",k:"400-600NL",b:5},
{n:"Disconcerted (IP)",h:228000,w:-1,s:"iPoker",k:"400-600NL",b:5},
{n:"mrcouda (IP)",h:228000,w:2,s:"iPoker",k:"400-600NL",b:5},
{n:"ChilliPepperrrr (IP)",h:227000,w:5.9,s:"iPoker",k:"400-600NL",b:5},
{n:"ilDuce123 (IP)",h:225000,w:-0.4,s:"iPoker",k:"400-600NL",b:5},
{n:"SirMokSegg (IP)",h:225000,w:0.3,s:"iPoker",k:"400-600NL",b:5},
{n:"neiji05 (IP)",h:221000,w:4.3,s:"iPoker",k:"400-600NL",b:5},
{n:"LLinusLLess (IP)",h:219000,w:4.5,s:"iPoker",k:"400-600NL",b:5},
{n:"eatFreshFood (IP)",h:219000,w:3.3,s:"iPoker",k:"400-600NL",b:5},
{n:"GRS19 (IP)",h:217000,w:3.9,s:"iPoker",k:"400-600NL",b:5},
{n:"Rambo182 (IP)",h:216000,w:0.8,s:"iPoker",k:"400-600NL",b:5},
{n:"crashandburn4 (IP)",h:212000,w:9,s:"iPoker",k:"400-600NL",b:5},
{n:"amplexus (IP)",h:212000,w:0.1,s:"iPoker",k:"400-600NL",b:5},
{n:"Agarramelasbolas (IP)",h:210000,w:1.7,s:"iPoker",k:"400-600NL",b:5},
{n:"ZanshinArt (IP)",h:209000,w:5.2,s:"iPoker",k:"400-600NL",b:5},
{n:"jumperdream747 (IP)",h:209000,w:0.1,s:"iPoker",k:"400-600NL",b:5},
{n:"gambler217 (IP)",h:207000,w:2,s:"iPoker",k:"400-600NL",b:5},
{n:"M0ney4Value (IP)",h:205000,w:-0.9,s:"iPoker",k:"400-600NL",b:5},
{n:"EdwardSnowdenNSA (IP)",h:201000,w:4.2,s:"iPoker",k:"400-600NL",b:5},
{n:"MuckItNSuckit (IP)",h:200000,w:-2.4,s:"iPoker",k:"400-600NL",b:5},
{n:"EdgarAllanPwn (IP)",h:199000,w:1.9,s:"iPoker",k:"400-600NL",b:5},
{n:"hulahHULAH (IP)",h:199000,w:5.2,s:"iPoker",k:"400-600NL",b:5},
{n:"Vallitutto (IP)",h:198000,w:4,s:"iPoker",k:"400-600NL",b:5},
{n:"RemcoEv (IP)",h:197000,w:0.3,s:"iPoker",k:"400-600NL",b:5},
{n:"GrinSmile (IP)",h:196000,w:4.7,s:"iPoker",k:"400-600NL",b:5},
{n:"Manchester2020 (IP)",h:196000,w:5.1,s:"iPoker",k:"400-600NL",b:5},
{n:"nemyx (IP)",h:196000,w:2.2,s:"iPoker",k:"400-600NL",b:5},
{n:"valufakis (IP)",h:194000,w:3.3,s:"iPoker",k:"400-600NL",b:5},
{n:"faliyosanroque (IP)",h:194000,w:3.2,s:"iPoker",k:"400-600NL",b:5},
{n:"DumbTax (IP)",h:192000,w:1,s:"iPoker",k:"400-600NL",b:5},
{n:"BIGshirley (IP)",h:192000,w:7.5,s:"iPoker",k:"400-600NL",b:5},
{n:"4444pk (IP)",h:191000,w:-4,s:"iPoker",k:"400-600NL",b:5},
{n:"Luckyhotgirl (IP)",h:191000,w:-0.9,s:"iPoker",k:"400-600NL",b:5},
{n:"canadafish (IP)",h:189000,w:1,s:"iPoker",k:"400-600NL",b:5},
{n:"pnzrkmpfwgn6 (IP)",h:188000,w:0.7,s:"iPoker",k:"400-600NL",b:5},
{n:"Serpico1921 (IP)",h:2300000,w:-0.7,s:"iPoker",k:"50NL",b:0.5},
{n:"krentsik1 (IP)",h:1300000,w:-1.8,s:"iPoker",k:"50NL",b:0.5},
{n:"AEsi22 (IP)",h:933000,w:-0.5,s:"iPoker",k:"50NL",b:0.5},
{n:"plzDontLie (IP)",h:880000,w:-0.4,s:"iPoker",k:"50NL",b:0.5},
{n:"SkillGrinder (IP)",h:862000,w:0.8,s:"iPoker",k:"50NL",b:0.5},
{n:"ResilenZ (IP)",h:848000,w:1.1,s:"iPoker",k:"50NL",b:0.5},
{n:"PatriotAce (IP)",h:836000,w:-1.8,s:"iPoker",k:"50NL",b:0.5},
{n:"CindyCampbell (IP)",h:831000,w:3,s:"iPoker",k:"50NL",b:0.5},
{n:"Nicedaybro (IP)",h:821000,w:2.3,s:"iPoker",k:"50NL",b:0.5},
{n:"luckylamppost (IP)",h:813000,w:-2.5,s:"iPoker",k:"50NL",b:0.5},
{n:"knightquiet98 (IP)",h:813000,w:0.6,s:"iPoker",k:"50NL",b:0.5},
{n:"ICHbinWin (IP)",h:810000,w:1,s:"iPoker",k:"50NL",b:0.5},
{n:"SiberianPower (IP)",h:761000,w:-0.5,s:"iPoker",k:"50NL",b:0.5},
{n:"Neuropunk1 (IP)",h:760000,w:-0.1,s:"iPoker",k:"50NL",b:0.5},
{n:"MRPKRBRG (IP)",h:752000,w:-1,s:"iPoker",k:"50NL",b:0.5},
{n:"Gulfikzone (IP)",h:746000,w:1.2,s:"iPoker",k:"50NL",b:0.5},
{n:"Ilsickcall (IP)",h:713000,w:2.1,s:"iPoker",k:"50NL",b:0.5},
{n:"ValkyriePrepared (IP)",h:709000,w:-1.2,s:"iPoker",k:"50NL",b:0.5},
{n:"Isohartsa1 (IP)",h:679000,w:-1.3,s:"iPoker",k:"50NL",b:0.5},
{n:"Carp2kg (IP)",h:672000,w:1.1,s:"iPoker",k:"50NL",b:0.5},
{n:"AhmedBet (IP)",h:658000,w:2.9,s:"iPoker",k:"50NL",b:0.5},
{n:"TXCTGR (IP)",h:650000,w:3.5,s:"iPoker",k:"50NL",b:0.5},
{n:"NaktisBR (IP)",h:641000,w:-1.2,s:"iPoker",k:"50NL",b:0.5},
{n:"vant1me (IP)",h:619000,w:-0.3,s:"iPoker",k:"50NL",b:0.5},
{n:"Meremore (IP)",h:613000,w:-0.5,s:"iPoker",k:"50NL",b:0.5},
{n:"NeonFlash (IP)",h:609000,w:-0.7,s:"iPoker",k:"50NL",b:0.5},
{n:"fishDrop (IP)",h:605000,w:-0.8,s:"iPoker",k:"50NL",b:0.5},
{n:"Tyulpanchik1 (IP)",h:595000,w:4.2,s:"iPoker",k:"50NL",b:0.5},
{n:"psychoginger (IP)",h:590000,w:-1.5,s:"iPoker",k:"50NL",b:0.5},
{n:"Veldora (IP)",h:579000,w:4.8,s:"iPoker",k:"50NL",b:0.5},
{n:"aquadisco (IP)",h:578000,w:2.5,s:"iPoker",k:"50NL",b:0.5},
{n:"lVegativen (IP)",h:576000,w:0.2,s:"iPoker",k:"50NL",b:0.5},
{n:"RedLineProfi (IP)",h:557000,w:-4.2,s:"iPoker",k:"50NL",b:0.5},
{n:"GreaTArtemka (IP)",h:553000,w:4.2,s:"iPoker",k:"50NL",b:0.5},
{n:"ZlayaKonjashka (IP)",h:545000,w:-6.9,s:"iPoker",k:"50NL",b:0.5},
{n:"black3711 (IP)",h:545000,w:3,s:"iPoker",k:"50NL",b:0.5},
{n:"Lampropez (IP)",h:541000,w:0,s:"iPoker",k:"50NL",b:0.5},
{n:"025usd (IP)",h:540000,w:3.1,s:"iPoker",k:"50NL",b:0.5},
{n:"Xardas9 (IP)",h:521000,w:3.7,s:"iPoker",k:"50NL",b:0.5},
{n:"JANUZAJ (IP)",h:516000,w:-4.1,s:"iPoker",k:"50NL",b:0.5},
{n:"happygoose (IP)",h:515000,w:-2.5,s:"iPoker",k:"50NL",b:0.5},
{n:"Shadowplayy (IP)",h:503000,w:1.6,s:"iPoker",k:"50NL",b:0.5},
{n:"PapiHulk (IP)",h:500000,w:5.8,s:"iPoker",k:"50NL",b:0.5},
{n:"Pofiq (IP)",h:494000,w:-0.1,s:"iPoker",k:"50NL",b:0.5},
{n:"Homalopyl (IP)",h:493000,w:-1.7,s:"iPoker",k:"50NL",b:0.5},
{n:"cadaver00 (IP)",h:492000,w:0.9,s:"iPoker",k:"50NL",b:0.5},
{n:"padv (IP)",h:490000,w:-2.7,s:"iPoker",k:"50NL",b:0.5},
{n:"ULKK (IP)",h:488000,w:0.1,s:"iPoker",k:"50NL",b:0.5},
{n:"peterthfc (IP)",h:488000,w:-14.8,s:"iPoker",k:"50NL",b:0.5},
{n:"HeyDarling1 (IP)",h:481000,w:1.4,s:"iPoker",k:"50NL",b:0.5},
{n:"Bluesomething (IP)",h:474000,w:1.6,s:"iPoker",k:"50NL",b:0.5},
{n:"VetervLico (IP)",h:473000,w:3.7,s:"iPoker",k:"50NL",b:0.5},
{n:"PotatoMan (IP)",h:462000,w:-3,s:"iPoker",k:"50NL",b:0.5},
{n:"MaybeBluff1 (IP)",h:452000,w:-5.7,s:"iPoker",k:"50NL",b:0.5},
{n:"stealth93 (IP)",h:448000,w:-1.5,s:"iPoker",k:"50NL",b:0.5},
{n:"Semosergus (IP)",h:439000,w:-0.8,s:"iPoker",k:"50NL",b:0.5},
{n:"babayyy12 (IP)",h:439000,w:13.7,s:"iPoker",k:"50NL",b:0.5},
{n:"KripatPP (IP)",h:435000,w:-2.4,s:"iPoker",k:"50NL",b:0.5},
{n:"22782464247 (IP)",h:430000,w:4.9,s:"iPoker",k:"50NL",b:0.5},
{n:"HeatCommittee (IP)",h:428000,w:6.1,s:"iPoker",k:"50NL",b:0.5},
{n:"Morgenes (IP)",h:424000,w:-7.5,s:"iPoker",k:"50NL",b:0.5},
{n:"getoverhere111 (IP)",h:423000,w:3.5,s:"iPoker",k:"50NL",b:0.5},
{n:"SeverGrad (IP)",h:422000,w:4.6,s:"iPoker",k:"50NL",b:0.5},
{n:"MurenA1 (IP)",h:415000,w:-0.4,s:"iPoker",k:"50NL",b:0.5},
{n:"machinetable49 (IP)",h:413000,w:0.2,s:"iPoker",k:"50NL",b:0.5},
{n:"Va1onqar (IP)",h:411000,w:-0.3,s:"iPoker",k:"50NL",b:0.5},
{n:"Xenopeld (IP)",h:409000,w:-2.7,s:"iPoker",k:"50NL",b:0.5},
{n:"GraceKelly1 (IP)",h:408000,w:-0.3,s:"iPoker",k:"50NL",b:0.5},
{n:"ItGrindsYouDown (IP)",h:406000,w:-2.9,s:"iPoker",k:"50NL",b:0.5},
{n:"GazzyB123456789 (IP)",h:405000,w:0.9,s:"iPoker",k:"50NL",b:0.5},
{n:"ClausDead (IP)",h:401000,w:-4.3,s:"iPoker",k:"50NL",b:0.5},
{n:"uDuC10DA (IP)",h:400000,w:-1.7,s:"iPoker",k:"50NL",b:0.5},
{n:"rakamakaf0 (IP)",h:394000,w:1,s:"iPoker",k:"50NL",b:0.5},
{n:"Izzzya (IP)",h:391000,w:1,s:"iPoker",k:"50NL",b:0.5},
{n:"BarkelBarquez (IP)",h:391000,w:1.8,s:"iPoker",k:"50NL",b:0.5},
{n:"bluff4win (IP)",h:389000,w:-3.5,s:"iPoker",k:"50NL",b:0.5},
{n:"LordRogar (IP)",h:389000,w:6.5,s:"iPoker",k:"50NL",b:0.5},
{n:"MrLi (IP)",h:386000,w:0.4,s:"iPoker",k:"50NL",b:0.5},
{n:"NickfromTV (IP)",h:384000,w:-3.9,s:"iPoker",k:"50NL",b:0.5},
{n:"nevergiveup57 (IP)",h:383000,w:2,s:"iPoker",k:"50NL",b:0.5},
{n:"Katran25 (IP)",h:381000,w:0.9,s:"iPoker",k:"50NL",b:0.5},
{n:"JohnSmith74 (IP)",h:381000,w:-2.6,s:"iPoker",k:"50NL",b:0.5},
{n:"Gotcha4n00b (IP)",h:377000,w:-3,s:"iPoker",k:"50NL",b:0.5},
{n:"nomochild (IP)",h:374000,w:-0.8,s:"iPoker",k:"50NL",b:0.5},
{n:"Pareatins (IP)",h:372000,w:-0.6,s:"iPoker",k:"50NL",b:0.5},
{n:"Tumatrogh (IP)",h:367000,w:-1.5,s:"iPoker",k:"50NL",b:0.5},
{n:"urtred (IP)",h:367000,w:2.9,s:"iPoker",k:"50NL",b:0.5},
{n:"bredOK88 (IP)",h:364000,w:-0.7,s:"iPoker",k:"50NL",b:0.5},
{n:"OnMyWayToRampage (IP)",h:364000,w:-0.4,s:"iPoker",k:"50NL",b:0.5},
{n:"WinstonSmith (IP)",h:363000,w:1.7,s:"iPoker",k:"50NL",b:0.5},
{n:"P76N (IP)",h:361000,w:-3.4,s:"iPoker",k:"50NL",b:0.5},
{n:"Athlete228 (IP)",h:361000,w:-0.1,s:"iPoker",k:"50NL",b:0.5},
{n:"chesdant (IP)",h:360000,w:3.2,s:"iPoker",k:"50NL",b:0.5},
{n:"NooK1 (IP)",h:356000,w:3.9,s:"iPoker",k:"50NL",b:0.5},
{n:"HeyWhaHappen (IP)",h:356000,w:3.4,s:"iPoker",k:"50NL",b:0.5},
{n:"LetTheBoyWatcH (IP)",h:351000,w:-4.5,s:"iPoker",k:"50NL",b:0.5},
{n:"HRCNONME (IP)",h:349000,w:-4.4,s:"iPoker",k:"50NL",b:0.5},
{n:"Tuzpobeda (IP)",h:347000,w:-0.1,s:"iPoker",k:"50NL",b:0.5},
{n:"prostable49 (IP)",h:346000,w:-4,s:"iPoker",k:"50NL",b:0.5},
{n:"Arbiter91 (IP)",h:346000,w:-4.9,s:"iPoker",k:"50NL",b:0.5},
{n:"king10clubs (PS)",h:1700000,w:4.1,s:"PokerStars",k:"1000NL",b:10},
{n:"scorpio04 (PS)",h:765000,w:0.1,s:"PokerStars",k:"1000NL",b:10},
{n:"AGL_by (PS)",h:671000,w:4.1,s:"PokerStars",k:"1000NL",b:10},
{n:"ADviking (PS)",h:638000,w:-0.4,s:"PokerStars",k:"1000NL",b:10},
{n:"Chessnok (PS)",h:614000,w:-0.8,s:"PokerStars",k:"1000NL",b:10},
{n:"golovorez777 (PS)",h:580000,w:2.9,s:"PokerStars",k:"1000NL",b:10},
{n:"Royal Mind (PS)",h:565000,w:2.9,s:"PokerStars",k:"1000NL",b:10},
{n:"oSpiel888 (PS)",h:558000,w:5.5,s:"PokerStars",k:"1000NL",b:10},
{n:"Flying Smile (PS)",h:526000,w:0.5,s:"PokerStars",k:"1000NL",b:10},
{n:"LOLyouPlay (PS)",h:505000,w:2.2,s:"PokerStars",k:"1000NL",b:10},
{n:"z4muz (PS)",h:501000,w:2,s:"PokerStars",k:"1000NL",b:10},
{n:"Agrotait (PS)",h:497000,w:1.1,s:"PokerStars",k:"1000NL",b:10},
{n:"ttesone (PS)",h:487000,w:3,s:"PokerStars",k:"1000NL",b:10},
{n:"fr1zerrr (PS)",h:476000,w:3.1,s:"PokerStars",k:"1000NL",b:10},
{n:"Belqi (PS)",h:474000,w:0.9,s:"PokerStars",k:"1000NL",b:10},
{n:"RUS)Timur (PS)",h:469000,w:6.6,s:"PokerStars",k:"1000NL",b:10},
{n:"ph3n0men0n (PS)",h:467000,w:2.4,s:"PokerStars",k:"1000NL",b:10},
{n:"Hatrick19911 (PS)",h:455000,w:0.6,s:"PokerStars",k:"1000NL",b:10},
{n:"moshmachine (PS)",h:454000,w:2.2,s:"PokerStars",k:"1000NL",b:10},
{n:"Nullus1123 (PS)",h:450000,w:2.2,s:"PokerStars",k:"1000NL",b:10},
{n:"VolkovDmitri (PS)",h:447000,w:0.6,s:"PokerStars",k:"1000NL",b:10},
{n:"teunuss (PS)",h:414000,w:1.3,s:"PokerStars",k:"1000NL",b:10},
{n:"Hope_Flooky (PS)",h:414000,w:1.4,s:"PokerStars",k:"1000NL",b:10},
{n:"vestimokrec (PS)",h:413000,w:0.2,s:"PokerStars",k:"1000NL",b:10},
{n:"AlexeSsz (PS)",h:412000,w:1.1,s:"PokerStars",k:"1000NL",b:10},
{n:"mapcel1D (PS)",h:408000,w:3.2,s:"PokerStars",k:"1000NL",b:10},
{n:"xfriendlyx (PS)",h:400000,w:3.2,s:"PokerStars",k:"1000NL",b:10},
{n:"serhiy1989 (PS)",h:394000,w:3.1,s:"PokerStars",k:"1000NL",b:10},
{n:"bonk30 (PS)",h:391000,w:5.4,s:"PokerStars",k:"1000NL",b:10},
{n:"angryogr1 (PS)",h:391000,w:3.5,s:"PokerStars",k:"1000NL",b:10},
{n:"RommyTheCute (PS)",h:386000,w:-0.6,s:"PokerStars",k:"1000NL",b:10},
{n:"Daniiiiil (PS)",h:380000,w:4.8,s:"PokerStars",k:"1000NL",b:10},
{n:"J0hn Mcclean (PS)",h:378000,w:-0.8,s:"PokerStars",k:"1000NL",b:10},
{n:"AverageGreg (PS)",h:363000,w:6.1,s:"PokerStars",k:"1000NL",b:10},
{n:"GiveMeUP (PS)",h:361000,w:6.7,s:"PokerStars",k:"1000NL",b:10},
{n:"White_OtB (PS)",h:361000,w:0.4,s:"PokerStars",k:"1000NL",b:10},
{n:"MaxHendrix (PS)",h:357000,w:1.8,s:"PokerStars",k:"1000NL",b:10},
{n:"ZarubaNT (PS)",h:356000,w:7.1,s:"PokerStars",k:"1000NL",b:10},
{n:"gunzreal (PS)",h:351000,w:1.2,s:"PokerStars",k:"1000NL",b:10},
{n:"belik555 (PS)",h:348000,w:-0.7,s:"PokerStars",k:"1000NL",b:10},
{n:"_qpuni$her_ (PS)",h:341000,w:2.6,s:"PokerStars",k:"1000NL",b:10},
{n:"JVL_STARRR69 (PS)",h:337000,w:5.6,s:"PokerStars",k:"1000NL",b:10},
{n:"l xFlake l (PS)",h:337000,w:2.1,s:"PokerStars",k:"1000NL",b:10},
{n:"SantaZzz (PS)",h:334000,w:3.4,s:"PokerStars",k:"1000NL",b:10},
{n:"el.suertero (PS)",h:328000,w:-0.8,s:"PokerStars",k:"1000NL",b:10},
{n:"Maksimus1978 (PS)",h:327000,w:1.6,s:"PokerStars",k:"1000NL",b:10},
{n:"ZilikPSM (PS)",h:326000,w:5.2,s:"PokerStars",k:"1000NL",b:10},
{n:"FourSixFour (PS)",h:323000,w:3.5,s:"PokerStars",k:"1000NL",b:10},
{n:"Katz0r (PS)",h:315000,w:4.8,s:"PokerStars",k:"1000NL",b:10},
{n:"coman567 (PS)",h:313000,w:0.1,s:"PokerStars",k:"1000NL",b:10},
{n:"C1awViper (PS)",h:310000,w:-2.2,s:"PokerStars",k:"1000NL",b:10},
{n:"Garnerus (PS)",h:309000,w:0.7,s:"PokerStars",k:"1000NL",b:10},
{n:"Sr amarillo (PS)",h:306000,w:1.6,s:"PokerStars",k:"1000NL",b:10},
{n:"omfgsorry (PS)",h:299000,w:2.2,s:"PokerStars",k:"1000NL",b:10},
{n:"niabios (PS)",h:298000,w:1.9,s:"PokerStars",k:"1000NL",b:10},
{n:"xPastorcitox (PS)",h:297000,w:4,s:"PokerStars",k:"1000NL",b:10},
{n:"balrog25 (PS)",h:293000,w:1,s:"PokerStars",k:"1000NL",b:10},
{n:"DeanoSupremo (PS)",h:293000,w:3,s:"PokerStars",k:"1000NL",b:10},
{n:"zazano (PS)",h:291000,w:1.7,s:"PokerStars",k:"1000NL",b:10},
{n:"TboneMunson (PS)",h:290000,w:2,s:"PokerStars",k:"1000NL",b:10},
{n:"RodinaLenina (PS)",h:289000,w:3,s:"PokerStars",k:"1000NL",b:10},
{n:"zerfer03 (PS)",h:289000,w:-1,s:"PokerStars",k:"1000NL",b:10},
{n:"proggrezive (PS)",h:286000,w:2,s:"PokerStars",k:"1000NL",b:10},
{n:"Labuns (PS)",h:283000,w:1.3,s:"PokerStars",k:"1000NL",b:10},
{n:"0Human0 (PS)",h:282000,w:4.8,s:"PokerStars",k:"1000NL",b:10},
{n:"LiveTogether (PS)",h:279000,w:7.2,s:"PokerStars",k:"1000NL",b:10},
{n:"Oskar1991XXX (PS)",h:277000,w:5.7,s:"PokerStars",k:"1000NL",b:10},
{n:"avr0ra (PS)",h:275000,w:7.1,s:"PokerStars",k:"1000NL",b:10},
{n:"shevliak (PS)",h:270000,w:4.3,s:"PokerStars",k:"1000NL",b:10},
{n:"Stefan11222 (PS)",h:269000,w:4.5,s:"PokerStars",k:"1000NL",b:10},
{n:"B_loJkl (PS)",h:268000,w:-0.3,s:"PokerStars",k:"1000NL",b:10},
{n:"MunEZ_StaRR (PS)",h:267000,w:3.4,s:"PokerStars",k:"1000NL",b:10},
{n:"luismi1912 (PS)",h:266000,w:0.4,s:"PokerStars",k:"1000NL",b:10},
{n:"nikolaos778 (PS)",h:265000,w:3.3,s:"PokerStars",k:"1000NL",b:10},
{n:"Sunni_92 (PS)",h:265000,w:7.3,s:"PokerStars",k:"1000NL",b:10},
{n:"mypokerf (PS)",h:265000,w:2.8,s:"PokerStars",k:"1000NL",b:10},
{n:"Go0se.core! (PS)",h:264000,w:1.4,s:"PokerStars",k:"1000NL",b:10},
{n:"Hayoterkinovich (PS)",h:261000,w:3.3,s:"PokerStars",k:"1000NL",b:10},
{n:"Ner4zzurri (PS)",h:258000,w:7.5,s:"PokerStars",k:"1000NL",b:10},
{n:"Philipp06 (PS)",h:257000,w:0.8,s:"PokerStars",k:"1000NL",b:10},
{n:"Anchig (PS)",h:253000,w:0.8,s:"PokerStars",k:"1000NL",b:10},
{n:"pogokc (PS)",h:252000,w:2.9,s:"PokerStars",k:"1000NL",b:10},
{n:"elpasoafera (PS)",h:249000,w:-1.3,s:"PokerStars",k:"1000NL",b:10},
{n:"Squa1l (PS)",h:248000,w:4.2,s:"PokerStars",k:"1000NL",b:10},
{n:"JMBigJoe (PS)",h:247000,w:1.9,s:"PokerStars",k:"1000NL",b:10},
{n:"Skazo4nik777 (PS)",h:245000,w:0.4,s:"PokerStars",k:"1000NL",b:10},
{n:"theIpoker (PS)",h:242000,w:7.1,s:"PokerStars",k:"1000NL",b:10},
{n:"YurNas (PS)",h:242000,w:1,s:"PokerStars",k:"1000NL",b:10},
{n:"BastianX (PS)",h:241000,w:5,s:"PokerStars",k:"1000NL",b:10},
{n:"andr31123 (PS)",h:237000,w:5.7,s:"PokerStars",k:"1000NL",b:10},
{n:"dccnesquick (PS)",h:234000,w:8.4,s:"PokerStars",k:"1000NL",b:10},
{n:"tuff_shark (PS)",h:233000,w:9.5,s:"PokerStars",k:"1000NL",b:10},
{n:"bolecc (PS)",h:233000,w:3,s:"PokerStars",k:"1000NL",b:10},
{n:"bogec (PS)",h:232000,w:3.8,s:"PokerStars",k:"1000NL",b:10},
{n:"rascal_319 (PS)",h:231000,w:-4.4,s:"PokerStars",k:"1000NL",b:10},
{n:"bigstealer (PS)",h:230000,w:1.2,s:"PokerStars",k:"1000NL",b:10},
{n:"psek1 (PS)",h:229000,w:3.2,s:"PokerStars",k:"1000NL",b:10},
{n:"RaisemyNut$ (PS)",h:224000,w:0.2,s:"PokerStars",k:"1000NL",b:10},
{n:"Ruslancheeck (PS)",h:224000,w:2.4,s:"PokerStars",k:"1000NL",b:10},
{n:"Bit2Easy (PS)",h:224000,w:1.2,s:"PokerStars",k:"1000NL",b:10},
{n:"SexyAngeline (PS)",h:7000000,w:1.8,s:"PokerStars",k:"100NL",b:1},
{n:"WavePervik (PS)",h:4600000,w:-1.3,s:"PokerStars",k:"100NL",b:1},
{n:"StEeElNuTz (PS)",h:4100000,w:-1.2,s:"PokerStars",k:"100NL",b:1},
{n:"gabi_igna (PS)",h:3600000,w:3.2,s:"PokerStars",k:"100NL",b:1},
{n:"mycka86 (PS)",h:3000000,w:3.5,s:"PokerStars",k:"100NL",b:1},
{n:"chenconhaste (PS)",h:3000000,w:3.2,s:"PokerStars",k:"100NL",b:1},
{n:"ka100pka527 (PS)",h:3000000,w:4.2,s:"PokerStars",k:"100NL",b:1},
{n:"simoniustin (PS)",h:3000000,w:4,s:"PokerStars",k:"100NL",b:1},
{n:"alkash613 (PS)",h:2900000,w:3.1,s:"PokerStars",k:"100NL",b:1},
{n:"cn_chayanne (PS)",h:2900000,w:3,s:"PokerStars",k:"100NL",b:1},
{n:"picka4u (PS)",h:2800000,w:2.8,s:"PokerStars",k:"100NL",b:1},
{n:"solbi86 (PS)",h:2800000,w:3.1,s:"PokerStars",k:"100NL",b:1},
{n:"Supermegopro (PS)",h:2600000,w:5.5,s:"PokerStars",k:"100NL",b:1},
{n:"Dr_Chase_Rus (PS)",h:2600000,w:0.6,s:"PokerStars",k:"100NL",b:1},
{n:"pardama (PS)",h:2600000,w:1.6,s:"PokerStars",k:"100NL",b:1},
{n:"Magnate777 (PS)",h:2600000,w:0.6,s:"PokerStars",k:"100NL",b:1},
{n:"hurtNCYDE (PS)",h:2500000,w:2.4,s:"PokerStars",k:"100NL",b:1},
{n:"vanilica (PS)",h:2400000,w:2.6,s:"PokerStars",k:"100NL",b:1},
{n:"butcheN18 (PS)",h:2400000,w:2,s:"PokerStars",k:"100NL",b:1},
{n:"e306 (PS)",h:2300000,w:1.1,s:"PokerStars",k:"100NL",b:1},
{n:"50CandyJoe (PS)",h:2100000,w:6.1,s:"PokerStars",k:"100NL",b:1},
{n:"Filojoes (PS)",h:2100000,w:2,s:"PokerStars",k:"100NL",b:1},
{n:"xxxZeka (PS)",h:2100000,w:-0.2,s:"PokerStars",k:"100NL",b:1},
{n:"HITYESCA (PS)",h:2100000,w:1.8,s:"PokerStars",k:"100NL",b:1},
{n:"bittarion (PS)",h:2100000,w:1.2,s:"PokerStars",k:"100NL",b:1},
{n:"PapaGun5286 (PS)",h:2100000,w:2.7,s:"PokerStars",k:"100NL",b:1},
{n:"SharingaaN (PS)",h:2000000,w:4,s:"PokerStars",k:"100NL",b:1},
{n:"Glushchenko (PS)",h:2000000,w:3,s:"PokerStars",k:"100NL",b:1},
{n:"AlexEliseev7 (PS)",h:2000000,w:4,s:"PokerStars",k:"100NL",b:1},
{n:"Tumen072 (PS)",h:1900000,w:0.1,s:"PokerStars",k:"100NL",b:1},
{n:"vrnMike (PS)",h:1900000,w:0.3,s:"PokerStars",k:"100NL",b:1},
{n:"typ6oky3mu4 (PS)",h:1900000,w:1.9,s:"PokerStars",k:"100NL",b:1},
{n:"MakoEv (PS)",h:1900000,w:2.7,s:"PokerStars",k:"100NL",b:1},
{n:"nikalas22 (PS)",h:1900000,w:3.5,s:"PokerStars",k:"100NL",b:1},
{n:"Ouga Buga (PS)",h:1800000,w:2,s:"PokerStars",k:"100NL",b:1},
{n:"Shad2y`wow (PS)",h:1800000,w:2.1,s:"PokerStars",k:"100NL",b:1},
{n:"D†est7oye†R (PS)",h:1800000,w:5.8,s:"PokerStars",k:"100NL",b:1},
{n:"Muinmyheart (PS)",h:1800000,w:1.6,s:"PokerStars",k:"100NL",b:1},
{n:"AfanasiyBomj (PS)",h:1800000,w:6.9,s:"PokerStars",k:"100NL",b:1},
{n:"John_les (PS)",h:1800000,w:2.2,s:"PokerStars",k:"100NL",b:1},
{n:"Henadzi (PS)",h:1800000,w:0,s:"PokerStars",k:"100NL",b:1},
{n:"hammerwife (PS)",h:1800000,w:1.2,s:"PokerStars",k:"100NL",b:1},
{n:"darklol (PS)",h:1700000,w:-1.7,s:"PokerStars",k:"100NL",b:1},
{n:"skars07 (PS)",h:1700000,w:2.7,s:"PokerStars",k:"100NL",b:1},
{n:"abramovich87 (PS)",h:1700000,w:1.7,s:"PokerStars",k:"100NL",b:1},
{n:"poker_soul11 (PS)",h:1700000,w:0.6,s:"PokerStars",k:"100NL",b:1},
{n:"1nFiNiTy1991 (PS)",h:1700000,w:2.2,s:"PokerStars",k:"100NL",b:1},
{n:"ManFer85 (PS)",h:1700000,w:3.7,s:"PokerStars",k:"100NL",b:1},
{n:"1Bunn (PS)",h:1700000,w:-3.4,s:"PokerStars",k:"100NL",b:1},
{n:"m4nifest (PS)",h:1700000,w:4.2,s:"PokerStars",k:"100NL",b:1},
{n:"ceedonen (PS)",h:1600000,w:4.7,s:"PokerStars",k:"100NL",b:1},
{n:"KLOP06031987 (PS)",h:1600000,w:1.2,s:"PokerStars",k:"100NL",b:1},
{n:"LuckyJyst (PS)",h:1600000,w:3.1,s:"PokerStars",k:"100NL",b:1},
{n:"kvitun (PS)",h:1600000,w:2.6,s:"PokerStars",k:"100NL",b:1},
{n:"ilaviiitech (PS)",h:1600000,w:2.6,s:"PokerStars",k:"100NL",b:1},
{n:"vadjkeee (PS)",h:1600000,w:6.2,s:"PokerStars",k:"100NL",b:1},
{n:"HerrJanks (PS)",h:1500000,w:7.4,s:"PokerStars",k:"100NL",b:1},
{n:"toprmaw (PS)",h:1500000,w:2.6,s:"PokerStars",k:"100NL",b:1},
{n:"alexBlack371 (PS)",h:1500000,w:1.5,s:"PokerStars",k:"100NL",b:1},
{n:"rate8 (PS)",h:1500000,w:2.2,s:"PokerStars",k:"100NL",b:1},
{n:"sutata (PS)",h:1500000,w:4.9,s:"PokerStars",k:"100NL",b:1},
{n:"myatiy 96 (PS)",h:1500000,w:5.9,s:"PokerStars",k:"100NL",b:1},
{n:"ruslik_by (PS)",h:1500000,w:0.5,s:"PokerStars",k:"100NL",b:1},
{n:"Dantistcopra (PS)",h:1400000,w:-0.6,s:"PokerStars",k:"100NL",b:1},
{n:"socito (PS)",h:1400000,w:3,s:"PokerStars",k:"100NL",b:1},
{n:"b2k-Snick (PS)",h:1400000,w:3.7,s:"PokerStars",k:"100NL",b:1},
{n:"Spid1 (PS)",h:1400000,w:2.7,s:"PokerStars",k:"100NL",b:1},
{n:"amphii (PS)",h:1300000,w:1.9,s:"PokerStars",k:"100NL",b:1},
{n:"reiyser (PS)",h:1300000,w:3,s:"PokerStars",k:"100NL",b:1},
{n:"easycall2587 (PS)",h:1300000,w:5.1,s:"PokerStars",k:"100NL",b:1},
{n:"Y_19 (PS)",h:1300000,w:-1.3,s:"PokerStars",k:"100NL",b:1},
{n:"RAidakCo (PS)",h:1300000,w:4,s:"PokerStars",k:"100NL",b:1},
{n:"Rizla_1984 (PS)",h:1300000,w:0.8,s:"PokerStars",k:"100NL",b:1},
{n:"ARCTlCkiss (PS)",h:1300000,w:4.9,s:"PokerStars",k:"100NL",b:1},
{n:"Grant[NY] (PS)",h:1300000,w:6.5,s:"PokerStars",k:"100NL",b:1},
{n:"K.Smirnov (PS)",h:1300000,w:-1.1,s:"PokerStars",k:"100NL",b:1},
{n:"lulu19911991 (PS)",h:1300000,w:1.8,s:"PokerStars",k:"100NL",b:1},
{n:"stds st (PS)",h:1300000,w:1.9,s:"PokerStars",k:"100NL",b:1},
{n:"yro07 (PS)",h:1300000,w:-0.5,s:"PokerStars",k:"100NL",b:1},
{n:"BronKKAA (PS)",h:1300000,w:2.4,s:"PokerStars",k:"100NL",b:1},
{n:"blackw0lf_03 (PS)",h:1300000,w:5.6,s:"PokerStars",k:"100NL",b:1},
{n:"zwetok (PS)",h:1300000,w:-1.1,s:"PokerStars",k:"100NL",b:1},
{n:"tipner (PS)",h:1300000,w:3.2,s:"PokerStars",k:"100NL",b:1},
{n:"KimWanHull (PS)",h:1300000,w:0.4,s:"PokerStars",k:"100NL",b:1},
{n:"ptolejmus (PS)",h:1300000,w:3.7,s:"PokerStars",k:"100NL",b:1},
{n:"SanychStar (PS)",h:1300000,w:3.1,s:"PokerStars",k:"100NL",b:1},
{n:"TheMinion (PS)",h:1200000,w:0.3,s:"PokerStars",k:"100NL",b:1},
{n:"janarr5 (PS)",h:1200000,w:4.4,s:"PokerStars",k:"100NL",b:1},
{n:"G.HANSEN333 (PS)",h:1200000,w:4.2,s:"PokerStars",k:"100NL",b:1},
{n:"el.suertero (PS)",h:1200000,w:3.4,s:"PokerStars",k:"100NL",b:1},
{n:"Priidix (PS)",h:1200000,w:1,s:"PokerStars",k:"100NL",b:1},
{n:"Vercus2009 (PS)",h:1200000,w:5.5,s:"PokerStars",k:"100NL",b:1},
{n:"hypersmart (PS)",h:1200000,w:5.3,s:"PokerStars",k:"100NL",b:1},
{n:"Azimar (PS)",h:1200000,w:4.4,s:"PokerStars",k:"100NL",b:1},
{n:"catrayx (PS)",h:1200000,w:3.9,s:"PokerStars",k:"100NL",b:1},
{n:"zulginn (PS)",h:1200000,w:1.4,s:"PokerStars",k:"100NL",b:1},
{n:"Mak.Alse (PS)",h:1200000,w:5.3,s:"PokerStars",k:"100NL",b:1},
{n:"Zager.v (PS)",h:1200000,w:6.3,s:"PokerStars",k:"100NL",b:1},
{n:"PacPacBum (PS)",h:1200000,w:1.5,s:"PokerStars",k:"100NL",b:1},
{n:"shootingGRID (PS)",h:1200000,w:2.9,s:"PokerStars",k:"100NL",b:1},
{n:"scorpio04 (PS)",h:526000,w:1.2,s:"PokerStars",k:"2000NL",b:20},
{n:"oSpiel888 (PS)",h:492000,w:4.5,s:"PokerStars",k:"2000NL",b:20},
{n:"Chessnok (PS)",h:446000,w:0.5,s:"PokerStars",k:"2000NL",b:20},
{n:"0Human0 (PS)",h:394000,w:2.4,s:"PokerStars",k:"2000NL",b:20},
{n:"AGL_by (PS)",h:374000,w:1.5,s:"PokerStars",k:"2000NL",b:20},
{n:"belik555 (PS)",h:348000,w:-0.4,s:"PokerStars",k:"2000NL",b:20},
{n:"GiveMeUP (PS)",h:334000,w:5,s:"PokerStars",k:"2000NL",b:20},
{n:"Bit2Easy (PS)",h:322000,w:2.4,s:"PokerStars",k:"2000NL",b:20},
{n:"angryogr1 (PS)",h:306000,w:1.2,s:"PokerStars",k:"2000NL",b:20},
{n:"VolkovDmitri (PS)",h:303000,w:1.1,s:"PokerStars",k:"2000NL",b:20},
{n:"coman567 (PS)",h:303000,w:0.5,s:"PokerStars",k:"2000NL",b:20},
{n:"SayNo2Racism (PS)",h:301000,w:3.6,s:"PokerStars",k:"2000NL",b:20},
{n:"king10clubs (PS)",h:298000,w:1.8,s:"PokerStars",k:"2000NL",b:20},
{n:"l xFlake l (PS)",h:297000,w:-0.3,s:"PokerStars",k:"2000NL",b:20},
{n:"ADviking (PS)",h:291000,w:-0.6,s:"PokerStars",k:"2000NL",b:20},
{n:"Nacho124441 (PS)",h:290000,w:-2.1,s:"PokerStars",k:"2000NL",b:20},
{n:"Agrotait (PS)",h:280000,w:0.9,s:"PokerStars",k:"2000NL",b:20},
{n:"Belqi (PS)",h:279000,w:2.2,s:"PokerStars",k:"2000NL",b:20},
{n:"Royal Mind (PS)",h:278000,w:1.5,s:"PokerStars",k:"2000NL",b:20},
{n:"MMAsherdog (PS)",h:265000,w:3.9,s:"PokerStars",k:"2000NL",b:20},
{n:"MunEZ_StaRR (PS)",h:259000,w:7.9,s:"PokerStars",k:"2000NL",b:20},
{n:"niabios (PS)",h:250000,w:2.3,s:"PokerStars",k:"2000NL",b:20},
{n:"MaxHendrix (PS)",h:249000,w:1.4,s:"PokerStars",k:"2000NL",b:20},
{n:"Scarface.VLT (PS)",h:248000,w:1.8,s:"PokerStars",k:"2000NL",b:20},
{n:"balrog25 (PS)",h:242000,w:1.3,s:"PokerStars",k:"2000NL",b:20},
{n:"ZarubaNT (PS)",h:239000,w:6.2,s:"PokerStars",k:"2000NL",b:20},
{n:"shevliak (PS)",h:237000,w:0.7,s:"PokerStars",k:"2000NL",b:20},
{n:"SantaZzz (PS)",h:232000,w:0.7,s:"PokerStars",k:"2000NL",b:20},
{n:"milanov888 (PS)",h:232000,w:3.4,s:"PokerStars",k:"2000NL",b:20},
{n:"thejericho2 (PS)",h:225000,w:1,s:"PokerStars",k:"2000NL",b:20},
{n:"Stefan11222 (PS)",h:216000,w:7.2,s:"PokerStars",k:"2000NL",b:20},
{n:"OBORRA (PS)",h:213000,w:7.7,s:"PokerStars",k:"2000NL",b:20},
{n:"theIpoker (PS)",h:212000,w:4.9,s:"PokerStars",k:"2000NL",b:20},
{n:"t9pkin (PS)",h:212000,w:0.9,s:"PokerStars",k:"2000NL",b:20},
{n:"Hatrick19911 (PS)",h:210000,w:1.9,s:"PokerStars",k:"2000NL",b:20},
{n:"ross_654 (PS)",h:205000,w:4.6,s:"PokerStars",k:"2000NL",b:20},
{n:"ac1dd (PS)",h:199000,w:4.4,s:"PokerStars",k:"2000NL",b:20},
{n:"Philipp06 (PS)",h:198000,w:1.7,s:"PokerStars",k:"2000NL",b:20},
{n:"zazano (PS)",h:198000,w:3.3,s:"PokerStars",k:"2000NL",b:20},
{n:"golovorez777 (PS)",h:197000,w:0.3,s:"PokerStars",k:"2000NL",b:20},
{n:"RodinaLenina (PS)",h:196000,w:4.3,s:"PokerStars",k:"2000NL",b:20},
{n:"Fiilismies (PS)",h:192000,w:3.2,s:"PokerStars",k:"2000NL",b:20},
{n:"OtB_RedBaron (PS)",h:190000,w:7.7,s:"PokerStars",k:"2000NL",b:20},
{n:"DRluck3 (PS)",h:190000,w:2.7,s:"PokerStars",k:"2000NL",b:20},
{n:"AverageGreg (PS)",h:189000,w:4.2,s:"PokerStars",k:"2000NL",b:20},
{n:"Squa1l (PS)",h:186000,w:3.4,s:"PokerStars",k:"2000NL",b:20},
{n:"ph3n0men0n (PS)",h:185000,w:1.4,s:"PokerStars",k:"2000NL",b:20},
{n:"avr0ra (PS)",h:184000,w:5.6,s:"PokerStars",k:"2000NL",b:20},
{n:"yakuts (PS)",h:178000,w:2.7,s:"PokerStars",k:"2000NL",b:20},
{n:"LOLyouPlay (PS)",h:176000,w:2.5,s:"PokerStars",k:"2000NL",b:20},
{n:"-r3d/L!ne (PS)",h:176000,w:0.6,s:"PokerStars",k:"2000NL",b:20},
{n:"DavyJones922 (PS)",h:175000,w:3.3,s:"PokerStars",k:"2000NL",b:20},
{n:"Beeeehto (PS)",h:173000,w:1.2,s:"PokerStars",k:"2000NL",b:20},
{n:"w00tLOL (PS)",h:171000,w:5,s:"PokerStars",k:"2000NL",b:20},
{n:"ICEMAN2710 (PS)",h:165000,w:7,s:"PokerStars",k:"2000NL",b:20},
{n:"antoha1998 (PS)",h:165000,w:0.1,s:"PokerStars",k:"2000NL",b:20},
{n:"LLinusLLove (PS)",h:162000,w:9.2,s:"PokerStars",k:"2000NL",b:20},
{n:"oj_pimpson (PS)",h:162000,w:0.7,s:"PokerStars",k:"2000NL",b:20},
{n:"vestimokrec (PS)",h:161000,w:0.4,s:"PokerStars",k:"2000NL",b:20},
{n:"SyrW_Helmets (PS)",h:160000,w:-1.9,s:"PokerStars",k:"2000NL",b:20},
{n:"B_loJkl (PS)",h:158000,w:0.9,s:"PokerStars",k:"2000NL",b:20},
{n:"ExtraResistance (PS)",h:157000,w:2.1,s:"PokerStars",k:"2000NL",b:20},
{n:"Maksimus1978 (PS)",h:156000,w:-1,s:"PokerStars",k:"2000NL",b:20},
{n:"LiveTogether (PS)",h:155000,w:9.4,s:"PokerStars",k:"2000NL",b:20},
{n:"RaisemyNut$ (PS)",h:155000,w:0.3,s:"PokerStars",k:"2000NL",b:20},
{n:"TUTI88 (PS)",h:153000,w:-1.7,s:"PokerStars",k:"2000NL",b:20},
{n:"BigBlindBets (PS)",h:153000,w:4.3,s:"PokerStars",k:"2000NL",b:20},
{n:"Iimitless (PS)",h:153000,w:4.2,s:"PokerStars",k:"2000NL",b:20},
{n:"Streetnikov (PS)",h:151000,w:1.1,s:"PokerStars",k:"2000NL",b:20},
{n:"Anchig (PS)",h:151000,w:0.9,s:"PokerStars",k:"2000NL",b:20},
{n:"ja.sam.gale (PS)",h:150000,w:2.2,s:"PokerStars",k:"2000NL",b:20},
{n:"AlexeSsz (PS)",h:150000,w:3.8,s:"PokerStars",k:"2000NL",b:20},
{n:"pay_my_trips (PS)",h:149000,w:0.5,s:"PokerStars",k:"2000NL",b:20},
{n:"J0hn Mcclean (PS)",h:144000,w:0.5,s:"PokerStars",k:"2000NL",b:20},
{n:"RommyTheCute (PS)",h:143000,w:-0.2,s:"PokerStars",k:"2000NL",b:20},
{n:"YurNas (PS)",h:142000,w:0.6,s:"PokerStars",k:"2000NL",b:20},
{n:"yurasov1990 (PS)",h:142000,w:3.5,s:"PokerStars",k:"2000NL",b:20},
{n:"_qpuni$her_ (PS)",h:141000,w:2.8,s:"PokerStars",k:"2000NL",b:20},
{n:"NLZWERVERNL (PS)",h:141000,w:6.9,s:"PokerStars",k:"2000NL",b:20},
{n:"FourSixFour (PS)",h:140000,w:3.2,s:"PokerStars",k:"2000NL",b:20},
{n:"dudd1 (PS)",h:140000,w:1.1,s:"PokerStars",k:"2000NL",b:20},
{n:"Truelove13 (PS)",h:136000,w:0.9,s:"PokerStars",k:"2000NL",b:20},
{n:"Go0se.core! (PS)",h:135000,w:3.6,s:"PokerStars",k:"2000NL",b:20},
{n:"pokerkluka (PS)",h:135000,w:2.9,s:"PokerStars",k:"2000NL",b:20},
{n:"Azrarn (PS)",h:134000,w:1.8,s:"PokerStars",k:"2000NL",b:20},
{n:"DeanoSupremo (PS)",h:134000,w:-2,s:"PokerStars",k:"2000NL",b:20},
{n:"JVL_STARRR69 (PS)",h:134000,w:2.4,s:"PokerStars",k:"2000NL",b:20},
{n:"Sr amarillo (PS)",h:133000,w:1.9,s:"PokerStars",k:"2000NL",b:20},
{n:"CooL1992 (PS)",h:133000,w:2.9,s:"PokerStars",k:"2000NL",b:20},
{n:"gunzreal (PS)",h:132000,w:1.9,s:"PokerStars",k:"2000NL",b:20},
{n:"tuff_shark (PS)",h:132000,w:4.4,s:"PokerStars",k:"2000NL",b:20},
{n:"grind4ever (PS)",h:131000,w:1.8,s:"PokerStars",k:"2000NL",b:20},
{n:"LifeisagameX (PS)",h:131000,w:0.4,s:"PokerStars",k:"2000NL",b:20},
{n:"Pass_72 (PS)",h:130000,w:7.9,s:"PokerStars",k:"2000NL",b:20},
{n:"2000kg (PS)",h:129000,w:3.6,s:"PokerStars",k:"2000NL",b:20},
{n:"nikolaos778 (PS)",h:128000,w:2,s:"PokerStars",k:"2000NL",b:20},
{n:"Flying Smile (PS)",h:127000,w:0.9,s:"PokerStars",k:"2000NL",b:20},
{n:"TheU10 (PS)",h:126000,w:0.6,s:"PokerStars",k:"2000NL",b:20},
{n:"takechip (PS)",h:125000,w:0.3,s:"PokerStars",k:"2000NL",b:20},
{n:"Katz0r (PS)",h:125000,w:2.7,s:"PokerStars",k:"2000NL",b:20},
{n:"joaquin41 (PS)",h:3800000,w:2.5,s:"PokerStars",k:"200NL",b:2},
{n:"YaDaDaMeeN21 (PS)",h:3600000,w:3.7,s:"PokerStars",k:"200NL",b:2},
{n:"IseeUcards (PS)",h:3300000,w:4.5,s:"PokerStars",k:"200NL",b:2},
{n:"MakoEv (PS)",h:3100000,w:4.4,s:"PokerStars",k:"200NL",b:2},
{n:"cn_chayanne (PS)",h:2800000,w:4.4,s:"PokerStars",k:"200NL",b:2},
{n:"Hackeran (PS)",h:2300000,w:1.8,s:"PokerStars",k:"200NL",b:2},
{n:"kvitun (PS)",h:2300000,w:0.9,s:"PokerStars",k:"200NL",b:2},
{n:"Kreuznagel (PS)",h:2200000,w:0.8,s:"PokerStars",k:"200NL",b:2},
{n:"ilexys (PS)",h:2200000,w:-0.4,s:"PokerStars",k:"200NL",b:2},
{n:"xSHTIRLITSx (PS)",h:2200000,w:-1.7,s:"PokerStars",k:"200NL",b:2},
{n:"blackw0lf_03 (PS)",h:2000000,w:5.7,s:"PokerStars",k:"200NL",b:2},
{n:"Igoriah (PS)",h:2000000,w:0.7,s:"PokerStars",k:"200NL",b:2},
{n:"Dimedr.All (PS)",h:2000000,w:6.2,s:"PokerStars",k:"200NL",b:2},
{n:"RamiroAgujis (PS)",h:2000000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"TOMBATLE (PS)",h:1900000,w:2.5,s:"PokerStars",k:"200NL",b:2},
{n:"ancientRage (PS)",h:1900000,w:3.6,s:"PokerStars",k:"200NL",b:2},
{n:"Monsthand (PS)",h:1900000,w:4.3,s:"PokerStars",k:"200NL",b:2},
{n:"RUS)Timur (PS)",h:1900000,w:4.6,s:"PokerStars",k:"200NL",b:2},
{n:"Ouga Buga (PS)",h:1900000,w:2.5,s:"PokerStars",k:"200NL",b:2},
{n:"Optimist1945 (PS)",h:1900000,w:2.8,s:"PokerStars",k:"200NL",b:2},
{n:"Nullus1123 (PS)",h:1800000,w:1.2,s:"PokerStars",k:"200NL",b:2},
{n:"EsKoTeiRo (PS)",h:1800000,w:4.3,s:"PokerStars",k:"200NL",b:2},
{n:"InsomniaRU (PS)",h:1800000,w:3.6,s:"PokerStars",k:"200NL",b:2},
{n:"KT90 (PS)",h:1800000,w:0.5,s:"PokerStars",k:"200NL",b:2},
{n:"ersevi6 (PS)",h:1800000,w:5.4,s:"PokerStars",k:"200NL",b:2},
{n:"chaps1988 (PS)",h:1800000,w:1.6,s:"PokerStars",k:"200NL",b:2},
{n:"FREDY BULLIT (PS)",h:1800000,w:1.1,s:"PokerStars",k:"200NL",b:2},
{n:"E.Tokio13 (PS)",h:1700000,w:-0.1,s:"PokerStars",k:"200NL",b:2},
{n:"ki11u (PS)",h:1700000,w:5.4,s:"PokerStars",k:"200NL",b:2},
{n:"Durnichka (PS)",h:1600000,w:5.4,s:"PokerStars",k:"200NL",b:2},
{n:"BronKKAA (PS)",h:1600000,w:3.7,s:"PokerStars",k:"200NL",b:2},
{n:"crusher6 (PS)",h:1600000,w:6.7,s:"PokerStars",k:"200NL",b:2},
{n:"Himan33 (PS)",h:1600000,w:0.1,s:"PokerStars",k:"200NL",b:2},
{n:"el.suertero (PS)",h:1600000,w:3.4,s:"PokerStars",k:"200NL",b:2},
{n:"jazzman337 (PS)",h:1600000,w:2.3,s:"PokerStars",k:"200NL",b:2},
{n:"BonusOnTilt (PS)",h:1600000,w:1.7,s:"PokerStars",k:"200NL",b:2},
{n:"Momess (PS)",h:1500000,w:0.7,s:"PokerStars",k:"200NL",b:2},
{n:"CRAZY_YEHOOO (PS)",h:1500000,w:8.6,s:"PokerStars",k:"200NL",b:2},
{n:"gabi_igna (PS)",h:1500000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"fataleggs13 (PS)",h:1500000,w:0.5,s:"PokerStars",k:"200NL",b:2},
{n:"The_Meer (PS)",h:1500000,w:3.5,s:"PokerStars",k:"200NL",b:2},
{n:"kebab-setä (PS)",h:1500000,w:6.9,s:"PokerStars",k:"200NL",b:2},
{n:"Sharknebulah (PS)",h:1500000,w:2,s:"PokerStars",k:"200NL",b:2},
{n:"Smeilz1 (PS)",h:1500000,w:-1.6,s:"PokerStars",k:"200NL",b:2},
{n:"andr_by (PS)",h:1500000,w:3.4,s:"PokerStars",k:"200NL",b:2},
{n:"m4nifest (PS)",h:1500000,w:2.9,s:"PokerStars",k:"200NL",b:2},
{n:"Nikoe0 (PS)",h:1500000,w:0.1,s:"PokerStars",k:"200NL",b:2},
{n:"tepi_guy (PS)",h:1500000,w:1.5,s:"PokerStars",k:"200NL",b:2},
{n:"HuanHuan (PS)",h:1500000,w:4.6,s:"PokerStars",k:"200NL",b:2},
{n:"1nFiNiTy1991 (PS)",h:1500000,w:2.7,s:"PokerStars",k:"200NL",b:2},
{n:"Pe4enka (PS)",h:1500000,w:-0.7,s:"PokerStars",k:"200NL",b:2},
{n:"butcheN18 (PS)",h:1500000,w:2,s:"PokerStars",k:"200NL",b:2},
{n:"gazlla (PS)",h:1500000,w:0.3,s:"PokerStars",k:"200NL",b:2},
{n:"janarr5 (PS)",h:1400000,w:2.7,s:"PokerStars",k:"200NL",b:2},
{n:"RAidakCo (PS)",h:1400000,w:2,s:"PokerStars",k:"200NL",b:2},
{n:"kaliboz (PS)",h:1400000,w:3.1,s:"PokerStars",k:"200NL",b:2},
{n:"Danil joker (PS)",h:1400000,w:4.8,s:"PokerStars",k:"200NL",b:2},
{n:"Greennday (PS)",h:1400000,w:-0.1,s:"PokerStars",k:"200NL",b:2},
{n:"Hotei168 (PS)",h:1400000,w:4.4,s:"PokerStars",k:"200NL",b:2},
{n:"ivanildo (PS)",h:1400000,w:-0.9,s:"PokerStars",k:"200NL",b:2},
{n:"XKTTBOBV11 (PS)",h:1400000,w:2.8,s:"PokerStars",k:"200NL",b:2},
{n:"BSTUSim (PS)",h:1400000,w:6.8,s:"PokerStars",k:"200NL",b:2},
{n:"pardama (PS)",h:1300000,w:0.6,s:"PokerStars",k:"200NL",b:2},
{n:"PacPacBum (PS)",h:1300000,w:1.9,s:"PokerStars",k:"200NL",b:2},
{n:"hurtNCYDE (PS)",h:1300000,w:2.9,s:"PokerStars",k:"200NL",b:2},
{n:"Saranchaz (PS)",h:1300000,w:4.8,s:"PokerStars",k:"200NL",b:2},
{n:"tipner (PS)",h:1300000,w:5.7,s:"PokerStars",k:"200NL",b:2},
{n:"DrontDodo (PS)",h:1300000,w:2.9,s:"PokerStars",k:"200NL",b:2},
{n:"vanilica (PS)",h:1300000,w:1.4,s:"PokerStars",k:"200NL",b:2},
{n:"Bimaxa (PS)",h:1300000,w:3.5,s:"PokerStars",k:"200NL",b:2},
{n:"TheAveiro (PS)",h:1300000,w:-0.4,s:"PokerStars",k:"200NL",b:2},
{n:"limpnfold24 (PS)",h:1300000,w:1.3,s:"PokerStars",k:"200NL",b:2},
{n:"Dantistcopra (PS)",h:1300000,w:-1.2,s:"PokerStars",k:"200NL",b:2},
{n:"VACBlack (PS)",h:1300000,w:0.1,s:"PokerStars",k:"200NL",b:2},
{n:"mol'farrr (PS)",h:1300000,w:5,s:"PokerStars",k:"200NL",b:2},
{n:"LuckyJyst (PS)",h:1300000,w:4.5,s:"PokerStars",k:"200NL",b:2},
{n:"PunKkKid (PS)",h:1300000,w:3.1,s:"PokerStars",k:"200NL",b:2},
{n:"Gamz11 (PS)",h:1200000,w:2.5,s:"PokerStars",k:"200NL",b:2},
{n:"ozone2003 (PS)",h:1200000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"ceedonen (PS)",h:1200000,w:2.8,s:"PokerStars",k:"200NL",b:2},
{n:"oledgyk (PS)",h:1200000,w:6.6,s:"PokerStars",k:"200NL",b:2},
{n:"Slavikkkk7 (PS)",h:1200000,w:2.6,s:"PokerStars",k:"200NL",b:2},
{n:"seiscero (PS)",h:1200000,w:3.3,s:"PokerStars",k:"200NL",b:2},
{n:"PapaGun5286 (PS)",h:1200000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"shockeaz (PS)",h:1200000,w:3.5,s:"PokerStars",k:"200NL",b:2},
{n:"skarbara (PS)",h:1200000,w:5.6,s:"PokerStars",k:"200NL",b:2},
{n:"C1awViper (PS)",h:1200000,w:1.9,s:"PokerStars",k:"200NL",b:2},
{n:"dontmarchrun (PS)",h:1200000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"JulyShort (PS)",h:1200000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"SpainT9 (PS)",h:1200000,w:-0.2,s:"PokerStars",k:"200NL",b:2},
{n:"T0ny Adams (PS)",h:1100000,w:9,s:"PokerStars",k:"200NL",b:2},
{n:"PayTaxOrDie (PS)",h:1100000,w:1.8,s:"PokerStars",k:"200NL",b:2},
{n:"K.Antagonist (PS)",h:1100000,w:3.2,s:"PokerStars",k:"200NL",b:2},
{n:"SanychStar (PS)",h:1100000,w:3.4,s:"PokerStars",k:"200NL",b:2},
{n:"rusdronenv (PS)",h:1100000,w:3.8,s:"PokerStars",k:"200NL",b:2},
{n:"Bykladjo (PS)",h:1100000,w:2.3,s:"PokerStars",k:"200NL",b:2},
{n:"v domike (PS)",h:1100000,w:2.1,s:"PokerStars",k:"200NL",b:2},
{n:"hano17 (PS)",h:1100000,w:1.7,s:"PokerStars",k:"200NL",b:2},
{n:"PbI6HaD3op (PS)",h:1100000,w:1.1,s:"PokerStars",k:"200NL",b:2},
{n:"Ravnica11 (PS)",h:1100000,w:4,s:"PokerStars",k:"200NL",b:2},
{n:"M4D_T1LT (PS)",h:1200000,w:5.2,s:"PokerStars",k:"500NL",b:5},
{n:"n0madzz (PS)",h:923000,w:2.8,s:"PokerStars",k:"500NL",b:5},
{n:"z4muz (PS)",h:903000,w:3.6,s:"PokerStars",k:"500NL",b:5},
{n:"TOMBATLE (PS)",h:770000,w:1.9,s:"PokerStars",k:"500NL",b:5},
{n:"kvitun (PS)",h:740000,w:2.5,s:"PokerStars",k:"500NL",b:5},
{n:"Ouga Buga (PS)",h:692000,w:4.6,s:"PokerStars",k:"500NL",b:5},
{n:"PokerStarJ2 (PS)",h:643000,w:1.2,s:"PokerStars",k:"500NL",b:5},
{n:"el.suertero (PS)",h:627000,w:4.6,s:"PokerStars",k:"500NL",b:5},
{n:"ilexys (PS)",h:617000,w:-0.7,s:"PokerStars",k:"500NL",b:5},
{n:"Nullus1123 (PS)",h:574000,w:2,s:"PokerStars",k:"500NL",b:5},
{n:"ANDOTX0 (PS)",h:555000,w:3.5,s:"PokerStars",k:"500NL",b:5},
{n:"typ6oky3mu4 (PS)",h:536000,w:2.4,s:"PokerStars",k:"500NL",b:5},
{n:"Hayoterkinovich (PS)",h:536000,w:3,s:"PokerStars",k:"500NL",b:5},
{n:"Daniiiiil (PS)",h:500000,w:3.4,s:"PokerStars",k:"500NL",b:5},
{n:"taras_kovel (PS)",h:499000,w:9.3,s:"PokerStars",k:"500NL",b:5},
{n:"madjic1 (PS)",h:492000,w:6.1,s:"PokerStars",k:"500NL",b:5},
{n:"L2Poker33 (PS)",h:490000,w:2.7,s:"PokerStars",k:"500NL",b:5},
{n:"dryzochek (PS)",h:488000,w:3.8,s:"PokerStars",k:"500NL",b:5},
{n:"SDutch91 (PS)",h:488000,w:4.1,s:"PokerStars",k:"500NL",b:5},
{n:"321letitrip (PS)",h:487000,w:2.3,s:"PokerStars",k:"500NL",b:5},
{n:"seiscero (PS)",h:481000,w:2.7,s:"PokerStars",k:"500NL",b:5},
{n:"DrontDodo (PS)",h:462000,w:2.8,s:"PokerStars",k:"500NL",b:5},
{n:"xfriendlyx (PS)",h:458000,w:1.7,s:"PokerStars",k:"500NL",b:5},
{n:"majeeeeeed (PS)",h:457000,w:4.1,s:"PokerStars",k:"500NL",b:5},
{n:"onetim3p1z (PS)",h:456000,w:2.8,s:"PokerStars",k:"500NL",b:5},
{n:"AMMADNAV (PS)",h:452000,w:2.7,s:"PokerStars",k:"500NL",b:5},
{n:"LuckyJyst (PS)",h:444000,w:0.9,s:"PokerStars",k:"500NL",b:5},
{n:"Mattulh (PS)",h:436000,w:3.4,s:"PokerStars",k:"500NL",b:5},
{n:"peevoajax (PS)",h:430000,w:6.2,s:"PokerStars",k:"500NL",b:5},
{n:"Painkiller72 (PS)",h:422000,w:6.4,s:"PokerStars",k:"500NL",b:5},
{n:"Seta-Beni (PS)",h:418000,w:5.9,s:"PokerStars",k:"500NL",b:5},
{n:"psyhoagromor (PS)",h:415000,w:2.6,s:"PokerStars",k:"500NL",b:5},
{n:"megalodoNkk (PS)",h:404000,w:4.7,s:"PokerStars",k:"500NL",b:5},
{n:"janarr5 (PS)",h:404000,w:4.5,s:"PokerStars",k:"500NL",b:5},
{n:"COOLIKO\\/23 (PS)",h:391000,w:2.9,s:"PokerStars",k:"500NL",b:5},
{n:"monkaSSSS (PS)",h:389000,w:4,s:"PokerStars",k:"500NL",b:5},
{n:"ph3n0men0n (PS)",h:389000,w:3.9,s:"PokerStars",k:"500NL",b:5},
{n:"alboadictoGB (PS)",h:387000,w:1.2,s:"PokerStars",k:"500NL",b:5},
{n:"sinsadir (PS)",h:380000,w:4.4,s:"PokerStars",k:"500NL",b:5},
{n:"Magnate777 (PS)",h:376000,w:3,s:"PokerStars",k:"500NL",b:5},
{n:"Crazy ATM (PS)",h:374000,w:2.4,s:"PokerStars",k:"500NL",b:5},
{n:"DenverAK888 (PS)",h:371000,w:0.8,s:"PokerStars",k:"500NL",b:5},
{n:"Zavorotny (PS)",h:371000,w:4.8,s:"PokerStars",k:"500NL",b:5},
{n:"neomorf (PS)",h:370000,w:7.2,s:"PokerStars",k:"500NL",b:5},
{n:"ManceRayder93 (PS)",h:367000,w:1.6,s:"PokerStars",k:"500NL",b:5},
{n:"RAidakCo (PS)",h:366000,w:1.9,s:"PokerStars",k:"500NL",b:5},
{n:"dreamydom (PS)",h:365000,w:2.9,s:"PokerStars",k:"500NL",b:5},
{n:"Sunni_92 (PS)",h:364000,w:1.6,s:"PokerStars",k:"500NL",b:5},
{n:"9I_TPENIRUIUS (PS)",h:348000,w:4,s:"PokerStars",k:"500NL",b:5},
{n:"ancientRage (PS)",h:345000,w:2.8,s:"PokerStars",k:"500NL",b:5},
{n:"joker180785 (PS)",h:345000,w:2.1,s:"PokerStars",k:"500NL",b:5},
{n:"HarissaMB (PS)",h:334000,w:1.4,s:"PokerStars",k:"500NL",b:5},
{n:"0steba (PS)",h:332000,w:2.3,s:"PokerStars",k:"500NL",b:5},
{n:"stan_09319 (PS)",h:330000,w:3.8,s:"PokerStars",k:"500NL",b:5},
{n:"I'm-iyh-rn (PS)",h:326000,w:4.8,s:"PokerStars",k:"500NL",b:5},
{n:"Alptraum85xx (PS)",h:318000,w:5.1,s:"PokerStars",k:"500NL",b:5},
{n:"badrealwOw (PS)",h:318000,w:3.4,s:"PokerStars",k:"500NL",b:5},
{n:"Hurloon (PS)",h:309000,w:1.6,s:"PokerStars",k:"500NL",b:5},
{n:"kuca86 (PS)",h:306000,w:0.3,s:"PokerStars",k:"500NL",b:5},
{n:"dontmarchrun (PS)",h:302000,w:2.8,s:"PokerStars",k:"500NL",b:5},
{n:"rodckz (PS)",h:296000,w:3.3,s:"PokerStars",k:"500NL",b:5},
{n:"Schyllae (PS)",h:294000,w:6.7,s:"PokerStars",k:"500NL",b:5},
{n:"blackw0lf_03 (PS)",h:288000,w:5.3,s:"PokerStars",k:"500NL",b:5},
{n:"VeTäSe (PS)",h:283000,w:2.9,s:"PokerStars",k:"500NL",b:5},
{n:"ffender (PS)",h:282000,w:-0.8,s:"PokerStars",k:"500NL",b:5},
{n:"Mannyy12 (PS)",h:279000,w:0.9,s:"PokerStars",k:"500NL",b:5},
{n:"Jimy Tiltman (PS)",h:279000,w:1.2,s:"PokerStars",k:"500NL",b:5},
{n:"rosychaser (PS)",h:278000,w:-0.4,s:"PokerStars",k:"500NL",b:5},
{n:"Flying Smile (PS)",h:277000,w:3.1,s:"PokerStars",k:"500NL",b:5},
{n:"LOLyouPlay (PS)",h:275000,w:3.5,s:"PokerStars",k:"500NL",b:5},
{n:"AAFORALIVING (PS)",h:273000,w:1.4,s:"PokerStars",k:"500NL",b:5},
{n:"Bimaxa (PS)",h:272000,w:3.4,s:"PokerStars",k:"500NL",b:5},
{n:"readraise (PS)",h:269000,w:2.3,s:"PokerStars",k:"500NL",b:5},
{n:"anxwowlol (PS)",h:267000,w:8.7,s:"PokerStars",k:"500NL",b:5},
{n:"ljryviltj (PS)",h:266000,w:4,s:"PokerStars",k:"500NL",b:5},
{n:"mapcel1D (PS)",h:265000,w:4.8,s:"PokerStars",k:"500NL",b:5},
{n:"spat93 (PS)",h:265000,w:4.7,s:"PokerStars",k:"500NL",b:5},
{n:"ersevi6 (PS)",h:263000,w:2.6,s:"PokerStars",k:"500NL",b:5},
{n:"shockeaz (PS)",h:263000,w:2,s:"PokerStars",k:"500NL",b:5},
{n:"Monsthand (PS)",h:260000,w:3.1,s:"PokerStars",k:"500NL",b:5},
{n:"chusito21 (PS)",h:257000,w:1.1,s:"PokerStars",k:"500NL",b:5},
{n:"ultegraa (PS)",h:257000,w:3.6,s:"PokerStars",k:"500NL",b:5},
{n:"DissidentOfHU (PS)",h:255000,w:0,s:"PokerStars",k:"500NL",b:5},
{n:"ChaosGen (PS)",h:250000,w:3.3,s:"PokerStars",k:"500NL",b:5},
{n:"3o3yJIbKA (PS)",h:249000,w:3.9,s:"PokerStars",k:"500NL",b:5},
{n:"tipner (PS)",h:244000,w:5,s:"PokerStars",k:"500NL",b:5},
{n:"AlexeSsz (PS)",h:242000,w:4.6,s:"PokerStars",k:"500NL",b:5},
{n:"Toriiiii (PS)",h:242000,w:4,s:"PokerStars",k:"500NL",b:5},
{n:"burigat (PS)",h:241000,w:2.1,s:"PokerStars",k:"500NL",b:5},
{n:"StraussJ (PS)",h:241000,w:7.3,s:"PokerStars",k:"500NL",b:5},
{n:"Ravnica11 (PS)",h:240000,w:3.8,s:"PokerStars",k:"500NL",b:5},
{n:"Tocmihail (PS)",h:240000,w:4.2,s:"PokerStars",k:"500NL",b:5},
{n:"pla5te (PS)",h:236000,w:5.5,s:"PokerStars",k:"500NL",b:5},
{n:"Henadzi (PS)",h:235000,w:2.4,s:"PokerStars",k:"500NL",b:5},
{n:"WYIYW (PS)",h:232000,w:7,s:"PokerStars",k:"500NL",b:5},
{n:"Royal Mind (PS)",h:231000,w:1.8,s:"PokerStars",k:"500NL",b:5},
{n:"crusher6 (PS)",h:229000,w:6.1,s:"PokerStars",k:"500NL",b:5},
{n:"teunuss (PS)",h:227000,w:5.7,s:"PokerStars",k:"500NL",b:5},
{n:"c94sual (PS)",h:227000,w:1.9,s:"PokerStars",k:"500NL",b:5},
{n:"fred_high (PS)",h:226000,w:-1,s:"PokerStars",k:"500NL",b:5},
{n:"WavePervik (PS)",h:5200000,w:-1.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"thevagosx (PS)",h:4700000,w:2.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"Al3xAnd3r22 (PS)",h:4500000,w:4,s:"PokerStars",k:"50NL",b:0.5},
{n:"MarsMiland (PS)",h:3500000,w:9.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"HITYESCA (PS)",h:3300000,w:1.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"Shirachi90 (PS)",h:3300000,w:4.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"Supermegopro (PS)",h:3100000,w:4.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"Shad2y`wow (PS)",h:3100000,w:2.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"LeXuSSS201 (PS)",h:2900000,w:3.9,s:"PokerStars",k:"50NL",b:0.5},
{n:"Crazyfish87 (PS)",h:2900000,w:5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Submenus (PS)",h:2700000,w:4.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"Gatyer14 (PS)",h:2700000,w:5.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"Glushchenko (PS)",h:2700000,w:5.9,s:"PokerStars",k:"50NL",b:0.5},
{n:"jamba83 (PS)",h:2600000,w:2.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"fandorin2005 (PS)",h:2600000,w:4.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"Dark13x_x (PS)",h:2600000,w:5.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"sergbest2005 (PS)",h:2600000,w:1.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"ljryviltj (PS)",h:2600000,w:1.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"pntdoru05 (PS)",h:2500000,w:2.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Troll8989 (PS)",h:2500000,w:2.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"hammerwife (PS)",h:2300000,w:3.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"el.suertero (PS)",h:2300000,w:2.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"chenconhaste (PS)",h:2300000,w:3.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"eraser2308 (PS)",h:2300000,w:6.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"3DMINSK (PS)",h:2300000,w:3.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"bratbugor (PS)",h:2300000,w:3.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"VictorTheRam (PS)",h:2200000,w:0.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"Ramyano (PS)",h:2200000,w:3.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"iwillkillset (PS)",h:2200000,w:-0.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"patriot424 (PS)",h:2100000,w:5,s:"PokerStars",k:"50NL",b:0.5},
{n:"BankItDrew (PS)",h:2100000,w:5.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"FuchsJ (PS)",h:2100000,w:2.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Y_19 (PS)",h:2100000,w:0.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"hurleysluck (PS)",h:2100000,w:2.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"Stratadamus (PS)",h:2100000,w:3.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"abramovich87 (PS)",h:2100000,w:3.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"SoLongRain (PS)",h:2000000,w:4.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"Zager.v (PS)",h:2000000,w:6.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"MrLimaN (PS)",h:2000000,w:0.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"1988 Sawa (PS)",h:2000000,w:3.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Morrowind999 (PS)",h:2000000,w:3.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"Domotirko228 (PS)",h:2000000,w:3.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"weite18 (PS)",h:2000000,w:3.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"ffac (PS)",h:2000000,w:6.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"Nabulasun (PS)",h:2000000,w:4.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"Jo_jpp (PS)",h:2000000,w:5.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"CashfishT (PS)",h:1900000,w:3.9,s:"PokerStars",k:"50NL",b:0.5},
{n:"4IKARNO (PS)",h:1900000,w:0.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"John_les (PS)",h:1900000,w:4.9,s:"PokerStars",k:"50NL",b:0.5},
{n:"c50.b1oom (PS)",h:1900000,w:8.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"nastja336 (PS)",h:1900000,w:7.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"william87872 (PS)",h:1900000,w:3,s:"PokerStars",k:"50NL",b:0.5},
{n:"tolstiyking (PS)",h:1900000,w:2,s:"PokerStars",k:"50NL",b:0.5},
{n:"ilaviiitech (PS)",h:1900000,w:5.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"SumPosad (PS)",h:1900000,w:1.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"chudyand1 (PS)",h:1800000,w:1.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"OlegozzZ (PS)",h:1800000,w:1.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"joker180785 (PS)",h:1800000,w:0.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"m4nifest (PS)",h:1800000,w:2.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"Infusorium (PS)",h:1800000,w:6.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"BSTUSim (PS)",h:1800000,w:4,s:"PokerStars",k:"50NL",b:0.5},
{n:"legendarym4x (PS)",h:1800000,w:1.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"50CandyJoe (PS)",h:1800000,w:4.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"Belvedera (PS)",h:1800000,w:0.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"tallonn88 (PS)",h:1800000,w:0.9,s:"PokerStars",k:"50NL",b:0.5},
{n:"kvitun (PS)",h:1800000,w:5.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"kelele45 (PS)",h:1800000,w:4.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"lulu19911991 (PS)",h:1800000,w:2.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"sophie2000 (PS)",h:1800000,w:3.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"ebashupoker (PS)",h:1800000,w:5.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"anderson_83a (PS)",h:1700000,w:5.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Gluck35 (PS)",h:1700000,w:4.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"LacunaCoil73 (PS)",h:1700000,w:3.6,s:"PokerStars",k:"50NL",b:0.5},
{n:"Kostiko_O (PS)",h:1700000,w:3.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"SerAlGog (PS)",h:1700000,w:4.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"RvPersie (PS)",h:1700000,w:2,s:"PokerStars",k:"50NL",b:0.5},
{n:"mazefaka007 (PS)",h:1700000,w:5.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"HELOTS (PS)",h:1700000,w:5.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"yibo_189 (PS)",h:1700000,w:-1.9,s:"PokerStars",k:"50NL",b:0.5},
{n:"Effort92 (PS)",h:1700000,w:4.2,s:"PokerStars",k:"50NL",b:0.5},
{n:"Dr_Chase_Rus (PS)",h:1700000,w:1.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Dioprest (PS)",h:1600000,w:6.4,s:"PokerStars",k:"50NL",b:0.5},
{n:"fish my nuts (PS)",h:1600000,w:5.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"Xamil666 (PS)",h:1600000,w:3.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"ruslik_by (PS)",h:1600000,w:1.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"skyftw (PS)",h:1600000,w:4.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"GranMaster87 (PS)",h:1600000,w:5.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"edidaz (PS)",h:1600000,w:8.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Sao77 (PS)",h:1600000,w:2.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"MyBestPokeR (PS)",h:1600000,w:5.8,s:"PokerStars",k:"50NL",b:0.5},
{n:"asmodej666 (PS)",h:1600000,w:4.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"zwetok (PS)",h:1600000,w:-0.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"G.HANSEN333 (PS)",h:1600000,w:7,s:"PokerStars",k:"50NL",b:0.5},
{n:"keko gr (PS)",h:1600000,w:-1.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"Muinmyheart (PS)",h:1600000,w:3,s:"PokerStars",k:"50NL",b:0.5},
{n:"7r3m5 (PS)",h:1600000,w:4.7,s:"PokerStars",k:"50NL",b:0.5},
{n:"irc122 (PS)",h:1600000,w:7.5,s:"PokerStars",k:"50NL",b:0.5},
{n:"Red_Warning (PS)",h:1500000,w:2.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"Carpincho77 (PS)",h:1500000,w:-0.1,s:"PokerStars",k:"50NL",b:0.5},
{n:"ac_lecktor (PS)",h:1500000,w:2.3,s:"PokerStars",k:"50NL",b:0.5},
{n:"AlaskaFreeza (WPN)",h:429000,w:1.6,s:"WPN",k:"1000NL",b:10},
{n:"THEREALGONZO (WPN)",h:295000,w:-3.1,s:"WPN",k:"1000NL",b:10},
{n:"ULTIMATEBOT (WPN)",h:268000,w:1.3,s:"WPN",k:"1000NL",b:10},
{n:"Farlopero20 (WPN)",h:256000,w:2.4,s:"WPN",k:"1000NL",b:10},
{n:"Walleater (WPN)",h:242000,w:0.9,s:"WPN",k:"1000NL",b:10},
{n:"PANDAisEVIL (WPN)",h:214000,w:-2.4,s:"WPN",k:"1000NL",b:10},
{n:"KMarkakis (WPN)",h:212000,w:-7.4,s:"WPN",k:"1000NL",b:10},
{n:"Intercooler (WPN)",h:201000,w:-2.6,s:"WPN",k:"1000NL",b:10},
{n:"YallahWallah (WPN)",h:198000,w:4.4,s:"WPN",k:"1000NL",b:10},
{n:"PridvorD (WPN)",h:196000,w:-6.7,s:"WPN",k:"1000NL",b:10},
{n:"TacticalTilt (WPN)",h:194000,w:-5.3,s:"WPN",k:"1000NL",b:10},
{n:"nintendowhiz (WPN)",h:187000,w:-2.8,s:"WPN",k:"1000NL",b:10},
{n:"greendogshin (WPN)",h:184000,w:-2.8,s:"WPN",k:"1000NL",b:10},
{n:"Ovalete (WPN)",h:176000,w:-3.9,s:"WPN",k:"1000NL",b:10},
{n:"EZflip (WPN)",h:169000,w:-13,s:"WPN",k:"1000NL",b:10},
{n:"xplo1t4bl3 (WPN)",h:167000,w:-3.6,s:"WPN",k:"1000NL",b:10},
{n:"_COBKA_PBET_ (WPN)",h:166000,w:-2.4,s:"WPN",k:"1000NL",b:10},
{n:"FantasticMrF0x (WPN)",h:147000,w:-5.4,s:"WPN",k:"1000NL",b:10},
{n:"CHlPTAKE (WPN)",h:145000,w:2.9,s:"WPN",k:"1000NL",b:10},
{n:"Romo99 (WPN)",h:140000,w:5.5,s:"WPN",k:"1000NL",b:10},
{n:"elmatador6969 (WPN)",h:137000,w:0.9,s:"WPN",k:"1000NL",b:10},
{n:"lovedoctor20 (WPN)",h:126000,w:0.9,s:"WPN",k:"1000NL",b:10},
{n:"MrShaman (WPN)",h:126000,w:0.1,s:"WPN",k:"1000NL",b:10},
{n:"DrunkisJeremy (WPN)",h:126000,w:-3.3,s:"WPN",k:"1000NL",b:10},
{n:"NewATM (WPN)",h:125000,w:-5.8,s:"WPN",k:"1000NL",b:10},
{n:"Avalan4 (WPN)",h:123000,w:3.4,s:"WPN",k:"1000NL",b:10},
{n:"Pr.Lupine (WPN)",h:121000,w:-1.4,s:"WPN",k:"1000NL",b:10},
{n:"J0hnMcclean (WPN)",h:113000,w:-3.2,s:"WPN",k:"1000NL",b:10},
{n:"luckyflea1 (WPN)",h:113000,w:-2.4,s:"WPN",k:"1000NL",b:10},
{n:"bonieumiesz (WPN)",h:112000,w:5.1,s:"WPN",k:"1000NL",b:10},
{n:"maybach1 (WPN)",h:112000,w:-4.6,s:"WPN",k:"1000NL",b:10},
{n:"ospiel888 (WPN)",h:111000,w:-2.3,s:"WPN",k:"1000NL",b:10},
{n:"Amancio_017 (WPN)",h:111000,w:-2.8,s:"WPN",k:"1000NL",b:10},
{n:"YoungPretender (WPN)",h:109000,w:-0.9,s:"WPN",k:"1000NL",b:10},
{n:"El Greco XIV (WPN)",h:107000,w:-4.3,s:"WPN",k:"1000NL",b:10},
{n:"truest0ry (WPN)",h:101000,w:3.3,s:"WPN",k:"1000NL",b:10},
{n:"dissidenTT (WPN)",h:100000,w:-0.9,s:"WPN",k:"1000NL",b:10},
{n:"majiincardroom (WPN)",h:99000,w:-0.6,s:"WPN",k:"1000NL",b:10},
{n:"TinyNiceBear (WPN)",h:97000,w:3,s:"WPN",k:"1000NL",b:10},
{n:"SpeedyToitel (WPN)",h:97000,w:0.8,s:"WPN",k:"1000NL",b:10},
{n:"llIIl (WPN)",h:94000,w:-1.9,s:"WPN",k:"1000NL",b:10},
{n:"knifetomeetu (WPN)",h:92000,w:-15.7,s:"WPN",k:"1000NL",b:10},
{n:"SteveSeagal (WPN)",h:92000,w:7,s:"WPN",k:"1000NL",b:10},
{n:"rip_ridge (WPN)",h:92000,w:0.1,s:"WPN",k:"1000NL",b:10},
{n:"IIIIIIIIIIIiii (WPN)",h:90000,w:3.2,s:"WPN",k:"1000NL",b:10},
{n:"NotAHero (WPN)",h:89000,w:-1.8,s:"WPN",k:"1000NL",b:10},
{n:"TheMestresis (WPN)",h:89000,w:-4.7,s:"WPN",k:"1000NL",b:10},
{n:"paSHens (WPN)",h:89000,w:-3.7,s:"WPN",k:"1000NL",b:10},
{n:"SighFold (WPN)",h:88000,w:0.2,s:"WPN",k:"1000NL",b:10},
{n:"JustNoPain (WPN)",h:88000,w:-4.6,s:"WPN",k:"1000NL",b:10},
{n:"NoChickenSong (WPN)",h:88000,w:6.5,s:"WPN",k:"1000NL",b:10},
{n:"AQuiteLuckyGuy (WPN)",h:86000,w:0.3,s:"WPN",k:"1000NL",b:10},
{n:"PiffPavvv (WPN)",h:84000,w:-1,s:"WPN",k:"1000NL",b:10},
{n:"Scott87 (WPN)",h:84000,w:3.6,s:"WPN",k:"1000NL",b:10},
{n:"niceCUPPAtea (WPN)",h:84000,w:-4.4,s:"WPN",k:"1000NL",b:10},
{n:"abolengo (WPN)",h:83000,w:-9.2,s:"WPN",k:"1000NL",b:10},
{n:"singh22 (WPN)",h:82000,w:-0.6,s:"WPN",k:"1000NL",b:10},
{n:"Hardblow (WPN)",h:82000,w:0.5,s:"WPN",k:"1000NL",b:10},
{n:"KOLXO3HuK (WPN)",h:81000,w:2.7,s:"WPN",k:"1000NL",b:10},
{n:"Padishar (WPN)",h:80000,w:-9.7,s:"WPN",k:"1000NL",b:10},
{n:"B1gPoppa (WPN)",h:79000,w:-0.7,s:"WPN",k:"1000NL",b:10},
{n:"Shibooooz (WPN)",h:78000,w:-7.5,s:"WPN",k:"1000NL",b:10},
{n:"httrdc (WPN)",h:78000,w:8.1,s:"WPN",k:"1000NL",b:10},
{n:"DRACKO (WPN)",h:78000,w:2.8,s:"WPN",k:"1000NL",b:10},
{n:"senorseitann (WPN)",h:78000,w:-2.7,s:"WPN",k:"1000NL",b:10},
{n:"HansLanda88 (WPN)",h:77000,w:-6,s:"WPN",k:"1000NL",b:10},
{n:"DarkRoomDonkey (WPN)",h:76000,w:-3.3,s:"WPN",k:"1000NL",b:10},
{n:"MASSACRE_ (WPN)",h:76000,w:-0.7,s:"WPN",k:"1000NL",b:10},
{n:"AdatolTatfo (WPN)",h:75000,w:-10.5,s:"WPN",k:"1000NL",b:10},
{n:"RA2 (WPN)",h:75000,w:-5.4,s:"WPN",k:"1000NL",b:10},
{n:"SpitItOut (WPN)",h:74000,w:-6.9,s:"WPN",k:"1000NL",b:10},
{n:"Juju44 (WPN)",h:72000,w:-17.3,s:"WPN",k:"1000NL",b:10},
{n:"jigga16 (WPN)",h:71000,w:4,s:"WPN",k:"1000NL",b:10},
{n:"ZireaelCiri (WPN)",h:71000,w:2.7,s:"WPN",k:"1000NL",b:10},
{n:"FREDYBULLIT (WPN)",h:70000,w:-10.5,s:"WPN",k:"1000NL",b:10},
{n:"D I E S E L (WPN)",h:69000,w:-0.5,s:"WPN",k:"1000NL",b:10},
{n:"smokinfrogs (WPN)",h:68000,w:1.7,s:"WPN",k:"1000NL",b:10},
{n:"Broozex (WPN)",h:66000,w:-5.3,s:"WPN",k:"1000NL",b:10},
{n:"VeryFairy (WPN)",h:66000,w:-2.8,s:"WPN",k:"1000NL",b:10},
{n:"IgLa (WPN)",h:65000,w:-6.4,s:"WPN",k:"1000NL",b:10},
{n:"elsrutero (WPN)",h:65000,w:5.1,s:"WPN",k:"1000NL",b:10},
{n:"2BTCONRED (WPN)",h:63000,w:2.5,s:"WPN",k:"1000NL",b:10},
{n:"KeepReloading (WPN)",h:63000,w:0.7,s:"WPN",k:"1000NL",b:10},
{n:"glebkovtunov (WPN)",h:62000,w:0.4,s:"WPN",k:"1000NL",b:10},
{n:"Evil_Devil (WPN)",h:61000,w:1.5,s:"WPN",k:"1000NL",b:10},
{n:"HarissaKid (WPN)",h:61000,w:-11.2,s:"WPN",k:"1000NL",b:10},
{n:"RoyaIKush (WPN)",h:61000,w:2.1,s:"WPN",k:"1000NL",b:10},
{n:"GARMONISTIK (WPN)",h:60000,w:-6.2,s:"WPN",k:"1000NL",b:10},
{n:"FlyingStyle (WPN)",h:59000,w:0.4,s:"WPN",k:"1000NL",b:10},
{n:"pokerrr83 (WPN)",h:59000,w:-2.2,s:"WPN",k:"1000NL",b:10},
{n:"DanBrazilian (WPN)",h:58000,w:6.3,s:"WPN",k:"1000NL",b:10},
{n:"MiKiToXXI (WPN)",h:58000,w:-1.6,s:"WPN",k:"1000NL",b:10},
{n:"FknMneyMan (WPN)",h:57000,w:-2,s:"WPN",k:"1000NL",b:10},
{n:"XyLiOne (WPN)",h:57000,w:0.2,s:"WPN",k:"1000NL",b:10},
{n:"KansasCityShfl (WPN)",h:56000,w:2,s:"WPN",k:"1000NL",b:10},
{n:"Yaduboyz (WPN)",h:56000,w:2.9,s:"WPN",k:"1000NL",b:10},
{n:"iQuitTomorrow (WPN)",h:56000,w:-3.7,s:"WPN",k:"1000NL",b:10},
{n:"Sr1Castle (WPN)",h:56000,w:-3.9,s:"WPN",k:"1000NL",b:10},
{n:"AriGold69 (WPN)",h:55000,w:-2.1,s:"WPN",k:"1000NL",b:10},
{n:"WPNHFU (WPN)",h:55000,w:0.3,s:"WPN",k:"1000NL",b:10},
{n:"NumLuckSlevin (WPN)",h:654000,w:5.7,s:"WPN",k:"100NL",b:1},
{n:"revolution_ (WPN)",h:1300000,w:2.7,s:"WPN",k:"100NL",b:1},
{n:"FREDYBULLIT (WPN)",h:240000,w:8.7,s:"WPN",k:"100NL",b:1},
{n:"Olex (WPN)",h:588000,w:2.8,s:"WPN",k:"100NL",b:1},
{n:"mrhappy22 (WPN)",h:211000,w:6.2,s:"WPN",k:"100NL",b:1},
{n:"Casanova71 (WPN)",h:74000,w:16.5,s:"WPN",k:"100NL",b:1},
{n:"edgysolid (WPN)",h:94000,w:10.9,s:"WPN",k:"100NL",b:1},
{n:"strisch (WPN)",h:117000,w:8.3,s:"WPN",k:"100NL",b:1},
{n:"Fruzzzy (WPN)",h:170000,w:5.5,s:"WPN",k:"100NL",b:1},
{n:"kettler26 (WPN)",h:241000,w:3.7,s:"WPN",k:"100NL",b:1},
{n:"Vesemir3 (WPN)",h:125000,w:7.2,s:"WPN",k:"100NL",b:1},
{n:"chicawow (WPN)",h:1200000,w:0.8,s:"WPN",k:"100NL",b:1},
{n:"UnderTheBeer (WPN)",h:284000,w:3,s:"WPN",k:"100NL",b:1},
{n:"haaalk (WPN)",h:101000,w:8.4,s:"WPN",k:"100NL",b:1},
{n:"apchik (WPN)",h:136000,w:6.1,s:"WPN",k:"100NL",b:1},
{n:"DmitryKhomych (WPN)",h:132000,w:6,s:"WPN",k:"100NL",b:1},
{n:"dron0202 (WPN)",h:115000,w:6.8,s:"WPN",k:"100NL",b:1},
{n:"Skdpro (WPN)",h:74000,w:10.4,s:"WPN",k:"100NL",b:1},
{n:"oleOleway (WPN)",h:41000,w:18.6,s:"WPN",k:"100NL",b:1},
{n:"tiamn (WPN)",h:94000,w:8.1,s:"WPN",k:"100NL",b:1},
{n:"VegetablesArentYummy (WPN)",h:327000,w:2.3,s:"WPN",k:"100NL",b:1},
{n:"smokinfrogs (WPN)",h:83000,w:8.3,s:"WPN",k:"100NL",b:1},
{n:"BigRoosterJrod (WPN)",h:459000,w:1.5,s:"WPN",k:"100NL",b:1},
{n:"plaxyRON (WPN)",h:62000,w:10.9,s:"WPN",k:"100NL",b:1},
{n:"TUNABro (WPN)",h:75000,w:9,s:"WPN",k:"100NL",b:1},
{n:"ranger73 (WPN)",h:107000,w:6.3,s:"WPN",k:"100NL",b:1},
{n:"RibbleStripe (WPN)",h:465000,w:1.4,s:"WPN",k:"100NL",b:1},
{n:"SlitherTuft (WPN)",h:56000,w:11.9,s:"WPN",k:"100NL",b:1},
{n:"Motool3 (WPN)",h:37000,w:17.7,s:"WPN",k:"100NL",b:1},
{n:"C00kieTumper (WPN)",h:130000,w:4.9,s:"WPN",k:"100NL",b:1},
{n:"potatoGOD (WPN)",h:149000,w:4.2,s:"WPN",k:"100NL",b:1},
{n:"Whippersnaper (WPN)",h:112000,w:5.5,s:"WPN",k:"100NL",b:1},
{n:"Finenorin (WPN)",h:71000,w:8.5,s:"WPN",k:"100NL",b:1},
{n:"EdgarCayce (WPN)",h:93000,w:6.5,s:"WPN",k:"100NL",b:1},
{n:"djshiggles (WPN)",h:178000,w:3.4,s:"WPN",k:"100NL",b:1},
{n:"CherryBerryUA (WPN)",h:120000,w:5,s:"WPN",k:"100NL",b:1},
{n:"GirlKitty (WPN)",h:65000,w:9.2,s:"WPN",k:"100NL",b:1},
{n:"Gaffed (WPN)",h:101000,w:5.9,s:"WPN",k:"100NL",b:1},
{n:"Dyonez (WPN)",h:71000,w:8,s:"WPN",k:"100NL",b:1},
{n:"Hrepconz (WPN)",h:77000,w:7.3,s:"WPN",k:"100NL",b:1},
{n:"SteerMan11 (WPN)",h:60000,w:9.3,s:"WPN",k:"100NL",b:1},
{n:"chikulya (WPN)",h:108000,w:5,s:"WPN",k:"100NL",b:1},
{n:"TheNormalOne (WPN)",h:49000,w:11,s:"WPN",k:"100NL",b:1},
{n:"satorius (WPN)",h:131000,w:4.1,s:"WPN",k:"100NL",b:1},
{n:"Softera (WPN)",h:33000,w:16.1,s:"WPN",k:"100NL",b:1},
{n:"Choloepus (WPN)",h:85000,w:6.2,s:"WPN",k:"100NL",b:1},
{n:"Geaptin (WPN)",h:48000,w:11.1,s:"WPN",k:"100NL",b:1},
{n:"Xenoglossia (WPN)",h:27000,w:18.9,s:"WPN",k:"100NL",b:1},
{n:"trecomaxi (WPN)",h:51000,w:10.1,s:"WPN",k:"100NL",b:1},
{n:"TorLord (WPN)",h:66000,w:7.8,s:"WPN",k:"100NL",b:1},
{n:"LetMeBluff (WPN)",h:122000,w:4.1,s:"WPN",k:"100NL",b:1},
{n:"meadowlark (WPN)",h:48000,w:10.3,s:"WPN",k:"100NL",b:1},
{n:"MilkAsta (WPN)",h:25000,w:19.9,s:"WPN",k:"100NL",b:1},
{n:"RockBrain (WPN)",h:98000,w:5,s:"WPN",k:"100NL",b:1},
{n:"Bligc (WPN)",h:123000,w:4,s:"WPN",k:"100NL",b:1},
{n:"GameTheory_ (WPN)",h:205000,w:2.3,s:"WPN",k:"100NL",b:1},
{n:"CapShepard (WPN)",h:156000,w:3,s:"WPN",k:"100NL",b:1},
{n:"dpockyyy (WPN)",h:85000,w:5.5,s:"WPN",k:"100NL",b:1},
{n:"selfassurance (WPN)",h:107000,w:4.4,s:"WPN",k:"100NL",b:1},
{n:"Barebux (WPN)",h:113000,w:4.1,s:"WPN",k:"100NL",b:1},
{n:"BirdsDie Alone (WPN)",h:49000,w:9.4,s:"WPN",k:"100NL",b:1},
{n:"STR1SCH (WPN)",h:650000,w:0.7,s:"WPN",k:"100NL",b:1},
{n:"powpow123 (WPN)",h:79000,w:5.7,s:"WPN",k:"100NL",b:1},
{n:"YTbIPOK (WPN)",h:118000,w:3.8,s:"WPN",k:"100NL",b:1},
{n:"LastoPiton (WPN)",h:116000,w:3.8,s:"WPN",k:"100NL",b:1},
{n:"SteinTicko (WPN)",h:24000,w:18.3,s:"WPN",k:"100NL",b:1},
{n:"Jotspryck (WPN)",h:84000,w:5.1,s:"WPN",k:"100NL",b:1},
{n:"cherdark (WPN)",h:151000,w:2.7,s:"WPN",k:"100NL",b:1},
{n:"NoNeedToKnowMe (WPN)",h:155000,w:2.6,s:"WPN",k:"100NL",b:1},
{n:"N0nAkRoN (WPN)",h:18000,w:22.4,s:"WPN",k:"100NL",b:1},
{n:"magswap (WPN)",h:23000,w:16.8,s:"WPN",k:"100NL",b:1},
{n:"lIlllllIlI (WPN)",h:85000,w:4.6,s:"WPN",k:"100NL",b:1},
{n:"angrybeaver24 (WPN)",h:34000,w:11.4,s:"WPN",k:"100NL",b:1},
{n:"Metalsole (WPN)",h:53000,w:7.1,s:"WPN",k:"100NL",b:1},
{n:"bluffer142 (WPN)",h:20000,w:18.3,s:"WPN",k:"100NL",b:1},
{n:"alertzr_ (WPN)",h:21000,w:17.3,s:"WPN",k:"100NL",b:1},
{n:"Polar1z1ng (WPN)",h:137000,w:2.7,s:"WPN",k:"100NL",b:1},
{n:"billyboba112 (WPN)",h:23000,w:15.7,s:"WPN",k:"100NL",b:1},
{n:"Shishune (WPN)",h:22000,w:15.8,s:"WPN",k:"100NL",b:1},
{n:"Ksander (WPN)",h:51000,w:6.7,s:"WPN",k:"100NL",b:1},
{n:"RiderofGhost (WPN)",h:39000,w:8.6,s:"WPN",k:"100NL",b:1},
{n:"FastPaid (WPN)",h:50000,w:6.8,s:"WPN",k:"100NL",b:1},
{n:"PedroDominguez (WPN)",h:25000,w:13.8,s:"WPN",k:"100NL",b:1},
{n:"derolerodesa (WPN)",h:29000,w:11.7,s:"WPN",k:"100NL",b:1},
{n:"WakaFloka (WPN)",h:88000,w:3.8,s:"WPN",k:"100NL",b:1},
{n:"Half9wit (WPN)",h:101000,w:3.3,s:"WPN",k:"100NL",b:1},
{n:"MisterMcCall (WPN)",h:134000,w:2.5,s:"WPN",k:"100NL",b:1},
{n:"ZaKoNaL (WPN)",h:46000,w:7.2,s:"WPN",k:"100NL",b:1},
{n:"DUMBBE11 (WPN)",h:87000,w:3.7,s:"WPN",k:"100NL",b:1},
{n:"Swordstaff (WPN)",h:43000,w:7.5,s:"WPN",k:"100NL",b:1},
{n:"HarrisonFold (WPN)",h:70000,w:4.6,s:"WPN",k:"100NL",b:1},
{n:"NeDovolen (WPN)",h:79000,w:4.1,s:"WPN",k:"100NL",b:1},
{n:"andrey0603 (WPN)",h:31000,w:10.2,s:"WPN",k:"100NL",b:1},
{n:"robinyoutstack (WPN)",h:133000,w:2.4,s:"WPN",k:"100NL",b:1},
{n:"FamcyDamzy (WPN)",h:39000,w:8.1,s:"WPN",k:"100NL",b:1},
{n:"geedorah (WPN)",h:25000,w:12.6,s:"WPN",k:"100NL",b:1},
{n:"dictex2 (WPN)",h:17000,w:18.9,s:"WPN",k:"100NL",b:1},
{n:"samid23 (WPN)",h:51000,w:6.1,s:"WPN",k:"100NL",b:1},
{n:"bigBrained (WPN)",h:37000,w:8.5,s:"WPN",k:"100NL",b:1},
{n:"greatBat (WPN)",h:8600,w:36.2,s:"WPN",k:"100NL",b:1},
{n:"AlaskaFreeza (WPN)",h:294000,w:-1.2,s:"WPN",k:"2000NL",b:20},
{n:"J0hnMcclean (WPN)",h:172000,w:-2.8,s:"WPN",k:"2000NL",b:20},
{n:"THEREALGONZO (WPN)",h:170000,w:-3.8,s:"WPN",k:"2000NL",b:20},
{n:"IIIIIIIIIIIiii (WPN)",h:158000,w:0.4,s:"WPN",k:"2000NL",b:20},
{n:"greendogshin (WPN)",h:122000,w:-5.6,s:"WPN",k:"2000NL",b:20},
{n:"niceCUPPAtea (WPN)",h:107000,w:-5.1,s:"WPN",k:"2000NL",b:20},
{n:"abolengo (WPN)",h:104000,w:3.1,s:"WPN",k:"2000NL",b:20},
{n:"TerminallyIll (WPN)",h:101000,w:-3.7,s:"WPN",k:"2000NL",b:20},
{n:"ULTIMATEBOT (WPN)",h:99000,w:4,s:"WPN",k:"2000NL",b:20},
{n:"xplo1t4bl3 (WPN)",h:93000,w:1.5,s:"WPN",k:"2000NL",b:20},
{n:"lovedoctor20 (WPN)",h:90000,w:7.4,s:"WPN",k:"2000NL",b:20},
{n:"Padishar (WPN)",h:89000,w:-6.9,s:"WPN",k:"2000NL",b:20},
{n:"singh22 (WPN)",h:86000,w:2.3,s:"WPN",k:"2000NL",b:20},
{n:"Ovalete (WPN)",h:82000,w:-5.9,s:"WPN",k:"2000NL",b:20},
{n:"lol voidaments (WPN)",h:81000,w:-1.1,s:"WPN",k:"2000NL",b:20},
{n:"bonieumiesz (WPN)",h:81000,w:1,s:"WPN",k:"2000NL",b:20},
{n:"NoChickenSong (WPN)",h:79000,w:-12.5,s:"WPN",k:"2000NL",b:20},
{n:"ILuvAvrilLavigne91 (WPN)",h:78000,w:5.2,s:"WPN",k:"2000NL",b:20},
{n:"D I E S E L (WPN)",h:76000,w:0,s:"WPN",k:"2000NL",b:20},
{n:"maybach1 (WPN)",h:75000,w:-2.9,s:"WPN",k:"2000NL",b:20},
{n:"EZflip (WPN)",h:74000,w:-9.7,s:"WPN",k:"2000NL",b:20},
{n:"nintendowhiz (WPN)",h:71000,w:-1.4,s:"WPN",k:"2000NL",b:20},
{n:"PANDAisEVIL (WPN)",h:69000,w:-2.2,s:"WPN",k:"2000NL",b:20},
{n:"FantasticMrF0x (WPN)",h:69000,w:3.8,s:"WPN",k:"2000NL",b:20},
{n:"YallahWallah (WPN)",h:67000,w:3.2,s:"WPN",k:"2000NL",b:20},
{n:"jrSuited18 (WPN)",h:66000,w:1.3,s:"WPN",k:"2000NL",b:20},
{n:"Intercooler (WPN)",h:65000,w:-6.4,s:"WPN",k:"2000NL",b:20},
{n:"Burundos254 (WPN)",h:63000,w:-0.8,s:"WPN",k:"2000NL",b:20},
{n:"BeppeBergomi (WPN)",h:63000,w:1.8,s:"WPN",k:"2000NL",b:20},
{n:"TIKITAKA11 (WPN)",h:61000,w:0.8,s:"WPN",k:"2000NL",b:20},
{n:"Pr.Lupine (WPN)",h:60000,w:1.9,s:"WPN",k:"2000NL",b:20},
{n:"StationSteve (WPN)",h:59000,w:-5.2,s:"WPN",k:"2000NL",b:20},
{n:"suckANDdance (WPN)",h:58000,w:-2.1,s:"WPN",k:"2000NL",b:20},
{n:"TheMestresis (WPN)",h:57000,w:-5.9,s:"WPN",k:"2000NL",b:20},
{n:"KMarkakis (WPN)",h:57000,w:-2.1,s:"WPN",k:"2000NL",b:20},
{n:"OhHiMark18 (WPN)",h:56000,w:-3.6,s:"WPN",k:"2000NL",b:20},
{n:"Chuzwizelymaifren (WPN)",h:54000,w:-6.4,s:"WPN",k:"2000NL",b:20},
{n:"_COBKA_PBET_ (WPN)",h:53000,w:-3.7,s:"WPN",k:"2000NL",b:20},
{n:"Hardblow (WPN)",h:52000,w:-5.5,s:"WPN",k:"2000NL",b:20},
{n:"BeInTheUnknown (WPN)",h:52000,w:-5.4,s:"WPN",k:"2000NL",b:20},
{n:"SighFold (WPN)",h:49000,w:-7.2,s:"WPN",k:"2000NL",b:20},
{n:"fearthereaper7 (WPN)",h:48000,w:-2.3,s:"WPN",k:"2000NL",b:20},
{n:"GARMONISTIK (WPN)",h:47000,w:-10.4,s:"WPN",k:"2000NL",b:20},
{n:"Amancio_017 (WPN)",h:47000,w:-6.8,s:"WPN",k:"2000NL",b:20},
{n:"Farlopero20 (WPN)",h:46000,w:-6.3,s:"WPN",k:"2000NL",b:20},
{n:"SpitItOut (WPN)",h:45000,w:-2.7,s:"WPN",k:"2000NL",b:20},
{n:"RealEnough (WPN)",h:45000,w:4.1,s:"WPN",k:"2000NL",b:20},
{n:"PR0DIGY (WPN)",h:45000,w:-10.7,s:"WPN",k:"2000NL",b:20},
{n:"AdatolTatfo (WPN)",h:45000,w:-4.2,s:"WPN",k:"2000NL",b:20},
{n:"OGORRA (WPN)",h:42000,w:-1.5,s:"WPN",k:"2000NL",b:20},
{n:"MAGlC (WPN)",h:41000,w:-7.6,s:"WPN",k:"2000NL",b:20},
{n:"KOLXO3HuK (WPN)",h:40000,w:-8.4,s:"WPN",k:"2000NL",b:20},
{n:"Yaduboyz (WPN)",h:40000,w:-10.7,s:"WPN",k:"2000NL",b:20},
{n:"elmatador6969 (WPN)",h:37000,w:-9.3,s:"WPN",k:"2000NL",b:20},
{n:"SepplBeppl (WPN)",h:36000,w:-1.4,s:"WPN",k:"2000NL",b:20},
{n:"PLO4Ladies (WPN)",h:36000,w:-2.4,s:"WPN",k:"2000NL",b:20},
{n:"Jamesfran69 (WPN)",h:34000,w:-10.6,s:"WPN",k:"2000NL",b:20},
{n:"RealMenRathole (WPN)",h:34000,w:-2.8,s:"WPN",k:"2000NL",b:20},
{n:"JohnMcShen (WPN)",h:33000,w:3,s:"WPN",k:"2000NL",b:20},
{n:"DrunkisJeremy (WPN)",h:33000,w:-6,s:"WPN",k:"2000NL",b:20},
{n:"rip_ridge (WPN)",h:33000,w:-0.8,s:"WPN",k:"2000NL",b:20},
{n:"B1gPoppa (WPN)",h:32000,w:3.2,s:"WPN",k:"2000NL",b:20},
{n:"merovingianZERO (WPN)",h:32000,w:-2.2,s:"WPN",k:"2000NL",b:20},
{n:"lmpala_zOrg (WPN)",h:32000,w:-1.4,s:"WPN",k:"2000NL",b:20},
{n:"rigggedeck (WPN)",h:31000,w:4.6,s:"WPN",k:"2000NL",b:20},
{n:"Right_Hook (WPN)",h:31000,w:-7.4,s:"WPN",k:"2000NL",b:20},
{n:"PridvorD (WPN)",h:31000,w:-6,s:"WPN",k:"2000NL",b:20},
{n:"Evil_Devil (WPN)",h:31000,w:0.2,s:"WPN",k:"2000NL",b:20},
{n:"Gektorrrr (WPN)",h:31000,w:2.6,s:"WPN",k:"2000NL",b:20},
{n:"AleajactaSUCK (WPN)",h:31000,w:13.1,s:"WPN",k:"2000NL",b:20},
{n:"az96 (WPN)",h:31000,w:-2,s:"WPN",k:"2000NL",b:20},
{n:"FlyingStyle (WPN)",h:31000,w:-4.3,s:"WPN",k:"2000NL",b:20},
{n:"otb_red_boss (WPN)",h:31000,w:0.4,s:"WPN",k:"2000NL",b:20},
{n:"NGIM (WPN)",h:31000,w:-15.9,s:"WPN",k:"2000NL",b:20},
{n:"senorseitann (WPN)",h:30000,w:0.8,s:"WPN",k:"2000NL",b:20},
{n:"DRACKO (WPN)",h:30000,w:5.4,s:"WPN",k:"2000NL",b:20},
{n:"Doblou (WPN)",h:30000,w:-4.6,s:"WPN",k:"2000NL",b:20},
{n:"xxemanueleM (WPN)",h:30000,w:3.7,s:"WPN",k:"2000NL",b:20},
{n:"OBORRA (WPN)",h:29000,w:5.2,s:"WPN",k:"2000NL",b:20},
{n:"Juju44 (WPN)",h:29000,w:-22.3,s:"WPN",k:"2000NL",b:20},
{n:"TooManySkunks (WPN)",h:29000,w:4.4,s:"WPN",k:"2000NL",b:20},
{n:"ABSOLUTETOPUP (WPN)",h:29000,w:6.3,s:"WPN",k:"2000NL",b:20},
{n:"Avalan4 (WPN)",h:29000,w:1.2,s:"WPN",k:"2000NL",b:20},
{n:"TacticalTilt (WPN)",h:29000,w:-10.3,s:"WPN",k:"2000NL",b:20},
{n:"2BTCONRED (WPN)",h:28000,w:2.1,s:"WPN",k:"2000NL",b:20},
{n:"AriGold69 (WPN)",h:28000,w:-5.1,s:"WPN",k:"2000NL",b:20},
{n:"ahalaymahalay (WPN)",h:28000,w:1,s:"WPN",k:"2000NL",b:20},
{n:"Mudryk1 (WPN)",h:28000,w:3.2,s:"WPN",k:"2000NL",b:20},
{n:"nutsforme100 (WPN)",h:26000,w:-11.6,s:"WPN",k:"2000NL",b:20},
{n:"Sasi16 (WPN)",h:26000,w:-11.8,s:"WPN",k:"2000NL",b:20},
{n:"RussiansRFish (WPN)",h:26000,w:6.5,s:"WPN",k:"2000NL",b:20},
{n:"RA2 (WPN)",h:26000,w:-5.9,s:"WPN",k:"2000NL",b:20},
{n:"oneplusone (WPN)",h:25000,w:-3.5,s:"WPN",k:"2000NL",b:20},
{n:"abdaubda85 (WPN)",h:25000,w:-9.4,s:"WPN",k:"2000NL",b:20},
{n:"autzen (WPN)",h:25000,w:-55.4,s:"WPN",k:"2000NL",b:20},
{n:"NotAHero (WPN)",h:25000,w:4.6,s:"WPN",k:"2000NL",b:20},
{n:"HoneyBadger557 (WPN)",h:25000,w:6.3,s:"WPN",k:"2000NL",b:20},
{n:"Walleater (WPN)",h:24000,w:-2.9,s:"WPN",k:"2000NL",b:20},
{n:"1BTC (WPN)",h:24000,w:4.3,s:"WPN",k:"2000NL",b:20},
{n:"luckyflea1 (WPN)",h:24000,w:0.6,s:"WPN",k:"2000NL",b:20},
{n:"AironVega (WPN)",h:2300000,w:-3.4,s:"WPN",k:"200NL",b:2},
{n:"IgLa (WPN)",h:1500000,w:-2.9,s:"WPN",k:"200NL",b:2},
{n:"StillLearn (WPN)",h:1200000,w:-4.1,s:"WPN",k:"200NL",b:2},
{n:"FREDYBULLIT (WPN)",h:1100000,w:-2.8,s:"WPN",k:"200NL",b:2},
{n:"Parcker (WPN)",h:773000,w:-2.4,s:"WPN",k:"200NL",b:2},
{n:"RockBrain (WPN)",h:649000,w:2.6,s:"WPN",k:"200NL",b:2},
{n:"ospiel888 (WPN)",h:639000,w:-2.5,s:"WPN",k:"200NL",b:2},
{n:"chicawow (WPN)",h:598000,w:0.6,s:"WPN",k:"200NL",b:2},
{n:"kettler26 (WPN)",h:564000,w:-0.5,s:"WPN",k:"200NL",b:2},
{n:"PayNCry (WPN)",h:535000,w:2.6,s:"WPN",k:"200NL",b:2},
{n:"CBuHKa (WPN)",h:530000,w:-5.3,s:"WPN",k:"200NL",b:2},
{n:"D1sbaLance (WPN)",h:527000,w:0.6,s:"WPN",k:"200NL",b:2},
{n:"Pyjamasparty (WPN)",h:500000,w:-3,s:"WPN",k:"200NL",b:2},
{n:"Archetype (WPN)",h:499000,w:4.5,s:"WPN",k:"200NL",b:2},
{n:"Vakabulyator (WPN)",h:487000,w:-3.1,s:"WPN",k:"200NL",b:2},
{n:"eraducanu (WPN)",h:467000,w:-2.2,s:"WPN",k:"200NL",b:2},
{n:"gevgev1 (WPN)",h:453000,w:0.7,s:"WPN",k:"200NL",b:2},
{n:"OneLastDepo (WPN)",h:439000,w:-1.5,s:"WPN",k:"200NL",b:2},
{n:"Jeberiel (WPN)",h:437000,w:-5.5,s:"WPN",k:"200NL",b:2},
{n:"vexatory (WPN)",h:427000,w:3,s:"WPN",k:"200NL",b:2},
{n:"VegetablesArentYummy (WPN)",h:410000,w:-2.4,s:"WPN",k:"200NL",b:2},
{n:"Marito32 (WPN)",h:398000,w:-1.6,s:"WPN",k:"200NL",b:2},
{n:"JustNoPain (WPN)",h:356000,w:-4.2,s:"WPN",k:"200NL",b:2},
{n:"Ice Bank Mice Elf (WPN)",h:353000,w:-7.8,s:"WPN",k:"200NL",b:2},
{n:"revolution_ (WPN)",h:348000,w:0.3,s:"WPN",k:"200NL",b:2},
{n:"IngoderTrucker (WPN)",h:346000,w:1.9,s:"WPN",k:"200NL",b:2},
{n:"Maze23 (WPN)",h:335000,w:-2.5,s:"WPN",k:"200NL",b:2},
{n:"Olex (WPN)",h:333000,w:0.3,s:"WPN",k:"200NL",b:2},
{n:"NLCHAKRA (WPN)",h:321000,w:0.2,s:"WPN",k:"200NL",b:2},
{n:"Bluff67 (WPN)",h:306000,w:-0.3,s:"WPN",k:"200NL",b:2},
{n:"MrInstaCall (WPN)",h:282000,w:-3.8,s:"WPN",k:"200NL",b:2},
{n:"burumburumVAV (WPN)",h:278000,w:-1.4,s:"WPN",k:"200NL",b:2},
{n:"Zemorteiro (WPN)",h:270000,w:-2.9,s:"WPN",k:"200NL",b:2},
{n:"Zorr0 (WPN)",h:268000,w:-3.5,s:"WPN",k:"200NL",b:2},
{n:"322xxx (WPN)",h:264000,w:-2.8,s:"WPN",k:"200NL",b:2},
{n:"Vulcanos (WPN)",h:260000,w:-1.7,s:"WPN",k:"200NL",b:2},
{n:"362362 (WPN)",h:256000,w:-5.7,s:"WPN",k:"200NL",b:2},
{n:"PiffPavvv (WPN)",h:255000,w:2,s:"WPN",k:"200NL",b:2},
{n:"KillJoy69 (WPN)",h:247000,w:-1.3,s:"WPN",k:"200NL",b:2},
{n:"PappaHappa (WPN)",h:240000,w:-3,s:"WPN",k:"200NL",b:2},
{n:"ChlapZdar (WPN)",h:233000,w:-3.2,s:"WPN",k:"200NL",b:2},
{n:"Drac4 (WPN)",h:220000,w:0.5,s:"WPN",k:"200NL",b:2},
{n:"San1tr0n (WPN)",h:219000,w:-0.7,s:"WPN",k:"200NL",b:2},
{n:"ceed1g (WPN)",h:217000,w:1.6,s:"WPN",k:"200NL",b:2},
{n:"Showtime87 (WPN)",h:217000,w:0.4,s:"WPN",k:"200NL",b:2},
{n:"Mokraya Psina (WPN)",h:206000,w:-0.6,s:"WPN",k:"200NL",b:2},
{n:"ludomen (WPN)",h:199000,w:3.6,s:"WPN",k:"200NL",b:2},
{n:"Garadski (WPN)",h:199000,w:-3.7,s:"WPN",k:"200NL",b:2},
{n:"NoEmotions11 (WPN)",h:197000,w:-3.4,s:"WPN",k:"200NL",b:2},
{n:"Dead Moroz (WPN)",h:196000,w:-3.9,s:"WPN",k:"200NL",b:2},
{n:"EMPOWERER (WPN)",h:195000,w:0.6,s:"WPN",k:"200NL",b:2},
{n:"KeepReloading (WPN)",h:192000,w:-4.5,s:"WPN",k:"200NL",b:2},
{n:"OOGWAY91 (WPN)",h:186000,w:1.3,s:"WPN",k:"200NL",b:2},
{n:"Arunachala (WPN)",h:184000,w:-2.9,s:"WPN",k:"200NL",b:2},
{n:"cherdark (WPN)",h:177000,w:1.9,s:"WPN",k:"200NL",b:2},
{n:"LaBuenaVida (WPN)",h:173000,w:-0.5,s:"WPN",k:"200NL",b:2},
{n:"YelloWallet (WPN)",h:172000,w:-8.1,s:"WPN",k:"200NL",b:2},
{n:"Nikityrik (WPN)",h:171000,w:-2.7,s:"WPN",k:"200NL",b:2},
{n:"O11235813 (WPN)",h:171000,w:1.9,s:"WPN",k:"200NL",b:2},
{n:"smokinfrogs (WPN)",h:169000,w:10,s:"WPN",k:"200NL",b:2},
{n:"pyka 6ora (WPN)",h:168000,w:5.8,s:"WPN",k:"200NL",b:2},
{n:"Kev3001 (WPN)",h:164000,w:1,s:"WPN",k:"200NL",b:2},
{n:"Frankie3377 (WPN)",h:161000,w:4.1,s:"WPN",k:"200NL",b:2},
{n:"ExploitBoss (WPN)",h:161000,w:-2.3,s:"WPN",k:"200NL",b:2},
{n:"3bet5bet (WPN)",h:159000,w:1.3,s:"WPN",k:"200NL",b:2},
{n:"RingoKing (WPN)",h:151000,w:0.7,s:"WPN",k:"200NL",b:2},
{n:"satorius (WPN)",h:151000,w:-0.7,s:"WPN",k:"200NL",b:2},
{n:"WilleZurmacht (WPN)",h:149000,w:2.3,s:"WPN",k:"200NL",b:2},
{n:"SanchoPunter (WPN)",h:147000,w:1,s:"WPN",k:"200NL",b:2},
{n:"crusher321 (WPN)",h:142000,w:10.9,s:"WPN",k:"200NL",b:2},
{n:"BukhnoG83 (WPN)",h:140000,w:-1.4,s:"WPN",k:"200NL",b:2},
{n:"Salsichaa (WPN)",h:140000,w:-3.5,s:"WPN",k:"200NL",b:2},
{n:"Endbringer (WPN)",h:138000,w:0.1,s:"WPN",k:"200NL",b:2},
{n:"StudyBTC (WPN)",h:137000,w:-2.4,s:"WPN",k:"200NL",b:2},
{n:"Walk1ngD1saster (WPN)",h:135000,w:-2.4,s:"WPN",k:"200NL",b:2},
{n:"rickhunter01 (WPN)",h:134000,w:-15.6,s:"WPN",k:"200NL",b:2},
{n:"mrhappy22 (WPN)",h:133000,w:7.5,s:"WPN",k:"200NL",b:2},
{n:"Go0dKicker (WPN)",h:130000,w:-0.6,s:"WPN",k:"200NL",b:2},
{n:"Bumbak (WPN)",h:129000,w:-1.6,s:"WPN",k:"200NL",b:2},
{n:"RibbleStripe (WPN)",h:125000,w:-1.1,s:"WPN",k:"200NL",b:2},
{n:"SamuelAmaro (WPN)",h:125000,w:1.9,s:"WPN",k:"200NL",b:2},
{n:"chaopen (WPN)",h:123000,w:2.5,s:"WPN",k:"200NL",b:2},
{n:"BallisticNuts (WPN)",h:123000,w:-4.9,s:"WPN",k:"200NL",b:2},
{n:"Sasha4 (WPN)",h:122000,w:0.1,s:"WPN",k:"200NL",b:2},
{n:"Cartulino (WPN)",h:121000,w:-1.6,s:"WPN",k:"200NL",b:2},
{n:"SHER1FFmd (WPN)",h:120000,w:-0.8,s:"WPN",k:"200NL",b:2},
{n:"MONAXOGIOS (WPN)",h:114000,w:2.4,s:"WPN",k:"200NL",b:2},
{n:"iRealist (WPN)",h:114000,w:5.5,s:"WPN",k:"200NL",b:2},
{n:"DManolo (WPN)",h:113000,w:4.3,s:"WPN",k:"200NL",b:2},
{n:"plamia79 (WPN)",h:111000,w:-0.9,s:"WPN",k:"200NL",b:2},
{n:"djshiggles (WPN)",h:111000,w:4.8,s:"WPN",k:"200NL",b:2},
{n:"_EV_ (WPN)",h:111000,w:-4.3,s:"WPN",k:"200NL",b:2},
{n:"twotwotwo (WPN)",h:108000,w:-2.7,s:"WPN",k:"200NL",b:2},
{n:"gib0n (WPN)",h:107000,w:0.2,s:"WPN",k:"200NL",b:2},
{n:"klairpipe (WPN)",h:107000,w:1.2,s:"WPN",k:"200NL",b:2},
{n:"1548756 (WPN)",h:107000,w:-1.1,s:"WPN",k:"200NL",b:2},
{n:"UnderratedKid (WPN)",h:107000,w:-8.3,s:"WPN",k:"200NL",b:2},
{n:"BigRoosterJrod (WPN)",h:104000,w:-0.7,s:"WPN",k:"200NL",b:2},
{n:"ImplicitG (WPN)",h:104000,w:1,s:"WPN",k:"200NL",b:2},
{n:"Universum88 (WPN)",h:104000,w:2.1,s:"WPN",k:"200NL",b:2},
{n:"Archetype (WPN)",h:281000,w:5.1,s:"WPN",k:"400-600NL",b:5},
{n:"EMPOWERER (WPN)",h:179000,w:8.7,s:"WPN",k:"400-600NL",b:5},
{n:"THEREALGONZO (WPN)",h:173000,w:7.1,s:"WPN",k:"400-600NL",b:5},
{n:"WhalenSmithers (WPN)",h:63000,w:15.3,s:"WPN",k:"400-600NL",b:5},
{n:"ilovebiggy1 (WPN)",h:77000,w:11.1,s:"WPN",k:"400-600NL",b:5},
{n:"IhasUbeat (WPN)",h:84000,w:10.4,s:"WPN",k:"400-600NL",b:5},
{n:"igarexa13 (WPN)",h:108000,w:8.5,s:"WPN",k:"400-600NL",b:5},
{n:"Walleater (WPN)",h:120000,w:5.6,s:"WPN",k:"400-600NL",b:5},
{n:"luxpoker (WPN)",h:86000,w:9.8,s:"WPN",k:"400-600NL",b:5},
{n:"ULTIMATEBOT (WPN)",h:86000,w:6.8,s:"WPN",k:"400-600NL",b:5},
{n:"eRa-Pechkin (WPN)",h:52000,w:13.5,s:"WPN",k:"400-600NL",b:5},
{n:"KlayDontPlay (WPN)",h:46000,w:14.4,s:"WPN",k:"400-600NL",b:5},
{n:"newBushido_ (WPN)",h:90000,w:5.8,s:"WPN",k:"400-600NL",b:5},
{n:"MODROST (WPN)",h:104000,w:5.6,s:"WPN",k:"400-600NL",b:5},
{n:"Villeroi (WPN)",h:114000,w:5,s:"WPN",k:"400-600NL",b:5},
{n:"NutsBetOnly (WPN)",h:38000,w:11.8,s:"WPN",k:"400-600NL",b:5},
{n:"RockBrain (WPN)",h:60000,w:11.1,s:"WPN",k:"400-600NL",b:5},
{n:"LuckyRiver2330 (WPN)",h:34000,w:18.3,s:"WPN",k:"400-600NL",b:5},
{n:"Rynaldo900 (WPN)",h:57000,w:7.6,s:"WPN",k:"400-600NL",b:5},
{n:"cedar2828 (WPN)",h:16000,w:29.5,s:"WPN",k:"400-600NL",b:5},
{n:"rekop74 (WPN)",h:43000,w:10.5,s:"WPN",k:"400-600NL",b:5},
{n:"ILoveRoeland2 (WPN)",h:14000,w:28.1,s:"WPN",k:"400-600NL",b:5},
{n:"OOGWAY91 (WPN)",h:181000,w:3.1,s:"WPN",k:"400-600NL",b:5},
{n:"opaitahon (WPN)",h:123000,w:4.3,s:"WPN",k:"400-600NL",b:5},
{n:"crusher321 (WPN)",h:94000,w:2.9,s:"WPN",k:"400-600NL",b:5},
{n:"HCP17PRO (WPN)",h:157000,w:3.5,s:"WPN",k:"400-600NL",b:5},
{n:"Casemiro6 (WPN)",h:32000,w:11.4,s:"WPN",k:"400-600NL",b:5},
{n:"LazyFish (WPN)",h:76000,w:5.1,s:"WPN",k:"400-600NL",b:5},
{n:"Anastasia31 (WPN)",h:119000,w:3.8,s:"WPN",k:"400-600NL",b:5},
{n:"rip_ridge (WPN)",h:103000,w:4.5,s:"WPN",k:"400-600NL",b:5},
{n:"blackchip100 (WPN)",h:13000,w:27.3,s:"WPN",k:"400-600NL",b:5},
{n:"SosiKirpich (WPN)",h:26000,w:16.8,s:"WPN",k:"400-600NL",b:5},
{n:"PANDAisEVIL (WPN)",h:159000,w:2.5,s:"WPN",k:"400-600NL",b:5},
{n:"DeathProph3t (WPN)",h:37000,w:11.7,s:"WPN",k:"400-600NL",b:5},
{n:"greendogshin (WPN)",h:46000,w:8.4,s:"WPN",k:"400-600NL",b:5},
{n:"MrShaman (WPN)",h:333000,w:1.4,s:"WPN",k:"400-600NL",b:5},
{n:"DegenFarmsLLC (WPN)",h:34000,w:8.2,s:"WPN",k:"400-600NL",b:5},
{n:"IHateCider (WPN)",h:54000,w:7,s:"WPN",k:"400-600NL",b:5},
{n:"Tierolis (WPN)",h:45000,w:9.5,s:"WPN",k:"400-600NL",b:5},
{n:"Opally (WPN)",h:73000,w:5.5,s:"WPN",k:"400-600NL",b:5},
{n:"WSOPME2055 (WPN)",h:168000,w:1.8,s:"WPN",k:"400-600NL",b:5},
{n:"frierenn (WPN)",h:111000,w:4.3,s:"WPN",k:"400-600NL",b:5},
{n:"Stefan11222 (WPN)",h:40000,w:7.9,s:"WPN",k:"400-600NL",b:5},
{n:"hubpubpub (WPN)",h:188000,w:2.2,s:"WPN",k:"400-600NL",b:5},
{n:"Arwizz (WPN)",h:30000,w:11.4,s:"WPN",k:"400-600NL",b:5},
{n:"DanBrazilian (WPN)",h:60000,w:4.4,s:"WPN",k:"400-600NL",b:5},
{n:"PridvorD (WPN)",h:346000,w:0.7,s:"WPN",k:"400-600NL",b:5},
{n:"CkaNNonBaLL (WPN)",h:40000,w:9.9,s:"WPN",k:"400-600NL",b:5},
{n:"Weazel1991 (WPN)",h:34000,w:8.5,s:"WPN",k:"400-600NL",b:5},
{n:"BrummDr92 (WPN)",h:64000,w:5.5,s:"WPN",k:"400-600NL",b:5},
{n:"eazyurb (WPN)",h:29000,w:10.5,s:"WPN",k:"400-600NL",b:5},
{n:"truE_m0nka (WPN)",h:24000,w:10.8,s:"WPN",k:"400-600NL",b:5},
{n:"Liluu (WPN)",h:37000,w:7.9,s:"WPN",k:"400-600NL",b:5},
{n:"MikeNolezy (WPN)",h:15000,w:18.7,s:"WPN",k:"400-600NL",b:5},
{n:"MendessX (WPN)",h:23000,w:13,s:"WPN",k:"400-600NL",b:5},
{n:"ProtocolFantom (WPN)",h:40000,w:8.4,s:"WPN",k:"400-600NL",b:5},
{n:"Antonella1973 (WPN)",h:80000,w:3.2,s:"WPN",k:"400-600NL",b:5},
{n:"psij3kie (WPN)",h:17000,w:14.9,s:"WPN",k:"400-600NL",b:5},
{n:"D1sbaLance (WPN)",h:51000,w:6.7,s:"WPN",k:"400-600NL",b:5},
{n:"martimc (WPN)",h:23000,w:12.4,s:"WPN",k:"400-600NL",b:5},
{n:"bonieumiesz (WPN)",h:46000,w:5.3,s:"WPN",k:"400-600NL",b:5},
{n:"PiffPavvv (WPN)",h:211000,w:1.8,s:"WPN",k:"400-600NL",b:5},
{n:"LarryDavidBowie (WPN)",h:19000,w:13,s:"WPN",k:"400-600NL",b:5},
{n:"Pump4ndDump20 (WPN)",h:32000,w:8.7,s:"WPN",k:"400-600NL",b:5},
{n:"babayagaaa (WPN)",h:64000,w:5.2,s:"WPN",k:"400-600NL",b:5},
{n:"JogaAgora (WPN)",h:41000,w:6.2,s:"WPN",k:"400-600NL",b:5},
{n:"Darks1de19 (WPN)",h:37000,w:7.4,s:"WPN",k:"400-600NL",b:5},
{n:"Xorkoth (WPN)",h:20000,w:12.8,s:"WPN",k:"400-600NL",b:5},
{n:"EugeneK (WPN)",h:6000,w:35.7,s:"WPN",k:"400-600NL",b:5},
{n:"DonButtON (WPN)",h:62000,w:4.5,s:"WPN",k:"400-600NL",b:5},
{n:"SellHood (WPN)",h:16000,w:15.7,s:"WPN",k:"400-600NL",b:5},
{n:"damns23 (WPN)",h:73000,w:3.6,s:"WPN",k:"400-600NL",b:5},
{n:"NoNeedToKnowMe (WPN)",h:38000,w:8.5,s:"WPN",k:"400-600NL",b:5},
{n:"NightF0xx (WPN)",h:36000,w:7.6,s:"WPN",k:"400-600NL",b:5},
{n:"bluechickadee (WPN)",h:31000,w:9.2,s:"WPN",k:"400-600NL",b:5},
{n:"smokinfrogs (WPN)",h:370000,w:0.2,s:"WPN",k:"400-600NL",b:5},
{n:"VitoDisfrutoni (WPN)",h:31000,w:8.9,s:"WPN",k:"400-600NL",b:5},
{n:"_COBKA_PBET_ (WPN)",h:102000,w:1.3,s:"WPN",k:"400-600NL",b:5},
{n:"Zavorotny (WPN)",h:36000,w:5.6,s:"WPN",k:"400-600NL",b:5},
{n:"Imagine8 (WPN)",h:11000,w:31.1,s:"WPN",k:"400-600NL",b:5},
{n:"Bainez2020 (WPN)",h:17000,w:19.8,s:"WPN",k:"400-600NL",b:5},
{n:"Nimble123 (WPN)",h:54000,w:4,s:"WPN",k:"400-600NL",b:5},
{n:"HappyMorning (WPN)",h:76000,w:4.3,s:"WPN",k:"400-600NL",b:5},
{n:"RNGeesus (WPN)",h:46000,w:4.6,s:"WPN",k:"400-600NL",b:5},
{n:"Intercooler (WPN)",h:84000,w:3,s:"WPN",k:"400-600NL",b:5},
{n:"BananaMilkshak (WPN)",h:32000,w:9.7,s:"WPN",k:"400-600NL",b:5},
{n:"lovemeplz (WPN)",h:78000,w:4.3,s:"WPN",k:"400-600NL",b:5},
{n:"PArTyLIKE1999 (WPN)",h:11000,w:27.4,s:"WPN",k:"400-600NL",b:5},
{n:"RiseAboveIt (WPN)",h:30000,w:10.6,s:"WPN",k:"400-600NL",b:5},
{n:"Markudjik (WPN)",h:21000,w:9.7,s:"WPN",k:"400-600NL",b:5},
{n:"Horizont (WPN)",h:16000,w:12.5,s:"WPN",k:"400-600NL",b:5},
{n:"Limwonster (WPN)",h:17000,w:14.3,s:"WPN",k:"400-600NL",b:5},
{n:"DogOfWar1 (WPN)",h:15000,w:15,s:"WPN",k:"400-600NL",b:5},
{n:"Hhouri39 (WPN)",h:13000,w:20.6,s:"WPN",k:"400-600NL",b:5},
{n:"MiKiToXXI (WPN)",h:8200,w:24.2,s:"WPN",k:"400-600NL",b:5},
{n:"DDCrow (WPN)",h:9400,w:24.4,s:"WPN",k:"400-600NL",b:5},
{n:"kingE12 (WPN)",h:10000,w:25.3,s:"WPN",k:"400-600NL",b:5},
{n:"wazzo11 (WPN)",h:84000,w:3.8,s:"WPN",k:"400-600NL",b:5},
{n:"Drop Apollo (WPN)",h:3800,w:50.4,s:"WPN",k:"400-600NL",b:5},
{n:"GranJugadaPiti (WPN)",h:12000,w:18.7,s:"WPN",k:"400-600NL",b:5},
{n:"revolution_ (WPN)",h:835000,w:2.6,s:"WPN",k:"50NL",b:0.5},
{n:"H1GHJACK (WPN)",h:809000,w:0.6,s:"WPN",k:"50NL",b:0.5},
{n:"Zembo (WPN)",h:804000,w:-2.6,s:"WPN",k:"50NL",b:0.5},
{n:"NumLuckSlevin (WPN)",h:668000,w:7,s:"WPN",k:"50NL",b:0.5},
{n:"Dead Moroz (WPN)",h:618000,w:-0.1,s:"WPN",k:"50NL",b:0.5},
{n:"metared (WPN)",h:590000,w:0.2,s:"WPN",k:"50NL",b:0.5},
{n:"Sometwo (WPN)",h:560000,w:4.8,s:"WPN",k:"50NL",b:0.5},
{n:"ZHComstok (WPN)",h:494000,w:-0.6,s:"WPN",k:"50NL",b:0.5},
{n:"Assakcuro (WPN)",h:481000,w:-2,s:"WPN",k:"50NL",b:0.5},
{n:"ciscodisco (WPN)",h:480000,w:-1.8,s:"WPN",k:"50NL",b:0.5},
{n:"STR1SCH (WPN)",h:474000,w:2.8,s:"WPN",k:"50NL",b:0.5},
{n:"zepequeno33 (WPN)",h:421000,w:0.5,s:"WPN",k:"50NL",b:0.5},
{n:"Xardas444 (WPN)",h:416000,w:-1,s:"WPN",k:"50NL",b:0.5},
{n:"extra6alactic (WPN)",h:400000,w:6.3,s:"WPN",k:"50NL",b:0.5},
{n:"MeatTruck (WPN)",h:395000,w:-2.5,s:"WPN",k:"50NL",b:0.5},
{n:"Ncendell (WPN)",h:374000,w:-3.8,s:"WPN",k:"50NL",b:0.5},
{n:"1sat (WPN)",h:320000,w:-1.6,s:"WPN",k:"50NL",b:0.5},
{n:"CBuHKa (WPN)",h:317000,w:-0.9,s:"WPN",k:"50NL",b:0.5},
{n:"pushup7 (WPN)",h:311000,w:-3.1,s:"WPN",k:"50NL",b:0.5},
{n:"topdrift (WPN)",h:306000,w:-0.4,s:"WPN",k:"50NL",b:0.5},
{n:"Whydah142 (WPN)",h:299000,w:5.2,s:"WPN",k:"50NL",b:0.5},
{n:"Lepusis (WPN)",h:296000,w:-3.9,s:"WPN",k:"50NL",b:0.5},
{n:"DIMATTE0 (WPN)",h:268000,w:2,s:"WPN",k:"50NL",b:0.5},
{n:"VetervLico (WPN)",h:263000,w:3.3,s:"WPN",k:"50NL",b:0.5},
{n:"AlexSexy (WPN)",h:259000,w:-4.1,s:"WPN",k:"50NL",b:0.5},
{n:"mr.fargo (WPN)",h:257000,w:-5.3,s:"WPN",k:"50NL",b:0.5},
{n:"nuacho (WPN)",h:245000,w:-1,s:"WPN",k:"50NL",b:0.5},
{n:"ERASER (WPN)",h:245000,w:4.8,s:"WPN",k:"50NL",b:0.5},
{n:"Ice Bank Mice Elf (WPN)",h:240000,w:-5.3,s:"WPN",k:"50NL",b:0.5},
{n:"BurnB4byBurn (WPN)",h:239000,w:-1.8,s:"WPN",k:"50NL",b:0.5},
{n:"SpyFace (WPN)",h:235000,w:3.5,s:"WPN",k:"50NL",b:0.5},
{n:"Yarmel (WPN)",h:235000,w:6.7,s:"WPN",k:"50NL",b:0.5},
{n:"Endbringer (WPN)",h:235000,w:-3.1,s:"WPN",k:"50NL",b:0.5},
{n:"PayNCry (WPN)",h:234000,w:-2.3,s:"WPN",k:"50NL",b:0.5},
{n:"WilleZurmacht (WPN)",h:226000,w:-0.4,s:"WPN",k:"50NL",b:0.5},
{n:"Garadski (WPN)",h:225000,w:-3.3,s:"WPN",k:"50NL",b:0.5},
{n:"strisch (WPN)",h:221000,w:7.9,s:"WPN",k:"50NL",b:0.5},
{n:"sardiuslight (WPN)",h:217000,w:3.6,s:"WPN",k:"50NL",b:0.5},
{n:"beautifulLie (WPN)",h:214000,w:10.8,s:"WPN",k:"50NL",b:0.5},
{n:"Blistein (WPN)",h:213000,w:0.7,s:"WPN",k:"50NL",b:0.5},
{n:"Ue1989 (WPN)",h:213000,w:3.7,s:"WPN",k:"50NL",b:0.5},
{n:"slessar (WPN)",h:209000,w:2.2,s:"WPN",k:"50NL",b:0.5},
{n:"Oniks13 (WPN)",h:203000,w:3.4,s:"WPN",k:"50NL",b:0.5},
{n:"Fumizja (WPN)",h:200000,w:-1.4,s:"WPN",k:"50NL",b:0.5},
{n:"Parcker (WPN)",h:200000,w:-2.1,s:"WPN",k:"50NL",b:0.5},
{n:"Lucky Monkey tilt (WPN)",h:194000,w:7.2,s:"WPN",k:"50NL",b:0.5},
{n:"FirstClan (WPN)",h:193000,w:-1.9,s:"WPN",k:"50NL",b:0.5},
{n:"MoneuIN (WPN)",h:193000,w:-4.2,s:"WPN",k:"50NL",b:0.5},
{n:"20180ttt (WPN)",h:189000,w:5.9,s:"WPN",k:"50NL",b:0.5},
{n:"PeacefulZ (WPN)",h:189000,w:3.4,s:"WPN",k:"50NL",b:0.5},
{n:"Luckcatcher1 (WPN)",h:187000,w:0.9,s:"WPN",k:"50NL",b:0.5},
{n:"BadIntensions (WPN)",h:183000,w:-1.4,s:"WPN",k:"50NL",b:0.5},
{n:"antibot (WPN)",h:178000,w:-6.4,s:"WPN",k:"50NL",b:0.5},
{n:"Edgedancer (WPN)",h:174000,w:4.2,s:"WPN",k:"50NL",b:0.5},
{n:"BootyKingdom (WPN)",h:174000,w:-5.3,s:"WPN",k:"50NL",b:0.5},
{n:"theeagle1 (WPN)",h:173000,w:-2.2,s:"WPN",k:"50NL",b:0.5},
{n:"Ignacioz (WPN)",h:172000,w:-4,s:"WPN",k:"50NL",b:0.5},
{n:"Slogger (WPN)",h:172000,w:-0.2,s:"WPN",k:"50NL",b:0.5},
{n:"NonnoPalmiro (WPN)",h:168000,w:-3.1,s:"WPN",k:"50NL",b:0.5},
{n:"Freshman13 (WPN)",h:167000,w:0.1,s:"WPN",k:"50NL",b:0.5},
{n:"Oldbob67 (WPN)",h:166000,w:1.8,s:"WPN",k:"50NL",b:0.5},
{n:"Elmoo334 (WPN)",h:166000,w:2.4,s:"WPN",k:"50NL",b:0.5},
{n:"Pyjamasparty (WPN)",h:165000,w:-3.1,s:"WPN",k:"50NL",b:0.5},
{n:"Pirataria (WPN)",h:162000,w:0.3,s:"WPN",k:"50NL",b:0.5},
{n:"BuldogLoverr (WPN)",h:161000,w:2,s:"WPN",k:"50NL",b:0.5},
{n:"Olex (WPN)",h:157000,w:-0.5,s:"WPN",k:"50NL",b:0.5},
{n:"IgLa (WPN)",h:156000,w:0.6,s:"WPN",k:"50NL",b:0.5},
{n:"BATLsamara (WPN)",h:152000,w:0.1,s:"WPN",k:"50NL",b:0.5},
{n:"SmileMFSmile (WPN)",h:145000,w:1.7,s:"WPN",k:"50NL",b:0.5},
{n:"OrthodoxPush (WPN)",h:144000,w:-0.8,s:"WPN",k:"50NL",b:0.5},
{n:"LuckyAceK (WPN)",h:142000,w:-1.3,s:"WPN",k:"50NL",b:0.5},
{n:"BaboonIRL (WPN)",h:140000,w:-0.2,s:"WPN",k:"50NL",b:0.5},
{n:"DmitryKhomych (WPN)",h:139000,w:4.6,s:"WPN",k:"50NL",b:0.5},
{n:"powpow123 (WPN)",h:139000,w:1.8,s:"WPN",k:"50NL",b:0.5},
{n:"mr.Anderson (WPN)",h:138000,w:-4,s:"WPN",k:"50NL",b:0.5},
{n:"LikeFlea (WPN)",h:136000,w:-2.1,s:"WPN",k:"50NL",b:0.5},
{n:"SpringheelJack (WPN)",h:136000,w:5.4,s:"WPN",k:"50NL",b:0.5},
{n:"A338v2msl (WPN)",h:132000,w:1,s:"WPN",k:"50NL",b:0.5},
{n:"RibbleStripe (WPN)",h:130000,w:2.1,s:"WPN",k:"50NL",b:0.5},
{n:"ReDumBell (WPN)",h:128000,w:-2.7,s:"WPN",k:"50NL",b:0.5},
{n:"Populardiva (WPN)",h:123000,w:3.1,s:"WPN",k:"50NL",b:0.5},
{n:"Rulesforfuulz (WPN)",h:122000,w:1.8,s:"WPN",k:"50NL",b:0.5},
{n:"thisisabook (WPN)",h:122000,w:-0.6,s:"WPN",k:"50NL",b:0.5},
{n:"ydys98 (WPN)",h:122000,w:-1.4,s:"WPN",k:"50NL",b:0.5},
{n:"Glock18 (WPN)",h:119000,w:0.7,s:"WPN",k:"50NL",b:0.5},
{n:"Azraeill (WPN)",h:119000,w:0.5,s:"WPN",k:"50NL",b:0.5},
{n:"EMPOWERER (WPN)",h:118000,w:0.4,s:"WPN",k:"50NL",b:0.5},
{n:"Wildsweet (WPN)",h:117000,w:2.7,s:"WPN",k:"50NL",b:0.5},
{n:"JACK913 (WPN)",h:115000,w:-53.2,s:"WPN",k:"50NL",b:0.5},
{n:"Loynis (WPN)",h:114000,w:-6.9,s:"WPN",k:"50NL",b:0.5},
{n:"ProtocolFantom (WPN)",h:113000,w:-0.2,s:"WPN",k:"50NL",b:0.5},
{n:"KeepReloading (WPN)",h:112000,w:-2.8,s:"WPN",k:"50NL",b:0.5},
{n:"UnderTheBeer (WPN)",h:111000,w:0.6,s:"WPN",k:"50NL",b:0.5},
{n:"Marvine (WPN)",h:110000,w:-1.3,s:"WPN",k:"50NL",b:0.5},
{n:"Passerby (WPN)",h:110000,w:-4.8,s:"WPN",k:"50NL",b:0.5},
{n:"haaalk (WPN)",h:110000,w:3.6,s:"WPN",k:"50NL",b:0.5},
{n:"aceQueen143 (WPN)",h:110000,w:-0.9,s:"WPN",k:"50NL",b:0.5},
{n:"1Sudden1 (WPN)",h:109000,w:1.3,s:"WPN",k:"50NL",b:0.5},
{n:"Stingg (WPN)",h:109000,w:-2.1,s:"WPN",k:"50NL",b:0.5},
{n:"gginim (WPN)",h:108000,w:2,s:"WPN",k:"50NL",b:0.5},
{n:"Tmac3point (WNX)",h:166000,w:-2.4,s:"Winamax",k:"1000NL",b:10},
{n:"cumiucco (WNX)",h:72000,w:-2.3,s:"Winamax",k:"1000NL",b:10},
{n:"Prudently (WNX)",h:61000,w:4.1,s:"Winamax",k:"1000NL",b:10},
{n:"FASTPLZ (WNX)",h:50000,w:8.2,s:"Winamax",k:"1000NL",b:10},
{n:"WOLFCUB (WNX)",h:49000,w:-7.7,s:"Winamax",k:"1000NL",b:10},
{n:"mongateeeee (WNX)",h:45000,w:-8.6,s:"Winamax",k:"1000NL",b:10},
{n:"thefirebat (WNX)",h:44000,w:-12.2,s:"Winamax",k:"1000NL",b:10},
{n:"Arigato SS (WNX)",h:43000,w:-7.8,s:"Winamax",k:"1000NL",b:10},
{n:"JJ_CR7 (WNX)",h:35000,w:0.7,s:"Winamax",k:"1000NL",b:10},
{n:"VirtuousGuy (WNX)",h:35000,w:9.4,s:"Winamax",k:"1000NL",b:10},
{n:"DarkPsyche (WNX)",h:30000,w:-0.6,s:"Winamax",k:"1000NL",b:10},
{n:"SukehiroYami (WNX)",h:29000,w:4.2,s:"Winamax",k:"1000NL",b:10},
{n:"Jo-Le-Clodo (WNX)",h:28000,w:-3.3,s:"Winamax",k:"1000NL",b:10},
{n:"PomponLeDign (WNX)",h:28000,w:-0.1,s:"Winamax",k:"1000NL",b:10},
{n:"BARTZI (WNX)",h:27000,w:8.1,s:"Winamax",k:"1000NL",b:10},
{n:"Kalmari (WNX)",h:24000,w:0.9,s:"Winamax",k:"1000NL",b:10},
{n:"PASKAPELAAJA (WNX)",h:21000,w:0,s:"Winamax",k:"1000NL",b:10},
{n:"Asasinner (WNX)",h:21000,w:-10.1,s:"Winamax",k:"1000NL",b:10},
{n:"BankPiggy (WNX)",h:21000,w:3.9,s:"Winamax",k:"1000NL",b:10},
{n:"Lios Couple (WNX)",h:21000,w:-7.8,s:"Winamax",k:"1000NL",b:10},
{n:"Fukurokuju_ (WNX)",h:21000,w:-3.6,s:"Winamax",k:"1000NL",b:10},
{n:"BordaPairal (WNX)",h:21000,w:-4,s:"Winamax",k:"1000NL",b:10},
{n:"ElCaravanas (WNX)",h:21000,w:5.3,s:"Winamax",k:"1000NL",b:10},
{n:"guerreroego (WNX)",h:21000,w:4.7,s:"Winamax",k:"1000NL",b:10},
{n:"Afouteza. (WNX)",h:20000,w:13.8,s:"Winamax",k:"1000NL",b:10},
{n:"Bazinga1 (WNX)",h:18000,w:5.6,s:"Winamax",k:"1000NL",b:10},
{n:"LizardMouth (WNX)",h:18000,w:-0.9,s:"Winamax",k:"1000NL",b:10},
{n:"letraducteur (WNX)",h:17000,w:16.5,s:"Winamax",k:"1000NL",b:10},
{n:"What do (WNX)",h:17000,w:-8,s:"Winamax",k:"1000NL",b:10},
{n:"HappyCase (WNX)",h:17000,w:4.4,s:"Winamax",k:"1000NL",b:10},
{n:"Mots Bleus (WNX)",h:16000,w:6.1,s:"Winamax",k:"1000NL",b:10},
{n:"ShuShuCabra (WNX)",h:15000,w:7.8,s:"Winamax",k:"1000NL",b:10},
{n:"deusExPoker (WNX)",h:14000,w:-5.6,s:"Winamax",k:"1000NL",b:10},
{n:"L1mitless (WNX)",h:14000,w:13.2,s:"Winamax",k:"1000NL",b:10},
{n:"PERDONA QUE (WNX)",h:14000,w:20.7,s:"Winamax",k:"1000NL",b:10},
{n:"ChilliPepper (WNX)",h:14000,w:-6.2,s:"Winamax",k:"1000NL",b:10},
{n:"Mercibocco (WNX)",h:13000,w:9.9,s:"Winamax",k:"1000NL",b:10},
{n:"NealRiggers (WNX)",h:13000,w:-15.5,s:"Winamax",k:"1000NL",b:10},
{n:"TIGNARRR (WNX)",h:13000,w:4.9,s:"Winamax",k:"1000NL",b:10},
{n:"Excusemoi (WNX)",h:13000,w:4.8,s:"Winamax",k:"1000NL",b:10},
{n:"RocktLaunchr (WNX)",h:12000,w:-0.8,s:"Winamax",k:"1000NL",b:10},
{n:"DiscoCactus (WNX)",h:12000,w:12.1,s:"Winamax",k:"1000NL",b:10},
{n:"goldenuggets (WNX)",h:12000,w:10.9,s:"Winamax",k:"1000NL",b:10},
{n:"PikaPiedra (WNX)",h:12000,w:3.4,s:"Winamax",k:"1000NL",b:10},
{n:"Pokato89 (WNX)",h:12000,w:-7.1,s:"Winamax",k:"1000NL",b:10},
{n:"Rasane_8 (WNX)",h:12000,w:13.7,s:"Winamax",k:"1000NL",b:10},
{n:"ka5t (WNX)",h:11000,w:1.4,s:"Winamax",k:"1000NL",b:10},
{n:"-ChatGTO- (WNX)",h:11000,w:-0.9,s:"Winamax",k:"1000NL",b:10},
{n:"boixoli (WNX)",h:11000,w:-8.4,s:"Winamax",k:"1000NL",b:10},
{n:"Troll 261477 (WNX)",h:11000,w:7.9,s:"Winamax",k:"1000NL",b:10},
{n:"24hATM (WNX)",h:10000,w:6.3,s:"Winamax",k:"1000NL",b:10},
{n:"BaronMorte (WNX)",h:10000,w:-14.5,s:"Winamax",k:"1000NL",b:10},
{n:"edukitoooooo (WNX)",h:9900,w:15,s:"Winamax",k:"1000NL",b:10},
{n:"John_Creasy (WNX)",h:9700,w:-9.1,s:"Winamax",k:"1000NL",b:10},
{n:"WTrend (WNX)",h:9500,w:-10,s:"Winamax",k:"1000NL",b:10},
{n:"R.Dawkins3 (WNX)",h:9500,w:-12.1,s:"Winamax",k:"1000NL",b:10},
{n:"YoHViraLOL (WNX)",h:9300,w:-6.2,s:"Winamax",k:"1000NL",b:10},
{n:"magitsab (WNX)",h:9200,w:1.8,s:"Winamax",k:"1000NL",b:10},
{n:"L0stWanderer (WNX)",h:9200,w:9.6,s:"Winamax",k:"1000NL",b:10},
{n:".Gabo. (WNX)",h:9000,w:5.2,s:"Winamax",k:"1000NL",b:10},
{n:"CatyTexas (WNX)",h:8900,w:6.2,s:"Winamax",k:"1000NL",b:10},
{n:"Cole0707 (WNX)",h:8800,w:-25.8,s:"Winamax",k:"1000NL",b:10},
{n:"SR-Wolf21915 (WNX)",h:8600,w:12,s:"Winamax",k:"1000NL",b:10},
{n:"itsALL.a.LIE (WNX)",h:8500,w:2.1,s:"Winamax",k:"1000NL",b:10},
{n:"Obeeelix (WNX)",h:8500,w:11.6,s:"Winamax",k:"1000NL",b:10},
{n:"biggil333 (WNX)",h:8300,w:5.7,s:"Winamax",k:"1000NL",b:10},
{n:"Vicieux 3805 (WNX)",h:8100,w:-9.9,s:"Winamax",k:"1000NL",b:10},
{n:"dom_sz8b8 (WNX)",h:7800,w:16,s:"Winamax",k:"1000NL",b:10},
{n:"LaMpRa (WNX)",h:7700,w:-5.7,s:"Winamax",k:"1000NL",b:10},
{n:"BeIIe Bite (WNX)",h:7500,w:2,s:"Winamax",k:"1000NL",b:10},
{n:"Palme1568336 (WNX)",h:7400,w:-12.2,s:"Winamax",k:"1000NL",b:10},
{n:"Raba18 (WNX)",h:7400,w:7.2,s:"Winamax",k:"1000NL",b:10},
{n:"xGabox (WNX)",h:7200,w:0.8,s:"Winamax",k:"1000NL",b:10},
{n:"Belgrano7 (WNX)",h:6900,w:-12.5,s:"Winamax",k:"1000NL",b:10},
{n:"fr k1ng (WNX)",h:6800,w:9.7,s:"Winamax",k:"1000NL",b:10},
{n:"_Chatoyer_ (WNX)",h:6800,w:3.4,s:"Winamax",k:"1000NL",b:10},
{n:"Bobby_Peru (WNX)",h:6700,w:14.3,s:"Winamax",k:"1000NL",b:10},
{n:"74Miguel (WNX)",h:6600,w:-8,s:"Winamax",k:"1000NL",b:10},
{n:"Eazy- E (WNX)",h:6300,w:4.6,s:"Winamax",k:"1000NL",b:10},
{n:"BerqaAzercha (WNX)",h:6300,w:-2.3,s:"Winamax",k:"1000NL",b:10},
{n:"DogSnchz (WNX)",h:6200,w:8.4,s:"Winamax",k:"1000NL",b:10},
{n:"Vo1ter (WNX)",h:6200,w:-20,s:"Winamax",k:"1000NL",b:10},
{n:"Hallabaloo (WNX)",h:6200,w:-2.5,s:"Winamax",k:"1000NL",b:10},
{n:"UHU stick (WNX)",h:6100,w:-8.4,s:"Winamax",k:"1000NL",b:10},
{n:"En_Passant (WNX)",h:6000,w:26.1,s:"Winamax",k:"1000NL",b:10},
{n:"J.Clouseau (WNX)",h:6000,w:7.1,s:"Winamax",k:"1000NL",b:10},
{n:"Zouksouk (WNX)",h:5900,w:-4,s:"Winamax",k:"1000NL",b:10},
{n:"oRaNGe_PoWeR (WNX)",h:5800,w:-1.7,s:"Winamax",k:"1000NL",b:10},
{n:"Sssshhhhhh. (WNX)",h:5700,w:0.5,s:"Winamax",k:"1000NL",b:10},
{n:"Captain Kirk (WNX)",h:5700,w:3,s:"Winamax",k:"1000NL",b:10},
{n:"MastrBlastr (WNX)",h:5500,w:27.5,s:"Winamax",k:"1000NL",b:10},
{n:"ImagineStars (WNX)",h:5500,w:-18.8,s:"Winamax",k:"1000NL",b:10},
{n:"urjoke (WNX)",h:5500,w:-12.9,s:"Winamax",k:"1000NL",b:10},
{n:"Agust1nTapia (WNX)",h:5500,w:9.7,s:"Winamax",k:"1000NL",b:10},
{n:"havinfun (WNX)",h:5500,w:15.6,s:"Winamax",k:"1000NL",b:10},
{n:"NeverScaredB (WNX)",h:5400,w:16.2,s:"Winamax",k:"1000NL",b:10},
{n:"AquaQueen (WNX)",h:5400,w:-0.6,s:"Winamax",k:"1000NL",b:10},
{n:"hooovering (WNX)",h:5400,w:10.3,s:"Winamax",k:"1000NL",b:10},
{n:"RaymondDalio (WNX)",h:5200,w:2.3,s:"Winamax",k:"1000NL",b:10},
{n:"1theshotgun1 (WNX)",h:5200,w:21.3,s:"Winamax",k:"1000NL",b:10},
{n:"Parmesano0o0 (WNX)",h:254000,w:6.5,s:"Winamax",k:"100NL",b:1},
{n:"PASTA FETA (WNX)",h:227000,w:4,s:"Winamax",k:"100NL",b:1},
{n:"calamardu06 (WNX)",h:210000,w:4.6,s:"Winamax",k:"100NL",b:1},
{n:"Evpositive (WNX)",h:187000,w:0.9,s:"Winamax",k:"100NL",b:1},
{n:"ninja265 (WNX)",h:184000,w:-7.7,s:"Winamax",k:"100NL",b:1},
{n:"LUCKYBOAR (WNX)",h:182000,w:0.4,s:"Winamax",k:"100NL",b:1},
{n:"Ragnar222 (WNX)",h:155000,w:8.4,s:"Winamax",k:"100NL",b:1},
{n:"H0le10ne (WNX)",h:140000,w:7.2,s:"Winamax",k:"100NL",b:1},
{n:"N1XXXX (WNX)",h:122000,w:1.8,s:"Winamax",k:"100NL",b:1},
{n:"dastol (WNX)",h:113000,w:-3.1,s:"Winamax",k:"100NL",b:1},
{n:"Eeeeels. (WNX)",h:107000,w:3.1,s:"Winamax",k:"100NL",b:1},
{n:"RenzoFilini (WNX)",h:106000,w:-1.6,s:"Winamax",k:"100NL",b:1},
{n:"blitzforce (WNX)",h:101000,w:2.5,s:"Winamax",k:"100NL",b:1},
{n:"BORNtoSLEEP (WNX)",h:98000,w:2.6,s:"Winamax",k:"100NL",b:1},
{n:"Mohamed95142 (WNX)",h:98000,w:-0.6,s:"Winamax",k:"100NL",b:1},
{n:"AL M1RQAB (WNX)",h:97000,w:3.7,s:"Winamax",k:"100NL",b:1},
{n:"AAmaterasu (WNX)",h:97000,w:6.5,s:"Winamax",k:"100NL",b:1},
{n:"DonJonoveze (WNX)",h:95000,w:-4.1,s:"Winamax",k:"100NL",b:1},
{n:"Opt1m1st (WNX)",h:95000,w:1.6,s:"Winamax",k:"100NL",b:1},
{n:"DUKI DUKI (WNX)",h:94000,w:-1.3,s:"Winamax",k:"100NL",b:1},
{n:"Plat Du Pied (WNX)",h:85000,w:7.7,s:"Winamax",k:"100NL",b:1},
{n:"RickDupont (WNX)",h:82000,w:-1,s:"Winamax",k:"100NL",b:1},
{n:"Deuillegivre (WNX)",h:81000,w:-1.9,s:"Winamax",k:"100NL",b:1},
{n:"ButtLicker (WNX)",h:81000,w:1.2,s:"Winamax",k:"100NL",b:1},
{n:"BenoitRoux (WNX)",h:81000,w:7.4,s:"Winamax",k:"100NL",b:1},
{n:"PrayForSyria (WNX)",h:81000,w:3.4,s:"Winamax",k:"100NL",b:1},
{n:"Mindblkfir14 (WNX)",h:80000,w:-1.1,s:"Winamax",k:"100NL",b:1},
{n:"killahhhhhhh (WNX)",h:79000,w:-2.1,s:"Winamax",k:"100NL",b:1},
{n:"Lapesk (WNX)",h:79000,w:5.5,s:"Winamax",k:"100NL",b:1},
{n:"Jerjes 1 (WNX)",h:79000,w:7.8,s:"Winamax",k:"100NL",b:1},
{n:"wlcmtohell (WNX)",h:78000,w:1.1,s:"Winamax",k:"100NL",b:1},
{n:"CooL19 (WNX)",h:77000,w:3.5,s:"Winamax",k:"100NL",b:1},
{n:"Waikikamukau (WNX)",h:72000,w:-8.9,s:"Winamax",k:"100NL",b:1},
{n:"Pushnisher (WNX)",h:72000,w:-5.9,s:"Winamax",k:"100NL",b:1},
{n:"Chimpapo (WNX)",h:71000,w:9,s:"Winamax",k:"100NL",b:1},
{n:"schnapselle (WNX)",h:71000,w:1,s:"Winamax",k:"100NL",b:1},
{n:"Random User (WNX)",h:69000,w:-3.9,s:"Winamax",k:"100NL",b:1},
{n:"AntonioRecio (WNX)",h:66000,w:1,s:"Winamax",k:"100NL",b:1},
{n:"s79o (WNX)",h:65000,w:10.3,s:"Winamax",k:"100NL",b:1},
{n:"hicalonic (WNX)",h:64000,w:3.8,s:"Winamax",k:"100NL",b:1},
{n:"RunninG00D (WNX)",h:64000,w:0.2,s:"Winamax",k:"100NL",b:1},
{n:"chenconhaste (WNX)",h:64000,w:3.1,s:"Winamax",k:"100NL",b:1},
{n:"Antolinez (WNX)",h:61000,w:1.6,s:"Winamax",k:"100NL",b:1},
{n:"Marc0_M0uly (WNX)",h:61000,w:0.4,s:"Winamax",k:"100NL",b:1},
{n:"anabiaz1 (WNX)",h:61000,w:0.1,s:"Winamax",k:"100NL",b:1},
{n:"Inshallah.ma (WNX)",h:61000,w:-1,s:"Winamax",k:"100NL",b:1},
{n:"Ia_biquette (WNX)",h:60000,w:-1.7,s:"Winamax",k:"100NL",b:1},
{n:"Indiens (WNX)",h:59000,w:-7.3,s:"Winamax",k:"100NL",b:1},
{n:"XXX-BET (WNX)",h:59000,w:3.5,s:"Winamax",k:"100NL",b:1},
{n:"dontbeloserr (WNX)",h:59000,w:-7.5,s:"Winamax",k:"100NL",b:1},
{n:"Sito010 (WNX)",h:58000,w:2,s:"Winamax",k:"100NL",b:1},
{n:"gerglme (WNX)",h:57000,w:-3.5,s:"Winamax",k:"100NL",b:1},
{n:"JhayCortez (WNX)",h:57000,w:1.4,s:"Winamax",k:"100NL",b:1},
{n:"DGEO67680 (WNX)",h:56000,w:3,s:"Winamax",k:"100NL",b:1},
{n:"nikkitos77 (WNX)",h:56000,w:1.6,s:"Winamax",k:"100NL",b:1},
{n:"ju14190 (WNX)",h:56000,w:-14.5,s:"Winamax",k:"100NL",b:1},
{n:"Zihuatanejo5 (WNX)",h:55000,w:-0.9,s:"Winamax",k:"100NL",b:1},
{n:"Oliva_Conde2 (WNX)",h:54000,w:6.8,s:"Winamax",k:"100NL",b:1},
{n:"Enchugardiu (WNX)",h:52000,w:-3.6,s:"Winamax",k:"100NL",b:1},
{n:"tricksNwin (WNX)",h:52000,w:2.4,s:"Winamax",k:"100NL",b:1},
{n:"bambamjam (WNX)",h:51000,w:-1.4,s:"Winamax",k:"100NL",b:1},
{n:"Drilo (WNX)",h:51000,w:-0.3,s:"Winamax",k:"100NL",b:1},
{n:"HansiFlick (WNX)",h:51000,w:4,s:"Winamax",k:"100NL",b:1},
{n:"karas39 (WNX)",h:51000,w:7.4,s:"Winamax",k:"100NL",b:1},
{n:"Stay_Focusss (WNX)",h:50000,w:2,s:"Winamax",k:"100NL",b:1},
{n:"Rhadamanth10 (WNX)",h:49000,w:-8.6,s:"Winamax",k:"100NL",b:1},
{n:"MrBesta (WNX)",h:49000,w:5.3,s:"Winamax",k:"100NL",b:1},
{n:"incouchable (WNX)",h:48000,w:-2.1,s:"Winamax",k:"100NL",b:1},
{n:"IMSEGA (WNX)",h:48000,w:-3.1,s:"Winamax",k:"100NL",b:1},
{n:"hookr1195 (WNX)",h:48000,w:-1,s:"Winamax",k:"100NL",b:1},
{n:"Deldar182 (WNX)",h:46000,w:-4.8,s:"Winamax",k:"100NL",b:1},
{n:"shinydiam (WNX)",h:46000,w:-5.7,s:"Winamax",k:"100NL",b:1},
{n:"Varanidae (WNX)",h:46000,w:-2.7,s:"Winamax",k:"100NL",b:1},
{n:"Marco Veloso (WNX)",h:45000,w:-10.6,s:"Winamax",k:"100NL",b:1},
{n:"Vis iluminee (WNX)",h:45000,w:-13,s:"Winamax",k:"100NL",b:1},
{n:"Tia Angus (WNX)",h:44000,w:3.3,s:"Winamax",k:"100NL",b:1},
{n:"la baaarbe (WNX)",h:44000,w:-0.6,s:"Winamax",k:"100NL",b:1},
{n:"A.M.123 (WNX)",h:44000,w:2,s:"Winamax",k:"100NL",b:1},
{n:"optimisedq (WNX)",h:44000,w:3,s:"Winamax",k:"100NL",b:1},
{n:"S.SWEENEY (WNX)",h:43000,w:-2.8,s:"Winamax",k:"100NL",b:1},
{n:"And68555 (WNX)",h:43000,w:10.3,s:"Winamax",k:"100NL",b:1},
{n:"VVictory (WNX)",h:42000,w:2.5,s:"Winamax",k:"100NL",b:1},
{n:"Luigi66369 (WNX)",h:42000,w:-1.7,s:"Winamax",k:"100NL",b:1},
{n:"SurLePont (WNX)",h:41000,w:1.3,s:"Winamax",k:"100NL",b:1},
{n:"jritxal (WNX)",h:41000,w:-2,s:"Winamax",k:"100NL",b:1},
{n:"Jflomvp (WNX)",h:41000,w:-16.7,s:"Winamax",k:"100NL",b:1},
{n:"-_Mohamed_- (WNX)",h:41000,w:4.3,s:"Winamax",k:"100NL",b:1},
{n:"magitsab (WNX)",h:41000,w:3.4,s:"Winamax",k:"100NL",b:1},
{n:"Agentdufist (WNX)",h:39000,w:-0.9,s:"Winamax",k:"100NL",b:1},
{n:"schwarzschil (WNX)",h:39000,w:-8.6,s:"Winamax",k:"100NL",b:1},
{n:"THEIronprice (WNX)",h:39000,w:-1.6,s:"Winamax",k:"100NL",b:1},
{n:"Cpourmoi101 (WNX)",h:39000,w:6.3,s:"Winamax",k:"100NL",b:1},
{n:"T.Dexter (WNX)",h:38000,w:2.9,s:"Winamax",k:"100NL",b:1},
{n:"SteveRambo (WNX)",h:38000,w:4.5,s:"Winamax",k:"100NL",b:1},
{n:"AllBard00 (WNX)",h:37000,w:-0.1,s:"Winamax",k:"100NL",b:1},
{n:"Adsooo (WNX)",h:37000,w:-3.2,s:"Winamax",k:"100NL",b:1},
{n:"Stikeeez (WNX)",h:37000,w:-7.4,s:"Winamax",k:"100NL",b:1},
{n:"Wosiiito820 (WNX)",h:36000,w:-6.8,s:"Winamax",k:"100NL",b:1},
{n:"DerKicker (WNX)",h:36000,w:6.3,s:"Winamax",k:"100NL",b:1},
{n:"4betshove.fr (WNX)",h:36000,w:1.1,s:"Winamax",k:"100NL",b:1},
{n:"Parmesano0o0 (WNX)",h:283000,w:4.5,s:"Winamax",k:"200NL",b:2},
{n:"Padu5 (WNX)",h:110000,w:3.9,s:"Winamax",k:"200NL",b:2},
{n:"Chimpapo (WNX)",h:94000,w:4.1,s:"Winamax",k:"200NL",b:2},
{n:"Inventflix (WNX)",h:87000,w:-6.1,s:"Winamax",k:"200NL",b:2},
{n:"L1mitless (WNX)",h:83000,w:7.8,s:"Winamax",k:"200NL",b:2},
{n:"PASTA FETA (WNX)",h:82000,w:1.3,s:"Winamax",k:"200NL",b:2},
{n:"DOWNATELLO (WNX)",h:81000,w:0.7,s:"Winamax",k:"200NL",b:2},
{n:"Marc0_M0uly (WNX)",h:69000,w:8.6,s:"Winamax",k:"200NL",b:2},
{n:"magitsab (WNX)",h:66000,w:-7.9,s:"Winamax",k:"200NL",b:2},
{n:"tricksNwin (WNX)",h:66000,w:1.7,s:"Winamax",k:"200NL",b:2},
{n:"Erro 405 (WNX)",h:65000,w:-1.6,s:"Winamax",k:"200NL",b:2},
{n:"axelrod90 (WNX)",h:60000,w:5.3,s:"Winamax",k:"200NL",b:2},
{n:"Po D Po (WNX)",h:59000,w:4.4,s:"Winamax",k:"200NL",b:2},
{n:"Annie-Dalgo (WNX)",h:57000,w:8.1,s:"Winamax",k:"200NL",b:2},
{n:"ButtLicker (WNX)",h:56000,w:2.8,s:"Winamax",k:"200NL",b:2},
{n:"KillBabyKill (WNX)",h:56000,w:-3.1,s:"Winamax",k:"200NL",b:2},
{n:"Mohamed95142 (WNX)",h:53000,w:-0.5,s:"Winamax",k:"200NL",b:2},
{n:"IronArni (WNX)",h:50000,w:10.7,s:"Winamax",k:"200NL",b:2},
{n:"Nbukele (WNX)",h:49000,w:8.1,s:"Winamax",k:"200NL",b:2},
{n:"mceepddlc (WNX)",h:49000,w:-2.3,s:"Winamax",k:"200NL",b:2},
{n:"Cpourmoi101 (WNX)",h:49000,w:2.9,s:"Winamax",k:"200NL",b:2},
{n:"LoSient0 (WNX)",h:48000,w:-2.4,s:"Winamax",k:"200NL",b:2},
{n:"l4mo (WNX)",h:46000,w:8.2,s:"Winamax",k:"200NL",b:2},
{n:"Adios Amigo (WNX)",h:46000,w:2.5,s:"Winamax",k:"200NL",b:2},
{n:"Eeeeels. (WNX)",h:44000,w:6.4,s:"Winamax",k:"200NL",b:2},
{n:"Random User (WNX)",h:44000,w:-4.1,s:"Winamax",k:"200NL",b:2},
{n:"ElonMuck11 (WNX)",h:44000,w:5,s:"Winamax",k:"200NL",b:2},
{n:"KIDDD (WNX)",h:43000,w:3.9,s:"Winamax",k:"200NL",b:2},
{n:"Mind_Less (WNX)",h:42000,w:-5.5,s:"Winamax",k:"200NL",b:2},
{n:"SbfKwon (WNX)",h:42000,w:13.3,s:"Winamax",k:"200NL",b:2},
{n:"Plat Du Pied (WNX)",h:42000,w:-0.8,s:"Winamax",k:"200NL",b:2},
{n:"Iman Khelif (WNX)",h:42000,w:-1.7,s:"Winamax",k:"200NL",b:2},
{n:"OrsonWelles1 (WNX)",h:42000,w:3.7,s:"Winamax",k:"200NL",b:2},
{n:"DonotXR (WNX)",h:41000,w:3.9,s:"Winamax",k:"200NL",b:2},
{n:"DeepDreaM (WNX)",h:41000,w:8.3,s:"Winamax",k:"200NL",b:2},
{n:"Polotubie (WNX)",h:40000,w:3.7,s:"Winamax",k:"200NL",b:2},
{n:"mr.SINFUL (WNX)",h:39000,w:-3.3,s:"Winamax",k:"200NL",b:2},
{n:"AnRoPo1710 (WNX)",h:39000,w:-7.6,s:"Winamax",k:"200NL",b:2},
{n:"AL M1RQAB (WNX)",h:39000,w:3.9,s:"Winamax",k:"200NL",b:2},
{n:"PrayForSyria (WNX)",h:38000,w:3.7,s:"Winamax",k:"200NL",b:2},
{n:"PokerPicasso (WNX)",h:37000,w:9.7,s:"Winamax",k:"200NL",b:2},
{n:"Keitaro77 (WNX)",h:37000,w:3.6,s:"Winamax",k:"200NL",b:2},
{n:"SteveRambo (WNX)",h:37000,w:8.9,s:"Winamax",k:"200NL",b:2},
{n:"LUCKYBOAR (WNX)",h:37000,w:7.1,s:"Winamax",k:"200NL",b:2},
{n:"oRaNGe_PoWeR (WNX)",h:37000,w:-7.6,s:"Winamax",k:"200NL",b:2},
{n:"2 Samuel 1 (WNX)",h:36000,w:0,s:"Winamax",k:"200NL",b:2},
{n:"La Diag (WNX)",h:36000,w:-2.2,s:"Winamax",k:"200NL",b:2},
{n:"Varanidae (WNX)",h:35000,w:5.4,s:"Winamax",k:"200NL",b:2},
{n:"I AM LUCKY (WNX)",h:35000,w:4.9,s:"Winamax",k:"200NL",b:2},
{n:"Touleuzz (WNX)",h:35000,w:13,s:"Winamax",k:"200NL",b:2},
{n:"HABAHDAKOOOR (WNX)",h:35000,w:-4,s:"Winamax",k:"200NL",b:2},
{n:"Alto_Spewww (WNX)",h:35000,w:5.9,s:"Winamax",k:"200NL",b:2},
{n:"Babylonsyste (WNX)",h:35000,w:10.9,s:"Winamax",k:"200NL",b:2},
{n:"anabiaz1 (WNX)",h:35000,w:2.6,s:"Winamax",k:"200NL",b:2},
{n:"DonJonoveze (WNX)",h:35000,w:2.5,s:"Winamax",k:"200NL",b:2},
{n:"DUKI DUKI (WNX)",h:34000,w:5.1,s:"Winamax",k:"200NL",b:2},
{n:"-Geoffroy- (WNX)",h:34000,w:-17.8,s:"Winamax",k:"200NL",b:2},
{n:"BBalanced (WNX)",h:32000,w:-12.7,s:"Winamax",k:"200NL",b:2},
{n:"Memento.Mori (WNX)",h:32000,w:3.2,s:"Winamax",k:"200NL",b:2},
{n:"UncrownedK (WNX)",h:31000,w:4.2,s:"Winamax",k:"200NL",b:2},
{n:"Physicx11 (WNX)",h:31000,w:4.5,s:"Winamax",k:"200NL",b:2},
{n:"BerroJavHD (WNX)",h:31000,w:9.8,s:"Winamax",k:"200NL",b:2},
{n:"ExploitMan (WNX)",h:31000,w:6.5,s:"Winamax",k:"200NL",b:2},
{n:"boixoli (WNX)",h:30000,w:-0.1,s:"Winamax",k:"200NL",b:2},
{n:"Ia_biquette (WNX)",h:30000,w:1.3,s:"Winamax",k:"200NL",b:2},
{n:"BoboLaTignas (WNX)",h:30000,w:4.5,s:"Winamax",k:"200NL",b:2},
{n:"4000h (WNX)",h:29000,w:-4.6,s:"Winamax",k:"200NL",b:2},
{n:"Gender Fluid (WNX)",h:29000,w:-3.9,s:"Winamax",k:"200NL",b:2},
{n:"Dr. Beat (WNX)",h:29000,w:3.9,s:"Winamax",k:"200NL",b:2},
{n:"Vioma78 (WNX)",h:29000,w:1.4,s:"Winamax",k:"200NL",b:2},
{n:"SkoroNa_nl1k (WNX)",h:28000,w:2,s:"Winamax",k:"200NL",b:2},
{n:"AA moment (WNX)",h:28000,w:7.5,s:"Winamax",k:"200NL",b:2},
{n:"ElFaquir (WNX)",h:28000,w:7.3,s:"Winamax",k:"200NL",b:2},
{n:"John Lark (WNX)",h:28000,w:-3.7,s:"Winamax",k:"200NL",b:2},
{n:"ChaMpEazzy (WNX)",h:28000,w:2.2,s:"Winamax",k:"200NL",b:2},
{n:"Granat88 (WNX)",h:27000,w:18.2,s:"Winamax",k:"200NL",b:2},
{n:"NOmercy666 (WNX)",h:27000,w:-1.3,s:"Winamax",k:"200NL",b:2},
{n:"eighty (WNX)",h:27000,w:3.1,s:"Winamax",k:"200NL",b:2},
{n:"SinCebolla (WNX)",h:27000,w:-4.1,s:"Winamax",k:"200NL",b:2},
{n:"God is Back (WNX)",h:26000,w:7.5,s:"Winamax",k:"200NL",b:2},
{n:"EXTRICABLE (WNX)",h:26000,w:-5.1,s:"Winamax",k:"200NL",b:2},
{n:"roadtoNL2k (WNX)",h:26000,w:-6.4,s:"Winamax",k:"200NL",b:2},
{n:"badagaio (WNX)",h:26000,w:4.1,s:"Winamax",k:"200NL",b:2},
{n:"RenzoFilini (WNX)",h:26000,w:1.5,s:"Winamax",k:"200NL",b:2},
{n:"STiTChHhHhH (WNX)",h:26000,w:3.7,s:"Winamax",k:"200NL",b:2},
{n:"ICashUrChips (WNX)",h:25000,w:11.5,s:"Winamax",k:"200NL",b:2},
{n:"RunninG00D (WNX)",h:25000,w:6,s:"Winamax",k:"200NL",b:2},
{n:"AllBard00 (WNX)",h:25000,w:-0.8,s:"Winamax",k:"200NL",b:2},
{n:"SurLePont (WNX)",h:25000,w:-5.4,s:"Winamax",k:"200NL",b:2},
{n:"PUPPON (WNX)",h:25000,w:-5.5,s:"Winamax",k:"200NL",b:2},
{n:"hookr1195 (WNX)",h:25000,w:-3.9,s:"Winamax",k:"200NL",b:2},
{n:"BedWettener (WNX)",h:25000,w:16.8,s:"Winamax",k:"200NL",b:2},
{n:"AnAnAAAAAAAA (WNX)",h:25000,w:2.8,s:"Winamax",k:"200NL",b:2},
{n:"incroyable5 (WNX)",h:24000,w:-2.1,s:"Winamax",k:"200NL",b:2},
{n:"Saeculum (WNX)",h:24000,w:6.7,s:"Winamax",k:"200NL",b:2},
{n:"killahhhhhhh (WNX)",h:24000,w:-1.5,s:"Winamax",k:"200NL",b:2},
{n:"SwagSon6996 (WNX)",h:24000,w:15.7,s:"Winamax",k:"200NL",b:2},
{n:"AAmaterasu (WNX)",h:23000,w:5.7,s:"Winamax",k:"200NL",b:2},
{n:"Inshallah.ma (WNX)",h:23000,w:-5.6,s:"Winamax",k:"200NL",b:2},
{n:"Chris Busted (WNX)",h:23000,w:9,s:"Winamax",k:"200NL",b:2},
{n:"BankPiggy (WNX)",h:91000,w:1.9,s:"Winamax",k:"400-600NL",b:5},
{n:"Tmac3point (WNX)",h:88000,w:2.1,s:"Winamax",k:"400-600NL",b:5},
{n:"HappyCase (WNX)",h:72000,w:1.7,s:"Winamax",k:"400-600NL",b:5},
{n:"1dog1bone (WNX)",h:68000,w:-10.2,s:"Winamax",k:"400-600NL",b:5},
{n:"Jo-Le-Clodo (WNX)",h:64000,w:1.6,s:"Winamax",k:"400-600NL",b:5},
{n:"LUCKYW1NNER (WNX)",h:60000,w:-5.3,s:"Winamax",k:"400-600NL",b:5},
{n:"Mercibocco (WNX)",h:60000,w:-2.5,s:"Winamax",k:"400-600NL",b:5},
{n:"BARTZI (WNX)",h:54000,w:2.6,s:"Winamax",k:"400-600NL",b:5},
{n:"magitsab (WNX)",h:50000,w:-4.4,s:"Winamax",k:"400-600NL",b:5},
{n:"L1mitless (WNX)",h:44000,w:3.9,s:"Winamax",k:"400-600NL",b:5},
{n:"Afouteza. (WNX)",h:38000,w:2.7,s:"Winamax",k:"400-600NL",b:5},
{n:"Troll 261477 (WNX)",h:37000,w:4.1,s:"Winamax",k:"400-600NL",b:5},
{n:"urjoke (WNX)",h:37000,w:8.5,s:"Winamax",k:"400-600NL",b:5},
{n:"GreenGrey (WNX)",h:37000,w:4.3,s:"Winamax",k:"400-600NL",b:5},
{n:"VirtuousGuy (WNX)",h:36000,w:10.9,s:"Winamax",k:"400-600NL",b:5},
{n:"-ChatGTO- (WNX)",h:35000,w:7.5,s:"Winamax",k:"400-600NL",b:5},
{n:"SR-Wolf21915 (WNX)",h:35000,w:7.4,s:"Winamax",k:"400-600NL",b:5},
{n:"Prudently (WNX)",h:35000,w:5.2,s:"Winamax",k:"400-600NL",b:5},
{n:"boixoli (WNX)",h:35000,w:5.7,s:"Winamax",k:"400-600NL",b:5},
{n:"Chimpapo (WNX)",h:35000,w:4.8,s:"Winamax",k:"400-600NL",b:5},
{n:"DagnyTaggart (WNX)",h:34000,w:1.7,s:"Winamax",k:"400-600NL",b:5},
{n:"Berkelio (WNX)",h:34000,w:10,s:"Winamax",k:"400-600NL",b:5},
{n:"DiscoCactus (WNX)",h:33000,w:4.7,s:"Winamax",k:"400-600NL",b:5},
{n:"JustRandom (WNX)",h:33000,w:4.8,s:"Winamax",k:"400-600NL",b:5},
{n:"Obeeelix (WNX)",h:32000,w:-2.9,s:"Winamax",k:"400-600NL",b:5},
{n:"PtitPrince (WNX)",h:32000,w:10.4,s:"Winamax",k:"400-600NL",b:5},
{n:"vandamme1960 (WNX)",h:32000,w:4,s:"Winamax",k:"400-600NL",b:5},
{n:"_Idobush_ (WNX)",h:31000,w:1.6,s:"Winamax",k:"400-600NL",b:5},
{n:"KIDDD (WNX)",h:31000,w:9.1,s:"Winamax",k:"400-600NL",b:5},
{n:"R.Dawkins3 (WNX)",h:30000,w:-4.4,s:"Winamax",k:"400-600NL",b:5},
{n:"SinPiedad_ (WNX)",h:29000,w:6.9,s:"Winamax",k:"400-600NL",b:5},
{n:"FemaleFeet (WNX)",h:28000,w:-3.1,s:"Winamax",k:"400-600NL",b:5},
{n:"biggil333 (WNX)",h:27000,w:10.3,s:"Winamax",k:"400-600NL",b:5},
{n:"OrsonWelles1 (WNX)",h:26000,w:-7.3,s:"Winamax",k:"400-600NL",b:5},
{n:"Saint-Just89 (WNX)",h:26000,w:-0.1,s:"Winamax",k:"400-600NL",b:5},
{n:"Padu5 (WNX)",h:26000,w:-9.6,s:"Winamax",k:"400-600NL",b:5},
{n:"CatyTexas (WNX)",h:25000,w:3.2,s:"Winamax",k:"400-600NL",b:5},
{n:"ShuShuCabra (WNX)",h:25000,w:-5.1,s:"Winamax",k:"400-600NL",b:5},
{n:"Inventflix (WNX)",h:25000,w:-1.7,s:"Winamax",k:"400-600NL",b:5},
{n:"Zouksouk (WNX)",h:24000,w:9.2,s:"Winamax",k:"400-600NL",b:5},
{n:"PomponLeDign (WNX)",h:24000,w:-8.2,s:"Winamax",k:"400-600NL",b:5},
{n:"oRaNGe_PoWeR (WNX)",h:24000,w:-2.5,s:"Winamax",k:"400-600NL",b:5},
{n:"cumiucco (WNX)",h:24000,w:-11.3,s:"Winamax",k:"400-600NL",b:5},
{n:"BeIIe Bite (WNX)",h:23000,w:2.7,s:"Winamax",k:"400-600NL",b:5},
{n:"Patulosky (WNX)",h:22000,w:4.2,s:"Winamax",k:"400-600NL",b:5},
{n:"FASTPLZ (WNX)",h:22000,w:7.3,s:"Winamax",k:"400-600NL",b:5},
{n:"Palme1568336 (WNX)",h:22000,w:-13.9,s:"Winamax",k:"400-600NL",b:5},
{n:"Elm0r0Bielsa (WNX)",h:22000,w:2.7,s:"Winamax",k:"400-600NL",b:5},
{n:"xGabox (WNX)",h:21000,w:1.6,s:"Winamax",k:"400-600NL",b:5},
{n:"FlexItOn (WNX)",h:21000,w:4.4,s:"Winamax",k:"400-600NL",b:5},
{n:"Danidoo (WNX)",h:21000,w:8.3,s:"Winamax",k:"400-600NL",b:5},
{n:"BerqaAzercha (WNX)",h:21000,w:2.5,s:"Winamax",k:"400-600NL",b:5},
{n:"LizardMouth (WNX)",h:20000,w:-10.1,s:"Winamax",k:"400-600NL",b:5},
{n:"56959720 (WNX)",h:20000,w:5.7,s:"Winamax",k:"400-600NL",b:5},
{n:"mceepddlc (WNX)",h:20000,w:-2.7,s:"Winamax",k:"400-600NL",b:5},
{n:"hAcKAir (WNX)",h:20000,w:4.6,s:"Winamax",k:"400-600NL",b:5},
{n:"Kalmari (WNX)",h:20000,w:5.7,s:"Winamax",k:"400-600NL",b:5},
{n:"JulienSong (WNX)",h:19000,w:7.5,s:"Winamax",k:"400-600NL",b:5},
{n:"wwuxa (WNX)",h:19000,w:7.2,s:"Winamax",k:"400-600NL",b:5},
{n:"IronArni (WNX)",h:19000,w:1.2,s:"Winamax",k:"400-600NL",b:5},
{n:"badagaio (WNX)",h:19000,w:-10.7,s:"Winamax",k:"400-600NL",b:5},
{n:"Po D Po (WNX)",h:19000,w:1.5,s:"Winamax",k:"400-600NL",b:5},
{n:"wina6873 (WNX)",h:19000,w:-0.2,s:"Winamax",k:"400-600NL",b:5},
{n:"IamEpicteto (WNX)",h:18000,w:-5.4,s:"Winamax",k:"400-600NL",b:5},
{n:"SUMMER 2K24 (WNX)",h:18000,w:-5.5,s:"Winamax",k:"400-600NL",b:5},
{n:"fromage58 (WNX)",h:18000,w:8.6,s:"Winamax",k:"400-600NL",b:5},
{n:"Riu Gelep (WNX)",h:18000,w:6.2,s:"Winamax",k:"400-600NL",b:5},
{n:"John_Creasy (WNX)",h:18000,w:-6.8,s:"Winamax",k:"400-600NL",b:5},
{n:"B4d3me1ster (WNX)",h:17000,w:6.6,s:"Winamax",k:"400-600NL",b:5},
{n:"Fukurokuju_ (WNX)",h:17000,w:5.2,s:"Winamax",k:"400-600NL",b:5},
{n:"Arigato SS (WNX)",h:17000,w:-8.7,s:"Winamax",k:"400-600NL",b:5},
{n:"HiiHiii (WNX)",h:17000,w:7.2,s:"Winamax",k:"400-600NL",b:5},
{n:"Touleuzz (WNX)",h:17000,w:-4.3,s:"Winamax",k:"400-600NL",b:5},
{n:"penguinman (WNX)",h:17000,w:1.9,s:"Winamax",k:"400-600NL",b:5},
{n:"UneMoule (WNX)",h:17000,w:3.6,s:"Winamax",k:"400-600NL",b:5},
{n:"Lacrize0tiek (WNX)",h:17000,w:8.1,s:"Winamax",k:"400-600NL",b:5},
{n:"iShowBluffs (WNX)",h:17000,w:8.5,s:"Winamax",k:"400-600NL",b:5},
{n:"letraducteur (WNX)",h:16000,w:23.3,s:"Winamax",k:"400-600NL",b:5},
{n:"Bobby_Peru (WNX)",h:16000,w:-3.3,s:"Winamax",k:"400-600NL",b:5},
{n:"guerreroego (WNX)",h:16000,w:0.7,s:"Winamax",k:"400-600NL",b:5},
{n:"DingLiren (WNX)",h:16000,w:9.1,s:"Winamax",k:"400-600NL",b:5},
{n:"PikaPiedra (WNX)",h:16000,w:16.8,s:"Winamax",k:"400-600NL",b:5},
{n:"UncrownedK (WNX)",h:16000,w:-8,s:"Winamax",k:"400-600NL",b:5},
{n:"porculero (WNX)",h:16000,w:4.6,s:"Winamax",k:"400-600NL",b:5},
{n:"Ganesha1 (WNX)",h:15000,w:-14.6,s:"Winamax",k:"400-600NL",b:5},
{n:"Tyrion81 (WNX)",h:15000,w:-1.3,s:"Winamax",k:"400-600NL",b:5},
{n:"tricksNwin (WNX)",h:15000,w:-14.7,s:"Winamax",k:"400-600NL",b:5},
{n:"PERDONA QUE (WNX)",h:15000,w:19.9,s:"Winamax",k:"400-600NL",b:5},
{n:"Polotubie (WNX)",h:15000,w:-6.7,s:"Winamax",k:"400-600NL",b:5},
{n:"PrayForSyria (WNX)",h:15000,w:6.3,s:"Winamax",k:"400-600NL",b:5},
{n:"Iman Khelif (WNX)",h:15000,w:4.7,s:"Winamax",k:"400-600NL",b:5},
{n:"La Diag (WNX)",h:15000,w:4,s:"Winamax",k:"400-600NL",b:5},
{n:"thefirebat (WNX)",h:15000,w:0.3,s:"Winamax",k:"400-600NL",b:5},
{n:"RaymondDalio (WNX)",h:14000,w:-7.7,s:"Winamax",k:"400-600NL",b:5},
{n:"axelrod90 (WNX)",h:14000,w:6.3,s:"Winamax",k:"400-600NL",b:5},
{n:"Palomena (WNX)",h:14000,w:18.7,s:"Winamax",k:"400-600NL",b:5},
{n:"SinCebolla (WNX)",h:14000,w:-3.8,s:"Winamax",k:"400-600NL",b:5},
{n:"WheelHunting (WNX)",h:14000,w:-7.5,s:"Winamax",k:"400-600NL",b:5},
{n:"Mr.Chief (WNX)",h:14000,w:3.6,s:"Winamax",k:"400-600NL",b:5},
{n:"ToutAmour (WNX)",h:14000,w:-0.9,s:"Winamax",k:"400-600NL",b:5},
{n:"nikkitos77 (WNX)",h:298000,w:2.8,s:"Winamax",k:"50NL",b:0.5},
{n:"bonus99x (WNX)",h:235000,w:1,s:"Winamax",k:"50NL",b:0.5},
{n:"ninja265 (WNX)",h:231000,w:-7.2,s:"Winamax",k:"50NL",b:0.5},
{n:"MyTrue (WNX)",h:177000,w:0.4,s:"Winamax",k:"50NL",b:0.5},
{n:"MonkeyMind (WNX)",h:140000,w:-0.1,s:"Winamax",k:"50NL",b:0.5},
{n:"E29Zro83 (WNX)",h:137000,w:-2.4,s:"Winamax",k:"50NL",b:0.5},
{n:"IDGAF20 (WNX)",h:135000,w:-1.2,s:"Winamax",k:"50NL",b:0.5},
{n:"PASTA FETA (WNX)",h:132000,w:8.1,s:"Winamax",k:"50NL",b:0.5},
{n:"dontbeloserr (WNX)",h:132000,w:-7.9,s:"Winamax",k:"50NL",b:0.5},
{n:"WskNPoker (WNX)",h:129000,w:1.8,s:"Winamax",k:"50NL",b:0.5},
{n:"TAIKI_NOZOMI (WNX)",h:129000,w:1.7,s:"Winamax",k:"50NL",b:0.5},
{n:"M.K.J (WNX)",h:129000,w:-4.2,s:"Winamax",k:"50NL",b:0.5},
{n:"BORNtoSLEEP (WNX)",h:129000,w:0.3,s:"Winamax",k:"50NL",b:0.5},
{n:"XPumanson (WNX)",h:127000,w:0.5,s:"Winamax",k:"50NL",b:0.5},
{n:"Numero10 (WNX)",h:126000,w:2.6,s:"Winamax",k:"50NL",b:0.5},
{n:"hicalonic (WNX)",h:125000,w:-1,s:"Winamax",k:"50NL",b:0.5},
{n:"EnTiltTotal (WNX)",h:122000,w:0.6,s:"Winamax",k:"50NL",b:0.5},
{n:"AAmaterasu (WNX)",h:120000,w:0.7,s:"Winamax",k:"50NL",b:0.5},
{n:"Stay_Focusss (WNX)",h:117000,w:-3.1,s:"Winamax",k:"50NL",b:0.5},
{n:"schrodlnger (WNX)",h:110000,w:-4.5,s:"Winamax",k:"50NL",b:0.5},
{n:"unbreAAkable (WNX)",h:109000,w:1.6,s:"Winamax",k:"50NL",b:0.5},
{n:"kiyashly (WNX)",h:105000,w:-7,s:"Winamax",k:"50NL",b:0.5},
{n:"PereRiche (WNX)",h:105000,w:0.4,s:"Winamax",k:"50NL",b:0.5},
{n:"PrayForSyria (WNX)",h:103000,w:1.7,s:"Winamax",k:"50NL",b:0.5},
{n:"Audi RS7 fr. (WNX)",h:100000,w:3,s:"Winamax",k:"50NL",b:0.5},
{n:"DXTIVO23 (WNX)",h:98000,w:4.9,s:"Winamax",k:"50NL",b:0.5},
{n:"yenorex (WNX)",h:98000,w:0.2,s:"Winamax",k:"50NL",b:0.5},
{n:"LICORNEPISS (WNX)",h:95000,w:-1.7,s:"Winamax",k:"50NL",b:0.5},
{n:"GechEV (WNX)",h:93000,w:2,s:"Winamax",k:"50NL",b:0.5},
{n:"Opt1m1st (WNX)",h:93000,w:1.5,s:"Winamax",k:"50NL",b:0.5},
{n:"E.Tokyo (WNX)",h:92000,w:6.2,s:"Winamax",k:"50NL",b:0.5},
{n:"DonJonoveze (WNX)",h:91000,w:1.3,s:"Winamax",k:"50NL",b:0.5},
{n:"theRateL (WNX)",h:83000,w:0.7,s:"Winamax",k:"50NL",b:0.5},
{n:"killahhhhhhh (WNX)",h:82000,w:-4.1,s:"Winamax",k:"50NL",b:0.5},
{n:"dastol (WNX)",h:80000,w:5.6,s:"Winamax",k:"50NL",b:0.5},
{n:"initialiZe (WNX)",h:80000,w:3.1,s:"Winamax",k:"50NL",b:0.5},
{n:"Clockwyse (WNX)",h:80000,w:-2.4,s:"Winamax",k:"50NL",b:0.5},
{n:"karas39 (WNX)",h:78000,w:0.8,s:"Winamax",k:"50NL",b:0.5},
{n:"Cool Shen (WNX)",h:76000,w:3.5,s:"Winamax",k:"50NL",b:0.5},
{n:"Metikka (WNX)",h:75000,w:1.9,s:"Winamax",k:"50NL",b:0.5},
{n:"Rhadamanth10 (WNX)",h:74000,w:4.7,s:"Winamax",k:"50NL",b:0.5},
{n:"Ed Galbraith (WNX)",h:74000,w:0.3,s:"Winamax",k:"50NL",b:0.5},
{n:"AzzWoopin (WNX)",h:73000,w:-6.5,s:"Winamax",k:"50NL",b:0.5},
{n:"Pulp_Bad (WNX)",h:73000,w:6.1,s:"Winamax",k:"50NL",b:0.5},
{n:"KhaoSanRoad (WNX)",h:73000,w:-4.5,s:"Winamax",k:"50NL",b:0.5},
{n:"Aduanim Sin. (WNX)",h:72000,w:4.7,s:"Winamax",k:"50NL",b:0.5},
{n:"Sage_9058723 (WNX)",h:71000,w:1,s:"Winamax",k:"50NL",b:0.5},
{n:"Caine (WNX)",h:70000,w:1,s:"Winamax",k:"50NL",b:0.5},
{n:"Jai74deQI (WNX)",h:70000,w:0,s:"Winamax",k:"50NL",b:0.5},
{n:"DiddyCalling (WNX)",h:69000,w:-1.1,s:"Winamax",k:"50NL",b:0.5},
{n:"meu1398 (WNX)",h:69000,w:-10.3,s:"Winamax",k:"50NL",b:0.5},
{n:"Waikikamukau (WNX)",h:65000,w:-7.8,s:"Winamax",k:"50NL",b:0.5},
{n:"rorogan (WNX)",h:64000,w:-3.3,s:"Winamax",k:"50NL",b:0.5},
{n:"Deldar182 (WNX)",h:63000,w:2.4,s:"Winamax",k:"50NL",b:0.5},
{n:"CooL19 (WNX)",h:62000,w:3.6,s:"Winamax",k:"50NL",b:0.5},
{n:"Master RG4L (WNX)",h:61000,w:4,s:"Winamax",k:"50NL",b:0.5},
{n:"Raphadance17 (WNX)",h:60000,w:-0.9,s:"Winamax",k:"50NL",b:0.5},
{n:"10bb100 (WNX)",h:59000,w:-3.4,s:"Winamax",k:"50NL",b:0.5},
{n:"Capt SALAMI (WNX)",h:58000,w:5.6,s:"Winamax",k:"50NL",b:0.5},
{n:"O_Tutshitsu (WNX)",h:58000,w:3.5,s:"Winamax",k:"50NL",b:0.5},
{n:"GLgentlemen (WNX)",h:57000,w:4,s:"Winamax",k:"50NL",b:0.5},
{n:"XXX-BET (WNX)",h:56000,w:5.7,s:"Winamax",k:"50NL",b:0.5},
{n:"Rolly Polly (WNX)",h:55000,w:-1.7,s:"Winamax",k:"50NL",b:0.5},
{n:"la baaarbe (WNX)",h:55000,w:-1.1,s:"Winamax",k:"50NL",b:0.5},
{n:"Erykah Badu (WNX)",h:55000,w:-2.2,s:"Winamax",k:"50NL",b:0.5},
{n:"Piwandepallo (WNX)",h:55000,w:0,s:"Winamax",k:"50NL",b:0.5},
{n:"Allez Guerik (WNX)",h:54000,w:-3.8,s:"Winamax",k:"50NL",b:0.5},
{n:"LUCKYBOAR (WNX)",h:54000,w:-2.2,s:"Winamax",k:"50NL",b:0.5},
{n:"Red Kaos 94 (WNX)",h:53000,w:3.7,s:"Winamax",k:"50NL",b:0.5},
{n:"WhiteWolf12 (WNX)",h:53000,w:-6.2,s:"Winamax",k:"50NL",b:0.5},
{n:"FEANOR3 (WNX)",h:53000,w:1.7,s:"Winamax",k:"50NL",b:0.5},
{n:"I BELIEVE (WNX)",h:53000,w:2.1,s:"Winamax",k:"50NL",b:0.5},
{n:"slowlymen_24 (WNX)",h:52000,w:4.8,s:"Winamax",k:"50NL",b:0.5},
{n:"incouchable (WNX)",h:52000,w:8.5,s:"Winamax",k:"50NL",b:0.5},
{n:"triponex (WNX)",h:52000,w:-9.4,s:"Winamax",k:"50NL",b:0.5},
{n:"ciol_5 (WNX)",h:52000,w:-2.3,s:"Winamax",k:"50NL",b:0.5},
{n:"Rafaly75 (WNX)",h:52000,w:3.5,s:"Winamax",k:"50NL",b:0.5},
{n:"Proxyrax (WNX)",h:52000,w:7,s:"Winamax",k:"50NL",b:0.5},
{n:"Elsalvaprim (WNX)",h:51000,w:3.6,s:"Winamax",k:"50NL",b:0.5},
{n:"Brelandinhio (WNX)",h:51000,w:-1.4,s:"Winamax",k:"50NL",b:0.5},
{n:"IMSEGA (WNX)",h:50000,w:10.6,s:"Winamax",k:"50NL",b:0.5},
{n:"anabiaz1 (WNX)",h:50000,w:3,s:"Winamax",k:"50NL",b:0.5},
{n:"H0le10ne (WNX)",h:50000,w:9.7,s:"Winamax",k:"50NL",b:0.5},
{n:"BOL_DE_READ (WNX)",h:49000,w:-2.1,s:"Winamax",k:"50NL",b:0.5},
{n:"EntireCircus (WNX)",h:49000,w:-5.5,s:"Winamax",k:"50NL",b:0.5},
{n:"WOLOLOOO (WNX)",h:48000,w:5.7,s:"Winamax",k:"50NL",b:0.5},
{n:"Furta_Pots (WNX)",h:48000,w:-3.4,s:"Winamax",k:"50NL",b:0.5},
{n:"mangezDpomme (WNX)",h:48000,w:-6.9,s:"Winamax",k:"50NL",b:0.5},
{n:"Mindblkfir14 (WNX)",h:46000,w:0.9,s:"Winamax",k:"50NL",b:0.5},
{n:"r.tournevis (WNX)",h:46000,w:-4.6,s:"Winamax",k:"50NL",b:0.5},
{n:"ouaichou (WNX)",h:46000,w:0.1,s:"Winamax",k:"50NL",b:0.5},
{n:"S.SWEENEY (WNX)",h:46000,w:-7.9,s:"Winamax",k:"50NL",b:0.5},
{n:"BrotherPines (WNX)",h:45000,w:-5.3,s:"Winamax",k:"50NL",b:0.5},
{n:"DogSanchez (WNX)",h:45000,w:0.3,s:"Winamax",k:"50NL",b:0.5},
{n:"Monztaaaa (WNX)",h:45000,w:-4.8,s:"Winamax",k:"50NL",b:0.5},
{n:"Az_Oreg (WNX)",h:44000,w:4.5,s:"Winamax",k:"50NL",b:0.5},
{n:"AAJDAA (WNX)",h:44000,w:-1.2,s:"Winamax",k:"50NL",b:0.5},
{n:"il tesoriere (WNX)",h:43000,w:3.5,s:"Winamax",k:"50NL",b:0.5},
{n:"blitzforce (WNX)",h:43000,w:8.3,s:"Winamax",k:"50NL",b:0.5},
{n:"Guibis78 (WNX)",h:43000,w:-7.3,s:"Winamax",k:"50NL",b:0.5}
];

// Expand compressed data to full format
const PLAYER_DATA = POKER_DATA_COMPRESSED.map(d => ({ 
  name: d.n, 
  hands: d.h, 
  winRate: d.w, 
  site: d.s, 
  stake: d.k, 
  bbValue: d.b 
}));

// ============================================================
// SITE LOGO COMPONENTS
// ============================================================

const GGPokerLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#18181b"/>
    <text x="20" y="27" textAnchor="middle" fill="#a88b46" fontSize="18" fontWeight="bold" fontFamily="Arial Black, sans-serif">GG</text>
  </svg>
);

const PokerStarsLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#18181b"/>
    <path d="M20 6 L23 16 L34 16 L25 22 L28 33 L20 26 L12 33 L15 22 L6 16 L17 16 Z" fill="#C41200"/>
    <path d="M20 12 L21.5 17 L27 17 L22.5 20.5 L24 26 L20 22.5 L16 26 L17.5 20.5 L13 17 L18.5 17 Z" fill="#a88b46"/>
  </svg>
);

const IPokerLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#18181b"/>
    <circle cx="20" cy="12" r="4" fill="#3B82F6"/>
    <rect x="16" y="18" width="8" height="16" rx="2" fill="#3B82F6"/>
  </svg>
);

const WinamaxLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#C41200"/>
    <path d="M8 12 L13 28 L20 18 L27 28 L32 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const WPNLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#18181b"/>
    <circle cx="20" cy="20" r="12" stroke="#10b981" strokeWidth="2" fill="none"/>
    <circle cx="20" cy="20" r="6" fill="#10b981"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="#10b981" strokeWidth="2"/>
    <line x1="20" y1="26" x2="20" y2="32" stroke="#10b981" strokeWidth="2"/>
    <line x1="8" y1="20" x2="14" y2="20" stroke="#10b981" strokeWidth="2"/>
    <line x1="26" y1="20" x2="32" y2="20" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

// ============================================================
// SITE CONFIGURATION
// ============================================================

const SITE_CONFIG = {
  GGPoker: { color: '#a88b46', Logo: GGPokerLogo, name: 'GGPoker' },
  PokerStars: { color: '#C41200', Logo: PokerStarsLogo, name: 'PokerStars' },
  iPoker: { color: '#3B82F6', Logo: IPokerLogo, name: 'iPoker' },
  Winamax: { color: '#C41200', Logo: WinamaxLogo, name: 'Winamax' },
  WPN: { color: '#10b981', Logo: WPNLogo, name: 'WPN' }
};

// Battle mode colors (high contrast for head-to-head)
const BATTLE_COLORS = {
  datasetA: { color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.6)', bg: 'rgba(34, 211, 238, 0.15)' },
  datasetB: { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.6)', bg: 'rgba(244, 114, 182, 0.15)' },
  merged: { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)', bg: 'rgba(255, 255, 255, 0.15)' }
};

// ============================================================
// DERIVED DATA STRUCTURES
// ============================================================

// Get available sites
const AVAILABLE_SITES = [...new Set(PLAYER_DATA.map(d => d.site))].sort();

// Get stakes per site
const STAKES_BY_SITE = {};
AVAILABLE_SITES.forEach(site => {
  const stakes = [...new Set(PLAYER_DATA.filter(d => d.site === site).map(d => d.stake))];
  // Sort stakes numerically
  stakes.sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
    const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
    return numA - numB;
  });
  STAKES_BY_SITE[site] = stakes;
});

// Get players by dataset key
const getDatasetKey = (site, stake) => `${site}_${stake}`;
const PLAYERS_BY_DATASET = {};
PLAYER_DATA.forEach(player => {
  const key = getDatasetKey(player.site, player.stake);
  if (!PLAYERS_BY_DATASET[key]) PLAYERS_BY_DATASET[key] = [];
  PLAYERS_BY_DATASET[key].push(player);
});

// ============================================================
// CALCULATION UTILITIES
// ============================================================

const calculateWeightedAverage = (players) => {
  if (players.length === 0) return 0;
  const totalWeightedWR = players.reduce((sum, p) => sum + (p.winRate * p.hands), 0);
  const totalHands = players.reduce((sum, p) => sum + p.hands, 0);
  return totalHands > 0 ? totalWeightedWR / totalHands : 0;
};

const calculateMedian = (players) => {
  if (players.length === 0) return 0;
  const sorted = [...players].sort((a, b) => b.winRate - a.winRate);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1].winRate + sorted[mid].winRate) / 2;
  }
  return sorted[mid].winRate;
};

const calculateTop20Average = (players) => {
  if (players.length === 0) return 0;
  const sorted = [...players].sort((a, b) => b.winRate - a.winRate);
  const top20Count = Math.max(1, Math.ceil(sorted.length * 0.2));
  const top20 = sorted.slice(0, top20Count);
  return calculateWeightedAverage(top20);
};

const calculateDatasetStats = (players) => {
  return {
    avgWinRate: calculateWeightedAverage(players),
    medianWinRate: calculateMedian(players),
    top20Average: calculateTop20Average(players),
    totalVolume: players.reduce((sum, p) => sum + p.hands, 0),
    playerCount: players.length
  };
};

const mergePlayerData = (selectedDatasets) => {
  const playerMap = new Map();
  
  selectedDatasets.forEach((dataset, index) => {
    const players = PLAYERS_BY_DATASET[dataset.key] || [];
    
    players.forEach(player => {
      const playerName = player.name;
      
      if (!playerMap.has(playerName)) {
        playerMap.set(playerName, { name: playerName, entries: [], datasets: new Set() });
      }
      
      const p = playerMap.get(playerName);
      p.entries.push({
        datasetKey: dataset.key,
        datasetIndex: index,
        hands: player.hands,
        winRate: player.winRate,
        bbValue: player.bbValue,
        site: player.site,
        stake: player.stake
      });
      p.datasets.add(dataset.key);
    });
  });
  
  const mergedPlayers = [];
  
  playerMap.forEach((player, name) => {
    const { entries, datasets } = player;
    const totalHands = entries.reduce((sum, e) => sum + e.hands, 0);
    const totalWeightedWR = entries.reduce((sum, e) => sum + (e.winRate * e.hands), 0);
    const weightedWinRate = totalHands > 0 ? totalWeightedWR / totalHands : 0;
    const totalProfit = entries.reduce((sum, e) => sum + ((e.winRate / 100) * e.hands * e.bbValue), 0);
    
    const datasetKeys = Array.from(datasets);
    const isMerged = datasetKeys.length > 1;
    const primaryDataset = datasetKeys[0];
    const primaryIndex = entries[0].datasetIndex;
    
    mergedPlayers.push({
      id: `player-${name}`,
      name,
      hands: totalHands,
      winRate: parseFloat(weightedWinRate.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      datasets: datasetKeys,
      primaryDataset,
      primaryIndex,
      isMerged,
      entries
    });
  });
  
  return mergedPlayers;
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const NachoStatsDashboard = () => {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedPlayer, setHighlightedPlayer] = useState(null);
  const [displayMode, setDisplayMode] = useState('winRate');
  const [chartView, setChartView] = useState('scatter');
  const [nachos, setNachos] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nachoRef = useRef(null);

  const MAX_SELECTIONS = 2;

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName('head')[0].appendChild(meta);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getEyeOffset = () => {
    if (!nachoRef.current) return { x: 0, y: 0 };
    const rect = nachoRef.current.getBoundingClientRect();
    const nachoCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const angle = Math.atan2(mousePos.y - nachoCenter.y, mousePos.x - nachoCenter.x);
    const distance = Math.min(3, Math.hypot(mousePos.x - nachoCenter.x, mousePos.y - nachoCenter.y) / 50);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  useEffect(() => {
    const newNachos = Array.from({ length: 54 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, size: 12 + Math.random() * 28,
      duration: 40 + Math.random() * 20, delay: Math.random() * 20,
      opacity: 0.4 + Math.random() * 0.5, moveX: Math.random() * 200 - 100, moveY: Math.random() * 200 - 100
    }));
    setNachos(newNachos);
  }, []);

  // Toggle dataset selection
  const toggleDataset = (site, stake) => {
    const key = getDatasetKey(site, stake);
    
    setSelectedDatasets(prev => {
      const exists = prev.find(d => d.key === key);
      if (exists) {
        return prev.filter(d => d.key !== key);
      } else if (prev.length < MAX_SELECTIONS) {
        return [...prev, { key, site, stake }];
      }
      return prev;
    });
  };

  const isDatasetSelected = (site, stake) => {
    const key = getDatasetKey(site, stake);
    return selectedDatasets.some(d => d.key === key);
  };

  const getSelectionIndex = (site, stake) => {
    const key = getDatasetKey(site, stake);
    return selectedDatasets.findIndex(d => d.key === key);
  };

  const canSelectMore = selectedDatasets.length < MAX_SELECTIONS;
  const isBattleMode = selectedDatasets.length === 2;

  // Merged players data
  const mergedPlayers = useMemo(() => {
    if (selectedDatasets.length === 0) return [];
    return mergePlayerData(selectedDatasets);
  }, [selectedDatasets]);

  // Battle stats
  const battleStats = useMemo(() => {
    if (!isBattleMode) return null;
    
    const [datasetA, datasetB] = selectedDatasets;
    const playersA = PLAYERS_BY_DATASET[datasetA.key] || [];
    const playersB = PLAYERS_BY_DATASET[datasetB.key] || [];
    
    return {
      datasetA: { ...datasetA, config: SITE_CONFIG[datasetA.site], stats: calculateDatasetStats(playersA) },
      datasetB: { ...datasetB, config: SITE_CONFIG[datasetB.site], stats: calculateDatasetStats(playersB) }
    };
  }, [isBattleMode, selectedDatasets]);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return mergedPlayers;
    return mergedPlayers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [mergedPlayers, searchTerm]);

  const leaderboard = useMemo(() => {
    const sorted = [...mergedPlayers];
    if (displayMode === 'profit') {
      return sorted.sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 100);
    }
    return sorted.sort((a, b) => b.winRate - a.winRate).slice(0, 100);
  }, [mergedPlayers, displayMode]);

  const filteredLeaderboard = useMemo(() => {
    if (!searchTerm) return leaderboard;
    return leaderboard.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [leaderboard, searchTerm]);

  const top50 = useMemo(() => {
    const sorted = [...mergedPlayers];
    if (displayMode === 'profit') {
      return sorted.sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 50);
    }
    return sorted.sort((a, b) => b.winRate - a.winRate).slice(0, 50);
  }, [mergedPlayers, displayMode]);

  const densityData = useMemo(() => {
    const minVal = -15;
    const maxVal = 20;
    const step = 1;
    
    const bins = [];
    for (let v = minVal; v <= maxVal; v += step) {
      bins.push({ value: v, countA: 0, countB: 0 });
    }
    
    selectedDatasets.forEach((dataset, index) => {
      const players = PLAYERS_BY_DATASET[dataset.key] || [];
      
      players.forEach(player => {
        const val = player.winRate;
        const binIndex = bins.findIndex(b => val >= b.value && val < b.value + step);
        if (binIndex !== -1) {
          if (index === 0) bins[binIndex].countA++;
          else bins[binIndex].countB++;
        }
      });
    });
    
    return bins.filter(b => b.value >= -10 && b.value <= 15);
  }, [selectedDatasets]);

  const getPlayerColor = (player) => {
    if (player.isMerged) return BATTLE_COLORS.merged.color;
    if (isBattleMode) return player.primaryIndex === 0 ? BATTLE_COLORS.datasetA.color : BATTLE_COLORS.datasetB.color;
    const site = player.entries?.[0]?.site;
    return SITE_CONFIG[site]?.color || '#a1a1aa';
  };

  const getPlayerGlow = (player) => {
    if (player.isMerged) return BATTLE_COLORS.merged.glow;
    if (isBattleMode) return player.primaryIndex === 0 ? BATTLE_COLORS.datasetA.glow : BATTLE_COLORS.datasetB.glow;
    const site = player.entries?.[0]?.site;
    return `${SITE_CONFIG[site]?.color}99` || 'rgba(161, 161, 170, 0.6)';
  };

  const isPlayerHighlighted = (player) => highlightedPlayer === player.id || (searchTerm && player.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const eyeOffset = getEyeOffset();

  // ============================================================
  // SUB-COMPONENTS
  // ============================================================

  const CartoonNacho = () => (
    <svg ref={nachoRef} width="90" height="90" viewBox="0 0 100 100" className="drop-shadow-[0_4px_12px_rgba(168,139,70,0.4)]">
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#a88b46" stroke="#8b7339" strokeWidth="2" />
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#facc15" opacity="0.9" />
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#facc15" opacity="0.9" />
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#facc15" opacity="0.9" />
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#a88b46" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#09090b" />
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#09090b" />
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#a88b46" opacity="0.8" />
    </svg>
  );

  const BattleCard = () => {
    if (!battleStats) return null;
    
    const { datasetA, datasetB } = battleStats;
    
    const compareMetric = (valueA, valueB, higherIsBetter = true) => {
      const diff = valueA - valueB;
      if (Math.abs(diff) < 0.01) return { winner: 'tie', diff: 0 };
      const aWins = higherIsBetter ? diff > 0 : diff < 0;
      return { winner: aWins ? 'A' : 'B', diff: Math.abs(diff) };
    };
    
    const metrics = [
      { label: 'Avg Win Rate', icon: TrendingUp, valueA: datasetA.stats.avgWinRate, valueB: datasetB.stats.avgWinRate, format: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)} bb`, higherIsBetter: true },
      { label: 'Median Win Rate', icon: Target, valueA: datasetA.stats.medianWinRate, valueB: datasetB.stats.medianWinRate, format: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)} bb`, higherIsBetter: true },
      { label: 'Top 20% Average', icon: Zap, valueA: datasetA.stats.top20Average, valueB: datasetB.stats.top20Average, format: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)} bb`, higherIsBetter: true },
      { label: 'Total Volume', icon: BarChart3, valueA: datasetA.stats.totalVolume, valueB: datasetB.stats.totalVolume, format: (v) => `${(v / 1000000).toFixed(1)}M`, higherIsBetter: true }
    ];
    const LogoA = datasetA.config.Logo;
    const LogoB = datasetB.config.Logo;
    
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        className="bg-zinc-900/60 backdrop-blur-xl border border-[rgba(168,139,70,0.2)] rounded-2xl p-6"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <LogoA size={32} />
            <div>
              <div className="text-cyan-400 text-base font-bold">{datasetA.site} {datasetA.stake}</div>
              <div className="text-zinc-500 text-xs">{datasetA.stats.playerCount} players</div>
            </div>
          </div>
          
          <div className="p-3 bg-[rgba(168,139,70,0.2)] rounded-full">
            <Swords size={28} className="text-[#a88b46]" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-pink-400 text-base font-bold">{datasetB.site} {datasetB.stake}</div>
              <div className="text-zinc-500 text-xs">{datasetB.stats.playerCount} players</div>
            </div>
            <LogoB size={32} />
          </div>
        </div>
        
        <div className="space-y-2.5">
          {metrics.map((metric, i) => {
            const comparison = compareMetric(metric.valueA, metric.valueB, metric.higherIsBetter);
            const Icon = metric.icon;
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center p-3 bg-zinc-950/50 rounded-xl"
              >
                <div className="text-left">
                  <div className={`text-base font-bold ${comparison.winner === 'A' ? 'text-cyan-400' : 'text-zinc-500'}`}
                       style={{ textShadow: comparison.winner === 'A' ? '0 0 10px rgba(34, 211, 238, 0.6)' : 'none' }}>
                    {metric.format(metric.valueA)}
                    {comparison.winner === 'A' && <span className="ml-2 text-sm">🏆</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 justify-center">
                  <Icon size={14} className="text-zinc-500" />
                  <span className="text-zinc-400 text-xs font-medium whitespace-nowrap">{metric.label}</span>
                </div>
                
                <div className="text-right">
                  <div className={`text-base font-bold ${comparison.winner === 'B' ? 'text-pink-400' : 'text-zinc-500'}`}
                       style={{ textShadow: comparison.winner === 'B' ? '0 0 10px rgba(244, 114, 182, 0.6)' : 'none' }}>
                    {comparison.winner === 'B' && <span className="mr-2 text-sm">🏆</span>}
                    {metric.format(metric.valueB)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="text-zinc-400 text-xs">
              <strong className="text-white">{mergedPlayers.filter(p => p.isMerged).length}</strong> players appear in both datasets (merged)
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const player = payload[0].payload;
    
    return (
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-[rgba(168,139,70,0.3)] rounded-xl p-4 min-w-[220px] shadow-2xl">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-700">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: getPlayerColor(player), boxShadow: `0 0 8px ${getPlayerGlow(player)}` }} />
          <span className="text-white font-semibold text-sm">{player.name}</span>
          {player.isMerged && <span className="text-white/80 text-[10px] px-1.5 py-0.5 bg-white/10 rounded">MERGED</span>}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-zinc-400 text-xs">Total Hands</span>
            <span className="text-white font-medium text-xs">{(player.hands / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400 text-xs">Win Rate</span>
            <span className={`font-bold text-xs ${player.winRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {player.winRate >= 0 ? '+' : ''}{player.winRate.toFixed(2)} bb/100
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400 text-xs">Est. Profit</span>
            <span className={`font-bold text-xs ${player.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {player.totalProfit >= 0 ? '+' : ''}${Math.round(player.totalProfit).toLocaleString()}
            </span>
          </div>
        </div>
        {player.entries && player.entries.length > 1 && (
          <div className="mt-3 pt-2 border-t border-zinc-700">
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1.5">Breakdown</div>
            {player.entries.map((e, i) => (
              <div key={i} className="flex justify-between text-xs py-0.5">
                <span className="text-zinc-400">{e.site} {e.stake}</span>
                <span className="text-zinc-300">{(e.hands / 1000000).toFixed(2)}M @ {e.winRate >= 0 ? '+' : ''}{e.winRate.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDot = (props) => {
    const { cx, cy, payload } = props;
    const isHighlighted = isPlayerHighlighted(payload);
    const color = getPlayerColor(payload);
    const size = isHighlighted ? 10 : 6;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={color}
        fillOpacity={isHighlighted ? 1 : 0.7}
        stroke={isHighlighted ? 'white' : 'none'}
        strokeWidth={2}
        style={{
          filter: isHighlighted ? `drop-shadow(0 0 10px ${getPlayerGlow(payload)})` : 'none',
          transition: 'all 0.2s ease'
        }}
      />
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white font-sans relative overflow-hidden">
      {/* Noise/Grain Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[8%] w-[900px] h-[900px] rounded-full opacity-60" 
             style={{ background: 'radial-gradient(circle, rgba(168, 139, 70, 0.08) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-[15%] -left-[12%] w-[1000px] h-[1000px] rounded-full opacity-50"
             style={{ background: 'radial-gradient(circle, rgba(168, 139, 70, 0.06) 0%, transparent 55%)', filter: 'blur(100px)' }} />
        <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] rounded-full opacity-40"
             style={{ background: 'radial-gradient(circle, rgba(168, 139, 70, 0.05) 0%, transparent 50%)', filter: 'blur(60px)' }} />
      </div>

      {/* Peripheral Bokeh Nachos */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div animate={{ x: [0, 3, 6, 4, 2, 5, 1, 0], y: [0, -5, -3, -8, -4, -6, -2, 0], rotate: [0, 2, 4, 6, 3, 5, 1, 0] }} transition={{ duration: 120, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] -left-[8%] w-[180px] h-[180px] opacity-[0.06]" style={{ filter: 'blur(18px)' }}>
          <NachoTriangle size={180} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -4, -2, -6, -4, -3, 0], y: [0, -6, -10, -4, -7, 0] }} transition={{ duration: 140, repeat: Infinity, ease: "easeInOut", delay: 40 }}
          className="absolute top-[40%] -left-[12%] w-[220px] h-[220px] opacity-[0.05]" style={{ filter: 'blur(22px)' }}>
          <NachoTriangle size={220} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 3, 6, 4, 2, 5, 1, 0], y: [0, -5, -3, -8, -4, -6, -2, 0] }} transition={{ duration: 100, repeat: Infinity, ease: "easeInOut", delay: 70 }}
          className="absolute bottom-[10%] -left-[6%] w-[160px] h-[160px] opacity-[0.07]" style={{ filter: 'blur(16px)' }}>
          <NachoTriangle size={160} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -4, -2, -6, -4, -3, 0], y: [0, -6, -10, -4, -7, 0] }} transition={{ duration: 130, repeat: Infinity, ease: "easeInOut", delay: 20 }}
          className="absolute top-[8%] -right-[10%] w-[200px] h-[200px] opacity-[0.05]" style={{ filter: 'blur(20px)' }}>
          <NachoTriangle size={200} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 3, 6, 4, 2, 5, 1, 0], y: [0, -5, -3, -8, -4, -6, -2, 0] }} transition={{ duration: 150, repeat: Infinity, ease: "easeInOut", delay: 60 }}
          className="absolute top-[50%] -right-[14%] w-[240px] h-[240px] opacity-[0.04]" style={{ filter: 'blur(24px)' }}>
          <NachoTriangle size={240} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -4, -2, -6, -4, -3, 0], y: [0, -6, -10, -4, -7, 0] }} transition={{ duration: 110, repeat: Infinity, ease: "easeInOut", delay: 90 }}
          className="absolute bottom-[15%] -right-[8%] w-[170px] h-[170px] opacity-[0.06]" style={{ filter: 'blur(17px)' }}>
          <NachoTriangle size={170} opacity={1} />
        </motion.div>
      </div>

      {/* Foreground Bokeh Nachos */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <motion.div animate={{ x: [0, 8, 15, 10, 5, 0], y: [0, -12, -8, -18, -5, 0], rotate: [0, 8, 15, 22, 12, 0] }} transition={{ duration: 80, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[3%] w-[90px] h-[90px] opacity-[0.12]" style={{ filter: 'blur(12px)' }}>
          <NachoTriangle size={90} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -10, -5, -12, 0], y: [0, -15, -25, -10, 0], rotate: [0, -12, -20, -8, 0] }} transition={{ duration: 90, repeat: Infinity, ease: "easeInOut", delay: 30 }}
          className="absolute bottom-[10%] right-[5%] w-[110px] h-[110px] opacity-[0.10]" style={{ filter: 'blur(14px)' }}>
          <NachoTriangle size={110} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 12, 6, 0], y: [0, -20, -10, 0], rotate: [0, 18, 10, 0] }} transition={{ duration: 70, repeat: Infinity, ease: "easeInOut", delay: 45 }}
          className="absolute top-[45%] -left-[2%] w-[80px] h-[80px] opacity-[0.08]" style={{ filter: 'blur(10px)' }}>
          <NachoTriangle size={80} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 8, 15, 10, 5, 0], y: [0, -12, -8, -18, -5, 0], rotate: [0, 8, 15, 22, 12, 0] }} transition={{ duration: 85, repeat: Infinity, ease: "easeInOut", delay: 60 }}
          className="absolute top-[15%] right-[8%] w-[70px] h-[70px] opacity-[0.09]" style={{ filter: 'blur(11px)' }}>
          <NachoTriangle size={70} opacity={1} />
        </motion.div>
      </div>

      {/* Midground Bokeh Nachos */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <motion.div animate={{ x: [0, 20, 35, 25, 10, 0], y: [0, -30, -20, -40, -15, 0], rotate: [0, 25, 50, 75, 55, 0] }} transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-[40px] h-[40px] opacity-[0.18]" style={{ filter: 'blur(4px)' }}>
          <NachoTriangle size={40} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -25, -15, -30, 0], y: [0, -35, -50, -25, 0], rotate: [0, -40, -80, -50, 0] }} transition={{ duration: 50, repeat: Infinity, ease: "easeInOut", delay: 15 }}
          className="absolute top-[60%] right-[20%] w-[35px] h-[35px] opacity-[0.16]" style={{ filter: 'blur(5px)' }}>
          <NachoTriangle size={35} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 30, 15, 0], y: [0, -25, -45, 0], rotate: [0, 60, 120, 0] }} transition={{ duration: 55, repeat: Infinity, ease: "easeInOut", delay: 25 }}
          className="absolute bottom-[30%] left-[8%] w-[45px] h-[45px] opacity-[0.15]" style={{ filter: 'blur(4px)' }}>
          <NachoTriangle size={45} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 20, 35, 25, 10, 0], y: [0, -30, -20, -40, -15, 0], rotate: [0, 25, 50, 75, 55, 0] }} transition={{ duration: 48, repeat: Infinity, ease: "easeInOut", delay: 35 }}
          className="absolute top-[35%] right-[12%] w-[38px] h-[38px] opacity-[0.14]" style={{ filter: 'blur(3px)' }}>
          <NachoTriangle size={38} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -25, -15, -30, 0], y: [0, -35, -50, -25, 0], rotate: [0, -40, -80, -50, 0] }} transition={{ duration: 42, repeat: Infinity, ease: "easeInOut", delay: 40 }}
          className="absolute top-[75%] left-[25%] w-[32px] h-[32px] opacity-[0.17]" style={{ filter: 'blur(4px)' }}>
          <NachoTriangle size={32} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 30, 15, 0], y: [0, -25, -45, 0], rotate: [0, 60, 120, 0] }} transition={{ duration: 52, repeat: Infinity, ease: "easeInOut", delay: 50 }}
          className="absolute top-[10%] left-[55%] w-[42px] h-[42px] opacity-[0.13]" style={{ filter: 'blur(4px)' }}>
          <NachoTriangle size={42} opacity={1} />
        </motion.div>
      </div>

      {/* Background (Focal) Bokeh Nachos */}
      <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
        <motion.div animate={{ x: [0, 25, 50, 35, 60, 40, 20, 0], y: [0, -40, -25, -60, -35, -55, -30, 0], rotate: [0, 45, 90, 150, 200, 270, 320, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[25%] left-[20%] w-[18px] h-[18px] opacity-[0.35]" style={{ filter: 'blur(0.5px)' }}>
          <NachoTriangle size={18} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -35, -20, -50, -30, -15, 0], y: [0, -50, -30, -45, -60, -25, 0], rotate: [0, -60, -120, -180, -250, -310, -360] }} transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 8 }}
          className="absolute top-[55%] right-[25%] w-[15px] h-[15px] opacity-[0.30]" style={{ filter: 'blur(0.5px)' }}>
          <NachoTriangle size={15} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 25, 50, 35, 60, 40, 20, 0], y: [0, -40, -25, -60, -35, -55, -30, 0], rotate: [0, 45, 90, 150, 200, 270, 320, 360] }} transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 12 }}
          className="absolute bottom-[35%] left-[35%] w-[20px] h-[20px] opacity-[0.28]" style={{ filter: 'blur(0.5px)' }}>
          <NachoTriangle size={20} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -35, -20, -50, -30, -15, 0], y: [0, -50, -30, -45, -60, -25, 0], rotate: [0, -60, -120, -180, -250, -310, -360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 18 }}
          className="absolute top-[40%] right-[35%] w-[16px] h-[16px] opacity-[0.32]" style={{ filter: 'blur(0.5px)' }}>
          <NachoTriangle size={16} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, 25, 50, 35, 60, 40, 20, 0], y: [0, -40, -25, -60, -35, -55, -30, 0], rotate: [0, 45, 90, 150, 200, 270, 320, 360] }} transition={{ duration: 26, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute top-[15%] left-[45%] w-[14px] h-[14px] opacity-[0.25]" style={{ filter: 'blur(0.5px)' }}>
          <NachoTriangle size={14} opacity={1} />
        </motion.div>
        <motion.div animate={{ x: [0, -35, -20, -50, -30, -15, 0], y: [0, -50, -30, -45, -60, -25, 0], rotate: [0, -60, -120, -180, -250, -310, -360] }} transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: 15 }}
          className="absolute bottom-[20%] right-[40%] w-[17px] h-[17px] opacity-[0.27]" style={{ filter: 'blur(0.5px)' }}>
          <NachoTriangle size={17} opacity={1} />
        </motion.div>
      </div>

      <style>{`
        @keyframes traceBorder {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .spark-border-gold { 
          position: relative; 
          overflow: hidden; 
          border-radius: 24px; 
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .spark-border-gold::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          border-radius: inherit; 
          padding: 1px; 
          background: linear-gradient(135deg, rgba(168, 139, 70, 0.5), rgba(168, 139, 70, 0.15)); 
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
          -webkit-mask-composite: xor; 
          mask-composite: exclude; 
          z-index: 1; 
          pointer-events: none; 
        }
        .spark-border-gold::after { 
          content: ""; 
          position: absolute; 
          top: 0; 
          left: 0; 
          width: 80px; 
          height: 2px; 
          background: linear-gradient(90deg, transparent 0%, #a88b46 50%, #a88b46 100%); 
          box-shadow: 0 0 15px 2px rgba(168, 139, 70, 0.6); 
          offset-path: rect(0 100% 100% 0 round 24px); 
          animation: traceBorder 6s linear infinite; 
          z-index: 2; 
          pointer-events: none; 
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NachosPokerNavBar />
        
        {/* CTA Banner with Sparkborder */}
        <div className="spark-border-gold mb-6 p-7">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>
                Win Rate <span style={{ color: '#a88b46' }}>Dashboard</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Compare win rates across 3,000 players and 5 poker sites. Ready for structured guidance? Explore the Mentorship Program.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a 
                href="https://www.nachospoker.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm text-zinc-950
                           transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,139,70,0.3)] hover:-translate-y-0.5"
                style={{ background: '#a88b46' }}
              >
                Join Our CFP <ExternalLink size={14} />
              </a>
              <a 
                href="https://calendly.com/patrickgerritsen90/30min" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-transparent px-5 py-3 rounded-lg font-semibold text-sm
                           transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: '1.5px solid #a88b46', color: '#a88b46' }}
              >
                Private Coaching <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-6"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Win Rate Dashboard
            </h1>
            <p className="text-zinc-400 text-sm">
              Select up to 2 datasets to compare • 3,000 player records across 5 sites
            </p>
          </div>

          {/* Site/Stake Selection Grid */}
          <div className="bg-zinc-950/50 rounded-xl p-5 mb-6 border border-zinc-800/50">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <span className="text-zinc-400 text-sm">
                Click a stake to select • <span className="text-[#a88b46] font-medium">{selectedDatasets.length}/{MAX_SELECTIONS}</span> selected
              </span>
              {selectedDatasets.length > 0 && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDatasets([])}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium
                             transition-colors hover:bg-red-500/20"
                >
                  Clear All
                </motion.button>
              )}
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            >
              {AVAILABLE_SITES.map(site => {
                const config = SITE_CONFIG[site];
                const stakes = STAKES_BY_SITE[site] || [];
                const SiteLogo = config.Logo;
                
                return (
                  <motion.div 
                    key={site} 
                    variants={scaleIn}
                    className="bg-zinc-900/50 rounded-xl p-4 border transition-colors"
                    style={{ borderColor: `${config.color}30` }}
                  >
                    {/* Site Header */}
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b" style={{ borderColor: `${config.color}30` }}>
                      <SiteLogo size={24} />
                      <span className="font-bold text-sm" style={{ color: config.color }}>{site}</span>
                    </div>
                    
                    {/* Stakes */}
                    <div className="flex flex-col gap-1.5">
                      {stakes.map(stake => {
                        const isSelected = isDatasetSelected(site, stake);
                        const selIndex = getSelectionIndex(site, stake);
                        const isDisabled = !isSelected && !canSelectMore;
                        
                        let btnColor = config.color;
                        let btnBg = 'rgba(255,255,255,0.05)';
                        let btnBorder = 'transparent';
                        
                        if (isSelected) {
                          btnColor = isBattleMode 
                            ? (selIndex === 0 ? BATTLE_COLORS.datasetA.color : BATTLE_COLORS.datasetB.color)
                            : config.color;
                          btnBg = isBattleMode 
                            ? (selIndex === 0 ? BATTLE_COLORS.datasetA.bg : BATTLE_COLORS.datasetB.bg)
                            : `${config.color}30`;
                          btnBorder = btnColor;
                        }
                        
                        return (
                          <motion.button
                            key={stake}
                            whileHover={!isDisabled ? { scale: 1.02 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                            onClick={() => !isDisabled && toggleDataset(site, stake)}
                            disabled={isDisabled}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border-2
                                       ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}
                                       ${isSelected ? 'animate-pulse' : ''}`}
                            style={{
                              color: isSelected ? btnColor : 'rgba(255,255,255,0.6)',
                              background: btnBg,
                              borderColor: btnBorder,
                              boxShadow: isSelected ? `0 0 12px ${btnColor}40` : 'none'
                            }}
                          >
                            {isSelected && <span className="mr-1">{selIndex === 0 ? '①' : '②'}</span>}
                            {stake}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Controls Row */}
          <div className="flex gap-4 mb-6 flex-wrap items-center justify-between">
            {/* Search Bar */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search players..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full py-2.5 pl-11 pr-4 bg-zinc-950/70 border border-zinc-800 rounded-lg text-white text-sm
                           placeholder-zinc-500 transition-all duration-200
                           focus:outline-none focus:border-[rgba(168,139,70,0.5)] focus:ring-2 focus:ring-[rgba(168,139,70,0.2)]"
              />
            </div>

            {/* Display Mode Toggle */}
            <div className="flex bg-zinc-900/80 rounded-xl p-1 border border-zinc-800">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                           ${displayMode === 'winRate' 
                             ? 'bg-gradient-to-r from-[rgba(168,139,70,0.3)] to-[rgba(168,139,70,0.2)] text-[#a88b46] shadow-lg' 
                             : 'text-zinc-400 hover:text-zinc-200'}`}
                onClick={() => setDisplayMode('winRate')}
              >
                <TrendingUp size={16} /> bb/100
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                           ${displayMode === 'profit' 
                             ? 'bg-gradient-to-r from-[rgba(168,139,70,0.3)] to-[rgba(168,139,70,0.2)] text-[#a88b46] shadow-lg' 
                             : 'text-zinc-400 hover:text-zinc-200'}`}
                onClick={() => setDisplayMode('profit')}
              >
                <DollarSign size={16} /> Profit ($)
              </motion.button>
            </div>
          </div>

          {/* Dashboard Grid: Chart + Leaderboard */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
            {/* Chart Panel */}
            <motion.div 
              variants={scaleIn}
              className="bg-zinc-900/40 backdrop-blur border border-zinc-800/50 rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h3 className="text-[#a88b46] text-base font-semibold">
                  {chartView === 'scatter' ? 'Player Distribution' : chartView === 'bar' ? 'Top 50 Rankings' : 'Win Rate Distribution'}
                </h3>
                <div className="flex bg-zinc-950/60 rounded-lg p-1 border border-zinc-800">
                  {[
                    { id: 'scatter', icon: LayoutGrid, label: 'Scatter' },
                    { id: 'bar', icon: BarChart3, label: 'Top 50' },
                    { id: 'density', icon: Flame, label: 'Distribution' }
                  ].map(view => (
                    <button
                      key={view.id}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all
                                 ${chartView === view.id 
                                   ? 'bg-[rgba(168,139,70,0.2)] text-[#a88b46]' 
                                   : 'text-zinc-500 hover:text-zinc-300'}`}
                      onClick={() => setChartView(view.id)}
                    >
                      <view.icon size={14} /> {view.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDatasets.length === 0 ? (
                <div className="h-[420px] flex items-center justify-center flex-col gap-3">
                  <Layers size={48} className="text-zinc-700" />
                  <p className="text-zinc-500 text-sm">Select datasets above to view data</p>
                </div>
              ) : (
                <div className="h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartView === 'scatter' ? (
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" dataKey="hands" name="Hands" tickFormatter={v => `${(v/1000000).toFixed(1)}M`} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} label={{ value: 'Total Hands', position: 'bottom', offset: 20, fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                        <YAxis type="number" dataKey={displayMode === 'profit' ? 'totalProfit' : 'winRate'} name={displayMode === 'profit' ? 'Profit' : 'Win Rate'} domain={displayMode === 'profit' ? ['auto', 'auto'] : [-10, 10]} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={v => displayMode === 'profit' ? `$${(v/1000).toFixed(0)}k` : v.toFixed(1)} label={{ value: displayMode === 'profit' ? 'Total Profit ($)' : 'Win Rate (bb/100)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter data={searchTerm ? filteredPlayers : mergedPlayers} shape={renderDot} onMouseEnter={(data) => setHighlightedPlayer(data.id)} onMouseLeave={() => setHighlightedPlayer(null)} />
                      </ScatterChart>
                    ) : chartView === 'bar' ? (
                      <BarChart data={top50} margin={{ top: 20, right: 20, bottom: 60, left: 20 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickFormatter={v => displayMode === 'profit' ? `$${(v/1000).toFixed(0)}k` : v.toFixed(1)} />
                        <YAxis type="category" dataKey="name" width={120} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} tickFormatter={v => v.length > 15 ? v.slice(0, 15) + '...' : v} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey={displayMode === 'profit' ? 'totalProfit' : 'winRate'} radius={[0, 4, 4, 0]}>
                          {top50.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getPlayerColor(entry)} fillOpacity={isPlayerHighlighted(entry) ? 1 : 0.7} style={{ filter: isPlayerHighlighted(entry) ? `drop-shadow(0 0 8px ${getPlayerGlow(entry)})` : 'none' }} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <AreaChart data={densityData} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                        <defs>
                          <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={BATTLE_COLORS.datasetA.color} stopOpacity={0.6} />
                            <stop offset="100%" stopColor={BATTLE_COLORS.datasetA.color} stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={BATTLE_COLORS.datasetB.color} stopOpacity={0.6} />
                            <stop offset="100%" stopColor={BATTLE_COLORS.datasetB.color} stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="value" type="number" domain={[-10, 15]} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} label={{ value: 'Win Rate (bb/100)', position: 'bottom', offset: 20, fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                        <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} label={{ value: 'Player Count', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                        <Tooltip content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="bg-zinc-900/95 backdrop-blur-xl border border-[rgba(168,139,70,0.3)] rounded-xl p-4 min-w-[180px]">
                              <div className="text-[#a88b46] font-semibold mb-2">{d.value} to {d.value + 1} bb/100</div>
                              {selectedDatasets.length >= 1 && (
                                <div className="flex justify-between mb-1">
                                  <span className="text-cyan-400 text-xs">{selectedDatasets[0]?.site} {selectedDatasets[0]?.stake}</span>
                                  <span className="text-cyan-400 font-semibold">{d.countA}</span>
                                </div>
                              )}
                              {selectedDatasets.length === 2 && (
                                <div className="flex justify-between">
                                  <span className="text-pink-400 text-xs">{selectedDatasets[1]?.site} {selectedDatasets[1]?.stake}</span>
                                  <span className="text-pink-400 font-semibold">{d.countB}</span>
                                </div>
                              )}
                            </div>
                          );
                        }} />
                        <ReferenceLine x={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5" />
                        <Area type="monotone" dataKey="countA" stroke={BATTLE_COLORS.datasetA.color} strokeWidth={2} fill="url(#gradientA)" />
                        {isBattleMode && (
                          <Area type="monotone" dataKey="countB" stroke={BATTLE_COLORS.datasetB.color} strokeWidth={2} fill="url(#gradientB)" />
                        )}
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}

              {/* Legend */}
              {selectedDatasets.length > 0 && (
                <div className="p-3 bg-zinc-950/50 rounded-lg mt-3 border border-zinc-800/50">
                  <div className="flex justify-center gap-6 flex-wrap">
                    {selectedDatasets.map((dataset, index) => (
                      <div key={dataset.key} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ 
                            background: isBattleMode ? (index === 0 ? BATTLE_COLORS.datasetA.color : BATTLE_COLORS.datasetB.color) : SITE_CONFIG[dataset.site].color,
                            boxShadow: `0 0 8px ${isBattleMode ? (index === 0 ? BATTLE_COLORS.datasetA.glow : BATTLE_COLORS.datasetB.glow) : SITE_CONFIG[dataset.site].color}` 
                          }} 
                        />
                        <span 
                          className="text-xs font-medium"
                          style={{ color: isBattleMode ? (index === 0 ? BATTLE_COLORS.datasetA.color : BATTLE_COLORS.datasetB.color) : 'white' }}
                        >
                          {dataset.site} {dataset.stake}
                        </span>
                      </div>
                    ))}
                    {isBattleMode && mergedPlayers.filter(p => p.isMerged).length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        <span className="text-white text-xs font-medium">Merged</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Leaderboard Panel */}
            <motion.div 
              variants={scaleIn}
              className="bg-zinc-900/40 backdrop-blur border border-zinc-800/50 rounded-xl flex flex-col overflow-hidden"
            >
              <div className="p-5 pb-3 border-b border-zinc-800/50">
                <div className="flex items-center gap-2.5 mb-2">
                  <Trophy size={20} className="text-[#a88b46]" />
                  <h3 className="text-[#a88b46] text-base font-semibold">
                    Top 100 by {displayMode === 'profit' ? 'Profit' : 'Win Rate'}
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs">Combined stats across selected datasets</p>
              </div>
              
              <div className="grid grid-cols-[44px_1fr_90px] px-5 py-2.5 bg-zinc-950/50 border-b border-zinc-800/50">
                <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">#</span>
                <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Player</span>
                <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider text-right">{displayMode === 'profit' ? 'Profit' : 'WR'}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                {filteredLeaderboard.length === 0 ? (
                  <div className="py-10 px-5 text-center">
                    <p className="text-zinc-500 text-sm">{selectedDatasets.length === 0 ? 'Select datasets above' : 'No players found'}</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredLeaderboard.slice(0, 50).map((player) => {
                      const originalRank = leaderboard.findIndex(p => p.id === player.id) + 1;
                      const isHighlighted = isPlayerHighlighted(player);
                      const playerColor = getPlayerColor(player);
                      
                      return (
                        <motion.div 
                          key={player.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`grid grid-cols-[44px_1fr_90px] items-center py-3 px-5 border-b border-zinc-800/30 cursor-pointer
                                     transition-all duration-200 hover:bg-white/5 hover:translate-x-1
                                     ${isHighlighted ? 'bg-[rgba(168,139,70,0.1)] border-l-2 border-l-[#a88b46]' : ''}`}
                          onMouseEnter={() => setHighlightedPlayer(player.id)} 
                          onMouseLeave={() => setHighlightedPlayer(null)}
                        >
                          <div className="flex items-center">
                            {originalRank <= 3 ? (
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center
                                             ${originalRank === 1 ? 'bg-gradient-to-br from-#a88b46 to-#a88b46' : 
                                               originalRank === 2 ? 'bg-gradient-to-br from-zinc-300 to-zinc-500' : 
                                               'bg-gradient-to-br from-amber-600 to-amber-800'}`}>
                                {originalRank === 1 ? <Crown size={12} className="text-zinc-900" /> : <Award size={12} className="text-zinc-900" />}
                              </div>
                            ) : (
                              <span className="text-zinc-500 text-xs font-medium pl-2">{originalRank}</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0" 
                                style={{ background: playerColor, boxShadow: `0 0 6px ${playerColor}` }} 
                              />
                              <span className="text-white text-xs font-medium truncate">{player.name}</span>
                              {player.isMerged && (
                                <span className="text-white/80 text-[8px] px-1 py-0.5 bg-white/10 rounded flex-shrink-0">M</span>
                              )}
                            </div>
                            <div className="text-zinc-500 text-[10px]">{(player.hands / 1000000).toFixed(1)}M hands</div>
                          </div>
                          <div className="text-right">
                            {displayMode === 'profit' ? (
                              <div className={`text-sm font-semibold ${player.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {player.totalProfit >= 0 ? '+' : ''}${Math.round(player.totalProfit).toLocaleString()}
                              </div>
                            ) : (
                              <div className={`text-sm font-semibold ${player.winRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {player.winRate >= 0 ? '+' : ''}{player.winRate.toFixed(2)} bb
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Head-to-Head Comparison */}
        <AnimatePresence>
          {isBattleMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                  <Swords size={28} className="text-[#a88b46]" />
                  Head-to-Head Comparison
                </h2>
                <p className="text-zinc-500 text-sm">
                  {selectedDatasets[0]?.site} {selectedDatasets[0]?.stake} vs {selectedDatasets[1]?.site} {selectedDatasets[1]?.stake}
                </p>
              </div>
              
              <BattleCard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formula Reference */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle size={22} className="text-[#a88b46]" />
            <h2 className="text-lg font-semibold text-white">Calculation Formulas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <motion.div 
              variants={scaleIn}
              className="bg-cyan-500/10 p-5 rounded-xl border border-cyan-500/20"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <TrendingUp size={18} className="text-cyan-400" />
                <h3 className="text-cyan-400 text-sm font-semibold">Weighted Win Rate</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Merging across datasets:<br />
                <code className="bg-zinc-950/50 px-2.5 py-1.5 rounded text-[11px] block mt-2 text-cyan-300">WR = Σ(WR_i × Hands_i) / Σ(Hands_i)</code>
              </p>
            </motion.div>

            <motion.div 
              variants={scaleIn}
              className="bg-pink-500/10 p-5 rounded-xl border border-pink-500/20"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <DollarSign size={18} className="text-pink-400" />
                <h3 className="text-pink-400 text-sm font-semibold">Total Profit</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Sum across stakes:<br />
                <code className="bg-zinc-950/50 px-2.5 py-1.5 rounded text-[11px] block mt-2 text-pink-300">Profit = Σ(WR/100 × Hands × BB$)</code>
              </p>
            </motion.div>

            <motion.div 
              variants={scaleIn}
              className="bg-[rgba(168,139,70,0.1)] p-5 rounded-xl border border-[rgba(168,139,70,0.2)]"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Target size={18} className="text-[#a88b46]" />
                <h3 className="text-[#a88b46] text-sm font-semibold">Data Sources</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                30 datasets, 3,000 players<br />
                <span className="text-zinc-500 text-[11px] block mt-2">
                  GGPoker • PokerStars • iPoker<br />Winamax • WPN
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NachoStatsDashboard;

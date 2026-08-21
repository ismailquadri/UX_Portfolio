---
slug: ryno-finance
title: "Ryno - Compliance Infrastructure That Scales Across Borders"
category: FinTech
summary: "How a 3-person compliance team scaled from 3 countries to 12 without hiring"
role: "Lead Product Designer — End-to-end UX"
team: "1 PM, 3 engineers, 1 compliance officer, 1 QA"
client: "Ryno — B2B crypto payout platform"
duration: "~4 months"
metrics:
  - value: "79%"
    label: "Faster wallet screening decisions (12 min -> 2.5 min)"
  - value: "3-4 days"
    label: "To configure a new country's onboarding rules, down from 3 weeks"
  - value: "62%"
    label: "Fewer partner support tickets in the first month"
  - value: "2"
    label: "New markets launched by ops alone, zero engineering tickets"
---

## Problem
Ryno moves crypto payouts across borders for other businesses. Every country their clients pay into comes with its own KYC rules, its own accepted document types, its own risk thresholds — and regulators everywhere expect proof you're actually following those rules, not just claiming to.

When I joined, Ryno was live in 3 markets with a roadmap to hit 12+ within 18 months. The problem wasn't that they needed a dashboard — dashboards are the easy part. The real problem was structural: everything that made a market "new" — document requirements, risk rules, onboarding steps — was being hand-built each time, by hand.

And it wasn't one team feeling this pain, it was three, each wanting something different from the same system. Compliance needed to move fast without cutting corners. Operations needed to launch new countries without waiting on engineering every time. Treasury partners needed visibility into their own numbers without going through an account manager. None of those needs were compatible with a single generic tool — which is part of why the existing setup had quietly fragmented into a spreadsheet, a Google Doc, and a lot of Slack.

Wallet screening decisions were happening in that shared spreadsheet: check a blockchain explorer, cross-reference some rules in your head, type "approved" in a cell. No audit trail, no memory of whether this wallet had been flagged before. It was taking about 12 minutes per wallet, and the backlog was growing 15% a week.

Country launches weren't much better. Compliance would write requirements in a Google Doc, an engineer would translate that into code, QA would catch the gaps, repeat. Three weeks, every time, for every country — even when the new country's rules looked a lot like the last one's.

## Process
- Shadowed the compliance officer through three live screening sessions and clocked it: 60% of her time wasn't spent deciding anything, it was spent gathering context across four open tabs — a spreadsheet, a block explorer, a risk tool, and Slack
- She had real risk heuristics in her head that weren't written down anywhere ("if inflow is zero but outflow exists, that's suspicious regardless of score") — the tool wasn't just slow, it wasn't capturing what she actually knew
- Walked through three recent country launches with operations and found the same shape every time: documents + verification method + validity window + risk rules — just never treated as a repeatable pattern
- Looked at how partners were actually using Ryno (via the PM's interview notes) and every request boiled down to the same thing: let me answer my own question instead of emailing an account manager

## Obstacles
The turning point in this project was realizing the compliance team's bottleneck wasn't decision-making capacity — it was context assembly. Once that clicked, "give people faster access to the right information" became the actual design problem, for all three roles, not just compliance.

My first instinct was one dashboard that surfaced everything — wallet queues, partner stats, onboarding pipelines, all in one place. I sketched it and brought it to the compliance officer, expecting a good reaction.

She shut it down immediately: "This is overwhelming. When I'm screening wallets, I don't care about onboarding. Give me focus." That stung a little, but she was right, and it reframed the whole project for me — in compliance work, cognitive overload isn't just annoying, it causes actual errors, and errors here have regulatory consequences. Focus wasn't a nice-to-have, it was a safety requirement.

That's what pushed me toward splitting the product into separate role-based portals instead of adjusting the one-dashboard idea — a compliance portal and a treasury partner portal, each built for how that person actually works, not sharing screen real estate with a job they don't have. Inside the compliance portal, I split further into focused workspaces — wallet screening, document review, country configuration — so nobody screening wallets ever has to look at an onboarding pipeline they don't care about right now.

The other real tension showed up in the country-configuration work. Operations wanted flexibility — every country is a little different, and they didn't want to keep waiting on engineering. But total flexibility, a blank form builder, meant it would be trivially easy to misconfigure a country and miss a required document category, which is exactly the kind of mistake that gets you in trouble with a regulator. I went back and forth on this for a while before landing on a structured template: the system already knows the categories a country needs — identity docs, address proof, financial docs — operations just fills in the specifics. Constrained enough to prevent mistakes, flexible enough to actually work.

## Solution
### The wallet screening queue
I built the queue around one rule: everything needed to make a decision has to be visible without scrolling or opening another tab. Risk tier comes first because that's how she actually triages — high-risk wallets before medium, medium before low — then the wallet address, currency and network, and how long it's been waiting.

Clicking into a wallet opens a side panel instead of a new page, on purpose. A full page navigation costs her 3-4 seconds of re-orientation every single time — multiply that by a queue of a few hundred and it adds up to real minutes. The panel shows the screening evidence, transaction history, and why it was flagged; she approves or rejects from the same panel, and it closes straight back into her place in the queue.

When the queue is actually empty, the interface doesn't just go blank — it tells her "All clear" and shows the day's numbers: screened, flagged, total. Small thing, but it gave her a sense of progress and doubled as reporting she didn't have to ask for.

### Country-specific onboarding configuration
This is the piece that let operations launch new markets without an engineering ticket. Instead of a blank canvas, every country is built from the same structured template: document types, verification method per document, how old a document is allowed to be, which risk tiers trigger extra scrutiny. You can't accidentally skip a required category, because the system already knows the categories.

The view itself uses progressive disclosure — country cards up top show how much of a country's config is done versus outstanding, and drilling into one reveals the full structure. Two new markets went live on this system without me or an engineer touching them.

### The treasury partner portal
Partners get a scoped view of exactly their own world — their customers, their volumes, their settlement status — mirroring the same information architecture as the compliance side, just walled off entirely to one partner's data. That wall isn't just a permission check, it's architecturally separate, so cross-partner data leakage isn't a "please don't" — it's not possible by the way the system is built.

## Outcome
Eight weeks after launch, wallet screening decisions dropped from about 12 minutes to about 2.5 — the compliance officer told me flatly, "I don't tab-switch anymore." Country configuration went from three weeks with an engineer involved to three or four days without one; two markets shipped on this system with zero engineering tickets. Partner support tickets dropped 62% in the first month because partners could just look the answer up themselves.

What mattered more to me than the numbers, honestly, was hearing her say she was making decisions "without second-guessing" — because for the first time, everything she needed was actually on the screen. Ryno's now pitching the partner portal to new treasury partners as a selling point, and the auditable screening workflow became part of their story going into their next funding round.

## Close
If I did this again, I'd instrument the old process properly before touching anything — I only have "12 minutes a wallet" because I sat and watched it happen, and stronger before/after numbers would've sharpened my priorities earlier, not just made a better slide later. I'd also go talk to treasury partners myself instead of working from the PM's notes — the portal held up fine, but I suspect a direct conversation would've caught some of the multi-currency reporting edge cases before they needed a late revision. And I'd run a real accessibility audit on the risk color system earlier — red/amber/green with text labels felt sufficient under deadline pressure, but misreading a risk level in a compliance tool has real consequences, and that shouldn't have waited.

The biggest thing I took from this project: constraints are the product. The country-configuration system works because it's constrained, not despite it — a blank canvas would've been easier to build and worse to use. And in a regulated domain, "simple" is genuinely hard to earn — every screen here has fewer elements than my first draft of it, and cutting things from a compliance tool is terrifying, because what if someone needs it? The shadowing sessions were what convinced me: more information doesn't help anyone make a better decision, the right information does.

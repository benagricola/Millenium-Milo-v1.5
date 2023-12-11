# Introduction

Take a deep breath for a second and realize something.

You... yes **YOU**, are about to commit to building a robot that can cut through metal, let alone your squishy human parts.
A machine that can easily electrocute you, cut you or set fire to your whole neighborhood if it's not given the respect it deserves.

**Please** give this machine the respect it deserves !!!

!!! warning

    Please follow the manual to the letter and perform any additional research you deem necessary before attempting to use Milo for the first time.

    If there is anything, and we mean _anything_ that you are curious or unsure about, you are more than welcome to ask us on our discord server.

    After all, you are special to us and we don't want you to get hurt.

Most importantly from everyone at the Millennium Machines team, have fun building your very first Milo!

---

## Bill of Materials

Provided [here](../../bom/sourcing_guide.md) is the bill of materials. Whilst we recommend that you try to stick to this list as much as possible, you're an adult (hopefully) and this is your machine. If there is a substitution that you think would lead to a better machine then feel free! If there is a feature you don't feel is necessary then don't buy the parts for it.

Furthermore, there are options in the guide that are up to you to decide on, such as drivers, motors and even control boards. Do your research and find what you need to make your build work for you.

---

## Spindle Selection

Milo supports 2 sizes of round spindle - 80mm or 65mm. These cover the 2 most common spindle sizes for a DIY mill of this type. In terms of what you're looking for when buying a spindle, you'll want a minimum of 800w of power.

You can then decide how you want to control your spindle - the simplest types are router style spindles which use a switch and or selector knob for manual control of speed and direction. The most complex but also most powerful way involves using a Spindle and VFD combination. With this setup you have more granular control over your settings, and can use outputs on your control board to control the spindle itself.

!!! note
    There are too many styles of spindle to realistically account for, so if the spindle mount doesn't support your spindle then design a new one and send it our way and we may include it as an official user mod!

---

## Parts List and Printing Guidelines

The Millennium Machines team has provided a printing list with settings for you as a guideline for printing the parts necessary for the build. This list can be found [here](../../printing/print_guide.md).

Remember, these settings are only a guideline, and are open to your own interpretations - but we do highly recommend following them to achieve the best mechanical properties for each individual part.

### File Naming

With your STL files downloaded and your printer warmed up, you may be wondering which parts to print in your favorite colors? Have no fear, we've got your back - each file is labelled.

#### Primary Color

Example: `Handwheel Body x2.stl`
These files have no prefix in their filename so are safe to print in your primary color.

#### Accent Color

Example: `[a] Table Bolt Down Bracket A x2.stl`
These files are prefixed with `[a]` and are intended to be printed in your chosen accent color.

#### Quantity Required

Example: `Handwheel Body x2.stl`
If any file ends with `x#`, that is telling you the quantity of that part required to build the machine.

#### Part Versions

Example: `Skirt Front A xxxxxx.stl`

Note the descriptor at the end of the file name - while there are many types of Skirt Front "A" files, they all vary in their design and some are even mirrors of others so as to mount devices on either side.

!!! tip
    Some printed parts have multiple versions in order to cater for different machine setups - be aware that not all versions need to be printed to build your machine.

    ![skirt variants picture](../img/skirt_variant.png){: .shadow}

    Choose the parts you need based on your build requirements.

---

## Drilling Out Holes

To make some features printable without support, some features are printed with a sacrificial floor. These parts will need to be drilled and or cut out before use.

## T-Nuts Application

This machine requires an immense amount of T-nuts. In the interest of simplifying this manual, we have chosen to omit the installation of T-nuts. Wherever a part interfaces with an extrusion in a way that looks like it requires a T-nut, then it should be considered a part that requires a T-nut.

## Linear Rail Carriages

Linear rail carriages use small ball-bearings to glide smoothly along the profile in the rail. If any of your carriages feel 'gritty' when moving, you should remove the carriages from the rail and give them a good clean with contact cleaner, brake cleaner or another similar non-corrosive degreaser.


You must make sure that your carriages are appropriately greased before running your machine. Liberal application of EP2 grease to the carriages will do the trick.

!!! warning
    Use a [dummy rail](https://github.com/MillenniumMachines/Milo-v1.5/tree/main//STL%20Files/Tools/Dummy%20Rail.stl) when removing carriages from the rail. _Searching for tiny ball-bearings when they go bouncing around your garage is not an experience we would like you to share!_

!!! tip
    Turn each rail upside down and put a carriage directly over one of the screw holes. You can then use a small syringe to inject grease directly into the carriage. When you start to see grease coming out along the rails you're done.

---

## Pre-flight Training

Before you head out on your journey to create skynet, it's probably a good idea that you learn a few things. Luckily the Millennium Machines team have put together a curated list of videos to teach you all you need to know - sit back, relax and enjoy.

- [How to lubricate your motion system](https://www.youtube.com/watch?v=UYvhYjkBFTY&list=PL7zrGeKp_8CTDOmpwZr5JnCSJqEghFh9j&index=39&t=816s)
- [How to use heat set inserts](https://www.youtube.com/watch?v=cyof7fYFcuQ&list=PL7zrGeKp_8CTDOmpwZr5JnCSJqEghFh9j&index=32)
- [Should you cold blue your rails ? And how to do it](https://www.youtube.com/watch?v=p6Id4Kl8RB0&list=PL7zrGeKp_8CTDOmpwZr5JnCSJqEghFh9j&index=10&t=210s)
- [How to get started with RepRap firmware on a fly board](https://www.youtube.com/watch?v=TAT532vIVzU)
- [CNC basics](https://www.youtube.com/watch?v=YBGqknN3gGs&t=466s)
- [Electronics connectors and how to use them](https://www.youtube.com/watch?v=y6G_MhQFv3k)
- [Cable chains and how not to use them](https://www.youtube.com/watch?v=_HiuY015rOY)

---

## CONTACT US

Building Milo can be confusing, but we're here to help.
Do you have a question?
Do you wanna show off your build?
Maybe you just want someone to chat with?
Well, why not join our community here on:

- :fontawesome-brands-discord: **Discord** [https://discord.gg/ya4UUj7ax2](https://discord.gg/ya4UUj7ax2)
- :fontawesome-brands-reddit: **Reddit** [/r/MilleniumMachines/](https://www.reddit.com/r/MilleniumMachines/)
- :fontawesome-brands-youtube: **YouTube** [Millennium Machine Works Official](https://www.youtube.com/channel/UCfdxXilZd76Dp8RfLxUJ_Gw)
- :fontawesome-brands-github: **GitHub** [https://github.com/MillenniumMachines](https://github.com/MillenniumMachines)

---

[Next Chapter: Hardware reference](./hardware_reference.md)

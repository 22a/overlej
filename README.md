# Overlej

A desktop application that lets you overlay images on all your workspaces.

## Features
* It lets you choose an image, and choose an opacity level.
* It also makes sure to render the overlay on all desktops/workspaces.
* Cross platform***

*** maybe, I have only tested on macOS. Window managers are hard, so who knows what this looks like on linus or bill OS

## Installation
Do you trust me? Do I trust me? Do you want to play the "let's execute 120mb of arbitrary code on my machine" game? 

### Yes
Install the app from the [releases page](https://github.com/22a/overlej/releases).

### No
Build it from source.

Clone the repo:
```bash
git clone git@github.com:22a/overlej.git
```

Install deps:
```bash
yarn
```

Then, either

* Run locally:
```bash
yarn start
```

or

* Build it yourself:
```bash
yarn build
```

## Why?
I'm not certain why other people use apps like these, but I was in the market for one because I got a fancy new keyboard and I couldn't remember my key layout so I wanted to be able to see it, with my eyes, all the time. There are a handful of apps like this out there - [Overlay2](http://www.colinthomas.com/overlay/), [Glueprint](http://glueprintapp.com/), [LayerX](https://github.com/yuhua-chen/LayerX), [etc](https://alternativeto.net/software/overlay2/) - but none of them were both free and allowed me to have the image be displayed on ALL workspaces. I was happy with Glueprint but got lost and confused and ashamed when I would swap workspaces and forget where my keys were.


## Learney Nuggets
I had never packaged an electron app before and didn't know how to make the `.icns` and `.ico` files I needed. Follow me and I'll teach you how:

1. Have a high res png of your icon at hand
2. Install [Prepo](https://itunes.apple.com/us/app/prepo/id476533227?mt=12)
3. Drag your png into it and export a `.Iconset` directory, `foo.Iconset` for example
* `iconutil` didn't like the uppercase filenames prepo generated so I ran `find path/to/foo.Iconset -depth -exec rename -f 's/(.*)\/([^\/]*)/$1\/\L$2/' {} \;` to help it along
5. Use `iconutil` to make your `.icns`: `iconutil -c icns path/to/foo.Iconset`, this will drop a `foo.icns` in the same directory as your iconset
6. Windows wants a `.ico` so I put my png in [an online conversion thingy](https://iconverticons.com/online/)
7. Then I put both my `.icns` and `.ico` into the build directory and let [Electron Builder](https://github.com/electron-userland/electron-builder) fandangle the slurpenstein

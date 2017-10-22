# Overlej

A desktop application that lets you overlay images on all your workspaces.

## Features
It lets you choose an image, and choose an opacity level.
It also makes sure to render the overlay on all desktops/workspaces.
Cross platform***

*** maybe, I have only tested on macOS. Window managers are hard so who know what this looks like on a linus or bill OS

## Why?
I'm not certain why other people use apps like these, but I was in the market for one because I got a fancy new keyboard and I couldn't remember my key layout so I wanted to be able to see it, with my eyes, all the time. There are a handful of apps like this out there - Overlay2, Glueprint, LayerX - but none of them were both free and allowed me to have the image be displayed on ALL workspaces. I was happy with Glueprint but got lost and confused and ashamed when I would swap workspaces and forget where my keys were.


## Learney Nuggets
I had never packaged an electron app before and didn't know how to make the `.icns` and `.ico` files I needed. Follow me and I'll teach you how:

1. Have a high res png of your icon
2. Install [Prepo](https://itunes.apple.com/us/app/prepo/id476533227?mt=12)
3. Drag your png into it and export a `.Iconset` directory, `foo.Iconset` for example
4. `iconutil` didn't like the uppercase filenames prepo generated so I `find path/to/foo.Iconset -depth -exec rename -f 's/(.*)\/([^\/]*)/$1\/\L$2/' {} \;`
5. Use `iconutil` to make your `.icns`: `iconutil -c icns path/to/foo.Iconset`, this will drop a `foo.icns` in the same directory as your iconset
6. Windows wants a `.ico` so I put my png in [an online conversion thingy](https://iconverticons.com/online/)
7. Then I put both my `.icns` and `.ico` into the build directory and let [Electron Builder](https://github.com/electron-userland/electron-builder) fandangle the slurpenstein

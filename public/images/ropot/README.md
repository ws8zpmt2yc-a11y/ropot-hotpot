# RoPot brand images

The five supplied brand images live here as JPEG (about 1.4MB in total). To
swap one for a newer render, overwrite the file and keep the name. If a file
is ever missing, that slot falls back to an on-brand red panel with the RoPot
mark rather than breaking the layout.

| Filename                | Which image                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `robot-server.jpg`      | The white RoPot service robot carrying trays in the red room  |
| `takeaway-packaging.jpg`| The two stacked red RoPot takeaway boxes                      |
| `hotpot-food.jpg`       | The close-up of bubbling broth with beef on chopsticks        |
| `ingredient-line.jpg`   | The long ingredient station with bowls of meat and vegetables |
| `ropot-hero-poster.jpg` | The red poster with the cute robot and the two brand lines    |

`.png` works too — `BrandImage` tries the other common extensions before it
gives up. To change a canonical path, edit `data/brand-images.ts`.

## Broth photography (optional)

`data/broths.ts` also points at these, and falls back gracefully if missing:

- `broth-classic-beef.jpg`
- `broth-tomato.jpg`
- `broth-mushroom.jpg`
- `broth-tom-yum.jpg`

Spicy Sichuan already reuses `hotpot-food.jpg`.

## Ingredient photography (optional)

Every ingredient is drawn as SVG art by default. To use a photograph instead,
drop a square image in `public/images/ingredients/` and add an `image` field to
that ingredient in `data/ingredients.ts`.

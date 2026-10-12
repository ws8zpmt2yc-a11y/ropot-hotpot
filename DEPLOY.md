# Putting the site online

The site is a plain folder of HTML, CSS, JS and images — no server needed.
`npm run export` rebuilds it into `out/`.

## Easiest: drag and drop (no account needed to get a link)

1. Go to **https://app.netlify.com/drop**
2. Drag `~/Desktop/ropot-site.zip` onto the page.
3. It gives you a link straight away, something like
   `https://calm-pastry-1a2b3c.netlify.app`.

To pick a nicer name, make a free Netlify account and use
**Site configuration → Change site name** to get e.g.
`https://ropot-hotpot.netlify.app`.

## Or the command line

```bash
npx netlify-cli deploy --dir=out --prod
```

The first run opens a browser to log in. After that it deploys in one command.

## Re-deploying after changes

```bash
npm run export
```

then drag `out` onto Netlify Drop again, or re-run the CLI command.

## Hosting under a subpath

If you ever host at `example.com/ropot-hotpot/` rather than a domain root,
build with `npm run export:pages` instead. That sets `basePath` and
`NEXT_PUBLIC_BASE_PATH`, which `lib/asset.ts` uses to prefix every image path.
Without it, assets 404.

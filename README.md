# Post Preview

See exactly how your content will look on the platform it is going to — before
you publish it. Pick a content type in the rail, fill in the inspector, watch
faithful previews render on the canvas, and export what you see as a PNG.

Everything runs in the browser. No account, no upload, no network calls —
fonts included.

## What it previews

| Category     | Platforms                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Posts**    | Facebook, Instagram, TikTok, LinkedIn, Reddit, X                                                     |
| **Comments** | Facebook, Instagram, TikTok, YouTube, Reddit, X                                                      |
| **Messages** | WhatsApp, Messenger, Instagram, Snapchat, Signal, TikTok, LinkedIn, Reddit, Slack, Discord, Teams    |
| **AI chat**  | ChatGPT, Claude, Gemini, Grok                                                                        |

Each preview follows the real client: its palette in both light and dark mode,
its typography and spacing, its verification marks, how it tiles two or four
attachments, where the timestamp sits, which counts it rounds and which it
spells out. The canvas toolbar frames a preview in an iPhone, an Android
handset or a browser window, flips its theme, and zooms out to compare several
platforms side by side.

## Using it

```bash
npm install
npm run dev      # http://localhost:5173/post-preview/
```

| Script               | Does                                            |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Vite dev server with hot reload                  |
| `npm run build`      | Type-check, then build to `dist/`                |
| `npm run preview`    | Serve the production build                       |
| `npm run lint`       | ESLint over the whole project                    |
| `npm run type-check` | `tsc --noEmit`                                   |

Your work is kept in `localStorage` between visits (text only — uploaded media
never leaves the tab and is never stored). Turn that off, clear it, or import
and export the content as JSON from **Settings**.

## How it is put together

```
src/
├── types/            Platform unions and content models — the single source of truth
├── constants/        Platform registry, editor navigation, seed content
├── lib/              Formatting, media decoding, storage. No React
├── hooks/            Reusable behaviour (lists, clipboard, export, media queries)
├── store/            Contexts, providers and hooks for config, settings, workspace
├── components/
│   ├── ui/           shadcn/ui primitives
│   ├── common/       Form fields, sortable list, panels, empty states, error boundary
│   └── layout/       Top bar, category rail, canvas + toolbar, command palette, export, settings
└── features/
    ├── config/       The editor: one section component per content area
    └── preview/
        ├── primitives/   Surface + palette, avatars, media, video, markdown, device frames
        ├── posts/        One component per platform
        ├── comments/     One component per platform
        ├── messages/     Shared chat shells + one component per platform
        ├── ai-chats/     Shared transcript shell + one component per assistant
        └── registry.ts   Platform → component lookup
```

Three ideas hold it together:

**Platforms are declared once.** The `as const` tuples in
[`src/types/platform.ts`](src/types/platform.ts) generate the platform unions,
and the registries are typed as `Record<Platform, Component>` — so adding a
platform to the tuple fails the build until a preview exists for it.

**Previews never read editor styles.** Each one declares a light and a dark
palette and publishes it as `--pv-*` custom properties through
`PreviewSurface`. Platform colour lives in one object per platform instead of a
conditional on every element, and the editor's own theme can never leak into a
preview.

**Structure is shared, presentation is not.** The eleven messaging clients
differ in colour, corner radius and whether the timestamp sits inside the
bubble — not in structure — so they share `BubbleThread` or `ThreadTranscript`
and contribute a header, a composer and a style object. The same is true of
comment threads and assistant transcripts.

### Adding a platform

1. Add its id to the relevant tuple in `src/types/platform.ts`.
2. Add a label, logo and brand colour to `PLATFORMS` in
   `src/constants/platforms.ts`.
3. Write the preview component and register it in
   `src/features/preview/registry.ts`.

The editor picks up the new platform automatically — there is no third place to
update.

## Licence

MIT. See [LICENSE](LICENSE).

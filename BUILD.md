npm create astro@latest astro

cd ./astro

npx astro add \
mdx \
node \
tailwind \
vue \
-y

npm install \
vitest

npm install --save-dev \
@astrojs/check

npm install --save-dev --save-exact \
prettier \
prettier-plugin-astro

npm init playwright@latest

update `tsconfig.json`:
`"exclude": [
    "_",
    "dist"
  ],
"compilerOptions": {
    "allowJs": true,
    "baseUrl": ".",
    "jsx": "preserve",
    "strictNullChecks": true, // add if using `base` template
    "paths": {
        "@/*": [
            "./src/*"
        ],
        "@data/*": [
            "./data/*"
        ]
    }
}`

npx shadcn-vue@latest init

changed to `"style": "new-york",` to `"style": "default",`

npx shadcn-vue@latest add button button-group

mkdir -p \
playwright/.clerk \
src/assets/{audio,images,fonts} \
src/components/site \
src/middleware \
src/types \
tests/unit

rm src/assets/{astro.svg,background.svg}

touch \
.env \
.env.example \
.prettierignore \
.vscode/{mcp,settings}.json \
{BUILD,CHANGELOG,TODO}.md \
cspell.json \
src/{consts,env.d}.ts \
src/{lib,middleware,types}/index.ts \
src/components/site/{Header,TitleBar,SEOHead,Footer}.astro \
src/components/site/{ModeToggle}.vue \
src/layouts/Article.astro \
src/pages/{403,404,500}.astro \
tests/e2e/smoke.spec.ts \
tests/global.setup.ts

mv astro.config.mjs astro.config.ts

update

- .gitignore
- .prettierignore
- .vscode/mcp.json
- .vscode/settings.json
- astro.config.ts
- CHANGELOG.md
- cspell.json
- package.json
- playwright.config.ts
- public/favicon.svg
- src/consts.ts
- src/env.d.ts
- src/types/index.ts
- TODO.md

- SEOHead
- ModeToggle
- Footer
- Header
- TitleBar
- 403
- 404
- 500

## Clerk

npx astro add \
@clerk/astro

npm install \
@astrojs/check \
@clerk/themes

npm install --save-dev \
@clerk/testing

mkdir -p \
src/pages/{a,test,u}

touch \
playwright/.clerk/user.json \
src/pages/{a,u}/index.astro \
src/pages/{sign-in,sign-up}.astro \
src/pages/test/{admin,editor,viewer}.astro

touch src/pages/test/{components}.astro

update astro.config.ts with shadcn clerk theme + clerk integrations configs

update sign-in + sign-up + middleware + header with basic stuff

add clerk css file + shadcn for clerk in global.css

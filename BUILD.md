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

update
- astro.config.ts with clerk theme package and integration configs
- sign, sign up, header.astro, middleware/index.ts

mkdir -p \
src/lib/auth \
src/types/auth

touch src/types/auth/index.ts

## spec kit

1 /speckit.constitution - Establish project principles
`Create principles focused on code quality, testing standards, user experience consistency, and performance requirements`
2 /speckit.specify - Create baseline specification
`add mvp rbac functionality. use miniminal, well-documented code to promote maintenability. clerk authenticated users will have one role either, admin, editor, or viewer. flexible permissions, start with three: write_content, edit_content, manage_user. include utiliies to allow in-template conditional rendering, e.g.: canWriteContent, canEditContent, canManageUser. middleware should include list of proteced and admin routes. menu items have a permissions array that will render based on the user's permissions. use Astro locals in middleware to store user data so they are accessible app wide.`



    2.1 /speckit.clarify (optional) - Ask structured questions to de-risk ambiguous areas before planning
3 /speckit.plan - Create implementation plan
    3.1 /speckit.checklist (optional) - Generate quality checklists to validate requirements completeness, clarity, and consistency
4 /speckit.tasks - Generate actionable tasks
    4.1 /speckit.analyze (optional) - Cross-artifact consistency & alignment report
5 /speckit.implement - Execute implementation
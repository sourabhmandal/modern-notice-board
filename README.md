## System Architechture
![System Architechture](https://raw.githubusercontent.com/sourabhmandal/modern-notice-board/337dcc207f64b855eccdd16d4957e6da6fff1e0a/readme-resources/architechture.svg)
## Getting Started

Install Dependencies
```bash
npm install --force
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Vitest Test Results
- 3 tests  ±0   3 :white_check_mark: ±0   0s :stopwatch: ±0s
- 1 suites ±0   0 :zzz: ±0 
- 1 files   ±0   0 :x: ±0

<details>
    <summary>Complete Test Report (Testing work in progress)</summary>
    
File                                            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------------------------|---------|----------|---------|---------|-------------------
All files                                       |    0.04 |     2.12 |    1.07 |    0.04 |                   
 aitplacementsv3                                |       0 |        0 |       0 |       0 |                   
  auth.config.ts                                |       0 |        0 |       0 |       0 | 1-185             
  drizzle.config.ts                             |       0 |        0 |       0 |       0 | 1-14              
  middleware.ts                                 |       0 |        0 |       0 |       0 | 1-44              
  next.config.mjs                               |       0 |        0 |       0 |       0 | 1-24              
 aitplacementsv3/src/app                        |       0 |        0 |       0 |       0 |                   
  layout.tsx                                    |       0 |        0 |       0 |       0 | 1-31              
  not-found.tsx                                 |       0 |        0 |       0 |       0 | 1-20              
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-38              
 aitplacementsv3/src/app/actions/mutation       |       0 |        0 |       0 |       0 |                   
  _ping.ts                                      |       0 |        0 |       0 |       0 | 1-11              
 aitplacementsv3/src/app/actions/query          |       0 |        0 |       0 |       0 |                   
  _ping.ts                                      |       0 |        0 |       0 |       0 | 1-15              
  auth.ts                                       |       0 |        0 |       0 |       0 | 1-52              
 aitplacementsv3/src/app/api/auth/[...nextAuth] |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-3               
 aitplacementsv3/src/app/api/auth/register      |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-191             
 aitplacementsv3/src/app/api/notice             |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-155             
 aitplacementsv3/src/app/api/notice/[id]        |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-157             
 aitplacementsv3/src/app/api/ping               |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-10              
 aitplacementsv3/src/app/api/upload             |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-215             
 aitplacementsv3/src/app/api/user               |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-206             
 aitplacementsv3/src/app/api/user/[id]          |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-76              
 aitplacementsv3/src/app/api/v1                 |       0 |        0 |       0 |       0 |                   
  route.ts                                      |       0 |        0 |       0 |       0 | 1-9               
 aitplacementsv3/src/app/api/v1/_open_api       |       0 |        0 |       0 |       0 |                   
  _api_contract.ts                              |       0 |        0 |       0 |       0 | 1-27              
  _openapi.ts                                   |       0 |        0 |       0 |       0 | 1-13              
  _schema.ts                                    |       0 |        0 |       0 |       0 | 1-28              
 aitplacementsv3/src/app/auth                   |       0 |        0 |       0 |       0 |                   
  layout.tsx                                    |       0 |        0 |       0 |       0 | 1-25              
 aitplacementsv3/src/app/auth/error             |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-65              
 aitplacementsv3/src/app/auth/login             |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-5               
 aitplacementsv3/src/app/auth/register          |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-5               
 aitplacementsv3/src/app/dashboard              |       0 |        0 |       0 |       0 |                   
  layout.tsx                                    |       0 |        0 |       0 |       0 | 1-35              
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-24              
 aitplacementsv3/src/app/dashboard/notice       |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-20              
 aitplacementsv3/src/app/dashboard/notice/[id]  |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-63              
 aitplacementsv3/src/app/dashboard/resources    |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-22              
 aitplacementsv3/src/app/dashboard/users        |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-28              
 aitplacementsv3/src/app/swagger                |       0 |        0 |       0 |       0 |                   
  page.tsx                                      |       0 |        0 |       0 |       0 | 1-31              
 aitplacementsv3/src/app/theme                  |       0 |        0 |       0 |       0 |                   
  index.ts                                      |       0 |        0 |       0 |       0 | 1-167             
 aitplacementsv3/src/components                 |       0 |        0 |       0 |       0 |                   
  index.ts                                      |       0 |        0 |       0 |       0 | 1                 
 aitplacementsv3/src/components/auth            |       0 |        0 |       0 |       0 |                   
  AuthFormWrapper.tsx                           |       0 |        0 |       0 |       0 | 1-104             
  LoginForm.tsx                                 |       0 |        0 |       0 |       0 | 1-106             
  RegisterForm.tsx                              |       0 |        0 |       0 |       0 | 1-259             
  auth.ts                                       |       0 |        0 |       0 |       0 | 1-32              
  commonPasswords.ts                            |       0 |        0 |       0 |       0 | 1-22              
 aitplacementsv3/src/components/button          |       0 |        0 |       0 |       0 |                   
  SignOutButton.tsx                             |       0 |        0 |       0 |       0 | 1-24              
  ToggleMode.tsx                                |       0 |        0 |       0 |       0 | 1-37              
 aitplacementsv3/src/components/constants       |       0 |        0 |       0 |       0 |                   
  backend-routes.ts                             |       0 |        0 |       0 |       0 | 1-17              
  frontend-routes.ts                            |       0 |        0 |       0 |       0 | 1-16              
 aitplacementsv3/src/components/context         |       0 |        0 |       0 |       0 |                   
  SWRProvider.tsx                               |       0 |        0 |       0 |       0 | 1-25              
  ThemeModeProvider.tsx                         |       0 |        0 |       0 |       0 | 1-57              
 aitplacementsv3/src/components/data-display    |       0 |        0 |       0 |       0 |                   
  AllUserListTable.tsx                          |       0 |        0 |       0 |       0 | 1-629             
  CollapsibleTable.tsx                          |       0 |        0 |       0 |       0 | 1-138             
  DashboardMainContent.tsx                      |       0 |        0 |       0 |       0 | 1-25              
  FeatureChip.tsx                               |       0 |        0 |       0 |       0 | 1-32              
  ListTableTwo.tsx                              |       0 |        0 |       0 |       0 | 1-95              
  NoticeListTable.tsx                           |       0 |        0 |       0 |       0 | 1-211             
  SafeHtml.tsx                                  |       0 |        0 |       0 |       0 | 1-19              
  Toast.tsx                                     |       0 |        0 |       0 |       0 | 1-71              
  useToast.tsx                                  |       0 |        0 |       0 |       0 | 1-28              
 aitplacementsv3/src/components/editor          |       0 |        0 |       0 |       0 |                   
  LinkBubbleMenu.tsx                            |       0 |        0 |       0 |       0 | 1-78              
  NoticeEditor.tsx                              |       0 |        0 |       0 |       0 | 1-182             
  NoticeEditorMui.tsx                           |       0 |        0 |       0 |       0 | 1-393             
  Toolbar.tsx                                   |       0 |        0 |       0 |       0 | 1-175             
  UploadFilesSection.tsx                        |       0 |        0 |       0 |       0 | 1-286             
 aitplacementsv3/src/components/navigation      |       0 |        0 |       0 |       0 |                   
  AppNavbar.tsx                                 |       0 |        0 |       0 |       0 | 1-103             
  Breadcrumb.tsx                                |       0 |        0 |       0 |       0 | 1-84              
  CardAlert.tsx                                 |       0 |        0 |       0 |       0 | 1-24              
  DashboardSideMenu.tsx                         |       0 |        0 |       0 |       0 | 1-91              
  LandingPageAppBar.tsx                         |       0 |        0 |       0 |       0 | 1-232             
  MenuButton.tsx                                |       0 |        0 |       0 |       0 | 1-22              
  MenuContent.tsx                               |       0 |        0 |       0 |       0 | 1-77              
  OptionsMenu.tsx                               |       0 |        0 |       0 |       0 | 1-80              
  SelectContent.tsx                             |       0 |        0 |       0 |       0 | 1-103             
  SideMenuMobile.tsx                            |       0 |        0 |       0 |       0 | 1-78              
 aitplacementsv3/src/components/popovers        |       0 |        0 |       0 |       0 |                   
  DeleteNoticeDialog.tsx                        |       0 |        0 |       0 |       0 | 1-137             
  UserActionsDialog.tsx                         |       0 |        0 |       0 |       0 | 1-179             
  ViewNoticeDialog.tsx                          |       0 |        0 |       0 |       0 | 1-186             
 aitplacementsv3/src/components/section         |       0 |        0 |       0 |       0 |                   
  LandinPageFeatures.tsx                        |       0 |        0 |       0 |       0 | 1-272             
  LandinPageHero.tsx                            |       0 |        0 |       0 |       0 | 1-132             
  LandingPageFAQ.tsx                            |       0 |        0 |       0 |       0 | 1-152             
  LandingPageFooter.tsx                         |       0 |        0 |       0 |       0 | 1-223             
  LandingPageHighlights.tsx                     |       0 |        0 |       0 |       0 | 1-122             
  LandingPageLogoCollection.tsx                 |       0 |        0 |       0 |       0 | 1-59              
  LandingPagePricing.tsx                        |       0 |        0 |       0 |       0 | 1-219             
  LandingPageTestimonials.tsx                   |       0 |        0 |       0 |       0 | 1-154             
 aitplacementsv3/src/components/utils           |       0 |        0 |       0 |       0 |                   
  api.utils.ts                                  |       0 |        0 |       0 |       0 | 1-50              
  hash.ts                                       |       0 |        0 |       0 |       0 | 1-11              
  sleep.ts                                      |       0 |        0 |       0 |       0 | 1-3               
 aitplacementsv3/src/server                     |       0 |        0 |       0 |       0 |                   
  S3.tsx                                        |       0 |        0 |       0 |       0 | 1-103             
  env.ts                                        |       0 |        0 |       0 |       0 | 1-59              
  index.ts                                      |       0 |        0 |       0 |       0 | 1-32              
 aitplacementsv3/src/server/model               |       0 |        0 |       0 |       0 |                   
  auth.ts                                       |       0 |        0 |       0 |       0 | 1-107             
  common.ts                                     |       0 |        0 |       0 |       0 | 1-18              
  index.ts                                      |       0 |        0 |       0 |       0 | 1-19              
  notice.ts                                     |       0 |        0 |       0 |       0 | 1-37              
 aitplacementsv3/src/server/utils               |   15.78 |    66.66 |      50 |   15.78 |                   
  db.ts                                         |       0 |        0 |       0 |       0 | 1-22              
  hash.ts                                       |     100 |      100 |     100 |     100 |                   

</details>

:recycle: This comment has been updated with latest results.

## Roadmap

- [X] Add material UI
- [X] Add Drizzle
- [X] Add zod and api type-safety
- [X] Add OpenAPI
- [X] create notice with file upload
- [X] view notice with files
- [ ] RBAC controls for Students and Admin
- [ ] Edit notice for Admin

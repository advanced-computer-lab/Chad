```
   ___________________       ________              __
  / ____/  _/ ____/   |     / ____/ /_  ____ _____/ /
 / / __ / // / __/ /| |    / /   / __ \/ __ `/ __  / 
/ /_/ // // /_/ / ___ |   / /___/ / / / /_/ / /_/ /  
\____/___/\____/_/  |_|   \____/_/ /_/\__,_/\__,_/  
```
<p align="center">
<img src="./chad.wpeb" width=300 alt="giga chad" title="hi">
</p>

----

## Index
- [Motivation behind the project](#motivation)
- [Build Status](#build-status)
- [Code Conventions](#code-conventions)
- [Tech Stack](#teck-stack)
- [Features](#features)
- [Api Reference](#api-reference)
- [Tests](#tests)
- [How To Use ?](#how-to-use-)
- [Init the dev enviroment](#init-the-enviroment)
- [Add env files](#add-env-files)
- [Important Notes for Development](#important-notes)
- [License](#license)
- [Sprint 1 Tasks distribution & progress](SPRINT1.md)
- [Sprint 2 Tasks distribution & progress](SPRINT2.md)
- [Sprint 3 Tasks distribution & progress](SPRINT3.md)

## Motivation
This project is an academic one, and the main purpose of implementing it is to get familier with the __MERN STACK__ , the __AGILE Methodology__ , __GITHUB WORK FLOW__ and of course to pass this CSEN704 GUC course 🙂.  

## Build Status
currently the project is in the staging process, and it is being tested intensively.

## Code Conventions
we used some conventions during the development of this project some of them are related to the folder structure and we emphasis on the separation of concerns:
- backend folder structure
    ```
    backend\
    ├── constants\     `folder to hold any enums in the system`
    ├── controllers\   `folder to hold logic between model and routers`
    ├── models\        `folder to hold database modles`
    ├── routers\       `folder to hold routers logic for the api` 
    └── utils\         `folder to hold any helper function`
    ```
- frontend folder structure
    ```
    src/
    ├── APIs/              `folder to hold any http calls to the api`
    ├── Assets/            `folder to hold imgs and other assets`
    ├── Components/        `folder to hold the reusable components`
    ├── Constants/         `folder to hold any enums in the system`
    ├── Context/           `folder to hold any shared ReactContext`
    ├── Pages/             `folder to hold different pages to route between`
    ├── Styles/            `folder to hold different scss files`
    └── Utils/             `folder to hold any helper function`
    ```
other are related to the code style, we used `eslint`, `prettier` with some rules to unify the code style like:
```
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false
}
```

## Teck Stack
we used the __MERN STACK__ to develop this project:
- `MongoDB` as the NoSQL database <small>god only know why</small>.
- `Mongoose` as schema and abstraction layer on top of `mongoDB`.
- `Express` as backend server on top of `node`.
- `React` as frontend framework on top of `javascript`.
- `scass` for styling on top of `css`.

## Features
we have implemented all the requirements, and we added the forgot password functionality.
> forgot password sp: i as a user should be able to enter my email incase if i forgot my password , and the system should email me with a temporary password so that i can restore my account.  

## API Reference
we implemented the backend using the __REST pattern__ so for each functionality there is/are endpoint/s to fulfill it.

### *Backend Public Endpoints Reference*

*__Note__:* default Response body would always contain `{success: Boolean, msg: String}` 
|Endpoint |Type | Request | Response|
|--|--|--|--|
|`/auth` |POST|body: `{email: String, password: String}`| body: `{token: String, user: Object}`|
|`/register`|POST|body: `{email: String, password: String, name: String, phone: String, passport: String }`|body: `{}`|
|`/forgetPassword` |POST|body: `{email: String}` | body: `{}`
|`/flight/<flightId>` |GET|body: `{}` | body: `{flight: Object}`|
|`/search-flights`|POST|body: `{attributes: Object}`| body `{flights: Array, returnFlights: Array, maxPages: Number, maxRPages: Number}`|
|`/place` | GET|body: `{}` | body: `{places: Array}`

### *Backend Private Reference*

*__Note__:* any Request should have in its headers a field `token: String` with token returned from `/auth`
|Endpoint |Type | Request | Response|
|--|--|--|--|
|`/flights/<page>`|GET|body: `{}`|body: `{flights: Array, maxPates: Number}`|
|`/flight`|POST|body: `{...flight Attributes}`|body: `{flight: Object}`|
|`/flight/<flightId>`|PUT|body: `{flight Attributes}`|body:`{flight: Object}`|
|`/flight/<flightId>`|DELETE|body:`{}`|body:`{flight: Object}`|
|`/reservations/<page>`|GET|body:`{}`|body:`{reservations: Array, maxPages: Number}`|
|`/reservations/<reservationId>`|GET|body:`{}`|body:`{reservation: Object}`|
|`/reservation`|POST|body:`{token: Object, tickets: Array}`|body:`{reservation: Object}`|
|`/reservation/<reservationId>`|DELETE|body:`{}`|body:`{reservation: Object}`|
|`/tickets/<page>`|GET|body:`{}`|body:`{tickets: Array}`|
|`/ticket/<ticketId>`|GET|body:`{}`|body:`{ticket: Object}`|
|`/ticket/<ticketId>`|PUT|body:`{seatNumber: Number, classType:String, token: Object}`|body:`{ticket: Object}`|
|`/ticket/<ticketId>`|DELETE|body:`{}`|body:`{ticket: Object}`|
|`/user-info/`|GET|body:`{}`|body:`{user: Object}`|
|`/user/`|PUT|body:`{...userAttriutes}`|body:`{user: Object}`|
|`/user/change-password`|PUT|body:`{oldPassword: String, newPassword: String}`|body:`{user: Object}`|
|`/user/`|DELETE|body:`{}`|body:`{user: Object}`|

*__Note__:* to know different user/flight attributes take a look at the modles folder in the backend

## Tests
we test the frontend with actual users and we test the backend endpoints with different scripts using __postman tool__ 

## How to use ?
1. first of all `clone` or `fork` the current repo.
2. add `.env` files in the frontend and backend folders with the following variables:
     - frontend
        ```
        REACT_APP_SERVER_URL=http://<IP OF THE BACKEND>:PORT
        REACT_APP_STRIPE_PUBKEY=<Strip Published Key>
        ```
    - backend
        ```
        PORT=8000
        SECRET=<Random secret to hash passwords>
        DB_URI=<URI of the mongoDB server>
        CLIENT_ID=<GOOGLE USER CONTENT CLIENT ID>
        CLIENT_SECRET=<GOOGLE SECRET>
        REFRESH_TOKEN=<GOOGLE AUTH REFERSH TOKEN>
        AUTH_TYPE=OAuth2
        USER_MAIL=<GOOGLE EMAIL>
        STRIPE_KEY=<Stripe Published Key>
        STRIPE_SECRET_KEY=<Stripe Secret Key>
        ```
3. install the dependencies with `npm i` in both folders.
4. run the backend server first and then the frontend server both with `npm start`
5. 🎉🎉 🥲


## Init the enviroment
1. clone from the `main` branch.

2. install the libs in frontend and backend folders.

3. add `.env files` like [here](#add-env-files).


## Add env Files
- in the backend folder:
    - create a folder and name it `.env`
    - add the any needed variables to it with this formate
        ```
        NAME_1=VALUE
        NAME_2=VALUE
        ...
        ```
    - note that `dotenv` by default loads the `.env` file.
    - you now can access the variables with `process.env.NAME_1`
- in the frontend folder:
    - create a folder and name it `.env`
    - likewise add to it any needed variables
    - but note in order for the varaibles to be loaded it must be prefixed with  `REACT_APP`
    like:
    ```
    REACT_APP_NAME_1=VALUE
    ....
    ```
    [read more here](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## Important Notes

- set prettier as the default foramter in your IDE
   - for easy development check the format on save option
- name the branches with the desc of feature `feat/...`.
- try write _COMMIT MSG BODY_ to your commits.
- test the code before you push to your branch
- do the linting in the backend by running `npm run lint` and resolve any warnings and errors
- move any _CONSTANTS VALUES_ into a folder in the constants folders
- update your progress in the [SPRINT1 file](SPRINT1.md) by checking the done tasks.

## License
[MIT License](License)

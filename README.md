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
- [Init the dev enviroment](#init-the-enviroment)
- [Add env files](#add-env-files)
- [Important Notes](#important-notes)
- [Sprint 1 Tasks distribution & progress](SPRINT1.md)

## Init the enviroment
1- clone from the `main` branch.

2- install the libs in frontend and backend folders.

3- add `.env files` like [here](#add-env-files).


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
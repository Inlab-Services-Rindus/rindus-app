# Populate database with real data

0. Open network dev tools tab.
1. Go to https://rindus.personio.de/staff
2. Scroll to the bottom and choose "All" in `Items` dropdown.
3. Filter network tab for employee-list/bff/data
4. Go to Response tap and overwrite the JSON content in a file under `employees/personio.json`
5. From project root run `knex seed:run --specific=seeds/production/init_personio_users.ts`
